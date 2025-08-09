import express from "express";
import {
  getPatientById,
  updatePatientById,
  getPatientsByHospital,
    createPatient, // Assuming you have a function to create a patient
} from "../controllers/patientsController.js";

const router = express.Router();

router.get("/:id", getPatientById);
router.put("/:id", updatePatientById);
router.get("/by-hospital/:hospital_id", getPatientsByHospital);
router.post("/create", createPatient);

export default router;