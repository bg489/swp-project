import mongoose from "mongoose";

const hospitalBloodTypeSchema = new mongoose.Schema({
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
        unique: true, // Mỗi bệnh viện chỉ có 1 bản ghi
    },
    inventories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BloodInventory", // liên kết đến từng loại máu
            required: true,
        },
    ],
}, {
    timestamps: true,
});

const HospitalBloodType = mongoose.model("HospitalBloodType", hospitalBloodTypeSchema);

export default HospitalBloodType;
