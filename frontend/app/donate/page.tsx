"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Heart, CalendarIcon, User, Droplets, Shield } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"

export default function DonatePage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    bloodType: "",
    address: "",
    emergencyContact: "",
    medicalHistory: "",
    availableTimes: [] as string[],
    agreeTerms: false,
  })

  const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
  const timeSlots = ["6:00 - 8:00", "8:00 - 10:00", "10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"]

  const requirements = [
    "Tuổi từ 18-60, cân nặng tối thiểu 45kg",
    "Không mắc các bệnh truyền nhiễm",
    "Không sử dụng thuốc kháng sinh trong 7 ngày",
    "Không hiến máu trong vòng 3 tháng gần đây",
    "Sức khỏe tốt, không có triệu chứng cảm cúm",
  ]

  const handleTimeSlotChange = (time: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        availableTimes: [...prev.availableTimes, time],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        availableTimes: prev.availableTimes.filter((t) => t !== time),
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData, selectedDate)
    // Handle form submission
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BloodConnect</h1>
                <p className="text-sm text-gray-600">Đăng ký hiến máu</p>
              </div>
            </Link>
            <Button variant="outline" asChild>
              <Link href="/">← Về trang chủ</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-red-100 text-red-800">🩸 Trở thành người hùng cứu sinh mạng</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Đăng ký hiến máu</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Một giọt máu cho đi, một sinh mạng ở lại. Hãy đăng ký để trở thành người hiến máu tình nguyện.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Requirements Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-red-600" />
                    Điều kiện hiến máu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Lưu ý quan trọng</h4>
                    <p className="text-sm text-red-700">
                      Vui lòng đọc kỹ các điều kiện và tư vấn với bác sĩ nếu có thắc mắc về sức khỏe.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-red-600" />
                    Thông tin đăng ký
                  </CardTitle>
                  <CardDescription>
                    Vui lòng điền đầy đủ thông tin để chúng tôi có thể liên hệ khi cần thiết
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Họ và tên *</Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                            placeholder="Nguyễn Văn A"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Số điện thoại *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                            placeholder="0901234567"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="email@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bloodType">Nhóm máu *</Label>
                          <Select
                            value={formData.bloodType}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, bloodType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhóm máu" />
                            </SelectTrigger>
                            <SelectContent>
                              {bloodTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  <div className="flex items-center">
                                    <Droplets className="w-4 h-4 mr-2 text-red-500" />
                                    {type}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Địa chỉ *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                          placeholder="123 Đường ABC, Quận 1, TP.HCM"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyContact">Liên hệ khẩn cấp</Label>
                        <Input
                          id="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={(e) => setFormData((prev) => ({ ...prev, emergencyContact: e.target.value }))}
                          placeholder="Tên và số điện thoại người thân"
                        />
                      </div>
                    </div>

                    {/* Medical History */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Thông tin y tế</h3>
                      <div>
                        <Label htmlFor="medicalHistory">Tiền sử bệnh lý (nếu có)</Label>
                        <Textarea
                          id="medicalHistory"
                          value={formData.medicalHistory}
                          onChange={(e) => setFormData((prev) => ({ ...prev, medicalHistory: e.target.value }))}
                          placeholder="Mô tả các bệnh lý, dị ứng, thuốc đang sử dụng..."
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Thời gian sẵn sàng</h3>
                      <div>
                        <Label>Ngày có thể hiến máu</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal mt-2">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP", { locale: vi }) : "Chọn ngày"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                              locale={vi}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label>Khung giờ thuận tiện</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {timeSlots.map((time) => (
                            <div key={time} className="flex items-center space-x-2">
                              <Checkbox
                                id={time}
                                checked={formData.availableTimes.includes(time)}
                                onCheckedChange={(checked) => handleTimeSlotChange(time, checked as boolean)}
                              />
                              <Label htmlFor={time} className="text-sm">
                                {time}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreeTerms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))
                          }
                          required
                        />
                        <Label htmlFor="agreeTerms" className="text-sm">
                          Tôi đồng ý với{" "}
                          <Link href="/terms" className="text-red-600 hover:underline">
                            điều khoản sử dụng
                          </Link>{" "}
                          và
                          <Link href="/privacy" className="text-red-600 hover:underline">
                            {" "}
                            chính sách bảo mật
                          </Link>
                          . Tôi cam kết thông tin cung cấp là chính xác và đồng ý tham gia hiến máu tình nguyện.
                        </Label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                        <Heart className="w-4 h-4 mr-2" />
                        Đăng ký hiến máu
                      </Button>
                      <Button type="button" variant="outline" asChild>
                        <Link href="/">Hủy</Link>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
