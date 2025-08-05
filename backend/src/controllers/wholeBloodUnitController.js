import WholeBloodUnit from "../models/WholeBloodUnit.js"; // đường dẫn model có thể khác
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import Hospital from "../models/Hospital.js";
import nodemailer from "nodemailer"

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
            "abnormalAntibodyDetected",
            "hivPositive",
            "hbvPositive",
            "hcvPositive",
            "syphilisPositive",
            "malariaPositive",
            "cmvPositive"
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

export async function isBloodGroupComplete(req, res) {
    try {
        const { id } = req.params;

        const unit = await WholeBloodUnit.findById(id);
        if (!unit) {
            return res.status(404).json({ message: "Whole blood unit not found." });
        }

        const { bloodGroupABO, bloodGroupRh } = unit;

        const isComplete = !!bloodGroupABO && !!bloodGroupRh;

        return res.status(200).json({
            message: "Blood group completeness checked.",
            isComplete, // true hoặc false
        });
    } catch (error) {
        console.error("Error checking blood group completeness:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function getBloodTypeStringById(req, res) {
    try {
        const { id } = req.params;

        const unit = await WholeBloodUnit.findById(id)
            .populate("user_id", "full_name email phone gender date_of_birth address")
            .populate("user_profile_id", "blood_type cccd cooldown_until");

        if (!unit) {
            return res.status(404).json({ message: "Whole blood unit not found." });
        }

        const { bloodGroupABO, bloodGroupRh, user_id, user_profile_id } = unit;

        if (!bloodGroupABO || !bloodGroupRh) {
            return res.status(400).json({ message: "Blood group information is incomplete." });
        }

        const bloodTypeString = `${bloodGroupABO}${bloodGroupRh}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        })

        // Looking to send emails in production? Check out our Email API/SMTP product!

        // const transporter = nodemailer.createTransport({
        //     host: process.env.EMAIL_HOST,
        //     port: Number(process.env.EMAIL_PORT),
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS,
        //     },
        //     logger: true,
        //     debug: true,
        // })


        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: unit.user_id.email,
            subject: `Nhóm máu của bạn là: ${bloodTypeString}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: url('https://ucarecdn.com/422ecb7e-b667-4ebd-ae6e-271fde785aa3/herobg.png') no-repeat center center; background-size: cover; border-radius: 10px; border: 1px solid #eee;">
                <div style="background-color: rgba(255, 255, 255, 0.95); padding: 20px; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://ucarecdn.com/87a8995c-f8a9-419f-87c0-75138d5c9c13/logo.png" alt="ScαrletBlood Logo" style="height: 60px; border-radius: 50%;" />
                    </div>
                    <h2 style="color: #e11d48; text-align: center; margin-bottom: 10px;">ScαrletBlood - Thông báo nhóm máu</h2>
                    <p style="font-size: 16px; color: #333; text-align: center; margin-bottom: 16px;">
                    Xin chào <strong>${unit.user_id.full_name}</strong>,
                    </p>
                    <p style="font-size: 16px; color: #333; text-align: center; margin-bottom: 16px;">
                    Hệ thống hiến máu <strong>ScαrletBlood</strong> đã xác định nhóm máu của bạn như sau:
                    </p>
                    <div style="font-size: 32px; font-weight: bold; color: white; background-color: #e11d48; padding: 14px 0; text-align: center; border-radius: 8px; letter-spacing: 3px;">
                    ${bloodTypeString}
                    </div>
                    <p style="font-size: 14px; color: #555; text-align: center; margin-top: 24px;">
                    Bạn có thể sử dụng thông tin này khi tham gia hiến máu hoặc trong các tình huống khẩn cấp.
                    </p>
                    <p style="font-size: 13px; color: #999; text-align: center; margin-top: 30px;">
                    Nếu bạn không chắc chắn về thông tin này hoặc có bất kỳ thắc mắc nào, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.
                    </p>
                </div>
                </div>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions)

        return res.status(200).json({
            message: "Blood type string retrieved successfully.",
            isComplete: true,
            bloodType: bloodTypeString,
            user: user_id,
            userProfile: user_profile_id,
        });
    } catch (error) {
        console.error("Error retrieving blood type string:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}


export async function markWholeBloodUnitAsNotEligible(req, res) {
    try {
        const { id } = req.params;

        const bloodUnit = await WholeBloodUnit.findById(id);
        if (!bloodUnit) {
            return res.status(404).json({ message: "Whole blood unit not found." });
        }

        if (bloodUnit.status === "not_eligible") {
            return res.status(200).json({ message: "Whole blood unit is already marked as not eligible." });
        }

        bloodUnit.status = "not_eligible";
        await bloodUnit.save();

        return res.status(200).json({
            message: "Whole blood unit status updated to not eligible successfully.",
            updatedUnit: bloodUnit,
        });
    } catch (error) {
        console.error("Error updating whole blood unit status to not_eligible:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function markWholeBloodUnitAsTransfused(req, res) {
    try {
        const { id } = req.params;

        const bloodUnit = await WholeBloodUnit.findById(id);
        if (!bloodUnit) {
            return res.status(404).json({ message: "Whole blood unit not found." });
        }

        if (bloodUnit.status === "transfused") {
            return res.status(200).json({ message: "Whole blood unit is already marked as transfused." });
        }

        // Không cho phép truyền máu nếu đơn vị máu đã hết hạn hoặc không đủ điều kiện
        if (bloodUnit.status === "expired" || bloodUnit.status === "not_eligible") {
            return res.status(400).json({ message: `Cannot transfuse blood unit with status "${bloodUnit.status}".` });
        }

        bloodUnit.status = "transfused";
        await bloodUnit.save();

        return res.status(200).json({
            message: "Whole blood unit status updated to transfused successfully.",
            updatedUnit: bloodUnit,
        });
    } catch (error) {
        console.error("Error updating whole blood unit status to transfused:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
