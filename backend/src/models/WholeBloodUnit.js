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
    abnormalAntibodyDetected: {
        type: Boolean,
        default: false,
    },
    hivPositive: {
        type: Boolean,
        default: false,
    },
    hbvPositive: {
        type: Boolean,
        default: false,
    },
    hcvPositive: {
        type: Boolean,
        default: false,
    },
    syphilisPositive: {
        type: Boolean,
        default: false,
    },
    malariaPositive: {
        type: Boolean,
        default: false,
    },
    cmvPositive: {
        type: Boolean,
        default: false,
    },

    status: {
        type: String,
        enum: ["pending", "donated", "expired", "not_eligible", "transfused"],
        default: "pending",
    },
}, {
    timestamps: true,
});

export default mongoose.model("WholeBloodUnit", wholeBloodUnitSchema);
