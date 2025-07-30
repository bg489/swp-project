import express from "express";
import {
  createUser,
  loginUser,
  requestPasswordReset,
  confirmPasswordReset,
  getAllEmails,
  getUserIdByEmail,
  toggleUserVerification,
  createDonorProfile,
  createRecipientProfile,
  getActiveDonorProfile,
  getActiveRecipientProfile,
  updateUserRole,
  updateUserById,
  createStaffProfile,
  getStaffProfileByUserId,
  getAvailableDonorsByHospital,
  updateCooldownUntil,
  getAllUsers,
  deleteUserByAdmin,
  getDonorsByHospitals,
  getCompatibleDonorsByHospitalAndRecipientBloodType
} from "../controllers/usersController.js";
import {
  getDonationsByDonorId,
  getDonationsByRecipientId,
  getWarehouseDonationsByRecipientId
} from "../controllers/donationController.js";
import {
  createDonorRequest,
  getDonorRequestsByDonorId,
  getDonorRequestsByHospitalId,
  updateDonorRequestStatus
} from "../controllers/donorRequestController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/reset/email", requestPasswordReset);
router.post("/reset/email/confirm", confirmPasswordReset);
router.get("/get-all-emails", getAllEmails);
router.get("/find-id", getUserIdByEmail);
router.put("/verify/:userId", toggleUserVerification);
router.post("/donor-profile", createDonorProfile);
router.post("/recipient-profile", createRecipientProfile);
router.get("/donor-profile/active/:user_id", getActiveDonorProfile);
router.get("/recipient-profile/active/:user_id", getActiveRecipientProfile);
router.put("/:userId/role", updateUserRole);
router.put('/edit/:userId', updateUserById);
router.post("/staff-profiles", createStaffProfile);
router.get("/staff-profiles/active/:userId", getStaffProfileByUserId);
router.get("/donor-profiles-by-hospital/:hospitalId", getAvailableDonorsByHospital);
router.put('/donor/update-cooldown', updateCooldownUntil);
router.get("/donations/donor-id/:donorId", getDonationsByDonorId);
router.get("/donations/recipient-id/:recipientId", getDonationsByRecipientId);
router.get("/donations-warehouse/recipient-id/:recipientId", getWarehouseDonationsByRecipientId);
router.get("/admin/get-all/:adminId", getAllUsers);
router.delete("/admin/users/delete/:adminId/:userId", deleteUserByAdmin);
router.post("/donors/by-hospitals", getDonorsByHospitals);
router.post("/donors/by-hospitals-and-bloodtype", getCompatibleDonorsByHospitalAndRecipientBloodType);
router.post("/donor/request", createDonorRequest);
router.get("/donor/get-requests-by-id/:donorId", getDonorRequestsByDonorId);
router.get("/donor/staff/get-requests-by-hospital/:hospitalId", getDonorRequestsByHospitalId);
router.put("/donor-requests/staff/:requestId/status", updateDonorRequestStatus);




export default router;
