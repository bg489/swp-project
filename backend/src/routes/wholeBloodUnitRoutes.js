import express from "express";
import {
    createWholeBloodUnit,
    updateWholeBloodUnitById,
    markWholeBloodUnitAsExpired,
    markWholeBloodUnitAsDonated,
    getWholeBloodUnitById,
    getWholeBloodUnitsByHospitalId,
    isBloodGroupComplete,
    getBloodTypeStringById
} from "../controllers/wholeBloodUnitController.js";

const router = express.Router();

// Tạo đơn vị máu toàn phần
router.post("/create", createWholeBloodUnit);

// Cập nhật thông tin đơn vị máu toàn phần (không đổi status)
router.put("/whole-blood-unit/:id", updateWholeBloodUnitById);

// Đánh dấu là đã hết hạn
router.put("/whole-blood-unit/:id/expire", markWholeBloodUnitAsExpired);

// Đánh dấu là đã hiến
router.put("/whole-blood-unit/:id/donate", markWholeBloodUnitAsDonated);

// Lấy thông tin một đơn vị máu theo ID
router.get("/whole-blood-unit/:id", getWholeBloodUnitById);

// Lấy tất cả đơn vị máu theo bệnh viện
router.get("/hospital/:hospital_id/whole-blood-units", getWholeBloodUnitsByHospitalId);

router.get("/whole-blood-unit/:id/check-blood-type", isBloodGroupComplete);

router.get("/whole-blood-unit/:id/email-blood-type", getBloodTypeStringById);

export default router;
