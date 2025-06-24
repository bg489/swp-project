import express from "express";
import {
    sendOTPEmail,
    verifyOTP,
    getOTPStatus
} from "../controllers/OTPController.js";

const router = express.Router();

// POST /api/otp/send
router.post("/send", sendOTPEmail)
router.post("/verify", verifyOTP)
router.get("/status", getOTPStatus);


export default router;
