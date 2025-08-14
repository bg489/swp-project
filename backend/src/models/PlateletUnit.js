import mongoose from "mongoose";

const plateletUnitSchema = new mongoose.Schema({
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
    bloodGroupABO: {
        type: String,
        enum: ["A", "B", "AB", "O"],
    },
    bloodGroupRh: {
        type: String,
        enum: ["+", "-"],
    },
    collectionDate: {
        type: Date,
    },
    expiryDate: {
        type: Date,
    },
    volumeOrWeight: {
        type: Number,
    },
    storageTemperature: {
        type: String,
        default: "20-24°C", // Nhiệt độ bảo quản tiểu cầu
    },
    agitationRequired: {
        type: Boolean,
        default: true, // Tiểu cầu cần lắc đều khi bảo quản
    },
    irradiated: {
        type: Boolean,
    },
    notes: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["pending", "donated", "expired", "not_eligible", "transfused"],
        default: "pending",
    },
}, {
    timestamps: true,
});

export default mongoose.model("PlateletUnit", plateletUnitSchema);
