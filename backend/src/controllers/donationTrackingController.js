import DonationRecord from "../models/DonationRecord.js";

// Staff cập nhật trạng thái donation
export async function updateDonationStatus(req, res) {
    try {
        const { donationId } = req.params;
        const { status, updated_by, notes } = req.body;
        const updated = await DonationRecord.findByIdAndUpdate(
            donationId,
            { status, updated_by, $push: { logs: { status, updated_by, notes, time: new Date() } } },
            { new: true }
        );
        res.json({ success: true, updated });
    } catch (err) {
        res.status(500).json({ message: "Error updating donation status", error: err });
    }
}

// Lưu log quá trình donation
export async function logDonationProcess(req, res) {
    try {
        const { donationId } = req.params;
        const { status, updated_by, notes } = req.body;
        const updated = await DonationRecord.findByIdAndUpdate(
            donationId,
            { $push: { logs: { status, updated_by, notes, time: new Date() } } },
            { new: true }
        );
        res.json({ success: true, updated });
    } catch (err) {
        res.status(500).json({ message: "Error logging donation process", error: err });
    }
}