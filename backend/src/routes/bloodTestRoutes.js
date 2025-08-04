import express from "express";
import {
    createBloodTest,
    updateBloodTest,
    markBloodTestFailed,
    markBloodTestPassed,
    getBloodTestById,
    getBloodTestsByHospital,
} from "../controllers/bloodTestController.js";

const router = express.Router();

// Tạo xét nghiệm máu
router.post("/create", createBloodTest);

// Cập nhật xét nghiệm máu (không đổi status)
router.put("/blood-test/:id", updateBloodTest);

// Đánh dấu thất bại
router.put("/blood-test/:id/fail", markBloodTestFailed);

// Đánh dấu đạt
router.put("/blood-test/:id/pass", markBloodTestPassed);

// Lấy thông tin 1 xét nghiệm máu theo ID
router.get("/blood-test/:id", getBloodTestById);

// Lấy tất cả xét nghiệm máu theo bệnh viện
router.get("/hospital/:hospitalId/blood-tests", getBloodTestsByHospital);

export default router;
