import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
    age: {
      type: Number,
      required: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
    },
    blood_type: {
      type: String,
      required: false,
    },
    component_needed: {
      type: String,
      required: false,
    },
    urgency: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      required: false,
    },
    contact: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    cccd: {
      type: String,
      required: false,
    },
    emergency_contact: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    medical_history: {
        type: [String], // <-- sửa thành mảng chuỗi
        required: false,
    },
    registration_date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["waiting", "processing", "done", "cancelled"],
      default: "waiting",
    },
    isUnknown: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;