"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DonatePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodType: "",
    dateOfBirth: "",
    address: "",
    donationDate: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success
      setSuccess("Đăng ký hiến máu thành công!")
      setFormData({
        name: "",
        email: "",
        phone: "",
        bloodType: "",
        dateOfBirth: "",
        address: "",
        donationDate: "",
        notes: "",
      })
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Đăng ký hiến máu</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Số điện thoại</label>
            <input
              type="tel"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="form-label">Nhóm máu</label>
            <select
              value={formData.bloodType}
              onChange={(e) => setFormData((prev) => ({ ...prev, bloodType: e.target.value }))}
              className="form-select"
              disabled={isLoading}
              required
            >
              <option value="">Chọn nhóm máu</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Ngày sinh</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
            className="form-input"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label className="form-label">Địa chỉ</label>
          <textarea
            placeholder="Nhập địa chỉ của bạn"
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            className="form-textarea"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label className="form-label">Ngày muốn hiến máu</label>
          <input
            type="date"
            value={formData.donationDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, donationDate: e.target.value }))}
            className="form-input"
            disabled={isLoading}
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div>
          <label className="form-label">Ghi chú (tùy chọn)</label>
          <textarea
            placeholder="Thêm ghi chú nếu có..."
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            className="form-textarea"
            disabled={isLoading}
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        {success && <div className="form-success">{success}</div>}

        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang đăng ký...
            </div>
          ) : (
            "Đăng ký hiến máu"
          )}
        </Button>
      </form>
    </div>
  )
}
