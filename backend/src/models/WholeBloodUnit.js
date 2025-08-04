import mongoose from "mongoose";

const wholeBloodUnitSchema = new mongoose.Schema({
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
    anticoagulantSolution: {
        type: String,
    },
    expiryDate: {
        type: Date,
    },
    volumeOrWeight: {
        type: Number,
    },
    storageTemperature: {
        type: String,
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
        enum: ["pending", "donated", "expired"],
        default: "pending", // mặc định là chưa hiến
    },
}, {
    timestamps: true,
});

export default mongoose.model("WholeBloodUnit", wholeBloodUnitSchema);
