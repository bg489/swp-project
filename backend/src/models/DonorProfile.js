import mongoose from "mongoose";

const donorProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blood_type: {
      type: String,
      required: false,
    },
    availability_date: {
      type: Date,
    },
    health_cert_url: {
      type: String,
    },
    cooldown_until: {
      type: Date,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: false,
    },
    is_in_the_role: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const DonorProfile = mongoose.model("DonorProfile", donorProfileSchema);

export default DonorProfile;
