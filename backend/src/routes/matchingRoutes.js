import express from "express";
import {
    matchRecipientWithDonor,
    saveRecipientDonorMatch,
    notifyMatch
} from "../controllers/matchingController.js";

const router = express.Router();

router.post("/match", matchRecipientWithDonor);
router.post("/save-match", saveRecipientDonorMatch);
router.post("/notify-match", notifyMatch);

export default router;