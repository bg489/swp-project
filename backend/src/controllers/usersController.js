import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import crypto from "crypto";
import DonorProfile from "../models/DonorProfile.js";
import RecipientProfile from '../models/RecipientProfile.js';

export async function createUser(req, res) {
  try {
    const {
      full_name,
      email,
      password, // raw password (to be hashed)
      role,
      phone,
      gender,
      date_of_birth,
      address,
    } = req.body;

    // Basic validation (you can expand this)
    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash password before saving (using bcrypt)
    
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      full_name,
      email,
      password_hash,
      role,
      phone,
      gender,
      date_of_birth,
      address,
      is_active: true,
      is_verified: false,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: savedUser._id,
        full_name: savedUser.full_name,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error("Error in createUser controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ message: "User is inactive" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Login success
    res.status(200).json({
      message: "Login successful",
      user: {
        user
      }
    });

  } catch (error) {
    console.error("Error in loginUser controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body

    if (!email) return res.status(400).json({ message: "Email is required" })

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "User not found" })

    const token = crypto.randomBytes(32).toString("hex")
    const expiry = new Date(Date.now() + 15 * 60 * 1000) // 15 min

    user.reset_token = token
    user.reset_token_expires = expiry
    await user.save()

    return res.status(200).json({
      message: "Reset token generated",
      token, // You can email this to the user
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal server error" })
  }
}

export async function confirmPasswordReset(req, res) {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword)
      return res.status(400).json({ message: "Token and new password required" })

    const user = await User.findOne({
      reset_token: token,
      reset_token_expires: { $gt: new Date() },
    })

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" })

    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(newPassword, salt)

    user.password_hash = password_hash
    user.reset_token = undefined
    user.reset_token_expires = undefined
    await user.save()

    return res.status(200).json({ message: "Password reset successful" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal server error" })
  }
}

export async function getAllEmails(req, res) {
  try {
    const users = await User.find({}, "email") // Get only the 'email' field
    const emails = users.map((user) => user.email)

    res.status(200).json({
      message: "Emails fetched successfully",
      emails,
    })
  } catch (error) {
    console.error("Error fetching emails:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export async function getUserIdByEmail(req, res) {
  try {
    const { email } = req.query

    if (!email) {
      return res.status(400).json({ message: "Thiếu email" })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng với email này" })
    }

    return res.status(200).json({
      message: "Tìm thấy user",
      userId: user._id,
    })
  } catch (error) {
    console.error("Lỗi khi tìm userId từ email:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

export async function toggleUserVerification(req, res) {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({ message: "Thiếu userId" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" })
    }

    user.is_verified = !user.is_verified
    await user.save()

    return res.status(200).json({
      message: "Cập nhật trạng thái xác minh thành công",
      userId: user._id,
      is_verified: user.is_verified,
    })
  } catch (error) {
    console.error("Lỗi khi đổi is_verified:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

export async function createDonorProfile(req, res) {
  try {
    const {
      user_id,
      blood_type,
      availability_date,
      health_cert_url,
      cooldown_until,
      hospital,
    } = req.body;

    if (!user_id || !blood_type || !availability_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(user_id);
    if (!user || user.role !== "donor") {
      return res.status(404).json({ message: "User is not a donor" });
    }

    // Deactivate recipient profile if it exists
    await RecipientProfile.findOneAndUpdate(
      { user_id },
      { is_in_the_role: false }
    );

    // Check if donor profile exists
    const existingProfile = await DonorProfile.findOne({ user_id });

    if (existingProfile) {
      existingProfile.is_in_the_role = true;
      if (blood_type !== undefined) existingProfile.blood_type = blood_type;
      if (availability_date !== undefined) existingProfile.availability_date = availability_date;
      if (health_cert_url !== undefined) existingProfile.health_cert_url = health_cert_url;
      if (cooldown_until !== undefined) existingProfile.cooldown_until = cooldown_until;
      if (hospital !== undefined) existingProfile.hospital = hospital;
      await existingProfile.save();

      return res.status(200).json({
        message: "Donor profile re-activated and updated",
        profile: existingProfile,
      });
    }

    const profile = new DonorProfile({
      user_id,
      blood_type,
      availability_date,
      health_cert_url,
      cooldown_until,
      hospital,
      is_in_the_role: true,
    });

    await profile.save();

    return res.status(201).json({
      message: "Donor profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("Error creating donor profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function createRecipientProfile(req, res) {
  try {
    const { user_id, medical_doc_url, hospital } = req.body;

    if (!user_id || !medical_doc_url || !hospital) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(user_id);
    if (!user || user.role !== "recipient") {
      return res.status(404).json({ message: "User is not a recipient" });
    }

    // Deactivate donor profile if it exists
    await DonorProfile.findOneAndUpdate(
      { user_id },
      { is_in_the_role: false }
    );

    // Check if recipient profile exists
    const existingProfile = await RecipientProfile.findOne({ user_id });

    if (existingProfile) {
      existingProfile.is_in_the_role = true;
      if (medical_doc_url !== undefined) existingProfile.medical_doc_url = medical_doc_url;
      if (hospital !== undefined) existingProfile.hospital = hospital;
      await existingProfile.save();

      return res.status(200).json({
        message: "Recipient profile re-activated and updated",
        profile: existingProfile,
      });
    }

    const profile = new RecipientProfile({
      user_id,
      medical_doc_url,
      hospital,
      is_in_the_role: true,
    });

    await profile.save();

    return res.status(201).json({
      message: "Recipient profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("Error creating recipient profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function getActiveDonorProfile(req, res) {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "Missing user_id parameter" });
    }

    const profile = await DonorProfile.findOne({ user_id });

    if (!profile) {
      return res.status(404).json({ message: "No active donor profile found" });
    }

    return res.status(200).json({
      message: "Active donor profile retrieved",
      profile,
    });
  } catch (error) {
    console.error("Error fetching donor profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getActiveRecipientProfile(req, res) {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "Missing user_id parameter" });
    }

    const profile = await RecipientProfile.findOne({ user_id });

    if (!profile) {
      return res.status(404).json({ message: "No active recipient profile found" });
    }

    return res.status(200).json({
      message: "Active recipient profile retrieved",
      profile,
    });
  } catch (error) {
    console.error("Error fetching recipient profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUserRole(req, res) {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;

    const validRoles = ["donor", "recipient", "staff", "admin"];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If same role, no need to update
    if (user.role === newRole) {
      return res.status(200).json({ message: "User already has this role" });
    }

    user.role = newRole;
    await user.save();

    return res.status(200).json({
      message: "User role updated successfully",
      userId: user._id,
      newRole: user.role,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function updateUserById(req, res) {
  try {
    const { userId } = req.params;
    const {
      full_name,
      email,
      phone,
      gender,
      date_of_birth,
      address,
      is_active,
      is_verified,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only update fields if provided
    if (full_name !== undefined) user.full_name = full_name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    if (date_of_birth !== undefined) user.date_of_birth = date_of_birth;
    if (address !== undefined) user.address = address;
    if (is_active !== undefined) user.is_active = is_active;
    if (is_verified !== undefined) user.is_verified = is_verified;

    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
