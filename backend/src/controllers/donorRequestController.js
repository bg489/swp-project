import DonorRequest from "../models/DonorRequest.js";
import User from "../models/User.js";
import Hospital from "../models/Hospital.js";
import DonorProfile from "../models/DonorProfile.js"; // ✅ import thêm

export async function createDonorRequest(req, res) {
  try {
    const {
      donor_id,
      available_date,
      available_time_range,
      amount_offered,
      components_offered,
      comment,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (
      !donor_id ||
      !available_date ||
      !available_time_range ||
      !amount_offered ||
      !components_offered
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra user tồn tại và đúng vai trò
    const user = await User.findById(donor_id);
    if (!user || user.role !== "donor") {
      return res.status(404).json({ message: "User is not a valid donor" });
    }

    

    const donorProfile = await DonorProfile.findOne({ user_id: donor_id })
      .populate("hospital", "name address"); // Populate hospital in profile if needed

      if (!donorProfile || !donorProfile.blood_type) {
        return res.status(400).json({ message: "Donor profile or blood type not found" });
      }

    // Tạo DonorRequest
    const newRequest = new DonorRequest({
      donor_id,
      blood_type_offered: donorProfile.blood_type,
      available_date,
      available_time_range,
      amount_offered,
      components_offered,
      hospital: donorProfile.hospital, // Sử dụng hospital từ DonorProfile nếu cần
      comment: comment || "",
      status: "in_progress",
    });

    const savedRequest = await newRequest.save();

    // Populate user & donor profile
    const populatedRequest = await DonorRequest.findById(savedRequest._id)
      .populate({
        path: "donor_id",
        select: "full_name email phone gender date_of_birth address",
      });
    
    return res.status(201).json({
      message: "Donor request created successfully",
      request: populatedRequest,
      donor_profile: donorProfile,
    });
  } catch (error) {
    console.error("Error creating donor request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getDonorRequestsByDonorId(req, res) {
  try {
    const { donorId } = req.params;

    // Kiểm tra donorId hợp lệ
    if (!donorId) {
      return res.status(400).json({ message: "Missing donorId" });
    }

    // Kiểm tra user tồn tại và là donor
    const user = await User.findById(donorId);
    if (!user || user.role !== "donor") {
      return res.status(404).json({ message: "User is not a valid donor" });
    }

    // Tìm các yêu cầu hiến máu của donor
    const donorRequests = await DonorRequest.find({ donor_id: donorId })
      .populate({
        path: "donor_id",
        select: "full_name email phone gender date_of_birth address",
      }).populate({
        path: "hospital",
        select: "name address",
      })
      .sort({ createdAt: -1 }); // mới nhất trước

    return res.status(200).json({
      message: "Fetched donor requests successfully",
      requests: donorRequests,
    });
  } catch (error) {
    console.error("Error fetching donor requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getDonorRequestsByHospitalId(req, res) {
  try {
    const { hospitalId } = req.params;

    // Kiểm tra hospitalId hợp lệ
    if (!hospitalId) {
      return res.status(400).json({ message: "Missing hospitalId" });
    }

    // Kiểm tra bệnh viện có tồn tại
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Tìm các yêu cầu hiến máu liên quan đến bệnh viện
    const donorRequests = await DonorRequest.find({ hospital: hospitalId })
      .populate({
        path: "donor_id",
        select: "full_name email phone gender date_of_birth address",
      })
      .populate({
        path: "hospital",
        select: "name address",
      })
      .sort({ createdAt: -1 }); // sắp xếp mới nhất trước

    return res.status(200).json({
      message: "Fetched donor requests by hospital successfully",
      requests: donorRequests,
    });
  } catch (error) {
    console.error("Error fetching donor requests by hospital:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateDonorRequestStatus(req, res) {
  try {
    const { requestId } = req.params;
    const { status, staff_id } = req.body;

    // Kiểm tra thông tin đầu vào
    if (!requestId || !status || !staff_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra user có phải là staff
    const staffUser = await User.findById(staff_id);
    if (!staffUser || staffUser.role !== "staff") {
      return res.status(403).json({ message: "Unauthorized: Only staff can update status" });
    }

    // Kiểm tra trạng thái hợp lệ
    const validStatuses = ["in_progress", "completed", "cancelled", "pending"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Tìm và cập nhật yêu cầu hiến máu
    const updatedRequest = await DonorRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    )
      .populate({
        path: "donor_id",
        select: "full_name email phone gender date_of_birth address",
      })
      .populate({
        path: "hospital",
        select: "name address",
      });

    if (!updatedRequest) {
      return res.status(404).json({ message: "Donor request not found" });
    }

    return res.status(200).json({
      message: "Donor request status updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating donor request status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
