import Donation from "../models/DonationRecord.js";
import WarehouseDonation from "../models/WarehouseDonation.js";
import User from "../models/User.js";
import BloodInventory from "../models/BloodInventory.js";

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

export async function createWarehouseDonation(req, res) {
  try {
    const {
      inventory_item,
      recipient_id,
      donation_date,
      volume,
      status,
      updated_by,
      notes,
      hospital,
    } = req.body;

    // Validate bắt buộc
    if (!inventory_item || !donation_date || !volume || !updated_by || !hospital) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra tồn tại inventory item
    const inventory = await BloodInventory.findById(inventory_item);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // Kiểm tra hospital hợp lệ
    if (!inventory.hospital.equals(hospital)) {
      return res.status(400).json({ message: "Inventory does not belong to this hospital" });
    }

    // Nếu có recipient, kiểm tra tồn tại
    if (recipient_id) {
      const recipient = await User.findById(recipient_id);
      if (!recipient) {
        return res.status(404).json({ message: "Recipient not found" });
      }
    }

    // Kiểm tra staff
    const staff = await User.findById(updated_by);
    if (!staff || staff.role !== "staff") {
      return res.status(404).json({ message: "Updated_by is not a valid staff" });
    }

    // Kiểm tra đủ số lượng máu trong kho
    if (inventory.quantity < volume) {
      return res.status(400).json({ message: "Not enough blood in inventory" });
    }

    // Tạo bản ghi rút máu từ kho
    const warehouseDonation = new WarehouseDonation({
      inventory_item,
      recipient_id,
      donation_date,
      volume,
      status: status || "in_progress",
      updated_by,
      notes,
      hospital,
    });

    await warehouseDonation.save();

    // Trừ máu trong inventory
    inventory.quantity -= volume;
    inventory.last_updated = new Date();
    if (inventory.quantity < 5) inventory.low_stock_alert = true;
    await inventory.save();

    return res.status(201).json({
      message: "Warehouse donation recorded successfully",
      donation: warehouseDonation,
    });
  } catch (error) {
    console.error("Error creating warehouse donation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function updateWarehouseDonationStatus(req, res) {
  try {
    const { donationId } = req.params;
    const { status, updated_by } = req.body;

    if (!donationId) {
      return res.status(400).json({ message: "Donation ID is required" });
    }

    if (!status || !["in_progress", "fulfilled", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid or missing status" });
    }

    if (updated_by) {
      const staff = await User.findById(updated_by);
      if (!staff || staff.role !== "staff") {
        return res.status(404).json({ message: "Updated_by is not a valid staff" });
      }
    }

    const warehouseDonation = await WarehouseDonation.findById(donationId);
    if (!warehouseDonation) {
      return res.status(404).json({ message: "Warehouse donation not found" });
    }

    const inventory = await BloodInventory.findById(warehouseDonation.inventory_item);
    if (!inventory) {
      return res.status(404).json({ message: "Related blood inventory not found" });
    }

    // Trường hợp HỦY -> KHÔI PHỤC (trừ lại máu)
    if (
      warehouseDonation.status === "cancelled" &&
      (status === "in_progress" || status === "fulfilled")
    ) {
      if (inventory.quantity < warehouseDonation.volume) {
        return res.status(400).json({ message: "Not enough blood in inventory to restore this donation" });
      }

      inventory.quantity -= warehouseDonation.volume;
      inventory.last_updated = new Date();
      if (inventory.quantity < 5) inventory.low_stock_alert = true;
      await inventory.save();
    }

    // Trường hợp KHÔNG HỦY -> HỦY (cộng lại máu)
    if (
      warehouseDonation.status !== "cancelled" &&
      status === "cancelled"
    ) {
      inventory.quantity += warehouseDonation.volume;
      inventory.last_updated = new Date();
      if (inventory.quantity >= 5) inventory.low_stock_alert = false;
      await inventory.save();
    }

    // Cập nhật trạng thái mới
    warehouseDonation.status = status;
    if (updated_by) warehouseDonation.updated_by = updated_by;
    await warehouseDonation.save();

    const updatedDonation = await WarehouseDonation.findById(donationId)
      .populate("inventory_item")
      .populate("recipient_id", "full_name email phone")
      .populate("updated_by", "full_name email")
      .populate("hospital", "name address");

    return res.status(200).json({
      message: "Warehouse donation status updated successfully",
      donation: updatedDonation,
    });
  } catch (error) {
    console.error("Error updating warehouse donation status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}




export async function getWarehouseDonationsByStaffId(req, res) {
  try {
    const { staffId } = req.params;

    if (!staffId) {
      return res.status(400).json({ message: "Staff ID is required" });
    }

    // Kiểm tra người dùng có tồn tại và là staff không
    const staff = await User.findById(staffId);
    if (!staff || staff.role !== "staff") {
      return res.status(404).json({ message: "Staff not found or invalid" });
    }

    // Tìm tất cả donation do staff này thực hiện
    const donations = await WarehouseDonation.find({ updated_by: staffId })
      .populate("inventory_item") // Thông tin máu rút ra
      .populate("recipient_id", "full_name email phone")
      .populate("updated_by", "full_name email")
      .populate("hospital", "name address");

    return res.status(200).json({
      message: "Warehouse donations fetched successfully",
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.error("Error fetching warehouse donations by staff ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function getDonationsByRecipientId(req, res) {
  try {
    const { recipientId } = req.params;

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    // Kiểm tra recipient tồn tại và đúng vai trò
    const recipient = await User.findById(recipientId);
    if (!recipient || recipient.role !== "recipient") {
      return res.status(404).json({ message: "Recipient not found or invalid" });
    }

    // Lấy danh sách các đợt hiến máu mà recipient là người nhận
    const donations = await Donation.find({ recipient_id: recipientId })
      .populate("donor_id", "full_name email phone")
      .populate("recipient_id", "full_name email phone")
      .populate("updated_by", "full_name email");

    return res.status(200).json({
      message: "Donations fetched successfully for recipient",
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.error("Error fetching donations by recipient ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getWarehouseDonationsByRecipientId(req, res) {
  try {
    const { recipientId } = req.params;

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    // Kiểm tra recipient tồn tại và đúng vai trò
    const recipient = await User.findById(recipientId);
    if (!recipient || recipient.role !== "recipient") {
      return res.status(404).json({ message: "Recipient not found or invalid" });
    }

    // Lấy danh sách các warehouse donation có recipient_id tương ứng
    const donations = await WarehouseDonation.find({ recipient_id: recipientId })
      .populate("inventory_item") // máu được rút ra từ kho
      .populate("recipient_id", "full_name email phone")
      .populate("updated_by", "full_name email")
      .populate("hospital", "name address");

    return res.status(200).json({
      message: "Warehouse donations fetched successfully for recipient",
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.error("Error fetching warehouse donations by recipient ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
