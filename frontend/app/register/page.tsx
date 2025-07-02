"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Lock, Phone, MapPin, Droplets, AlertCircle, Eye, EyeOff, CheckCircle, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LocationSelector } from "@/components/location-selector"

interface LocationData {
  province: { code: string; name: string } | null
  district: { code: string; name: string } | null
  ward: { code: string; name: string } | null
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    bloodType: "",
    agreeTerms: false,
  })
  const [locationData, setLocationData] = useState<LocationData>({
    province: null,
    district: null,
    ward: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]

  const handleLocationChange = useCallback((location: LocationData) => {
    setLocationData(location)
  }, [])

  const handleAddressChange = useCallback((address: string) => {
    setFormData((prev) => ({ ...prev, address }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      setIsLoading(false)
      return
    }

    if (!formData.agreeTerms) {
      setError("Vui lòng đồng ý với điều khoản sử dụng")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      setIsLoading(false)
      return
    }

    // Validate location selection
    if (!locationData.province || !locationData.district || !locationData.ward) {
      setError("Vui lòng chọn đầy đủ thông tin địa chỉ (Tỉnh/Thành phố, Quận/Huyện, Xã/Phường)")
      setIsLoading(false)
      return
    }

    // Validate detailed address
    if (!formData.address.trim()) {
      setError("Vui lòng nhập địa chỉ chi tiết (số nhà, tên đường)")
      setIsLoading(false)
      return
    }

    try {
      // Prepare full address
      const fullAddress = `${formData.address}, ${locationData.ward.name}, ${locationData.district.name}, ${locationData.province.name}`

      // Call API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: fullAddress,
          bloodType: formData.bloodType,
          location: {
            province: locationData.province,
            district: locationData.district,
            ward: locationData.ward,
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to login page with success message
        router.push(`/login?message=${encodeURIComponent(result.message)}`)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-5xl">
          <Card className="w-full shadow-xl border-0">
            <CardHeader className="text-center space-y-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
              <CardTitle className="text-3xl font-bold">Đăng ký tài khoản</CardTitle>
              <CardDescription className="text-red-100 text-lg">
                Tạo tài khoản để tham gia cộng đồng hiến máu
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                    <User className="w-6 h-6 text-red-500" />
                    <h3 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Họ và tên *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          placeholder="Nguyễn Văn A"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          className="pl-12 h-12 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          className="pl-12 h-12 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Mật khẩu *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                          className="pl-12 pr-12 h-12 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Xác nhận mật khẩu *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          className="pl-12 pr-12 h-12 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Số điện thoại *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="0901234567"
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          className="pl-12 h-12 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="bloodType" className="text-sm font-medium text-gray-700">
                        Nhóm máu *
                      </Label>
                      <Select
                        value={formData.bloodType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, bloodType: value }))}
                      >
                        <SelectTrigger className="h-12 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100">
                          <SelectValue placeholder="Chọn nhóm máu" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center">
                                <Droplets className="w-4 h-4 mr-3 text-red-500" />
                                {type}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                    <MapPin className="w-6 h-6 text-red-500" />
                    <h3 className="text-xl font-semibold text-gray-900">Thông tin địa chỉ</h3>
                  </div>

                  {/* Location Selector with integrated detailed address */}
                  <LocationSelector
                    onLocationChange={handleLocationChange}
                    onAddressChange={handleAddressChange}
                    value={locationData}
                    detailedAddress={formData.address}
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))
                      }
                      required
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="agreeTerms" className="text-sm leading-6 text-gray-700">
                        <div className="flex items-center mb-2">
                          <Shield className="w-4 h-4 mr-2 text-red-500" />
                          <span className="font-medium">Điều khoản và cam kết</span>
                        </div>
                        Tôi đồng ý với{" "}
                        <Link href="/terms" className="text-red-600 hover:underline font-medium">
                          điều khoản sử dụng
                        </Link>{" "}
                        và{" "}
                        <Link href="/privacy" className="text-red-600 hover:underline font-medium">
                          chính sách bảo mật
                        </Link>
                        . Tôi cam kết thông tin cung cấp là chính xác và đồng ý tham gia hiến máu tình nguyện.
                      </Label>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-lg shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Đang đăng ký...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-3" />
                      Đăng ký tài khoản
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  Đã có tài khoản?{" "}
                  <Link href="/login" className="text-red-600 hover:underline font-semibold">
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
