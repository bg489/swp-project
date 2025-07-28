import { type NextRequest, NextResponse } from "next/server"
import { login } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email và mật khẩu là bắt buộc" }, { status: 400 })
    }

    // Attempt login
    const user = await login(email, password)

    if (user) {
      return NextResponse.json({
        success: true,
        message: "Đăng nhập thành công",
        user,
      })
    } else {
      return NextResponse.json({ success: false, message: "Email hoặc mật khẩu không đúng" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ success: false, message: "Đã xảy ra lỗi server" }, { status: 500 })
  }
}
