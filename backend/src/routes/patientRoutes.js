import express from "express";
import {
  getPatientById,
  updatePatientById,
  getPatientsByHospital,
  createPatient,
  cancelPatientById,
} from "../controllers/patientsController.js";

const router = express.Router();

router.get("/:id", getPatientById);
router.put("/:id", updatePatientById);
router.get("/by-hospital/:hospital_id", getPatientsByHospital);
router.post("/create", createPatient);
router.put("/:id/cancelled", cancelPatientById);

export default router;