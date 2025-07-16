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
  getDonationById,
  createWarehouseDonation,
  updateWarehouseDonationStatus,
  getWarehouseDonationsByStaffId
} from "../controllers/donationController.js";

const router = express.Router();


router.get("/blood-requests/get-list/:hospitalId", getBloodRequestsByHospital);
router.get("/blood-request/get-by-id/:requestId", getBloodRequestById);
router.put("/blood-requests/:requestId/status", updateBloodRequestStatus);
router.post("/donation/", createDonation);
router.post("/donation-blood-inventory/", createWarehouseDonation);
router.get("/donations/scheduled", getScheduledDonations);
router.get("/donations/by-staff/:staffId", getDonationsByStaffId);
router.get("/donations-warehouse/by-staff/:staffId", getWarehouseDonationsByStaffId);
router.put("/donations/:donationId/update-status", updateDonationStatus);
router.put("/donations-blood-inventory/:donationId/update-status", updateWarehouseDonationStatus);
router.get("/donations/id/:donationId", getDonationById);





export default router;
