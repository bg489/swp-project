import BloodRequest from "../models/BloodRequest.js";
import User from "../models/User.js";

export async function createBloodRequest(req, res) {
  try {
    const {
      recipient_id,
      blood_type_needed,
      components_needed,
      amount_needed,
      hospital_location,
      is_emergency,
      comment,
    } = req.body;

    // Validate required fields
    if (
      !recipient_id ||
      !blood_type_needed ||
      !components_needed ||
      !amount_needed ||
      !hospital_location
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate recipient exists and has correct role
    const user = await User.findById(recipient_id);
    if (!user || user.role !== "recipient") {
      return res.status(404).json({ message: "User is not a valid recipient" });
    }

    // Create the blood request
    const newRequest = new BloodRequest({
      recipient_id,
      blood_type_needed,
      components_needed,
      amount_needed,
      hospital_location,
      is_emergency: is_emergency || false, // default to false if not provided
      status: "pending", // default status
      comment: comment || "",
    });

    const savedRequest = await newRequest.save();

    return res.status(201).json({
      message: "Blood request created successfully",
      request: savedRequest,
    });
  } catch (error) {
    console.error("Error creating blood request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getBloodRequestsByRecipientId(req, res) {
  try {
    const { recipientId } = req.params;

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    const requests = await BloodRequest.find({ recipient_id: recipientId })
      .populate("recipient_id", "fullName email phone")
      .sort({ createdAt: -1 });

    if (!requests.length) {
      return res.status(404).json({ message: "No blood requests found for this recipient" });
    }

    return res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching blood requests by recipient ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
