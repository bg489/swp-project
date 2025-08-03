import DonorDonationRequest from "../models/DonorDonationRequest.js";
import Hospital from "../models/Hospital.js";
import User from "../models/User.js";

export async function createDonorDonationRequest(req, res) {
  try {
    const {
      user_id,
      hospital,
      donation_date,
      donation_time_range,
      donation_type,
      separated_component,
      notes,
    } = req.body;

    // Validate bắt buộc
    if (
      !user_id ||
      !hospital ||
      !donation_date ||
      !donation_time_range?.from ||
      !donation_time_range?.to ||
      !donation_type
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra người dùng tồn tại và là donor
    const user = await User.findById(user_id);
    if (!user || user.role !== "user") {
      return res.status(404).json({ message: "User not found or not a donor" });
    }

    // Kiểm tra bệnh viện tồn tại
    const hospitalExists = await Hospital.findById(hospital);
    if (!hospitalExists) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Nếu là gạn tách thì phải có loại thành phần
    if (donation_type === "separated" && !separated_component) {
      return res.status(400).json({ message: "Separated component is required for apheresis donation" });
    }

    // Tạo yêu cầu hiến máu
    const newRequest = new DonorDonationRequest({
      user_id,
      hospital,
      donation_date,
      donation_time_range,
      donation_type,
      separated_component: donation_type === "separated" ? separated_component : undefined,
      notes: notes || "",
    });

    const savedRequest = await newRequest.save();

    return res.status(201).json({
      message: "Donor donation request created successfully",
      request: savedRequest,
    });
  } catch (error) {
    console.error("Error creating donor donation request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getDonorDonationRequestsByUserId(req, res) {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const requests = await DonorDonationRequest.find({ user_id })
      .populate("hospital", "name address")
      .sort({ createdAt: -1 });

    if (requests.length === 0) {
      return res.status(404).json({ message: "No donation requests found for this user" });
    }

    // Đếm số lượng theo status
    const statusCount = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    requests.forEach((req) => {
      const status = req.status;
      if (status === "pending") statusCount.pending += 1;
      else if (status === "approved") statusCount.approved += 1;
      else if (status === "rejected") statusCount.rejected += 1;
    });

    res.status(200).json({
      message: "Fetched donation requests for user successfully",
      total: requests.length,
      status_summary: statusCount,
      requests,
    });
  } catch (error) {
    console.error("Error fetching donation requests by user ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function rejectDonationRequestById(req, res) {
  try {
    const { request_id } = req.params;

    if (!request_id) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    // Tìm và cập nhật yêu cầu thành "rejected"
    const updatedRequest = await DonorDonationRequest.findByIdAndUpdate(
      request_id,
      { status: "rejected" },
      { new: true }
    ).populate("hospital", "name address");

    if (!updatedRequest) {
      return res.status(404).json({ message: "Donation request not found" });
    }

    res.status(200).json({
      message: "Donation request has been rejected",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error rejecting donation request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
