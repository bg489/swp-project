import mongoose from "mongoose";

const healthCheckSchema = new mongoose.Schema(
  {
    checkin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CheckIn",
      required: true,
    },
    weight: {
      type: Number,
      required: false,
    },
    blood_volume_allowed: {
      type: Number,
      required: false,
      description: "Calculated based on weight and gender rules",
    },
    can_donate_whole_blood: {
      type: Boolean,
      required: false,
    },
    can_donate_components: {
      type: Boolean,
      required: false,
    },
    has_chronic_disease: {
      type: Boolean,
      required: false,
    },
    is_pregnant: {
      type: Boolean,
      required: false,
    },
    has_history_of_transplant: {
      type: Boolean,
      required: false,
    },
    drug_use_violation: {
      type: Boolean,
      required: false,
    },
    disability_severity: {
      type: String,
      enum: ["none", "mild", "severe", "extreme"],
      default: "none",
    },
    infectious_disease: {
      type: Boolean,
      required: false,
    },
    sexually_transmitted_disease: {
      type: Boolean,
      required: false,
    },
    is_clinically_alert: {
      type: Boolean,
      required: false,
    },
    systolic_bp: {
      type: Number,
      required: false,
    },
    diastolic_bp: {
      type: Number,
      required: false,
    },
    heart_rate: {
      type: Number,
      required: false,
    },
    abnormal_symptoms: [
      {
        type: String,
        enum: [
          "rapid_weight_loss",
          "pale_skin",
          "dizziness",
          "sweating",
          "swollen_lymph_nodes",
          "fever",
          "edema",
          "cough",
          "dyspnea",
          "diarrhea",
          "bleeding",
          "skin_abnormalities",
        ],
      },
    ],
    overall_result: {
      type: String,
      enum: ["passed", "failed"],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const HealthCheck = mongoose.model("HealthCheck", healthCheckSchema);

export default HealthCheck;
