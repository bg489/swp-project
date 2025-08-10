import BloodTestRecord from "../models/BloodTestRecord.js";

// POST /api/blood-test-records - Tạo mới kết quả xét nghiệm máu
export async function createBloodTestRecord(req, res) {
  try {
    const data = req.body;
    const newRecord = new BloodTestRecord(data);
    await newRecord.save();
    return res.status(201).json({
      message: "Tạo kết quả xét nghiệm máu thành công",
      bloodTestRecord: newRecord,
    });
  } catch (error) {
    console.error("Lỗi khi tạo kết quả xét nghiệm máu:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// GET /api/blood-test-records/by-hospital/:hospitalId - Lấy tất cả kết quả xét nghiệm theo id bệnh viện
export async function getBloodTestRecordsByHospital(req, res) {
  try {
    const { hospitalId } = req.params;
    // Giả sử mỗi BloodTestRecord có trường donorId liên kết với Patient, và Patient có trường hospital
    const records = await BloodTestRecord.find()
      .populate({
        path: "donorId",
        match: { hospital: hospitalId },
      })
      .exec();

    // Lọc ra các record có donorId (tức là bệnh nhân thuộc hospital này)
    const filteredRecords = records.filter((r) => r.donorId);

    return res.status(200).json({ bloodTestRecords: filteredRecords });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách kết quả xét nghiệm:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// PATCH /api/blood-test-records/:id - Cập nhật thông tin xét nghiệm máu theo id
export async function updateBloodTestRecordById(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedRecord = await BloodTestRecord.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedRecord) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy kết quả xét nghiệm" });
    }
    return res.status(200).json({
      message: "Cập nhật kết quả xét nghiệm thành công",
      bloodTestRecord: updatedRecord,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật kết quả xét nghiệm:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// DELETE /api/blood-test-records/:id - Xóa kết quả xét nghiệm máu theo id
export async function deleteBloodTestRecordById(req, res) {
  try {
    const { id } = req.params;
    const deletedRecord = await BloodTestRecord.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy kết quả xét nghiệm" });
    }
    return res.status(200).json({
      message: "Xóa kết quả xét nghiệm thành công",
      bloodTestRecord: deletedRecord,
    });
  } catch (error) {
    console.error("Lỗi khi xóa kết quả xét nghiệm:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}