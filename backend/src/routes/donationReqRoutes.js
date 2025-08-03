import express from "express";
import {
    createDonorDonationRequest,
    getDonorDonationRequestsByUserId,
    rejectDonationRequestById
} from "../controllers/donorDonationRequestController.js";

const router = express.Router();

router.post("/donor-donation-request/create", createDonorDonationRequest);
router.get("/donor-donation-request/user/:user_id", getDonorDonationRequestsByUserId);
router.put("/donor-donation-request/reject/:request_id", rejectDonationRequestById);

export default router;
