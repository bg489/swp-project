import express from "express";
import {
  createUser,
  loginUser,
  requestPasswordReset,
  confirmPasswordReset,
  getAllEmails,
  getUserIdByEmail,
  toggleUserVerification 
} from "../controllers/usersController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/reset/email", requestPasswordReset);
router.post("/reset/email/confirm", confirmPasswordReset);
router.get("/get-all-emails", getAllEmails);
router.get("/find-id", getUserIdByEmail);
router.put("/verify/:userId", toggleUserVerification);

export default router;
