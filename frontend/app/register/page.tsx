"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import Button from "@/components/Button"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodType: "",
    address: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Đăng ký thành công!")
        router.push("/login")
      } else {
        setError(data.message || "Đăng ký thất bại. Vui lòng thử lại.")
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại sau.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Đăng ký tài khoản</h2>
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
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="form-label">Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}

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
              "Đăng ký"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
