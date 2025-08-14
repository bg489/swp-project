// routes/bloodRequestRecordRoutes.ts
import express from "express";
import {
  createBloodRequestRecord,
  getBloodRequestsByHospital,
  updateBloodRequestStatusById,
  updateBloodRequestSelectedBagsById
} from "../controllers/bloodRequestRecordController.js";

const router = express.Router();

router.post("/blood-requests", createBloodRequestRecord);
router.get("/blood-requests/:hospitalId", getBloodRequestsByHospital);
router.put("/status/:id", updateBloodRequestStatusById);
router.put("/selected-bag/:id", updateBloodRequestSelectedBagsById);

export default router;
