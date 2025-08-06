import BloodTest from "../models/BloodTest.js";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import Hospital from "../models/Hospital.js";
import HealthCheck from "../models/HealthCheck.js";

export async function createBloodTest(req, res) {
    try {
        const { user_id, user_profile_id, hospital_id, healthcheck_id, HBsAg, hemoglobin } = req.body;

        if (
            !user_id ||
            !user_profile_id ||
            !hospital_id ||
            !healthcheck_id ||
            typeof HBsAg !== "boolean" ||
            typeof hemoglobin !== "number"
        ) {
            return res.status(400).json({ message: "Missing or invalid required fields." });
        }

        // Kiểm tra liên kết tồn tại
        const [user, userProfile, hospital, healthCheck] = await Promise.all([
            User.findById(user_id),
            UserProfile.findById(user_profile_id),
            Hospital.findById(hospital_id),
            HealthCheck.findById(healthcheck_id),
        ]);

        if (!user) return res.status(404).json({ message: "User not found." });
        if (!userProfile) return res.status(404).json({ message: "User profile not found." });
        if (!hospital) return res.status(404).json({ message: "Hospital not found." });
        if (!healthCheck) return res.status(404).json({ message: "Health Check not found." });

        // Xác định status dựa trên HBsAg và hemoglobin
        let status = "pending";

        // Tạo bản ghi
        const newBloodTest = await BloodTest.create({
            user_id,
            user_profile_id,
            hospital_id,
            healthcheck_id,
            HBsAg,
            hemoglobin,
            total_protein: 0,
            platelet_count: "",
            status,
        });

        return res.status(201).json({
            message: "Blood test created successfully.",
            bloodTest: newBloodTest,
        });
    } catch (error) {
        console.error("Error creating blood test:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function updateBloodTest(req, res) {
    try {
        const { id } = req.params;
        const { HBsAg, hemoglobin } = req.body;

        // Kiểm tra đầu vào
        if (typeof HBsAg !== "boolean" || typeof hemoglobin !== "number") {
            return res.status(400).json({
                message: "HBsAg must be boolean and hemoglobin must be number.",
            });
        }

        // Tìm bản ghi theo ID
        const bloodTest = await BloodTest.findById(id);
        if (!bloodTest) {
            return res.status(404).json({ message: "Blood test not found." });
        }

        // Cập nhật HBsAg và hemoglobin, KHÔNG thay đổi status
        bloodTest.HBsAg = HBsAg;
        bloodTest.hemoglobin = hemoglobin;

        await bloodTest.save();

        return res.status(200).json({
            message: "Blood test updated successfully.",
            bloodTest,
        });
    } catch (error) {
        console.error("Error updating blood test:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function markBloodTestFailed(req, res) {
    try {
        const { id } = req.params;

        // Kiểm tra xem bản ghi có tồn tại không
        const bloodTest = await BloodTest.findById(id);
        if (!bloodTest) {
            return res.status(404).json({ message: "Blood test record not found." });
        }

        // Cập nhật status thành "failed"
        bloodTest.status = "failed";
        await bloodTest.save();

        return res.status(200).json({
            message: "Blood test status marked as failed.",
            bloodTest,
        });
    } catch (error) {
        console.error("Error marking blood test as failed:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function markBloodTestPassed(req, res) {
    try {
        const { id } = req.params;

        // Tìm bản ghi xét nghiệm máu
        const bloodTest = await BloodTest.findById(id);
        if (!bloodTest) {
            return res.status(404).json({ message: "Blood test record not found." });
        }

        // Đánh dấu passed
        bloodTest.status = "passed";
        await bloodTest.save();

        // Lấy thông tin blood_volume_allowed từ healthcheck_id
        const healthCheck = await HealthCheck.findById(bloodTest.healthcheck_id);
        if (!healthCheck) {
            return res.status(404).json({ message: "Related health check not found." });
        }

        return res.status(200).json({
            message: "Blood test status marked as passed.",
            bloodTest,
            blood_volume_allowed: healthCheck.blood_volume_allowed,
        });
    } catch (error) {
        console.error("Error marking blood test as passed:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function getBloodTestById(req, res) {
    try {
        const { id } = req.params;

        const bloodTest = await BloodTest.findById(id)
            .populate("user_id", "full_name email")
            .populate("user_profile_id", "blood_type cccd")
            .populate("hospital_id", "name address");

        if (!bloodTest) {
            return res.status(404).json({ message: "Blood test not found." });
        }

        return res.status(200).json(bloodTest);
    } catch (error) {
        console.error("Error retrieving blood test:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}



export async function getBloodTestsByHospital(req, res) {
    try {
        const { hospitalId } = req.params;

        const bloodTests = await BloodTest.find({ hospital_id: hospitalId })
            .populate("user_id", "full_name email phone gender date_of_birth")
            .populate("user_profile_id", "blood_type cccd cooldown_until")
            .populate("hospital_id", "name address phone");

        return res.status(200).json(bloodTests);
    } catch (error) {
        console.error("Error retrieving blood tests by hospital:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function updateSeparationInfo(req, res) {
    try {
        const { id } = req.params;
        const { is_seperated, separated_component } = req.body;

        // Kiểm tra đầu vào
        if (typeof is_seperated !== "boolean") {
            return res.status(400).json({
                message: "`is_seperated` must be a boolean.",
            });
        }

        if (is_seperated) {
            if (!Array.isArray(separated_component) || separated_component.length === 0) {
                return res.status(400).json({
                    message: "`separated_component` must be a non-empty array if `is_seperated` is true.",
                });
            }

            const allowedComponents = ["RBC", "plasma", "platelet"];
            const invalid = separated_component.filter((c) => !allowedComponents.includes(c));
            if (invalid.length > 0) {
                return res.status(400).json({
                    message: `Invalid separated_component values: ${invalid.join(", ")}`,
                });
            }
        }

        // Tìm bản ghi
        const bloodTest = await BloodTest.findById(id);
        if (!bloodTest) {
            return res.status(404).json({ message: "Blood test not found." });
        }

        // Cập nhật giá trị
        bloodTest.is_seperated = is_seperated;
        bloodTest.separated_component = is_seperated ? separated_component : [];

        await bloodTest.save();

        return res.status(200).json({
            message: "Separation info updated successfully.",
            bloodTest,
        });
    } catch (error) {
        console.error("Error updating separation info:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function getSeparationInfoById(req, res) {
    try {
        const { id } = req.params;

        const bloodTest = await BloodTest.findById(id);
        if (!bloodTest) {
            return res.status(404).json({ message: "Blood test not found." });
        }

        return res.status(200).json({
            message: "Separation info retrieved successfully.",
            is_seperated: bloodTest.is_seperated,
            separated_component: bloodTest.separated_component,
        });
    } catch (error) {
        console.error("Error retrieving separation info:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function updateBloodTestValues(req, res) {
    try {
        const { id } = req.params;
        const { total_protein, platelet_count } = req.body;

        // Tìm bản ghi xét nghiệm máu
        const bloodTest = await BloodTest.findById(id);
        if (!bloodTest) {
            return res.status(404).json({ message: "Blood test not found." });
        }

        // Cập nhật giá trị nếu có
        if (typeof total_protein === "number") {
            bloodTest.total_protein = total_protein;
        }

        if (typeof platelet_count === "string") {
            bloodTest.platelet_count = platelet_count;
        }

        await bloodTest.save();

        return res.status(200).json({
            message: "Blood test values updated successfully.",
            bloodTest,
        });
    } catch (error) {
        console.error("Error updating blood test values:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
