import DonorDonationRequest from "../models/DonorDonationRequest.js";
import Hospital from "../models/Hospital.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import { validateObjectId } from "../utils/validation.js";

export async function createDonorDonationRequest(req, res) {
  try {
    const {
      user_id,
      hospital,
      donation_date,
      donation_time_range,
      donation_type,
      separated_component,
      notes,
    } = req.body;

    // Validate bắt buộc
    if (
      !user_id ||
      !hospital ||
      !donation_date ||
      !donation_time_range?.from ||
      !donation_time_range?.to ||
      !donation_type
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra người dùng tồn tại và là donor
    const user = await User.findById(user_id);
    if (!user || user.role !== "user") {
      return res.status(404).json({ message: "User not found or not a donor" });
    }

    // Kiểm tra bệnh viện tồn tại
    const hospitalExists = await Hospital.findById(hospital);
    if (!hospitalExists) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Nếu là gạn tách thì phải có loại thành phần
    if (donation_type === "separated" && !separated_component) {
      return res.status(400).json({ message: "Separated component is required for apheresis donation" });
    }

    // Tạo yêu cầu hiến máu
    const newRequest = new DonorDonationRequest({
      user_id,
      hospital,
      donation_date,
      donation_time_range,
      donation_type,
      separated_component: donation_type === "separated" ? separated_component : undefined,
      notes: notes || "",
    });

    const savedRequest = await newRequest.save();

    return res.status(201).json({
      message: "Donor donation request created successfully",
      request: savedRequest,
    });
  } catch (error) {
    console.error("Error creating donor donation request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getDonorDonationRequestsByUserId(req, res) {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const requests = await DonorDonationRequest.find({ user_id })
      .populate("hospital", "name address")
      .sort({ createdAt: -1 });

    if (requests.length === 0) {
      return res.status(404).json({ message: "No donation requests found for this user" });
    }

    // Đếm số lượng theo status
    const statusCount = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    requests.forEach((req) => {
      const status = req.status;
      if (status === "pending") statusCount.pending += 1;
      else if (status === "approved") statusCount.approved += 1;
      else if (status === "rejected") statusCount.rejected += 1;
    });

    res.status(200).json({
      message: "Fetched donation requests for user successfully",
      total: requests.length,
      status_summary: statusCount,
      requests,
    });
  } catch (error) {
    console.error("Error fetching donation requests by user ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function rejectDonationRequestById(req, res) {
  try {
    const { request_id } = req.params;

    if (!request_id) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    const updatedRequest = await DonorDonationRequest.findByIdAndUpdate(
      request_id,
      { status: "rejected" },
      { new: true }
    ).populate("user_id", "full_name email").populate("hospital", "name address");

    if (!updatedRequest) {
      return res.status(404).json({ message: "Donation request not found" });
    }


    const user = updatedRequest.user_id;
    const email = user?.email;
    const donationDate = new Date(updatedRequest.donation_date).toLocaleDateString("vi-VN");
    const hospital = updatedRequest.hospital;

    if (email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: "Yêu cầu hiến máu bị từ chối",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: #fff1f2; border: 1px solid #fecaca;">
            <h2 style="color: #b91c1c; text-align: center;">Yêu cầu hiến máu của bạn bị từ chối</h2>
            <p style="font-size: 16px; color: #111827;">
              Xin chào <strong>${user.full_name}</strong>,<br><br>
              Rất tiếc, yêu cầu hiến máu vào ngày <strong>${donationDate}</strong> tại <strong>${hospital.name}</strong> - ${hospital.address} đã bị từ chối.
            </p>

            <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
              Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ, vui lòng phản hồi email này.
            </p>

            <p style="font-size: 14px; color: #9ca3af;">Trân trọng,<br>Đội ngũ ScarletBlood</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({
      message: "Donation request has been rejected and email sent",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error rejecting donation request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getDonorDonationRequestsByHospitalId(req, res) {
  try {
    const { hospital_id } = req.params;

    // Validate hospital_id using utility function
    const validationError = validateObjectId(hospital_id, 'Hospital ID');
    if (validationError) {
      return res.status(validationError.status).json({ message: validationError.message });
    }

    const hospital = await Hospital.findById(hospital_id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const requests = await DonorDonationRequest.find({ hospital: hospital_id })
      .populate("user_id", "name email") // Lấy tên, email người dùng
      .sort({ createdAt: -1 });

    if (requests.length === 0) {
      return res.status(404).json({ message: "No donation requests found for this hospital" });
    }

    // Thống kê trạng thái
    const statusCount = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    requests.forEach((req) => {
      if (req.status === "pending") statusCount.pending += 1;
      else if (req.status === "approved") statusCount.approved += 1;
      else if (req.status === "rejected") statusCount.rejected += 1;
    });

    res.status(200).json({
      message: "Fetched donation requests for hospital successfully",
      total: requests.length,
      status_summary: statusCount,
      requests,
    });
  } catch (error) {
    console.error("Error fetching donation requests by hospital ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



export async function approveDonationRequestById(req, res) {
  try {
    const { request_id } = req.params;

    if (!request_id) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    // Cập nhật trạng thái yêu cầu thành "approved"
    const updatedRequest = await DonorDonationRequest.findByIdAndUpdate(
      request_id,
      { status: "approved" },
      { new: true }
    ).populate("user_id", "full_name email").populate("hospital", "name address");

    if (!updatedRequest) {
      return res.status(404).json({ message: "Donation request not found" });
    }

    const user = updatedRequest.user_id;
    const email = user?.email;
    const hospital = updatedRequest.hospital;
    const donationDate = new Date(updatedRequest.donation_date).toLocaleDateString("vi-VN");

    if (!email) {
      return res.status(400).json({ message: "User email not found" });
    }

    // Tạo transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Thông báo xác nhận hiến máu từ ScarletBlood",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: #fefefe; border: 1px solid #e5e7eb;">
          <h2 style="color: #e11d48; text-align: center;">Yêu cầu hiến máu của bạn đã được chấp nhận</h2>
          <p style="font-size: 16px; color: #111827;">
            Xin chào <strong>${user.full_name}</strong>,<br><br>
            Cảm ơn bạn đã đăng ký hiến máu tại hệ thống <strong>ScarletBlood</strong>.<br>
            Yêu cầu hiến máu của bạn đã được <strong>chấp nhận</strong>.
          </p>

          <p style="font-size: 16px; color: #1f2937; margin-top: 12px;">
            ⏰ <strong>Ngày hiến máu:</strong> ${donationDate}<br>
            🏥 <strong>Địa điểm:</strong> ${hospital.name} - ${hospital.address}
          </p>

          <h3 style="color: #e11d48; margin-top: 24px;">Điều cần lưu ý trước khi đi hiến máu:</h3>
          <ul style="font-size: 15px; color: #374151; line-height: 1.6;">
            <li>Làm theo quy định</li>
            <li>Chú ý đến sức khỏe: đêm trước chúng ta ngủ đầy đủ và uống nước đủ</li>
            <li>Ngủ tốt, ngủ đủ</li>
            <li>Không uống rượu, bia, nên ăn nhẹ trước khi hiến máu, tránh ăn chất nhiều đường, mỡ</li>
            <li>Mang CCCD hoặc giấy tờ tùy thân khi đến điểm hiến máu</li>
          </ul>

          <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
            Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email này.
          </p>

          <p style="font-size: 14px; color: #9ca3af;">Trân trọng,<br>Đội ngũ ScarletBlood</p>
        </div>
      `,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Donation request has been approved and email sent",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error approving donation request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
