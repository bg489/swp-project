import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const inventory = await db.getBloodInventory()
    return NextResponse.json({
      success: true,
      data: inventory,
    })
  } catch (error) {
    console.error("Blood inventory API error:", error)
    return NextResponse.json({ success: false, message: "Đã xảy ra lỗi server" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { bloodType, units } = await request.json()

    if (!bloodType || units === undefined) {
      return NextResponse.json({ success: false, message: "Thiếu thông tin cần thiết" }, { status: 400 })
    }

    const updatedInventory = await db.updateBloodInventory(bloodType, units)

    if (updatedInventory) {
      return NextResponse.json({
        success: true,
        message: "Cập nhật kho máu thành công",
        data: updatedInventory,
      })
    } else {
      return NextResponse.json({ success: false, message: "Không tìm thấy nhóm máu" }, { status: 404 })
    }
  } catch (error) {
    console.error("Update blood inventory API error:", error)
    return NextResponse.json({ success: false, message: "Đã xảy ra lỗi server" }, { status: 500 })
  }
}
