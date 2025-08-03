import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
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
    cooldown_until: {
      type: Date,
    },
    cccd: {
      type: String,
      required: false, // Hoặc true nếu bạn muốn bắt buộc nhập CCCD
      unique: true,     // Ngăn trùng lặp CCCD giữa các user
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
