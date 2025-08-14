import express from "express";
import {
  createBloodTestRecord,
  getBloodTestRecordsByHospital,
  updateBloodTestRecordById,
  deleteBloodTestRecordById,
} from "../controllers/bloodTestRecordController.js";

const router = express.Router();

// Tạo mới kết quả xét nghiệm máu
router.post("/", createBloodTestRecord);

// Lấy tất cả kết quả xét nghiệm theo id bệnh viện
router.get("/by-hospital/:hospitalId", getBloodTestRecordsByHospital);

// Cập nhật thông tin xét nghiệm máu theo id
router.put("/:id", updateBloodTestRecordById);

// Xóa kết quả xét nghiệm máu theo id
router.delete("/:id", deleteBloodTestRecordById);

export default router;