import UserOTPVerification from "../models/UserOTPVerification.js"
import nodemailer from "nodemailer"
import bcrypt from "bcrypt"

export async function sendOTPEmail(req, res) {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    // Generate 6-digit numeric OTP
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`

    // Hash the OTP before saving
    const salt = await bcrypt.genSalt(10)
    const hashedOTP = await bcrypt.hash(otp, salt)

    // Delete any existing OTPs for this email
    await UserOTPVerification.deleteMany({ email })

    // Save new OTP
    const newOTPVerification = await UserOTPVerification.create({
      email,
      otp: hashedOTP,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // expires in 10 minutes
    })

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Looking to send emails in production? Check out our Email API/SMTP product!

    // const transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: Number(process.env.EMAIL_PORT),
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASS,
    //     },
    //     logger: true,
    //     debug: true,
    // })


    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: `Mã otp của bạn là: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: url('https://ucarecdn.com/422ecb7e-b667-4ebd-ae6e-271fde785aa3/herobg.png') no-repeat center center; background-size: cover; border-radius: 10px; border: 1px solid #eee;">
        <div style="background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://ucarecdn.com/87a8995c-f8a9-419f-87c0-75138d5c9c13/logo.png" alt="ScαrletBlood Logo" style="height: 60px; border-radius: 50%;" />
            </div>
            <h2 style="color: #e11d48; text-align: center; margin-bottom: 10px;">ScαrletBlood - Xác minh OTP</h2>
            <p style="font-size: 16px; color: #333; text-align: center; margin: 0 0 10px 0;">
            Cảm ơn bạn đã sử dụng hệ thống hiến máu <strong>ScαrletBlood</strong>.
            </p>
            <p style="font-size: 16px; color: #333; text-align: center; margin: 0 0 20px 0;">
            Mã xác thực (OTP) của bạn là:
            </p>
            <div style="font-size: 32px; font-weight: bold; color: white; background-color: #e11d48; padding: 12px 0; text-align: center; border-radius: 8px; letter-spacing: 4px;">
            ${otp}
            </div>
            <p style="font-size: 14px; color: #555; text-align: center; margin-top: 20px;">
            Mã OTP sẽ hết hạn sau <strong>10 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.
            </p>
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
            Nếu bạn không yêu cầu mã này, hãy bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ.
            </p>
        </div>
        </div>
    `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    res.status(200).json({
      message: "OTP đã được gửi qua email",
      email,
      expiresAt: newOTPVerification.expiresAt,
    })

  } catch (error) {
    console.error("Error sending OTP email:", error)
    res.status(500).json({ message: "Không thể gửi OTP" })
  }
}


export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ message: "Email và mã OTP là bắt buộc" })
    }

    // Tìm OTP gần nhất theo email
    const userOTPRecord = await UserOTPVerification.findOne({ email })

    if (!userOTPRecord) {
      return res.status(404).json({ message: "Không tìm thấy mã OTP nào cho email này" })
    }

    // Kiểm tra thời hạn
    if (userOTPRecord.expiresAt < new Date()) {
      await UserOTPVerification.deleteMany({ email }) // dọn dẹp luôn
      return res.status(410).json({ message: "Mã OTP đã hết hạn, vui lòng yêu cầu mã mới" })
    }

    // So sánh OTP
    const isMatch = await bcrypt.compare(otp, userOTPRecord.otp)

    if (!isMatch) {
      return res.status(401).json({ message: "Mã OTP không đúng" })
    }

    // Thành công: có thể đánh dấu là xác thực hoặc tiếp tục các bước khác
    await UserOTPVerification.deleteMany({ email }) // Xoá sau khi dùng
    res.status(200).json({ message: "Xác minh OTP thành công" })

  } catch (error) {
    console.error("Lỗi khi xác minh OTP:", error)
    res.status(500).json({ message: "Lỗi máy chủ khi xác minh OTP" })
  }
}

export async function getOTPStatus(req, res) {
  try {
    const { email } = req.query;
    const record = await UserOTPVerification.findOne({ email });
    if (!record) return res.status(404).json({ message: "OTP not found" });

    res.json({
      createdAt: record.createdAt,
      expiresAt: record.expiresAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get OTP status" });
  }
}