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
import { Heart, CalendarIcon, User, Droplets, Shield, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { GuestAccessWarning } from "@/components/auth/guest-access-warning"

export default function DonatePage() {
  const { user, isLoading } = useAuth()
  const today = new Date().toISOString().split("T")[0];

  const [loading, setLoading] = useState(false);



  const handleCheckboxChange = (component: string) => {
    const selected = formData.components_offered.includes(component);
    const updated = selected
      ? formData.components_offered.filter((c) => c !== component)
      : [...formData.components_offered, component];

    setFormData((prev) => ({ ...prev, components_offered: updated }));
  };

  const [selectedDate, setSelectedDate] = useState<Date>()
  const [formData, setFormData] = useState({
    available_date: today,
    available_time_range: {
      from: "",
      to: "",
    },
    amount_offered: "",
    components_offered: [] as string[],
    hospital: "",
    notes: "",
  });

  const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
  const timeSlots = ["6:00 - 8:00", "8:00 - 10:00", "10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"]

  const requirements = [
    "Tuổi từ 18-60, cân nặng tối thiểu 45kg",
    "Không mắc các bệnh truyền nhiễm",
    "Không sử dụng thuốc kháng sinh trong 7 ngày",
    "Không hiến máu trong vòng 3 tháng gần đây",
    "Sức khỏe tốt, không có triệu chứng cảm cúm",
  ]


  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Form submitted:", formData, selectedDate)
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/donor-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit donor request");
      }

      alert("Đăng ký hiến máu thành công!");
      // Reset form
      setFormData({
        available_date: today,
        available_time_range: { from: "", to: "" },
        amount_offered: "",
        components_offered: [],
        hospital: "",
        notes: "",
      });
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi gửi yêu cầu.");
    } finally {
      setLoading(false);
    }
  }

  function returnNameComponentBlood(comp: string): React.ReactNode {
    if (comp === "whole") return "Máu toàn phần";
    if (comp === "RBC") return "Hồng cầu";  
    if (comp === "plasma") return "Huyết tương";
    if (comp === "platelet") return "Tiểu cầu";
    return comp; // Default case, should not happen
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  // Show guest access warning if not logged in
  if (!user) {
    return (
      <>
        <Header />
        <GuestAccessWarning
          title="Đăng ký hiến máu"
          description="Để đăng ký hiến máu tình nguyện, bạn cần đăng nhập hoặc tạo tài khoản mới"
        />
        <Footer />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
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
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-red-600 mr-2" />
                      <h4 className="font-semibold text-red-800">Lưu ý quan trọng</h4>
                    </div>
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

                    {/* Availability */}
                    <div className="space-y-4">
                      <div className="max-w-xl mx-auto p-6">
                        <div className="space-y-4">
                          {/* Ngày hiến */}
                          <div>
                            <Label htmlFor="available_date">Ngày hiến máu</Label>
                            <Input
                              type="date"
                              id="available_date"
                              min={today}
                              value={formData.available_date}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  available_date: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>

                          {/* Khung giờ */}
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <Label htmlFor="from">Từ giờ</Label>
                              <Input
                                type="time"
                                id="from"
                                value={formData.available_time_range.from}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    available_time_range: {
                                      ...prev.available_time_range,
                                      from: e.target.value,
                                    },
                                  }))
                                }
                                required
                              />
                            </div>
                            <div className="flex-1">
                              <Label htmlFor="to">Đến giờ</Label>
                              <Input
                                type="time"
                                id="to"
                                value={formData.available_time_range.to}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    available_time_range: {
                                      ...prev.available_time_range,
                                      to: e.target.value,
                                    },
                                  }))
                                }
                                required
                              />
                            </div>
                          </div>

                          {/* Lượng máu muốn hiến */}
                          <div>
                            <Label htmlFor="amount">Lượng máu (ml)</Label>
                            <Input
                              type="number"
                              id="amount"
                              value={formData.amount_offered}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  amount_offered: e.target.value,
                                }))
                              }
                              placeholder="Ví dụ: 350"
                              required
                              min={50}
                            />
                          </div>

                          {/* Thành phần máu */}
                          <div>
                            <Label>Thành phần muốn hiến</Label>
                            <div className="flex gap-4 flex-wrap mt-1">
                              {["whole", "RBC", "plasma", "platelet"].map((comp) => (
                                <label key={comp} className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={formData.components_offered.includes(comp)}
                                    onChange={() => handleCheckboxChange(comp)}
                                  />
                                  {returnNameComponentBlood(comp)}
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Ghi chú */}
                          <div>
                            <Label htmlFor="notes">Ghi chú thêm</Label>
                            <Textarea
                              id="notes"
                              value={formData.notes}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, notes: e.target.value }))
                              }
                              placeholder="Ghi chú đặc biệt (nếu có)..."
                            />
                          </div>

                          {/* Submit */}
                          <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Đang gửi..." : "Đăng ký hiến máu"}
                          </Button>
                        </div>
                      </div>
                      </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">Quy trình an toàn</h3>
                <p className="text-sm text-blue-700">
                  Tất cả dụng cụ đều vô trùng, sử dụng một lần và được tiêu hủy ngay sau khi sử dụng.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-green-800 mb-2">Kiểm tra sức khỏe</h3>
                <p className="text-sm text-green-700">
                  Bác sĩ sẽ kiểm tra sức khỏe tổng quát trước khi tiến hành hiến máu.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-purple-800 mb-2">Chăm sóc sau hiến</h3>
                <p className="text-sm text-purple-700">Được nghỉ ngơi và cung cấp đồ ăn nhẹ để phục hồi sức khỏe.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
