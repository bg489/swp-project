import mongoose from "mongoose";

const bloodRequestRecordSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true, // Mỗi yêu cầu máu có ID duy nhất
      trim: true,
    },
    hospital_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    bloodType: {
      type: String,
      required: true,
      trim: true,
    },
    component: {
      type: String,
      enum: ["whole_blood", "red_cells", "platelets", "plasma"],
      required: true,
    },
    unitsNeeded: {
      type: Number,
      required: true,
      min: 1,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
      required: true,
    },
    requestDate: {
      type: Date,
      required: true,
    },
    requiredDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "in_progress", "fulfilled", "cancelled"],
      default: "pending",
      required: true,
    },
    hospital: {
      type: String,
      required: true,
      trim: true,
    },
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    selectedBags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BloodBag", // Giả sử bạn có model túi máu
      },
    ],
  },
  {
    timestamps: true, // Tự động tạo createdAt & updatedAt
  }
);

const BloodRequestRecord = mongoose.model("BloodRequestRecord", bloodRequestRecordSchema);

export default BloodRequestRecord;
