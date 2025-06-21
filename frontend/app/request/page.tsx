"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function RequestPage() {
  const [formData, setFormData] = useState({
    patientName: "",
    bloodType: "",
    unitsNeeded: "",
    urgency: "",
    hospital: "",
    hospitalAddress: "",
    contactName: "",
    contactPhone: "",
    neededBy: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Yêu cầu đã được gửi thành công!")
        setFormData({
          patientName: "",
          bloodType: "",
          unitsNeeded: "",
          urgency: "",
          hospital: "",
          hospitalAddress: "",
          contactName: "",
          contactPhone: "",
          neededBy: "",
          description: "",
        })
        router.refresh()
      } else {
        setError(data.error || "Có lỗi xảy ra khi gửi yêu cầu.")
      }
    } catch (err: any) {
      setError("Có lỗi xảy ra khi gửi yêu cầu.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Yêu cầu máu</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Họ và tên người cần máu</label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
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
              placeholder="Nhập số đơn vị máu"
              value={formData.unitsNeeded}
              onChange={(e) => setFormData((prev) => ({ ...prev, unitsNeeded: e.target.value }))}
              className="form-input"
              disabled={isLoading}
              min="1"
              required
            />
          </div>

          <div>
            <label className="form-label">Mức độ khẩn cấp</label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData((prev) => ({ ...prev, urgency: e.target.value }))}
              className="form-select"
              disabled={isLoading}
              required
            >
              <option value="">Chọn mức độ</option>
              <option value="low">Thấp</option>
              <option value="medium">Trung bình</option>
              <option value="high">Cao</option>
              <option value="critical">Cực kỳ khẩn cấp</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Bệnh viện/Cơ sở y tế</label>
          <input
            type="text"
            placeholder="Nhập tên bệnh viện"
            value={formData.hospital}
            onChange={(e) => setFormData((prev) => ({ ...prev, hospital: e.target.value }))}
            className="form-input"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label className="form-label">Địa chỉ bệnh viện</label>
          <textarea
            placeholder="Nhập địa chỉ chi tiết của bệnh viện"
            rows={3}
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
            <label className="form-label">Số điện thoại liên hệ</label>
            <input
              type="tel"
              placeholder="Số điện thoại"
              value={formData.contactPhone}
              onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label">Thời gian cần máu</label>
          <input
            type="datetime-local"
            value={formData.neededBy}
            onChange={(e) => setFormData((prev) => ({ ...prev, neededBy: e.target.value }))}
            className="form-input"
            disabled={isLoading}
            required
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div>
          <label className="form-label">Mô tả tình trạng</label>
          <textarea
            placeholder="Mô tả chi tiết tình trạng bệnh nhân và lý do cần máu"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
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
              Đang gửi yêu cầu...
            </div>
          ) : (
            "Gửi yêu cầu máu"
          )}
        </Button>
      </form>
    </div>
  )
}
