import mongoose from "mongoose";

const donorDonationRequestSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    donation_date: {
      type: Date,
      required: true,
    },
    donation_time_range: {
      from: {
        type: String, // Format: "HH:mm"
        required: true,
      },
      to: {
        type: String, // Format: "HH:mm"
        required: true,
      },
    },
    donation_type: {
      type: String,
      enum: ["whole", "separated"], // "whole" = whole blood, "separated" = apheresis
      required: true,
    },
    separated_component: [{
      type: String,
      enum: ["RBC", "plasma", "platelet"], // In English
      required: function () {
        return this.donation_type === "separated";
      },
    }],
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
  enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const DonorDonationRequest = mongoose.model(
  "DonorDonationRequest",
  donorDonationRequestSchema
);

export default DonorDonationRequest;
