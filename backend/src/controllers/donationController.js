import Donation from "../models/DonationRecord.js";
import User from "../models/User.js";

export async function createDonation(req, res) {
  try {
    const {
      donor_id,
      recipient_id,
      donation_date,
      donation_type,
      volume,
      status,
      updated_by,
      notes,
    } = req.body;

    // Validate bắt buộc
    if (!donor_id || !donation_date || !donation_type || !volume) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra donor tồn tại
    const donor = await User.findById(donor_id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    // Nếu có recipient, kiểm tra recipient tồn tại
    if (recipient_id) {
      const recipient = await User.findById(recipient_id);
      if (!recipient) {
        return res.status(404).json({ message: "Recipient not found" });
      }
    }

    // Nếu có updated_by, kiểm tra staff tồn tại
    if (updated_by) {
      const staff = await User.findById(updated_by);
      if (!staff || staff.role !== "staff") {
        return res.status(404).json({ message: "Updated_by is not a valid staff" });
      }
    }

    // Tạo donation mới
    const newDonation = new Donation({
      donor_id,
      recipient_id,
      donation_date,
      donation_type,
      volume,
      status: status || "scheduled",
      updated_by,
      notes,
    });

    const savedDonation = await newDonation.save();

    return res.status(201).json({
      message: "Donation created successfully",
      donation: savedDonation,
    });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getScheduledDonations(req, res) {
  try {
    const donations = await Donation.find({ status: "scheduled" })
      .populate("donor_id", "full_name email phone")
      .populate("recipient_id", "full_name email phone")
      .populate("updated_by", "full_name email");

    return res.status(200).json({
      message: "Scheduled donations fetched successfully",
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.error("Error fetching scheduled donations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getDonationsByStaffId(req, res) {
  try {
    const { staffId } = req.params;

    if (!staffId) {
      return res.status(400).json({ message: "Staff ID is required" });
    }

    // Kiểm tra staff tồn tại và có vai trò staff
    const staff = await User.findById(staffId);
    if (!staff || staff.role !== "staff") {
      return res.status(404).json({ message: "Staff not found or invalid" });
    }

    const donations = await Donation.find({ updated_by: staffId })
      .populate("donor_id", "full_name email phone")
      .populate("recipient_id", "full_name email phone")
      .populate("updated_by", "full_name email");

    return res.status(200).json({
      message: "Donations updated by staff fetched successfully",
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.error("Error fetching donations by staff ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function updateDonationStatus(req, res) {
  try {
    const { donationId } = req.params;
    const { status, updated_by } = req.body;

    if (!donationId) {
      return res.status(400).json({ message: "Donation ID is required" });
    }

    if (!status || !["scheduled", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid or missing status" });
    }

    // Nếu có updated_by, kiểm tra staff tồn tại và đúng role
    if (updated_by) {
      const staff = await User.findById(updated_by);
      if (!staff || staff.role !== "staff") {
        return res.status(404).json({ message: "Updated_by is not a valid staff" });
      }
    }

    const updatedDonation = await Donation.findByIdAndUpdate(
      donationId,
      { status, updated_by },
      { new: true }
    )
      .populate("donor_id", "full_name email phone")
      .populate("recipient_id", "full_name email phone")
      .populate("updated_by", "full_name email");

    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    return res.status(200).json({
      message: "Donation status updated successfully",
      donation: updatedDonation,
    });
  } catch (error) {
    console.error("Error updating donation status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getDonationById(req, res) {
  try {
    const { donationId } = req.params;

    if (!donationId) {
      return res.status(400).json({ message: "Donation ID is required" });
    }

    const donation = await Donation.findById(donationId)
      .populate("donor_id", "full_name email phone")
      .populate("recipient_id", "full_name email phone")
      .populate("updated_by", "full_name email");

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    return res.status(200).json({
      message: "Donation fetched successfully",
      donation,
    });
  } catch (error) {
    console.error("Error fetching donation by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getDonationsByDonorId(req, res) {
  try {
    const { donorId } = req.params;

    if (!donorId) {
      return res.status(400).json({ message: "Donor ID is required" });
    }

    // Kiểm tra donor tồn tại
    const donor = await User.findById(donorId);
    if (!donor || donor.role !== "donor") {
      return res.status(404).json({ message: "Donor not found or invalid" });
    }

    const donations = await Donation.find({ donor_id: donorId })
      .populate("donor_id", "full_name email phone")
      .populate("recipient_id", "full_name email phone")
      .populate("updated_by", "full_name email");

    return res.status(200).json({
      message: "Donations fetched successfully for donor",
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.error("Error fetching donations by donor ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
