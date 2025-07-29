import mongoose from "mongoose";

const donorRequestSchema = new mongoose.Schema(
  {
    donor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blood_type_offered: {
      type: String,
      required: true,
    },
    components_offered: {
      type: [String],
      enum: ["whole", "RBC", "plasma", "platelet"],
      required: true,
    },
    amount_offered: {
      type: Number,
      required: true,
    },
    available_date: {
      type: Date,
      required: true, // Ngày sẵn sàng hiến máu
    },
    available_time_range: {
      from: {
        type: String, // định dạng HH:mm, ví dụ "08:00"
        required: true,
      },
      to: {
        type: String, // định dạng HH:mm, ví dụ "10:30"
        required: true,
      },
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    comment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const DonorRequest = mongoose.model("DonorRequest", donorRequestSchema);

export default DonorRequest;
