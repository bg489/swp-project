import RedBloodCellUnit from "../models/RedBloodCellUnit.js";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import Hospital from "../models/Hospital.js";

export async function createRedBloodCellUnit(req, res) {
    try {
        const { user_id, user_profile_id, hospital_id, volumeOrWeight } = req.body;

        if (!user_id || !user_profile_id || !hospital_id || typeof volumeOrWeight !== "number") {
            return res.status(400).json({ message: "Missing or invalid required fields." });
        }

        const [user, userProfile, hospital] = await Promise.all([
            User.findById(user_id),
            UserProfile.findById(user_profile_id),
            Hospital.findById(hospital_id),
        ]);

        if (!user || !userProfile || !hospital) {
            return res.status(404).json({ message: "User/UserProfile/Hospital not found." });
        }

        const unit = await RedBloodCellUnit.create({
            user_id,
            user_profile_id,
            hospital_id,
            volumeOrWeight,
        });

        return res.status(201).json({ message: "Red blood cell unit created successfully.", unit });
    } catch (error) {
        console.error("Error creating red blood cell unit:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function updateRedBloodCellUnitById(req, res) {
    try {
        const { id } = req.params;
        const unit = await RedBloodCellUnit.findById(id);
        if (!unit) return res.status(404).json({ message: "Red blood cell unit not found." });

        const allowedFields = [
            "bloodGroupABO",
            "bloodGroupRh",
            "collectionDate",
            "expiryDate",
            "volumeOrWeight",
            "storageTemperature",
            "irradiated",
            "notes",
        ];

        for (const key of allowedFields) {
            if (req.body.hasOwnProperty(key)) unit[key] = req.body[key];
        }

        await unit.save();

        return res.status(200).json({ message: "Red blood cell unit updated successfully.", unit });
    } catch (error) {
        console.error("Error updating red blood cell unit:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function markRedBloodCellUnitAsExpired(req, res) {
    try {
        const { id } = req.params;
        const unit = await RedBloodCellUnit.findById(id);
        if (!unit) return res.status(404).json({ message: "Red blood cell unit not found." });

        if (unit.status === "expired") {
            return res.status(200).json({ message: "Already marked as expired." });
        }

        unit.status = "expired";
        await unit.save();

        return res.status(200).json({ message: "Marked as expired.", unit });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function markRedBloodCellUnitAsDonated(req, res) {
    try {
        const { id } = req.params;
        const unit = await RedBloodCellUnit.findById(id);
        if (!unit) return res.status(404).json({ message: "Unit not found." });

        if (unit.status === "expired") {
            return res.status(400).json({ message: "Cannot donate expired unit." });
        }

        if (unit.status === "donated") {
            return res.status(200).json({ message: "Already donated." });
        }

        unit.status = "donated";
        await unit.save();

        return res.status(200).json({ message: "Marked as donated.", unit });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function getRedBloodCellUnitsByHospitalId(req, res) {
    try {
        const { hospital_id } = req.params;

        const hospital = await Hospital.findById(hospital_id);
        if (!hospital) return res.status(404).json({ message: "Hospital not found." });

        const units = await RedBloodCellUnit.find({ hospital_id })
            .populate("user_id", "full_name email")
            .populate("user_profile_id", "blood_type cccd");

        return res.status(200).json({ message: "Fetched successfully.", units });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function getRedBloodCellUnitById(req, res) {
    try {
        const { id } = req.params;
        const unit = await RedBloodCellUnit.findById(id)
            .populate("user_id", "full_name email phone")
            .populate("user_profile_id", "blood_type cccd");

        if (!unit) return res.status(404).json({ message: "Unit not found." });

        return res.status(200).json({ message: "Fetched successfully.", unit });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function markRedBloodCellUnitAsNotEligible(req, res) {
    try {
        const { id } = req.params;
        const unit = await RedBloodCellUnit.findById(id);
        if (!unit) return res.status(404).json({ message: "Unit not found." });

        if (unit.status === "not_eligible") {
            return res.status(200).json({ message: "Already marked as not eligible." });
        }

        unit.status = "not_eligible";
        await unit.save();

        return res.status(200).json({ message: "Marked as not eligible.", unit });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function markRedBloodCellUnitAsTransfused(req, res) {
    try {
        const { id } = req.params;
        const unit = await RedBloodCellUnit.findById(id);
        if (!unit) return res.status(404).json({ message: "Unit not found." });

        if (unit.status === "expired" || unit.status === "not_eligible") {
            return res.status(400).json({ message: `Cannot transfuse unit with status "${unit.status}".` });
        }

        if (unit.status === "transfused") {
            return res.status(200).json({ message: "Already transfused." });
        }

        unit.status = "transfused";
        await unit.save();

        return res.status(200).json({ message: "Marked as transfused.", unit });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function markMultipleRedBloodCellUnitsAsTransfused(req, res) {
    try {
        const { ids, notes } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Invalid or empty ids array." });
        }

        // Lọc ra các đơn vị hợp lệ
        const validUnits = await RedBloodCellUnit.find({
            _id: { $in: ids },
            status: { $nin: ["transfused", "expired", "not_eligible"] }
        });

        if (validUnits.length === 0) {
            return res.status(400).json({ message: "No eligible red blood cell units found to transfuse." });
        }

        // Cập nhật hàng loạt
        await RedBloodCellUnit.updateMany(
            { _id: { $in: validUnits.map(u => u._id) } },
            { 
                $set: { 
                    status: "transfused",
                    ...(typeof notes === "string" && notes.trim() !== "" ? { notes: notes.trim() } : {})
                }
            }
        );

        return res.status(200).json({
            message: "Red blood cell units updated to transfused successfully.",
            updatedCount: validUnits.length,
            updatedIds: validUnits.map(u => u._id)
        });
    } catch (error) {
        console.error("Error in bulk transfuse (RBC):", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
