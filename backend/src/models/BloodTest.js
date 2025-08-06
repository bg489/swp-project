import mongoose from "mongoose";

const bloodTestSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        user_profile_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserProfile",
            required: true,
        },
        hospital_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            required: true,
        },
        healthcheck_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HealthCheck",
            required: true,
        },
        HBsAg: {
            type: Boolean,
            required: true,
        },
        hemoglobin: {
            type: Number,
            required: true,
        },
        is_seperated: {
            type: Boolean,
            default: false,
        },
        separated_component: {
            type: [String],
            validate: {
                validator: function (value) {
                    // Nếu is_seperated là true thì phải có separated_component không rỗng
                    if (this.is_seperated) {
                        return Array.isArray(value) && value.length > 0;
                    }
                    return true; // Không cần nếu không gạn tách
                },
                message: 'separated_component is required when is_seperated is true.'
            }
        },
        total_protein: {
            type: Number, // g/L
        },
        platelet_count: {
            type: String, // x10⁹/L
        },
        status: {
            type: String,
            enum: ["pending", "passed", "failed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const BloodTest = mongoose.model("BloodTest", bloodTestSchema);

export default BloodTest;
