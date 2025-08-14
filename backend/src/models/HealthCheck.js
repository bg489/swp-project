import mongoose from "mongoose";

const healthCheckSchema = new mongoose.Schema(
  {
    checkin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CheckIn",
      required: true,
    },
    hospital_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
    weight: Number,
    blood_volume_allowed: Number,
    can_donate_whole_blood: Boolean,
    has_collected_blood: {
      type: Boolean,
      default: false,
    },
    can_donate_components: Boolean,
    has_chronic_disease: Boolean,
    is_pregnant: Boolean,
    has_history_of_transplant: Boolean,
    drug_use_violation: Boolean,
    disability_severity: {
      type: String,
      enum: ["none", "mild", "severe", "extreme"],
      default: "none",
    },
    infectious_disease: Boolean,
    sexually_transmitted_disease: Boolean,
    is_clinically_alert: Boolean,
    systolic_bp: Number,
    diastolic_bp: Number,
    heart_rate: Number,
    abnormal_symptoms: [
      {
        type: String,
        enum: [
            "none",
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
    },

    // New fields from donor's questionnaire
    donor_feeling_healthy: Boolean,
    risky_occupation: Boolean,
    blood_donation_count: Number,
    last_donation_date: Boolean,

    // Disease history
    has_cardiovascular_disease: Boolean,
    has_liver_disease: Boolean,
    has_kidney_disease: Boolean,
    has_endocrine_disorder: Boolean,
    has_tuberculosis_or_respiratory_disease: Boolean,
    has_blood_disease: Boolean,
    has_mental_or_neurological_disorder: Boolean,
    has_malaria: Boolean,
    has_syphilis: Boolean,
    has_hiv_or_aids: Boolean,
    has_other_transmissible_diseases: Boolean,

    // Medical/surgical history
    has_surgical_or_medical_history: Boolean,
    exposure_to_blood_or_body_fluids: Boolean,
    received_vaccine_or_biologics: Boolean,
    tattoo_or_organ_transplant: Boolean,

    // Abnormal symptoms
    has_unexplained_weight_loss: Boolean,
    has_night_sweats: Boolean,
    has_skin_or_mucosal_tumors: Boolean,
    has_enlarged_lymph_nodes: Boolean,
    has_digestive_disorder: Boolean,
    has_fever_over_37_5_long: Boolean,

    // Risk behaviors
    uses_illegal_drugs: Boolean,
    has_sexual_contact_with_risk_person: Boolean,

    // Postpartum
    has_infant_under_12_months: Boolean,

    // Medication history
    has_taken_medicine_last_week: Boolean,

    // Declaration
    declaration_understood_questions: Boolean,
    declaration_feels_healthy: Boolean,
    declaration_voluntary: Boolean,
    declaration_will_report_if_risk_found: Boolean,
  },
  {
    timestamps: true,
  }
);

const HealthCheck = mongoose.model("HealthCheck", healthCheckSchema);

export default HealthCheck;