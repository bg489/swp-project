import express from "express";
import {
    createDonorDonationRequest,
    getDonorDonationRequestsByUserId,
    rejectDonationRequestById,
    getDonorDonationRequestsByHospitalId,
    approveDonationRequestById,
    completeDonationRequestById
} from "../controllers/donorDonationRequestController.js";

const router = express.Router();

router.post("/donor-donation-request/create", createDonorDonationRequest);
router.get("/donor-donation-request/user/:user_id", getDonorDonationRequestsByUserId);
router.put("/donor-donation-request/reject/:request_id", rejectDonationRequestById);
router.get("/donor-donation-request/hospital/:hospital_id", getDonorDonationRequestsByHospitalId);
router.put("/donor-donation-request/approve/:request_id", approveDonationRequestById);
router.put("/donor-donation-request/complete/:request_id", completeDonationRequestById);

export default router;
