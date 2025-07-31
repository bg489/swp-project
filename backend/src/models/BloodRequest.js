import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blood_type_needed: {
      type: String,
      required: true,
    },
    components_needed: {
      type: [String],
      enum: ["whole", "RBC", "plasma", "platelet"],
      required: true,
    },
    amount_needed: {
      type: Number,
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    distance: {
      type: Number,
      required: false,   // hoặc true nếu bắt buộc
      default: 10,       // mặc định 10km nếu không truyền lên
    },
    is_emergency: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: [
        "pending",    // vừa tạo
        "approved",   // đã được admin/phê duyệt
        "matched",    // đã ghép với người hiến phù hợp
        "in_progress",// đang xử lý (ví dụ: đang vận chuyển máu)
        "completed",  // đã hoàn tất (đã nhận máu)
        "cancelled",  // bị hủy bởi người nhận
        "rejected"    // bị từ chối bởi admin/hệ thống
      ],
      default: "pending",
    },

    comment: {
      type: String,
      default: "",
      // Column: comment | Type: VARCHAR
    },
  },
  {
    timestamps: true,
  }
);

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);

export default BloodRequest;
