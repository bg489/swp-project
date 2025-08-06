import PlateletUnit from "../models/PlateletUnit.js";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import Hospital from "../models/Hospital.js";

export async function createPlateletUnit(req, res) {
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

        const unit = await PlateletUnit.create({
            user_id,
            user_profile_id,
            hospital_id,
            volumeOrWeight,
        });

        return res.status(201).json({ message: "Platelet unit created successfully.", unit });
    } catch (error) {
        console.error("Error creating platelet unit:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function updatePlateletUnitById(req, res) {
    try {
        const { id } = req.params;
        const unit = await PlateletUnit.findById(id);
        if (!unit) return res.status(404).json({ message: "Platelet unit not found." });

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
        return res.status(200).json({ message: "Platelet unit updated successfully.", unit });
    } catch (error) {
        console.error("Error updating platelet unit:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function getPlateletUnitById(req, res) {
    try {
        const { id } = req.params;
        const unit = await PlateletUnit.findById(id).populate("user_id user_profile_id hospital_id");
        if (!unit) return res.status(404).json({ message: "Platelet unit not found." });
        return res.status(200).json({ unit });
    } catch (error) {
        console.error("Error retrieving platelet unit:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function getPlateletUnitsByHospitalId(req, res) {
    try {
        const { hospital_id } = req.params;
        const units = await PlateletUnit.find({ hospital_id }).sort({ createdAt: -1 });
        return res.status(200).json({ units });
    } catch (error) {
        console.error("Error retrieving platelet units:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function markPlateletUnitAsExpired(req, res) {
    try {
        const { id } = req.params;
        const unit = await PlateletUnit.findById(id);
        if (!unit) return res.status(404).json({ message: "Platelet unit not found." });

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

export async function markPlateletUnitAsDonated(req, res) {
    try {
        const { id } = req.params;
        const unit = await PlateletUnit.findById(id);
        if (!unit) return res.status(404).json({ message: "Platelet unit not found." });

        if (unit.status !== "pending") {
            return res.status(400).json({ message: `Cannot donate unit with status "${unit.status}".` });
        }

        unit.status = "donated";
        await unit.save();

        return res.status(200).json({ message: "Marked as donated.", unit });
    } catch (error) {
        console.error("Error marking as donated:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function markPlateletUnitAsNotEligible(req, res) {
    try {
        const { id } = req.params;
        const unit = await PlateletUnit.findById(id);
        if (!unit) return res.status(404).json({ message: "Platelet unit not found." });

        unit.status = "not_eligible";
        await unit.save();

        return res.status(200).json({ message: "Marked as not eligible.", unit });
    } catch (error) {
        console.error("Error marking as not eligible:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function markPlateletUnitAsTransfused(req, res) {
    try {
        const { id } = req.params;
        const unit = await PlateletUnit.findById(id);
        if (!unit) return res.status(404).json({ message: "Unit not found." });

        if (unit.status === "expired" || unit.status === "not_eligible") {
            return res.status(400).json({ message: `Cannot transfuse unit with status "${unit.status}".` });
        }

        unit.status = "transfused";
        await unit.save();

        return res.status(200).json({ message: "Marked as transfused.", unit });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
