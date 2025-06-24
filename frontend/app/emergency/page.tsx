"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Phone, Clock, MapPin, Droplets, User, Hospital } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function EmergencyPage() {
  const [formData, setFormData] = useState({
    patientName: "",
    hospitalName: "",
    contactPerson: "",
    phone: "",
    bloodType: "",
    unitsNeeded: "",
    urgencyLevel: "",
    medicalCondition: "",
    location: "",
    additionalNotes: "",
  })

  const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
  const urgencyLevels = [
    { value: "critical", label: "Cực kỳ khẩn cấp (< 1 giờ)", color: "bg-red-600" },
    { value: "urgent", label: "Khẩn cấp (< 4 giờ)", color: "bg-orange-500" },
    { value: "high", label: "Ưu tiên cao (< 12 giờ)", color: "bg-yellow-500" },
    { value: "medium", label: "Trung bình (< 24 giờ)", color: "bg-blue-500" },
  ]

  const activeEmergencies = [
    {
      id: "EMG001",
      patient: "Nguyễn Văn A",
      hospital: "Bệnh viện Chợ Rẫy",
      bloodType: "O-",
      units: 4,
      urgency: "critical",
      timeLeft: "45 phút",
      status: "Đang tìm",
    },
    {
      id: "EMG002",
      patient: "Trần Thị B",
      hospital: "Bệnh viện Bình Dan",
      bloodType: "A+",
      units: 2,
      urgency: "urgent",
      timeLeft: "2 giờ 30 phút",
      status: "Đã tìm thấy",
    },
    {
      id: "EMG003",
      patient: "Lê Văn C",
      hospital: "Bệnh viện 115",
      bloodType: "B+",
      units: 3,
      urgency: "high",
      timeLeft: "8 giờ",
      status: "Đang xử lý",
    },
  ]

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "urgent":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "high":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Emergency request submitted:", formData)
    // Handle emergency request submission
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
            <Badge className="mb-4 bg-red-100 text-red-800">🚨 Yêu cầu máu khẩn cấp</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Yêu cầu máu khẩn cấp</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hệ thống xử lý yêu cầu máu khẩn cấp 24/7. Chúng tôi sẽ kết nối với người hiến máu phù hợp trong thời gian
              nhanh nhất.
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4 text-red-600">
              <Phone className="w-4 h-4" />
              <span className="font-semibold">Hotline: 1900-1234</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Emergency Request Form */}
            <div className="lg:col-span-2">
              <Card className="border-red-200">
                <CardHeader className="bg-red-50">
                  <CardTitle className="flex items-center text-red-800">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Tạo yêu cầu khẩn cấp
                  </CardTitle>
                  <CardDescription className="text-red-700">
                    Vui lòng điền đầy đủ thông tin để chúng tôi xử lý nhanh nhất
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Patient Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <User className="w-5 h-5 mr-2 text-red-600" />
                        Thông tin bệnh nhân
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="patientName">Tên bệnh nhân *</Label>
                          <Input
                            id="patientName"
                            value={formData.patientName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, patientName: e.target.value }))}
                            placeholder="Nguyễn Văn A"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="bloodType">Nhóm máu cần *</Label>
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
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="unitsNeeded">Số đơn vị cần *</Label>
                          <Input
                            id="unitsNeeded"
                            type="number"
                            min="1"
                            value={formData.unitsNeeded}
                            onChange={(e) => setFormData((prev) => ({ ...prev, unitsNeeded: e.target.value }))}
                            placeholder="2"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="urgencyLevel">Mức độ khẩn cấp *</Label>
                          <Select
                            value={formData.urgencyLevel}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, urgencyLevel: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn mức độ" />
                            </SelectTrigger>
                            <SelectContent>
                              {urgencyLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  <div className="flex items-center">
                                    <div className={`w-3 h-3 ${level.color} rounded-full mr-2`} />
                                    {level.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Hospital Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Hospital className="w-5 h-5 mr-2 text-red-600" />
                        Thông tin bệnh viện
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="hospitalName">Tên bệnh viện *</Label>
                          <Input
                            id="hospitalName"
                            value={formData.hospitalName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, hospitalName: e.target.value }))}
                            placeholder="Bệnh viện Chợ Rẫy"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Địa chỉ *</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                            placeholder="201B Nguyễn Chí Thanh, Q.5, TP.HCM"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-red-600" />
                        Thông tin liên hệ
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contactPerson">Người liên hệ *</Label>
                          <Input
                            id="contactPerson"
                            value={formData.contactPerson}
                            onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                            placeholder="Bác sĩ Nguyễn Văn B"
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
                    </div>

                    {/* Medical Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Chi tiết y tế</h3>
                      <div>
                        <Label htmlFor="medicalCondition">Tình trạng bệnh lý *</Label>
                        <Textarea
                          id="medicalCondition"
                          value={formData.medicalCondition}
                          onChange={(e) => setFormData((prev) => ({ ...prev, medicalCondition: e.target.value }))}
                          placeholder="Mô tả tình trạng bệnh nhân, lý do cần máu khẩn cấp..."
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="additionalNotes">Ghi chú thêm</Label>
                        <Textarea
                          id="additionalNotes"
                          value={formData.additionalNotes}
                          onChange={(e) => setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                          placeholder="Thông tin bổ sung, yêu cầu đặc biệt..."
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-lg py-3">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Gửi yêu cầu khẩn cấp
                      </Button>
                      <Button type="button" variant="outline" className="px-8">
                        Hủy
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Active Emergencies Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-red-600" />
                    Yêu cầu khẩn cấp hiện tại
                  </CardTitle>
                  <CardDescription>Các trường hợp đang được xử lý</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeEmergencies.map((emergency) => (
                      <div key={emergency.id} className={`p-3 rounded-lg border ${getUrgencyColor(emergency.urgency)}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{emergency.id}</span>
                          <Badge variant="outline" className="text-xs">
                            {emergency.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">{emergency.patient}</p>
                          <p className="text-gray-600">{emergency.hospital}</p>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center">
                              <Droplets className="w-3 h-3 mr-1" />
                              {emergency.bloodType} - {emergency.units} đơn vị
                            </span>
                          </div>
                          <div className="flex items-center text-red-600">
                            <Clock className="w-3 h-3 mr-1" />
                            <span className="font-medium">{emergency.timeLeft}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Hỗ trợ 24/7</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>Hotline: 1900-1234</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>Trung tâm điều phối</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
