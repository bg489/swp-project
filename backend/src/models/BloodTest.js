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
