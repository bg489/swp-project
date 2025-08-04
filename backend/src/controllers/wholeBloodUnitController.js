import WholeBloodUnit from "../models/WholeBloodUnit.js"; // đường dẫn model có thể khác
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import Hospital from "../models/Hospital.js";

export async function createWholeBloodUnit(req, res) {
    try {
        const { user_id, user_profile_id, hospital_id, volume } = req.body;

        if (!user_id || !user_profile_id || !hospital_id || typeof volume !== "number") {
            return res.status(400).json({ message: "Missing or invalid required fields." });
        }

        // Kiểm tra tồn tại
        const [user, userProfile, hospital] = await Promise.all([
            User.findById(user_id),
            UserProfile.findById(user_profile_id),
            Hospital.findById(hospital_id),
        ]);

        if (!user) return res.status(404).json({ message: "User not found." });
        if (!userProfile) return res.status(404).json({ message: "User profile not found." });
        if (!hospital) return res.status(404).json({ message: "Hospital not found." });

        let bloodUnitsToCreate = [];

        if (volume === 500) {
            bloodUnitsToCreate.push({
                user_id,
                user_profile_id,
                hospital_id,
                volumeOrWeight: 250,
            });
            bloodUnitsToCreate.push({
                user_id,
                user_profile_id,
                hospital_id,
                volumeOrWeight: 250,
            });
        } else {
            bloodUnitsToCreate.push({
                user_id,
                user_profile_id,
                hospital_id,
                volumeOrWeight: volume,
            });
        }

        const createdUnits = await WholeBloodUnit.insertMany(bloodUnitsToCreate);

        return res.status(201).json({
            message: "Whole blood unit(s) created successfully.",
            units: createdUnits,
        });
    } catch (error) {
        console.error("Error creating whole blood unit:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function updateWholeBloodUnitById(req, res) {
    try {
        const { id } = req.params;

        // Kiểm tra bản ghi tồn tại
        const bloodUnit = await WholeBloodUnit.findById(id);
        if (!bloodUnit) {
            return res.status(404).json({ message: "Whole blood unit not found." });
        }

        // Danh sách các trường được phép cập nhật
        const allowedFields = [
            "bloodGroupABO",
            "bloodGroupRh",
            "collectionDate",
            "anticoagulantSolution",
            "expiryDate",
            "volumeOrWeight",
            "storageTemperature",
            "irradiated",
            "notes",
        ];

        // Chỉ cập nhật những trường có trong allowedFields và tồn tại trong req.body
        for (const key of allowedFields) {
            if (req.body.hasOwnProperty(key)) {
                bloodUnit[key] = req.body[key];
            }
        }

        await bloodUnit.save();

        return res.status(200).json({
            message: "Whole blood unit updated successfully.",
            updatedUnit: bloodUnit,
        });
    } catch (error) {
        console.error("Error updating whole blood unit:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
