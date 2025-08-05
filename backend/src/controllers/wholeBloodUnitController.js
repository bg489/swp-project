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

export async function markWholeBloodUnitAsExpired(req, res) {
    try {
        const { id } = req.params;

        const bloodUnit = await WholeBloodUnit.findById(id);
        if (!bloodUnit) {
            return res.status(404).json({ message: "Whole blood unit not found." });
        }

        // Nếu đã là expired thì không cần cập nhật nữa
        if (bloodUnit.status === "expired") {
            return res.status(200).json({ message: "Whole blood unit is already marked as expired." });
        }

        bloodUnit.status = "expired";
        await bloodUnit.save();

        return res.status(200).json({
            message: "Whole blood unit status updated to expired successfully.",
            updatedUnit: bloodUnit,
        });
    } catch (error) {
        console.error("Error updating whole blood unit status:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}


export async function markWholeBloodUnitAsDonated(req, res) {
    try {
        const { id } = req.params;

        const bloodUnit = await WholeBloodUnit.findById(id);
        if (!bloodUnit) {
            return res.status(404).json({ message: "Whole blood unit not found." });
        }

        // Nếu đã được đánh dấu là donated thì không cần cập nhật nữa
        if (bloodUnit.status === "donated") {
            return res.status(200).json({ message: "Whole blood unit is already marked as donated." });
        }

        // Không cho phép chuyển trạng thái nếu đơn vị máu đã hết hạn
        if (bloodUnit.status === "expired") {
            return res.status(400).json({ message: "Cannot mark expired blood unit as donated." });
        }

        bloodUnit.status = "donated";
        await bloodUnit.save();

        return res.status(200).json({
            message: "Whole blood unit status updated to donated successfully.",
            updatedUnit: bloodUnit,
        });
    } catch (error) {
        console.error("Error updating whole blood unit status:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function getWholeBloodUnitsByHospitalId(req, res) {
    try {
        const { hospital_id } = req.params;

        // Kiểm tra hospital có tồn tại không
        const hospital = await Hospital.findById(hospital_id);
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found." });
        }

        // Tìm tất cả đơn vị máu thuộc hospital đó
        const units = await WholeBloodUnit.find({ hospital_id })
            .populate("user_id", "full_name email phone gender date_of_birth")
            .populate("user_profile_id", "blood_type cccd cooldown_until");

        return res.status(200).json({
            message: "Whole blood units retrieved successfully.",
            hospital: {
                _id: hospital._id,
                name: hospital.name,
                address: hospital.address,
            },
            units,
        });
    } catch (error) {
        console.error("Error fetching whole blood units by hospital:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function getWholeBloodUnitById(req, res) {
    try {
        const { id } = req.params;

        const unit = await WholeBloodUnit.findById(id)
            .populate("user_id", "full_name email phone gender date_of_birth")
            .populate("user_profile_id", "blood_type cccd cooldown_until")
            .populate("hospital_id", "name address phone");

        if (!unit) {
            return res.status(404).json({ message: "Whole blood unit not found." });
        }

        return res.status(200).json({
            message: "Whole blood unit retrieved successfully.",
            unit,
        });
    } catch (error) {
        console.error("Error fetching whole blood unit by ID:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

