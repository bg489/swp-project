"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function EmergencyPage() {
  const [formData, setFormData] = useState({
    patientName: "",
    bloodType: "",
    unitsNeeded: "",
    hospital: "",
    hospitalAddress: "",
    contactName: "",
    contactPhone: "",
    emergencyDescription: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success
      setSuccess("Yêu cầu khẩn cấp đã được gửi thành công!")
      setFormData({
        patientName: "",
        bloodType: "",
        unitsNeeded: "",
        hospital: "",
        hospitalAddress: "",
        contactName: "",
        contactPhone: "",
        emergencyDescription: "",
      })
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Yêu cầu khẩn cấp</h1>
      <p className="mb-4">Vui lòng điền đầy đủ thông tin vào form bên dưới để yêu cầu hỗ trợ khẩn cấp.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Họ và tên bệnh nhân</label>
            <input
              type="text"
              placeholder="Nhập họ và tên bệnh nhân"
              value={formData.patientName}
              onChange={(e) => setFormData((prev) => ({ ...prev, patientName: e.target.value }))}
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="form-label">Nhóm máu cần</label>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Số lượng máu cần (đơn vị)</label>
            <input
              type="number"
              placeholder="Số đơn vị máu"
              value={formData.unitsNeeded}
              onChange={(e) => setFormData((prev) => ({ ...prev, unitsNeeded: e.target.value }))}
              className="form-input"
              disabled={isLoading}
              min="1"
              required
            />
          </div>

          <div>
            <label className="form-label">Bệnh viện</label>
            <input
              type="text"
              placeholder="Tên bệnh viện"
              value={formData.hospital}
              onChange={(e) => setFormData((prev) => ({ ...prev, hospital: e.target.value }))}
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label">Địa chỉ bệnh viện</label>
          <textarea
            placeholder="Địa chỉ chi tiết của bệnh viện"
            rows={2}
            value={formData.hospitalAddress}
            onChange={(e) => setFormData((prev) => ({ ...prev, hospitalAddress: e.target.value }))}
            className="form-textarea"
            disabled={isLoading}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Người liên hệ</label>
            <input
              type="text"
              placeholder="Tên người liên hệ"
              value={formData.contactName}
              onChange={(e) => setFormData((prev) => ({ ...prev, contactName: e.target.value }))}
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="form-label">Số điện thoại</label>
            <input
              type="tel"
              placeholder="Số điện thoại liên hệ"
              value={formData.contactPhone}
              onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label">Mô tả tình trạng khẩn cấp</label>
          <textarea
            placeholder="Mô tả chi tiết tình trạng khẩn cấp và lý do cần máu gấp"
            rows={4}
            value={formData.emergencyDescription}
            onChange={(e) => setFormData((prev) => ({ ...prev, emergencyDescription: e.target.value }))}
            className="form-textarea"
            disabled={isLoading}
            required
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
              Đang gửi yêu cầu khẩn cấp...
            </div>
          ) : (
            "Gửi yêu cầu khẩn cấp"
          )}
        </Button>
      </form>
    </div>
  )
}
