import express from "express";
import {
  createBloodRequest
} from "../controllers/bloodReqController.js";

const router = express.Router();

router.post("/request", createBloodRequest);



export default router;
