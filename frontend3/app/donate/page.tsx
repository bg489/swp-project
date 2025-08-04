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
import { ProtectedRoute } from "@/components/auth/protected-route"
import { toast } from "@/hooks/use-toast"
import api from "@/lib/axios"

export default function DonatePage() {
  const { user, isLoading } = useAuth()
  
  // Sử dụng ngày địa phương thay vì UTC để tránh bị lùi ngày
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Tính toán ngày tối đa (3 tháng từ hôm nay)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = `${maxDate.getFullYear()}-${String(maxDate.getMonth() + 1).padStart(2, '0')}-${String(maxDate.getDate()).padStart(2, '0')}`;

  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [formData, setFormData] = useState({
    available_date: todayString,
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
  const timeSlots = ["8:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"]

  const requirements = [
    "Tuổi từ 18-60, cân nặng tối thiểu 45kg",
    "Không mắc các bệnh truyền nhiễm",
    "Không sử dụng thuốc kháng sinh trong 7 ngày",
    "Không hiến máu trong vòng 3 tháng gần đây",
    "Sức khỏe tốt, không có triệu chứng cảm cúm",
    "Đăng ký trước từ 1 ngày đến 3 tháng",
  ]

  const handleCheckboxChange = (component: string) => {
    const selected = formData.components_offered.includes(component);
    const updated = selected
      ? formData.components_offered.filter((c) => c !== component)
      : [...formData.components_offered, component];

    setFormData((prev) => ({ ...prev, components_offered: updated }));
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    )
  }

  // Check if user is authorized
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-red-600">Vui lòng đăng nhập</CardTitle>
              <CardDescription>
                Bạn cần đăng nhập để đăng ký hiến máu.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/login">
                <Button className="bg-red-600 hover:bg-red-700">
                  Đăng nhập ngay
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (user.role !== "donor") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-red-600">Không có quyền truy cập</CardTitle>
              <CardDescription>
                Trang này chỉ dành cho người hiến máu. Bạn cần đăng ký là người hiến máu để sử dụng tính năng này.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) return;
    
    setLoading(true);
    
    try {
      // Validate required fields
      if (!formData.available_date) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng chọn ngày hiến máu.",
        })
        return;
      }

      // Validate date range
      const selectedDate = new Date(formData.available_date);
      const todayDate = new Date(todayString);
      const maxDateObj = new Date(maxDateString);
      
      if (selectedDate < todayDate) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Ngày hiến máu không thể là ngày trong quá khứ.",
        })
        return;
      }
      
      if (selectedDate > maxDateObj) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Ngày hiến máu không thể quá 3 tháng từ hôm nay.",
        })
        return;
      }

      if (!formData.available_time_range.from || !formData.available_time_range.to) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng chọn khung giờ hiến máu.",
        })
        return;
      }

      if (!formData.amount_offered) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng nhập lượng máu dự kiến hiến (ml).",
        })
        return;
      }

      console.log("Submitting form with user:", user)
      console.log("Form data:", formData)
      console.log("API Base URL:", process.env.NODE_ENV === "development" ? "http://localhost:5001/api" : "/api")

      // Validate user
      if (!user || !user._id) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng đăng nhập trước khi đăng ký hiến máu!",
        })
        return;
      }

      // Debug user info
      console.log("Current user:", {
        id: user._id,
        role: user.role,
        email: user.email,
        full_name: user.full_name
      });

      // Validate form data before submitting
      if (formData.components_offered.length === 0) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng chọn ít nhất một thành phần máu để hiến.",
        })
        return;
      }

      const requestData = {
        donor_id: user._id,
        available_date: formData.available_date,
        available_time_range: formData.available_time_range,
        amount_offered: parseInt(formData.amount_offered),
        components_offered: formData.components_offered,
        comment: formData.notes,
      };

      console.log("Submitting donor request:", requestData);

      const response = await api.post("/users/donor/request", requestData);

      if (response.status === 201) {
        // Show success state
        setShowSuccessMessage(true);
        
        toast({
          title: "🎉 Đăng ký hiến máu thành công!",
          description: `Cảm ơn bạn đã đăng ký hiến ${formData.amount_offered}ml máu vào ngày ${formData.available_date} từ ${formData.available_time_range.from} - ${formData.available_time_range.to}. Chúng tôi sẽ liên hệ với bạn sớm nhất!`,
          duration: 6000,
        })
        
        // Show additional success message
        setTimeout(() => {
          toast({
            title: "🩸 Bạn là người hùng!",
            description: "Hành động của bạn có thể cứu sống 3 người. Hãy theo dõi email để nhận thông báo từ chúng tôi.",
            duration: 5000,
          })
        }, 2000)
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            available_date: todayString,
            available_time_range: { from: "", to: "" },
            amount_offered: "",
            components_offered: [],
            hospital: "",
            notes: "",
          });
          setShowSuccessMessage(false);
        }, 3000)
      }
    } catch (error: any) {
      console.error("Error submitting donor request:", error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = "Đã xảy ra lỗi khi gửi yêu cầu.";
      
      if (error.response?.status === 404) {
        if (error.response?.data?.message?.includes("User not found")) {
          errorMessage = "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.";
        } else if (error.response?.data?.message?.includes("not a valid donor")) {
          errorMessage = "Tài khoản của bạn chưa được thiết lập để hiến máu. Vui lòng liên hệ quản trị viên.";
        } else {
          errorMessage = "Endpoint không tồn tại. Vui lòng kiểm tra kết nối server.";
        }
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Thông tin không hợp lệ. Vui lòng kiểm tra lại.";
      } else if (error.response?.status === 500) {
        errorMessage = "Lỗi hệ thống. Vui lòng thử lại sau.";
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra server backend có đang chạy không.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: errorMessage,
      })
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

  return (
    <ProtectedRoute requiredRole="donor">
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
                  {showSuccessMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <h3 className="font-semibold text-green-800">Đăng ký thành công! 🎉</h3>
                      </div>
                      <p className="text-sm text-green-700 mb-2">
                        Cảm ơn bạn đã đăng ký hiến máu tình nguyện! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                      </p>
                      <div className="flex items-center text-sm text-green-600">
                        <Heart className="w-4 h-4 mr-1" />
                        <span>Bạn có thể cứu sống đến 3 người bằng hành động này!</span>
                      </div>
                    </div>
                  )}
                  
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
                              min={todayString}
                              max={maxDateString}
                              value={formData.available_date}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  available_date: e.target.value,
                                }))
                              }
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Chọn ngày trong vòng 3 tháng tới (từ {new Date(todayString).toLocaleDateString('vi-VN')} đến {new Date(maxDateString).toLocaleDateString('vi-VN')})
                            </p>
                          </div>

                          {/* Khung giờ */}
                          <div>
                            <Label htmlFor="timeSlot">Khung giờ hiến máu</Label>
                            <Select
                              value={`${formData.available_time_range.from} - ${formData.available_time_range.to}`}
                              onValueChange={(value) => {
                                const [from, to] = value.split(' - ');
                                setFormData((prev) => ({
                                  ...prev,
                                  available_time_range: {
                                    from: from,
                                    to: to,
                                  },
                                }))
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn khung giờ phù hợp" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((slot) => (
                                  <SelectItem key={slot} value={slot}>
                                    {slot}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                              min={200}
                              max={500}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Lượng máu tiêu chuẩn: 200-500ml (khuyến nghị: 350ml)
                            </p>
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
                          <Button 
                            type="submit" 
                            disabled={loading || showSuccessMessage} 
                            className={`w-full transition-all duration-300 ${
                              showSuccessMessage 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-red-600 hover:bg-red-700'
                            }`}
                          >
                            {loading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Đang gửi...
                              </>
                            ) : showSuccessMessage ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Đăng ký thành công!
                              </>
                            ) : (
                              "Đăng ký hiến máu"
                            )}
                          </Button>
                        </div>
                      </div>
                      </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Tìm điểm hiến máu gần bạn</h2>
                <p className="text-red-100 mb-6 max-w-2xl mx-auto">
                  Khám phá các điểm hiến máu và bệnh viện gần khu vực của bạn. Tìm địa điểm thuận tiện nhất để thực hiện việc hiến máu.
                </p>
                <Link href="/check-map">
                  <Button className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-3 text-lg">
                    🗺️ Xem bản đồ điểm hiến máu
                  </Button>
                </Link>
              </CardContent>
            </Card>
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
    </ProtectedRoute>
  )
}
