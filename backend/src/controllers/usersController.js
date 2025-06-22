import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import crypto from "crypto";

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