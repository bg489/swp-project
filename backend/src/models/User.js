import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["donor", "recipient", "staff", "admin", "user"],
      required: true,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    date_of_birth: {
      type: Date,
    },
    address: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    reset_token: { type: String },
    reset_token_expires: { type: Date },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
