import { type NextRequest, NextResponse } from "next/server"
import { register } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    const requiredFields = ["name", "email", "password", "phone", "address", "bloodType"]
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json({ success: false, message: `${field} là bắt buộc` }, { status: 400 })
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json({ success: false, message: "Email không hợp lệ" }, { status: 400 })
    }

    // Validate password length
    if (userData.password.length < 6) {
      return NextResponse.json({ success: false, message: "Mật khẩu phải có ít nhất 6 ký tự" }, { status: 400 })
    }

    // Validate blood type
    const validBloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
    if (!validBloodTypes.includes(userData.bloodType)) {
      return NextResponse.json({ success: false, message: "Nhóm máu không hợp lệ" }, { status: 400 })
    }

    // Attempt registration
    const result = await register(userData)

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
          user: result.user,
        },
        { status: 201 },
      )
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }
  } catch (error) {
    console.error("Registration API error:", error)
    return NextResponse.json({ success: false, message: "Đã xảy ra lỗi server" }, { status: 500 })
  }
}
