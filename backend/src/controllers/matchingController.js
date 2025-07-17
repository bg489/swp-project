import DonorProfile from "../models/DonorProfile.js";
import RecipientProfile from "../models/RecipientProfile.js";
import Hospital from "../models/Hospital.js";
// import notification util nếu có

// Tìm donor phù hợp cho recipient
export async function matchRecipientWithDonor(req, res) {
    try {
        const { recipient_id } = req.body;
        const recipient = await RecipientProfile.findById(recipient_id).populate("hospital");
        if (!recipient) return res.status(404).json({ message: "Recipient not found" });

        // Lấy danh sách donor cùng nhóm máu, cùng bệnh viện, còn active
        const donors = await DonorProfile.find({
            blood_type: req.body.blood_type,
            hospital: recipient.hospital._id,
            is_in_the_role: true,
            cooldown_until: { $lte: new Date() }
        });

        res.json({ matched_donors: donors });
    } catch (err) {
        res.status(500).json({ message: "Error matching donor", error: err });
    }
}

// Lưu thông tin match vào DB (ví dụ: tạo một DonationRecord)
export async function saveRecipientDonorMatch(req, res) {
    try {
        // Tạo record mới cho match
        // Tùy vào model của bạn, ví dụ:
        // const record = await DonationRecord.create({...});
        res.json({ success: true, message: "Match saved" });
    } catch (err) {
        res.status(500).json({ message: "Error saving match", error: err });
    }
}

// Gửi notification (giả lập)
export async function notifyMatch(req, res) {
    try {
        // Gửi thông báo cho donor/recipient
        res.json({ success: true, message: "Notification sent" });
    } catch (err) {
        res.status(500).json({ message: "Error sending notification", error: err });
    }
}