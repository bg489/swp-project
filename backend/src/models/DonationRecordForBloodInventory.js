import mongoose from "mongoose";

const donationRecordForBloodInventorySchema = new mongoose.Schema(
  {
    donor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Người hiến máu
    },
    blood_inventory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodInventory",
      required: true, // Gắn với kho máu cụ thể
    },
    donation_date: {
      type: Date,
      required: true, // Ngày hiến máu
    },
    donation_type: {
      type: [String],
      enum: ["whole", "RBC", "plasma", "platelet"],
      required: true, // Loại máu hiến
    },
    volume: {
      type: Number,
      required: true, // Số lượng máu (ml hoặc túi)
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
      required: true, // Trạng thái quy trình
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Nhân viên cập nhật
      required: false,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  }
);

const DonationRecordForBloodInventory = mongoose.model(
  "DonationRecordForBloodInventory",
  donationRecordForBloodInventorySchema
);

export default DonationRecordForBloodInventory;
