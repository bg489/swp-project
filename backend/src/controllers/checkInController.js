import CheckIn from "../models/CheckIn.js";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import Hospital from "../models/Hospital.js";
import DonorDonationRequest from "../models/DonorDonationRequest.js";

export async function getCheckInById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Check-in ID is required" });
    }

    const checkIn = await CheckIn.findById(id)
      .populate({
        path: "user_id",
        model: "User",
        select: "full_name email phone gender date_of_birth",
      })
      .populate({
        path: "userprofile_id",
        model: "UserProfile",
        select: "blood_type cccd cooldown_until",
      })
      .populate({
        path: "hospital_id",
        model: "Hospital",
        select: "name address phone",
      })
      .populate({
        path: "donorDonationRequest_id",
        model: "DonorDonationRequest",
        select: "donation_date donation_time_range donation_type separated_component notes status",
      });

    if (!checkIn) {
      return res.status(404).json({ message: "Check-in not found" });
    }

    res.status(200).json({ checkIn });
  } catch (error) {
    console.error("Error fetching check-in by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}




export async function createCheckInByUserId(req, res) {
  try {
    const {
      user_id,
      userprofile_id,
      hospital_id,
      donorDonationRequest_id,
      status,
      comment,
    } = req.body;

    // Kiểm tra dữ liệu đầu vào bắt buộc
    if (!user_id || !userprofile_id || !hospital_id || !donorDonationRequest_id) {
      return res.status(400).json({
        message: "user_id, userprofile_id, hospital_id và donorDonationRequest_id là bắt buộc.",
      });
    }

    // Kiểm tra các đối tượng có tồn tại
    const [user, profile, hospital, donationRequest] = await Promise.all([
      User.findById(user_id),
      UserProfile.findById(userprofile_id),
      Hospital.findById(hospital_id),
      DonorDonationRequest.findById(donorDonationRequest_id),
    ]);

    if (!user || !profile || !hospital || !donationRequest) {
      return res.status(404).json({
        message: "Không tìm thấy user, user profile, hospital hoặc donor donation request.",
      });
    }

    // Tạo bản ghi CheckIn mới
    const newCheckIn = await CheckIn.create({
      user_id,
      userprofile_id,
      hospital_id,
      donorDonationRequest_id,
      status: status || "in_progress",
      comment: comment || "",
    });

    res.status(201).json({
      message: "Tạo CheckIn thành công",
      checkIn: newCheckIn,
    });
  } catch (error) {
    console.error("Lỗi khi tạo CheckIn:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}


// PUT /api/checkin/unverify/:id
export async function markCheckInUnverified(req, res) {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const checkIn = await CheckIn.findById(id);

    if (!checkIn) {
      return res.status(404).json({ message: "Không tìm thấy bản ghi CheckIn" });
    }

    checkIn.status = "unverified";
    if (comment !== undefined) {
      checkIn.comment = comment;
    }

    await checkIn.save();

    res.json({
      message: "Cập nhật CheckIn thành công",
      checkIn,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật CheckIn:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}


export async function markCheckInVerified(req, res) {
  try {
    const { checkInId } = req.params;

    const checkIn = await CheckIn.findById(checkInId);
    if (!checkIn) {
      return res.status(404).json({ message: "CheckIn not found" });
    }

    checkIn.status = "verified";
    checkIn.comment = ""; // Clear comment if needed
    await checkIn.save();

    res.json({
      message: "CheckIn marked as verified successfully",
      checkIn,
    });
  } catch (error) {
    console.error("Error verifying CheckIn:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCheckInsByHospitalId(req, res) {
  try {
    const { hospitalId } = req.params;

    if (!hospitalId) {
      return res.status(400).json({ message: "Hospital ID is required." });
    }

    const checkIns = await CheckIn.find({ hospital_id: hospitalId })
      .populate({
        path: "user_id",
        model: "User",
        select: "full_name email phone gender date_of_birth",
      })
      .populate({
        path: "userprofile_id",
        model: "UserProfile",
        select: "blood_type cccd cooldown_until",
      })
      .populate({
        path: "hospital_id",
        model: "Hospital",
        select: "name address phone",
      })
      .populate({
        path: "donorDonationRequest_id",
        model: "DonorDonationRequest",
        select: "donation_date donation_time_range donation_type separated_component notes status",
      })
      .sort({ createdAt: -1 }); // Mới nhất lên trước

    res.status(200).json({ checkIns });
  } catch (error) {
    console.error("Error fetching check-ins by hospital ID:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
