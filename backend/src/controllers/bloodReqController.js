import BloodRequest from "../models/BloodRequest.js";
import User from "../models/User.js";
import Hospital from "../models/Hospital.js";

export async function createBloodRequest(req, res) {
  try {
    const {
      recipient_id,
      blood_type_needed,
      components_needed,
      amount_needed,
      hospital,
      distance,
      is_emergency,
      comment,
    } = req.body;

    // Validate required fields
    if (
      !recipient_id ||
      !blood_type_needed ||
      !components_needed ||
      !amount_needed ||
      !hospital
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate recipient exists and has correct role
    const user = await User.findById(recipient_id);
    if (!user || user.role !== "recipient") {
      return res.status(404).json({ message: "User is not a valid recipient" });
    }

    // Create the blood request
    const newRequest = new BloodRequest({
      recipient_id,
      blood_type_needed,
      components_needed,
      amount_needed,
      hospital,
      distance: distance || 10,
      is_emergency: is_emergency || false, // default to false if not provided
      status: "pending", // default status
      comment: comment || "",
    });

    const savedRequest = await newRequest.save();

    return res.status(201).json({
      message: "Blood request created successfully",
      request: savedRequest,
    });
  } catch (error) {
    console.error("Error creating blood request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getBloodRequestsByRecipientId(req, res) {
  try {
    const { recipientId } = req.params;

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    const requests = await BloodRequest.find({ recipient_id: recipientId })
      .populate("recipient_id", "fullName email phone")
      .sort({ createdAt: -1 });

    if (!requests.length) {
      return res.status(404).json({ message: "No blood requests found for this recipient" });
    }

    return res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching blood requests by recipient ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getBloodRequestsByHospital = async (req, res) => {
  const { hospitalId } = req.params;

  try {
    // Kiểm tra bệnh viện tồn tại không
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }

    // Tìm tất cả yêu cầu máu thuộc bệnh viện này
    const bloodRequests = await BloodRequest.find({ hospital: hospitalId, status: "pending" })
      .populate("recipient_id", "full_name email phone") // populate thông tin người nhận
      .populate("hospital", "name address phone");       // populate thông tin bệnh viện

    return res.status(200).json({
      success: true,
      count: bloodRequests.length,
      data: bloodRequests,
    });
  } catch (error) {
    console.error("Error fetching blood requests by hospital:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export async function getBloodRequestById(req, res) {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    const request = await BloodRequest.findById(requestId)
      .populate("recipient_id", "full_name email phone")
      .populate("hospital", "name address");

    if (!request) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    return res.status(200).json(request);
  } catch (error) {
    console.error("Error fetching blood request by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateBloodRequestStatus(req, res) {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    // Validate params & body
    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required" });
    }
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Danh sách các trạng thái hợp lệ
    const validStatuses = [
      "pending", "approved", "matched",
      "in_progress", "completed", "cancelled", "rejected"
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Tìm yêu cầu máu và cập nhật
    const updatedRequest = await BloodRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    )
      .populate("recipient_id", "full_name email phone")
      .populate("hospital", "name address");

    if (!updatedRequest) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    return res.status(200).json({
      message: "Blood request status updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating blood request status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}