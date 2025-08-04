import express from "express";
import { createCheckInByUserId, getCheckInById, markCheckInUnverified, markCheckInVerified, getCheckInsByHospitalId } from "../controllers/checkInController.js";

const router = express.Router();

// POST /api/checkin
router.post("/", createCheckInByUserId);

// GET /api/checkin/:id
router.get("/:id", getCheckInById);

router.put("/unverify/:id", markCheckInUnverified);

router.put("/checkins/:checkInId/verify", markCheckInVerified);

router.get("/hospital/:hospitalId", getCheckInsByHospitalId);

export default router;
