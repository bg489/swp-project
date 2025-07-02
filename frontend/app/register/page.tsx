"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, User, Mail, Phone, Calendar, Droplets, MapPin, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LocationSelector } from "@/components/location-selector"

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  dateOfBirth: string
  gender: string
  bloodType: string
  address: string
  agreeTerms: boolean
}

interface LocationData {
  province: { code: string; name: string } | null
  district: { code: string; name: string } | null
  ward: { code: string; name: string } | null
}

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    address: "",
    agreeTerms: false,
  })

  const [locationData, setLocationData] = useState<LocationData>({
    province: null,
    district: null,
    ward: null,
  })

  const handleLocationChange = useCallback((location: LocationData) => {
    setLocationData(location)
  }, [])

  const handleAddressChange = useCallback((address: string) => {
    setFormData((prev) => ({ ...prev, address }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    if (!locationData.province || !locationData.district || !locationData.ward) {
      setError("Vui lòng chọn đầy đủ thông tin địa chỉ")
      return
    }

    if (!formData.agreeTerms) {
      setError("Vui lòng đồng ý với điều khoản sử dụng")
      return
    }

    setIsLoading(true)

    try {
      // Create full address
      const fullAddress = `${formData.address}, ${locationData.ward.name}, ${locationData.district.name}, ${locationData.province.name}`

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          address: fullAddress,
          location: locationData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Set user in context (this will redirect to appropriate dashboard)
        setUser(data.user)
      } else {
        setError(data.message || "Đăng ký thất bại")
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-2xl border-0">
        <CardHeader className="text-center bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Đăng ký hiến máu</CardTitle>
          <CardDescription className="text-red-100 text-lg">
            Tham gia cộng đồng hiến máu tình nguyện - Cứu sống những sinh mạng
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Họ và tên *
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      placeholder="Nhập họ và tên đầy đủ"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="pl-10 h-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <User className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email *
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className="pl-10 h-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <Mail className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Số điện thoại *
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      placeholder="0901234567"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      className="pl-10 h-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <Phone className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                    Ngày sinh *
                  </Label>
                  <div className="relative">
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="pl-10 h-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <Calendar className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                    Giới tính *
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger className="h-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodType" className="text-sm font-medium text-gray-700">
                    Nhóm máu *
                  </Label>
                  <div className="relative">
                    <Select
                      value={formData.bloodType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, bloodType: value }))}
                    >
                      <SelectTrigger className="h-12 pl-10 focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <SelectValue placeholder="Chọn nhóm máu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                      </SelectContent>
                    </Select>
                    <Droplets className="absolute left-3 top-4 h-4 w-4 text-red-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Mật khẩu *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="h-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="h-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Thông tin địa chỉ</h3>
              </div>

              <LocationSelector
                onLocationChange={handleLocationChange}
                onAddressChange={handleAddressChange}
                value={locationData}
                detailedAddress={formData.address}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Điều khoản và cam kết</h3>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))}
                  required
                  className="mt-1"
                />
                <Label htmlFor="agreeTerms" className="text-sm leading-6 text-gray-700">
                  Tôi đồng ý với{" "}
                  <Link href="/terms" className="text-red-600 hover:underline font-medium">
                    điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link href="/privacy" className="text-red-600 hover:underline font-medium">
                    chính sách bảo mật
                  </Link>
                  . Tôi cam kết thông tin cung cấp là chính xác và đồng ý tham gia hiến máu tình nguyện để cứu sống
                  những sinh mạng.
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5" />
                    <span>Đăng ký hiến máu</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-red-600 hover:underline font-medium">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
