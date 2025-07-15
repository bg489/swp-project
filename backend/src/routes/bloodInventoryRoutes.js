import express from "express";
import {
    createBloodInventory,
    getBloodInventoriesByHospital,
    updateBloodInventoryQuantity,
    createAllBloodInventories
} from "../controllers/bloodInventoryController.js";

const router = express.Router();

// POST tạo mới 1 blood inventory
router.post("/blood-inventory/create", createBloodInventory);


router.post("/blood-inventory/createAll", createAllBloodInventories);

// GET tất cả inventory của 1 bệnh viện theo hospitalId
router.get("/blood-inventory/hospital/:hospitalId", getBloodInventoriesByHospital);

// PUT cập nhật số lượng inventory theo inventoryId
router.put("/blood-inventory/update/:inventoryId", updateBloodInventoryQuantity);

export default router;
