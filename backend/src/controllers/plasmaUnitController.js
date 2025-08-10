import PlasmaUnit from "../models/PlasmaUnit.js";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import Hospital from "../models/Hospital.js";

export async function createPlasmaUnit(req, res) {
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

        const unit = await PlasmaUnit.create({
            user_id,
            user_profile_id,
            hospital_id,
            volumeOrWeight,
        });

        return res.status(201).json({ message: "Plasma unit created successfully.", unit });
    } catch (error) {
        console.error("Error creating plasma unit:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function updatePlasmaUnitById(req, res) {
    try {
        const { id } = req.params;
        const unit = await PlasmaUnit.findById(id);
        if (!unit) return res.status(404).json({ message: "Plasma unit not found." });

        const allowedFields = [
            "bloodGroupABO",
            "bloodGroupRh",
            "collectionDate",
            "expiryDate",
            "storageTemperature",
            "irradiated",
            "notes",
        ];

        for (const key of allowedFields) {
            if (req.body.hasOwnProperty(key)) unit[key] = req.body[key];
        }

        await unit.save();
        return res.status(200).json({ message: "Plasma unit updated successfully.", unit });
    } catch (error) {
        console.error("Error updating plasma unit:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function markPlasmaUnitAsExpired(req, res) {
    try {
        const { id } = req.params;
        const unit = await PlasmaUnit.findById(id);
        if (!unit) return res.status(404).json({ message: "Plasma unit not found." });

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

export async function markPlasmaUnitAsDonated(req, res) {
    try {
        const { id } = req.params;
        const unit = await PlasmaUnit.findById(id);
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

export async function markPlasmaUnitAsNotEligible(req, res) {
    try {
        const { id } = req.params;
        const unit = await PlasmaUnit.findById(id);
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

export async function markPlasmaUnitAsTransfused(req, res) {
    try {
        const { id } = req.params;
        const unit = await PlasmaUnit.findById(id);
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

export async function getPlasmaUnitsByHospitalId(req, res) {
    try {
        const { hospital_id } = req.params;

        const hospital = await Hospital.findById(hospital_id);
        if (!hospital) return res.status(404).json({ message: "Hospital not found." });

        const units = await PlasmaUnit.find({ hospital_id })
            .populate("user_id", "full_name email")
            .populate("user_profile_id", "blood_type cccd");

        return res.status(200).json({ message: "Fetched successfully.", units });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function getPlasmaUnitById(req, res) {
    try {
        const { id } = req.params;
        const unit = await PlasmaUnit.findById(id)
            .populate("user_id", "full_name email phone")
            .populate("user_profile_id", "blood_type cccd");

        if (!unit) return res.status(404).json({ message: "Unit not found." });

        return res.status(200).json({ message: "Fetched successfully.", unit });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function markMultiplePlasmaUnitsAsTransfused(req, res) {
    try {
        const { ids, notes } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Invalid or empty ids array." });
        }

        // Tìm các đơn vị plasma hợp lệ
        const validUnits = await PlasmaUnit.find({
            _id: { $in: ids },
            status: { $nin: ["transfused", "expired", "not_eligible"] }
        });

        if (validUnits.length === 0) {
            return res.status(400).json({ message: "No eligible plasma units found to transfuse." });
        }

        // Cập nhật hàng loạt
        await PlasmaUnit.updateMany(
            { _id: { $in: validUnits.map(u => u._id) } },
            { 
                $set: { 
                    status: "transfused",
                    ...(typeof notes === "string" && notes.trim() !== "" ? { notes: notes.trim() } : {})
                }
            }
        );

        return res.status(200).json({
            message: "Plasma units updated to transfused successfully.",
            updatedCount: validUnits.length,
            updatedIds: validUnits.map(u => u._id)
        });
    } catch (error) {
        console.error("Error in bulk transfuse (Plasma):", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
