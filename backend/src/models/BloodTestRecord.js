import mongoose from "mongoose";

const bloodTestRecordSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    testDate: {
      type: Date,
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
      trim: true,
    },
    hemoglobin: {
      type: Number,
      required: true,
    },
    hiv: {
      type: Boolean,
      required: true,
    },
    hepatitisB: {
      type: Boolean,
      required: true,
    },
    hepatitisC: {
      type: Boolean,
      required: true,
    },
    syphilis: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "passed", "failed"],
      default: "pending",
      required: true,
    },
    technician: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const BloodTestRecord = mongoose.model("BloodTestRecord", bloodTestRecordSchema);

export default BloodTestRecord;