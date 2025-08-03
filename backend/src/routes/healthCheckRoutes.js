import express from "express";
import {
    createHealthCheck,
    updateHealthCheck
} from "../controllers/healthCheckController.js";

const router = express.Router();

router.post("/create", createHealthCheck);
router.put("/health-check/:id", updateHealthCheck);


export default router;
