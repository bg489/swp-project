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
  getAvailableDonorsByHospital
} from "../controllers/usersController.js";

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



export default router;
