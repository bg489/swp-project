import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import crypto from "crypto";
import DonorProfile from "../models/DonorProfile.js";
import RecipientProfile from '../models/RecipientProfile.js';
import StaffProfile from "../models/StaffProfile.js";
import Hospital from "../models/Hospital.js";
import UserProfile from "../models/UserProfile.js";


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

export const createStaffProfile = async (req, res) => {
  try {
    const { user_id, department, assigned_area, shift_time, hospital } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!user_id || !hospital) {
      return res.status(400).json({ success: false, message: "user_id và hospital là bắt buộc." });
    }

    // Kiểm tra user tồn tại và có role là staff
    const user = await User.findById(user_id);
    if (!user || user.role !== "staff") {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại hoặc không phải nhân viên (staff)." });
    }

    // Tạo StaffProfile
    const newProfile = new StaffProfile({
      user_id,
      department,
      assigned_area,
      shift_time,
      hospital,
    });

    await newProfile.save();

    res.status(201).json({
      success: true,
      message: "Tạo hồ sơ nhân viên thành công.",
      staffProfile: newProfile,
    });
  } catch (error) {
    console.error("Lỗi khi tạo staff profile:", error);
    res.status(500).json({ success: false, message: "Không thể tạo hồ sơ nhân viên." });
  }
};

export const getStaffProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Thiếu userId trong URL." });
    }

    const staffProfile = await StaffProfile.findOne({ user_id: userId })
      .populate("user_id", "-password") // Lấy thêm thông tin user nhưng ẩn mật khẩu
      .populate("hospital"); // Lấy thông tin bệnh viện nếu cần

    if (!staffProfile) {
      return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ nhân viên cho user này." });
    }

    res.status(200).json({ success: true, staffProfile });
  } catch (error) {
    console.error("Lỗi khi lấy staff profile theo userId:", error);
    res.status(500).json({ success: false, message: "Không thể lấy thông tin hồ sơ nhân viên." });
  }
};

export async function getAvailableDonorsByHospital(req, res) {
  try {
    const { hospitalId } = req.params;

    if (!hospitalId) {
      return res.status(400).json({ message: "Missing hospitalId parameter" });
    }

    // Kiểm tra bệnh viện tồn tại
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const now = new Date();

    // Tìm tất cả donor profile thuộc bệnh viện này
    // và có availability_date trước hoặc bằng thời gian hiện tại
    const donors = await DonorProfile.find({
      hospital: hospitalId,
      availability_date: { $lte: now },
      is_in_the_role: true, // chỉ lấy donor còn hoạt động
    })
      .populate("user_id", "full_name email phone blood_type") // populate thông tin người hiến
      .populate("hospital", "name address phone"); // populate thông tin bệnh viện

    return res.status(200).json({
      success: true,
      count: donors.length,
      donors,
    });
  } catch (error) {
    console.error("Error fetching available donors:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateCooldownUntil(req, res) {
  try {
    const { user_id, cooldown_until } = req.body;

    if (!user_id || !cooldown_until) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra hồ sơ donor có tồn tại không
    const donorProfile = await DonorProfile.findOne({ user_id });

    if (!donorProfile) {
      return res.status(404).json({ message: "Donor profile not found" });
    }

    donorProfile.cooldown_until = cooldown_until;

    await donorProfile.save();

    return res.status(200).json({
      message: "Cooldown updated successfully",
      profile: donorProfile,
    });
  } catch (error) {
    console.error("Error updating cooldown:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /admin/users
export async function getAllUsers(req, res) {
  try {
    const adminId = req.params.adminId;
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== "admin" || !adminUser.is_verified) {
      return res.status(403).json({ message: "Permission denied" });
    }

    const users = await User.find({}, "-password_hash"); // Exclude password_hash field

    return res.status(200).json({
      message: "Fetched all users",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE /admin/users/:adminId/:userId
export async function deleteUserByAdmin(req, res) {
  try {
    const { adminId, userId } = req.params;

    // Kiểm tra admin hợp lệ
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin" || !admin.is_verified) {
      return res.status(403).json({ message: "Bạn không có quyền xóa người dùng." });
    }

    // Không cho admin tự xóa chính mình
    if (adminId === userId) {
      return res.status(400).json({ message: "Không thể tự xóa chính mình." });
    }

    // Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Xóa các profile liên quan (nếu có)
    await DonorProfile.deleteOne({ user_id: userId });
    await RecipientProfile.deleteOne({ user_id: userId });
    await StaffProfile.deleteOne({ user_id: userId });

    // Xóa user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Xóa người dùng thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi xóa người dùng." });
  }
}

// POST /api/donors/by-hospitals
export async function getDonorsByHospitals(req, res) {
  try {
    const { hospitalIds } = req.body;

    if (!Array.isArray(hospitalIds) || hospitalIds.length === 0) {
      return res.status(400).json({ message: "Danh sách hospitalIds không hợp lệ." });
    }

    const now = new Date();

    const donors = await DonorProfile.find({
      hospital: { $in: hospitalIds },
      availability_date: { $lte: now },
      $or: [
        { cooldown_until: { $lte: now } },
        { cooldown_until: { $exists: false } },
        { cooldown_until: null }
      ],
      is_in_the_role: true,
    })
      .populate("user_id", "full_name email phone blood_type")
      .populate("hospital", "name address phone");

    return res.status(200).json({
      success: true,
      count: donors.length,
      donors,
    });
  } catch (error) {
    console.error("Lỗi khi lấy người hiến máu theo bệnh viện + thời gian:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
}

// POST /api/donors/by-hospitals-and-bloodtype
// POST /api/donors/compatible
export async function getCompatibleDonorsByHospitalAndRecipientBloodType(req, res) {
  try {
    const { hospitalIds, recipientBloodType } = req.body;

    if (!Array.isArray(hospitalIds) || hospitalIds.length === 0) {
      return res.status(400).json({ message: "Danh sách hospitalIds không hợp lệ." });
    }

    if (!recipientBloodType) {
      return res.status(400).json({ message: "Thiếu nhóm máu của người nhận." });
    }

    const bloodCompatibilityMap = {
      "O-": ["O-"],
      "O+": ["O-", "O+"],
      "A-": ["O-", "A-"],
      "A+": ["O-", "O+", "A-", "A+"],
      "B-": ["O-", "B-"],
      "B+": ["O-", "O+", "B-", "B+"],
      "AB-": ["O-", "A-", "B-", "AB-"],
      "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    };

    const compatibleBloodTypes = bloodCompatibilityMap[recipientBloodType];

    if (!compatibleBloodTypes) {
      return res.status(400).json({ message: "Nhóm máu người nhận không hợp lệ." });
    }

    const now = new Date();

    const donors = await DonorProfile.find({
      hospital: { $in: hospitalIds },
      blood_type: { $in: compatibleBloodTypes },
      availability_date: { $lte: now },
      $or: [
        { cooldown_until: { $lte: now } },
        { cooldown_until: { $exists: false } },
        { cooldown_until: null }
      ],
      is_in_the_role: true,
    })
      .populate("user_id", "full_name email phone blood_type")
      .populate("hospital", "name address phone");

    return res.status(200).json({
      success: true,
      count: donors.length,
      donors,
    });
  } catch (error) {
    console.error("Lỗi khi tìm donor tương thích theo nhóm máu:", error);
    return res.status(500).json({ message: "Lỗi máy chủ." });
  }
}



export async function createUserProfile(req, res) {
  try {
    const { user_id, blood_type, cooldown_until, cccd } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "Missing user_id" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra nếu CCCD đã tồn tại ở hồ sơ khác
    if (cccd) {
      const duplicateCCCD = await UserProfile.findOne({ cccd, user_id: { $ne: user_id } });
      if (duplicateCCCD) {
        return res.status(409).json({ message: "CCCD already exists for another user" });
      }
    }

    const existingProfile = await UserProfile.findOne({ user_id });

    if (existingProfile) {
      if (blood_type !== undefined) existingProfile.blood_type = blood_type;
      if (cooldown_until !== undefined) existingProfile.cooldown_until = cooldown_until;
      if (cccd !== undefined) existingProfile.cccd = cccd;
      await existingProfile.save();

      return res.status(200).json({
        message: "User profile updated",
        profile: existingProfile,
      });
    }

    const newProfile = new UserProfile({
      user_id,
      blood_type,
      cooldown_until,
      cccd,
    });

    await newProfile.save();

    return res.status(201).json({
      message: "User profile created successfully",
      profile: newProfile,
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function checkCCCDExists(req, res) {
  try {
    const { cccd } = req.query;

    if (!cccd) {
      return res.status(400).json({ message: "Thiếu mã số CCCD" });
    }

    const existingProfile = await UserProfile.findOne({ cccd });

    if (existingProfile) {
      const user = await User.findById(existingProfile.user_id).select("email");

      return res.status(200).json({
        exists: true,
        user_id: existingProfile.user_id,
        email: user?.email || null,
      });
    }

    return res.status(200).json({ exists: false });
  } catch (err) {
    console.error("Error checking CCCD:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
}

export async function getUserProfileByUserId(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Thiếu userId trong URL." });
    }

    const profile = await UserProfile.findOne({ user_id: userId }).populate("user_id", "-password_hash");

    if (!profile) {
      return res.status(404).json({ message: "Không tìm thấy hồ sơ người dùng." });
    }

    return res.status(200).json({
      message: "Lấy hồ sơ người dùng thành công.",
      profile,
    });
  } catch (error) {
    console.error("Lỗi khi lấy UserProfile:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// PATCH /api/user-profile/update-blood-type/:userId

export async function updateUserProfileBloodType(req, res) {
  try {
    const { userId } = req.params;
    const { blood_type } = req.body;

    if (!userId || !blood_type) {
      return res.status(400).json({ message: "Thiếu userId hoặc blood_type" });
    }

    const profile = await UserProfile.findOne({ user_id: userId });

    if (!profile) {
      return res.status(404).json({ message: "Không tìm thấy hồ sơ người dùng" });
    }

    profile.blood_type = blood_type;
    await profile.save();

    return res.status(200).json({
      message: "Cập nhật nhóm máu thành công",
      profile,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật nhóm máu:", error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
}
