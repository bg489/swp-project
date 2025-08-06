import mongoose from "mongoose";

const redBloodCellUnitSchema = new mongoose.Schema({
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
        default: "2-6°C", // Nhiệt độ bảo quản tiêu chuẩn của hồng cầu
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

export default mongoose.model("RedBloodCellUnit", redBloodCellUnitSchema);
