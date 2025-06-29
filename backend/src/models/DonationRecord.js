import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Người hiến bắt buộc
    },
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Có thể null nếu không gán người nhận cụ thể
    },
    donation_date: {
      type: Date,
      required: true, // Ngày hiến bắt buộc
    },
    donation_type: {
      type: [String],
      enum: ["whole", "RBC", "plasma", "platelet"],
      required: true, // Loại hiến bắt buộc
    },
    volume: {
      type: Number,
      required: true, // Đơn vị máu (ml hoặc số lượng túi)
    },
    status: {
      type: String,
      enum: [
        "scheduled", // Đã lên lịch
        "completed", // Đã hoàn tất
        "cancelled", // Bị hủy
      ],
      default: "scheduled",
      required: true,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Staff thực hiện cập nhật trạng thái
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // createdAt và updatedAt tự động
  }
);

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
