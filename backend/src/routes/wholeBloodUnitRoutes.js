import express from "express";
import {
    createWholeBloodUnit,
    updateWholeBloodUnitById,
    markWholeBloodUnitAsExpired,
    markWholeBloodUnitAsDonated,
    getWholeBloodUnitById,
    getWholeBloodUnitsByHospitalId,
    isBloodGroupComplete,
    getBloodTypeStringById,
    markWholeBloodUnitAsNotEligible,
    markWholeBloodUnitAsTransfused,
    markMultipleWholeBloodUnitsAsTransfused
} from "../controllers/wholeBloodUnitController.js";

import {
    createRedBloodCellUnit,
    updateRedBloodCellUnitById,
    markRedBloodCellUnitAsExpired,
    markRedBloodCellUnitAsDonated,
    getRedBloodCellUnitById,
    getRedBloodCellUnitsByHospitalId,
    markRedBloodCellUnitAsNotEligible,
    markRedBloodCellUnitAsTransfused,
    markMultipleRedBloodCellUnitsAsTransfused
} from "../controllers/redBloodCellController.js";

import {
    createPlasmaUnit,
    updatePlasmaUnitById,
    markPlasmaUnitAsExpired,
    markPlasmaUnitAsDonated,
    getPlasmaUnitById,
    getPlasmaUnitsByHospitalId,
    markPlasmaUnitAsNotEligible,
    markPlasmaUnitAsTransfused,
    markMultiplePlasmaUnitsAsTransfused
} from "../controllers/plasmaUnitController.js";

import {
    createPlateletUnit,
    updatePlateletUnitById,
    markPlateletUnitAsExpired,
    markPlateletUnitAsDonated,
    getPlateletUnitById,
    getPlateletUnitsByHospitalId,
    markPlateletUnitAsNotEligible,
    markPlateletUnitAsTransfused,
    markMultiplePlateletUnitsAsTransfused
} from "../controllers/plateletUnitController.js";

const router = express.Router();

// === WHOLE BLOOD ===
router.post("/create", createWholeBloodUnit);
router.put("/whole-blood-unit/:id", updateWholeBloodUnitById);
router.put("/whole-blood-unit/:id/expire", markWholeBloodUnitAsExpired);
router.put("/whole-blood-unit/:id/donate", markWholeBloodUnitAsDonated);
router.put("/whole-blood-unit/:id/not-eligible", markWholeBloodUnitAsNotEligible);
router.put("/whole-blood-unit/:id/transfused", markWholeBloodUnitAsTransfused);
router.get("/whole-blood-unit/:id", getWholeBloodUnitById);
router.get("/hospital/:hospital_id/whole-blood-units", getWholeBloodUnitsByHospitalId);
router.get("/whole-blood-unit/:id/check-blood-type", isBloodGroupComplete);
router.get("/whole-blood-unit/:id/email-blood-type", getBloodTypeStringById);
router.put("/whole-blood-unit/transfused/notes", markMultipleWholeBloodUnitsAsTransfused);

// === RED BLOOD CELLS ===
router.post("/red-blood-cell/create", createRedBloodCellUnit);
router.put("/red-blood-cell/:id", updateRedBloodCellUnitById);
router.put("/red-blood-cell/:id/expire", markRedBloodCellUnitAsExpired);
router.put("/red-blood-cell/:id/donate", markRedBloodCellUnitAsDonated);
router.put("/red-blood-cell/:id/not-eligible", markRedBloodCellUnitAsNotEligible);
router.put("/red-blood-cell/:id/transfused", markRedBloodCellUnitAsTransfused);
router.get("/red-blood-cell/:id", getRedBloodCellUnitById);
router.get("/hospital/:hospital_id/red-blood-cells", getRedBloodCellUnitsByHospitalId);
router.put("/red-blood-cell/transfused/notes", markMultipleRedBloodCellUnitsAsTransfused);

// === PLASMA ===
router.post("/plasma/create", createPlasmaUnit);
router.put("/plasma/:id", updatePlasmaUnitById);
router.put("/plasma/:id/expire", markPlasmaUnitAsExpired);
router.put("/plasma/:id/donate", markPlasmaUnitAsDonated);
router.put("/plasma/:id/not-eligible", markPlasmaUnitAsNotEligible);
router.put("/plasma/:id/transfused", markPlasmaUnitAsTransfused);
router.get("/plasma/:id", getPlasmaUnitById);
router.get("/hospital/:hospital_id/plasmas", getPlasmaUnitsByHospitalId);
router.put("/plasma/transfused/notes", markMultiplePlasmaUnitsAsTransfused);

// === PLATELETS ===
router.post("/platelet/create", createPlateletUnit);
router.put("/platelet/:id", updatePlateletUnitById);
router.put("/platelet/:id/expire", markPlateletUnitAsExpired);
router.put("/platelet/:id/donate", markPlateletUnitAsDonated);
router.put("/platelet/:id/not-eligible", markPlateletUnitAsNotEligible);
router.put("/platelet/:id/transfused", markPlateletUnitAsTransfused);
router.get("/platelet/:id", getPlateletUnitById);
router.get("/hospital/:hospital_id/platelets", getPlateletUnitsByHospitalId);
router.put("/platelet/transfused/notes", markMultiplePlateletUnitsAsTransfused);

export default router;
