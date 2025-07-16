import mongoose from "mongoose";

const warehouseDonationSchema = new mongoose.Schema(
    {
        inventory_item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BloodInventory",
            required: true, // Tham chiếu tới bản ghi inventory được rút
        },
        recipient_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // Có thể không có nếu rút dự phòng
        },
        donation_date: {
            type: Date,
            required: true,
        },
        volume: {
            type: Number,
            required: true, // Số lượng đơn vị lấy ra
        },
        status: {
            type: String,
            enum: ["in_progress", "fulfilled", "cancelled"],
            default: "in_progress",
            required: true,
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // Staff xác nhận rút máu
        },
        notes: {
            type: String,
            default: "",
        },
        hospital: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            required: true, // Kho máu thuộc bệnh viện nào
        },
    },
    {
        timestamps: true, // Tự động tạo createdAt, updatedAt
    }
);

const WarehouseDonation = mongoose.model("WarehouseDonation", warehouseDonationSchema);

export default WarehouseDonation;
