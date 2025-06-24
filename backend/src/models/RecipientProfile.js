import mongoose from "mongoose";

const recipientProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    medical_doc_url: {
      type: String,
      required: false,
    },
    hospital_name: {
      type: String,
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

const RecipientProfile = mongoose.model("RecipientProfile", recipientProfileSchema);

export default RecipientProfile;
