import mongoose from "mongoose";

const staffProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    department: {
      type: String,
      required: false,
    },
    assigned_area: {
      type: String,
      required: false,
    },
    shift_time: {
      type: String,
      required: false,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const StaffProfile = mongoose.model("StaffProfile", staffProfileSchema);

export default StaffProfile;
