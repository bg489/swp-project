import express from "express";
import {
    updateDonationStatus,
    logDonationProcess
} from "../controllers/donationTrackingController.js";

const router = express.Router();

router.put("/update-status/:donationId", updateDonationStatus);
router.post("/log/:donationId", logDonationProcess);

export default router;