import express from "express";
import { getHospitals, createHospital, getHospitalById, createHospitals } from "../controllers/hospitalsController.js";

const router = express.Router();

router.get("/", getHospitals);          // GET tất cả
router.post("/", createHospital);       // POST tạo mới
router.get("/:id", getHospitalById);    // GET theo id
router.post("/hospitals", createHospitals);       // POST tạo mới

export default router;
