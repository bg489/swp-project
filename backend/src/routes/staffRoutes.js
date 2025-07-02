import express from "express";
import {
  getBloodRequestsByHospital,
  getBloodRequestById,
  updateBloodRequestStatus 
} from "../controllers/bloodReqController.js";
import {
  createDonation,
  getScheduledDonations,
  getDonationsByStaffId,
  updateDonationStatus,
  getDonationById
} from "../controllers/donationController.js";

const router = express.Router();


router.get("/blood-requests/get-list/:hospitalId", getBloodRequestsByHospital);
router.get("/blood-request/get-by-id/:requestId", getBloodRequestById);
router.put("/blood-requests/:requestId/status", updateBloodRequestStatus);
router.post("/donation/", createDonation);
router.get("/donations/scheduled", getScheduledDonations);
router.get("/donations/by-staff/:staffId", getDonationsByStaffId);
router.put("/donations/:donationId/update-status", updateDonationStatus);
router.get("/donations/id/:donationId", getDonationById);





export default router;
