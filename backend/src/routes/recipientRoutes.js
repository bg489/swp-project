import express from "express";
import {
  createBloodRequest,
  getBloodRequestsByRecipientId
} from "../controllers/bloodReqController.js";

const router = express.Router();

router.post("/request", createBloodRequest);
router.get("/blood-requests/:recipientId", getBloodRequestsByRecipientId);


export default router;
