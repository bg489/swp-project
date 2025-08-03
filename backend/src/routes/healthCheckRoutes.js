import express from "express";
import {
    createHealthCheck,
    updateHealthCheck,
    markHealthCheckFailed,
    markHealthCheckPassed,
    getCheckInStatusByHealthCheckId,
    getAllCheckInStatusesByHospitalId,
    getHealthCheckById
} from "../controllers/healthCheckController.js";

const router = express.Router();

router.post("/create", createHealthCheck);
router.put("/health-check/:id", updateHealthCheck);
router.put("/health-check/:id/fail", markHealthCheckFailed);
router.put("/health-check/:id/pass", markHealthCheckPassed);
router.get("/health-check/:id/checkin", getCheckInStatusByHealthCheckId);
router.get("/hospital/:hospitalId/checkin-statuses", getAllCheckInStatusesByHospitalId);
router.get('/healthcheck/:id', getHealthCheckById);


export default router;
