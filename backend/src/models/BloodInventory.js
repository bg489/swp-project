import mongoose from "mongoose";

const bloodInventorySchema = new mongoose.Schema({
    blood_type: {
        type: String,
        required: true,
        enum: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    },
    component: {
        type: String,
        enum: ["whole", "RBC", "plasma", "platelet"],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    expiring_quantity: {
        type: Number,
        default: 0,
    },
    last_updated: {
        type: Date,
        default: Date.now,
    },
    low_stock_alert: {
        type: Boolean,
        default: false,
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true, // Mỗi inventory bắt buộc thuộc về 1 bệnh viện
    },
}, {
    timestamps: true,
});

const BloodInventory = mongoose.model("BloodInventory", bloodInventorySchema);

export default BloodInventory;
