// controllers/bloodRequestRecordController.js
import BloodRequestRecord from "../models/BloodRequestRecord.js";

// POST /api/blood-request-records - Tạo mới yêu cầu máu
export async function createBloodRequestRecord(req, res) {
  try {
    const data = req.body;
    const newRecord = new BloodRequestRecord(data);
    await newRecord.save();
    return res.status(201).json({
      message: "Tạo yêu cầu máu thành công",
      bloodRequestRecord: newRecord,
    });
  } catch (error) {
    console.error("Lỗi khi tạo yêu cầu máu:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// GET /api/blood-request-records/by-hospital/:hospitalId
// Lấy tất cả yêu cầu máu theo id bệnh viện
export async function getBloodRequestsByHospital(req, res) {
  try {
    const { hospitalId } = req.params;
    const records = await BloodRequestRecord.find({ hospital_id: hospitalId }).exec();

    return res.status(200).json({ bloodRequestRecords: records });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách yêu cầu máu:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// PATCH /api/blood-request-records/:id/status - Cập nhật trạng thái yêu cầu máu
export async function updateBloodRequestStatusById(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Kiểm tra status hợp lệ
    const validStatuses = ["pending", "approved", "in_progress", "fulfilled", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const updatedRecord = await BloodRequestRecord.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu máu" });
    }

    return res.status(200).json({
      message: "Cập nhật trạng thái yêu cầu máu thành công",
      bloodRequestRecord: updatedRecord,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái yêu cầu máu:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// PATCH /api/blood-request-records/:id/selected-bags - Cập nhật túi máu đã chọn
export async function updateBloodRequestSelectedBagsById(req, res) {
  try {
    const { id } = req.params;
    const { selectedBags } = req.body;

    // Kiểm tra kiểu dữ liệu (phải là mảng)
    if (!Array.isArray(selectedBags)) {
      return res.status(400).json({ message: "selectedBags phải là một mảng" });
    }

    const updatedRecord = await BloodRequestRecord.findByIdAndUpdate(
      id,
      { selectedBags },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu máu" });
    }

    return res.status(200).json({
      message: "Cập nhật túi máu đã chọn thành công",
      bloodRequestRecord: updatedRecord,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật túi máu đã chọn:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}
