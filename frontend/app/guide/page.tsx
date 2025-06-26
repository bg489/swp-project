"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, Clock, CheckCircle, Phone, FileText, Utensils, Bed, Activity, Shield, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function GuidePage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleDashboardAccess = () => {
    if (!user) {
      // Nếu chưa đăng nhập, chuyển đến trang login với redirect
      router.push("/login?redirectTo=/guide")
      window.scrollTo(0, 0)
    } else {
      // Nếu đã đăng nhập, chuyển đến dashboard theo role
      switch (user.role) {
        case "admin":
          router.push("/admin/dashboard")
          window.scrollTo(0, 0)
          break
        case "staff":
          router.push("/staff/dashboard")
          window.scrollTo(0, 0)
          break
        case "user":
          router.push("/user/dashboard")
          window.scrollTo(0, 0)
          break
        default:
          // Nếu role không xác định, chuyển về trang chủ
          router.push("/")
          window.scrollTo(0, 0)
          break
      }
    }
  }

  const handleDonateClick = () => {
    router.push("/donate")
    window.scrollTo(0, 0)
  }

  const handleQnAClick = () => {
    router.push("/qna")
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <Header />

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <Badge className="mb-4 bg-red-100 text-red-800">Hướng dẫn chi tiết</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Hướng dẫn hiến máu lần đầu</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hướng dẫn toàn diện giúp bạn chuẩn bị và trải qua quá trình hiến máu một cách an toàn và tự tin
            </p>
          </div>

          {/* Preparation Section */}
          <Card className="mb-12 border-blue-200 bg-blue-50/50 mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <CheckCircle className="w-6 h-6 mr-2" />
                Chuẩn bị trước khi hiến máu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Bed className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Ngủ đủ giấc</h4>
                      <p className="text-gray-600">Ngủ ít nhất 7-8 tiếng trước ngày hiến máu</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Utensils className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Ăn uống đầy đủ</h4>
                      <p className="text-gray-600">Ăn bữa sáng/trưa đầy đủ, uống nhiều nước</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Chuẩn bị giấy tờ</h4>
                      <p className="text-gray-600">CMND/CCCD, thẻ BHYT (nếu có)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Activity className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Tránh vận động mạnh</h4>
                      <p className="text-gray-600">Không tập thể dục nặng 24h trước hiến máu</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Section */}
          <Card className="mb-12 border-green-200 bg-green-50/50 mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Clock className="w-6 h-6 mr-2" />
                Quy trình hiến máu (60-90 phút)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Đăng ký và khai báo y tế",
                    time: "10-15 phút",
                    description: "Điền form thông tin cá nhân và tình trạng sức khỏe",
                  },
                  {
                    step: 2,
                    title: "Khám sàng lọc",
                    time: "15-20 phút",
                    description: "Đo huyết áp, cân nặng, kiểm tra mạch, nhiệt độ",
                  },
                  {
                    step: 3,
                    title: "Xét nghiệm máu nhanh",
                    time: "5-10 phút",
                    description: "Kiểm tra nhóm máu, hemoglobin, HIV, viêm gan",
                  },
                  {
                    step: 4,
                    title: "Hiến máu",
                    time: "8-10 phút",
                    description: "Lấy 350-450ml máu (tùy cân nặng)",
                  },
                  {
                    step: 5,
                    title: "Nghỉ ngơi và ăn nhẹ",
                    time: "15-20 phút",
                    description: "Uống nước, ăn bánh quy, quan sát tình trạng sức khỏe",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          {item.time}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* After Care Section */}
          <Card className="mb-12 border-orange-200 bg-orange-50/50 mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <Shield className="w-6 h-6 mr-2" />
                Chăm sóc sau hiến máu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Ngay sau hiến máu:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Giữ băng gạc 4-6 tiếng</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Uống nhiều nước (2-3 lít)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Nghỉ ngơi 15-20 phút</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Tránh nâng vật nặng</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">24-48 tiếng sau:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Ăn thực phẩm giàu sắt</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Tránh rượu bia, thuốc lá</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Ngủ đủ giấc</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Theo dõi vết chích</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Info Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 mx-auto">
            {/* Eligibility */}
            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader>
                <CardTitle className="text-purple-800">Điều kiện hiến máu</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Tuổi: 18-60 tuổi</li>
                  <li>• Cân nặng: Nam ≥ 45kg, Nữ ≥ 42kg</li>
                  <li>• Sức khỏe tốt, không bệnh lý</li>
                  <li>• Huyết áp: 90-140/60-90 mmHg</li>
                  <li>• Mạch: 60-100 lần/phút</li>
                  <li>• Hemoglobin: Nam ≥125g/L, Nữ ≥120g/L</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contraindications */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-red-800">Không được hiến máu khi</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Đang mắc bệnh cấp tính</li>
                  <li>• Dùng thuốc kháng sinh</li>
                  <li>• Phụ nữ có thai, cho con bú</li>
                  <li>• Vừa tiêm vaccine (7-28 ngày)</li>
                  <li>• Vừa phẫu thuật (6 tháng)</li>
                  <li>• Có hành vi nguy cơ cao</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Contact */}
          <Card className="border-red-300 bg-red-100/50 mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <Phone className="w-6 h-6 mr-2" />
                Liên hệ khẩn cấp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Nếu có triệu chứng bất thường:</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Chảy máu không cầm</li>
                    <li>• Choáng váng kéo dài</li>
                    <li>• Sốt cao, ớn lạnh</li>
                    <li>• Đau tức ngực</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Hotline 24/7:</h4>
                  <p className="text-2xl font-bold text-red-600">1900 1234</p>
                  <p className="text-gray-600">Trung tâm Huyết học Quốc gia</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="mt-12 mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-800">Câu hỏi thường gặp</CardTitle>
                <button
                  onClick={handleQnAClick}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    q: "Hiến máu có đau không?",
                    a: "Chỉ có cảm giác châm kim nhẹ khi đầu, sau đó không đau. Toàn bộ quá trình rất nhẹ nhàng.",
                  },
                  {
                    q: "Bao lâu có thể hiến máu lần tiếp theo?",
                    a: "Nam: 3 tháng/lần, Nữ: 4 tháng/lần. Tối đa 5 lần/năm cho nam, 4 lần/năm cho nữ.",
                  },
                  {
                    q: "Hiến máu có ảnh hưởng đến sức khỏe?",
                    a: "Không. Cơ thể sẽ tự bù đắp lượng máu đã hiến trong 24-48h. Thậm chí còn có lợi cho sức khỏe.",
                  },
                  {
                    q: "Có được ăn uống trước khi hiến máu?",
                    a: "Nên ăn bữa sáng/trưa bình thường, tránh thức ăn quá béo. Uống nhiều nước.",
                  },
                ].map((item, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-gray-900 mb-2">{item.q}</h4>
                    <p className="text-gray-600 mb-4">{item.a}</p>
                    {index < 3 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center mt-16 p-12 bg-red-600 rounded-xl text-white mx-auto">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Sẵn sàng cứu sống người khác?</h2>
            <p className="text-xl mb-6 opacity-90">Mỗi lần hiến máu có thể cứu sống đến 3 người</p>
            <div className="space-x-4">
              <button
                onClick={handleDonateClick}
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Đăng ký hiến máu
              </button>
              <button
                onClick={handleDashboardAccess}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
              >
                Tìm điểm hiến máu
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
