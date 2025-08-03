import HealthCheck from "../models/HealthCheck.js";
import CheckIn from "../models/CheckIn.js";

export async function createHealthCheck(req, res) {
  try {
    const { checkin_id } = req.body;

    if (!checkin_id) {
      return res.status(400).json({ message: "checkin_id is required." });
    }

    // Kiểm tra checkin_id có tồn tại không
    const checkIn = await CheckIn.findById(checkin_id);
    if (!checkIn) {
      return res.status(404).json({ message: "Check-in not found." });
    }

    // Tạo bản ghi HealthCheck chỉ với checkin_id
    const newHealthCheck = await HealthCheck.create({
      checkin_id,
    });

    return res.status(201).json({
      message: "Health check record created with checkin_id.",
      healthCheck: newHealthCheck,
    });
  } catch (error) {
    console.error("Error creating health check:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateHealthCheck(req, res) {
  try {
    const { id } = req.params; // Lấy id từ URL
    const updateData = req.body;

    // Kiểm tra xem bản ghi có tồn tại không
    const existing = await HealthCheck.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Health check record not found." });
    }

    // Cập nhật bản ghi
    const updated = await HealthCheck.findByIdAndUpdate(id, updateData, {
      new: true, // Trả về bản ghi sau khi update
      runValidators: true, // Kiểm tra ràng buộc schema
    });

    return res.status(200).json({
      message: "Health check record updated successfully.",
      healthCheck: updated,
    });
  } catch (error) {
    console.error("Error updating health check:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
