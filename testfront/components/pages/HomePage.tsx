"use client"

import api from "../../lib/axios";
import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Heart, Users, MapPin, Clock, Shield, Activity, Phone, Mail, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Header } from "../../components/header"
import { getCurrentUser, type User } from "../../lib/auth"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const searchParams = useSearchParams()
  const loginSuccess = searchParams.get("login") === "success"
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (!title.trim() || !content.trim()) {
        toast.error("All fields are required");
        return;
      }
  
      
      try {
        await api.post("/notes", {
          title,
          content,
        });
  
        toast.success("Note created successfully!");
        const tesing = await api.get("/notes");
        console.log(tesing.data);
      } catch (error) {
        console.log("Error creating note", error);
      }
    };

  useEffect(() => {
    setCurrentUser(getCurrentUser())
    const fetchNotes = async () => {
          try {
            const res = await api.get("/notes");
            console.log(res.data);
          } catch (error) {
            console.log("Error fetching notes");
            console.log(error);
          }
        };
    
        fetchNotes();
  }, [])

  const bloodTypes = [
    { type: "O-", compatibility: "Người hiến vạn năng", color: "bg-red-500" },
    { type: "O+", compatibility: "Hiến cho O+, A+, B+, AB+", color: "bg-red-400" },
    { type: "A-", compatibility: "Hiến cho A-, A+, AB-, AB+", color: "bg-blue-500" },
    { type: "A+", compatibility: "Hiến cho A+, AB+", color: "bg-blue-400" },
    { type: "B-", compatibility: "Hiến cho B-, B+, AB-, AB+", color: "bg-green-500" },
    { type: "B+", compatibility: "Hiến cho B+, AB+", color: "bg-green-400" },
    { type: "AB-", compatibility: "Hiến cho AB-, AB+", color: "bg-purple-500" },
    { type: "AB+", compatibility: "Người nhận vạn năng", color: "bg-purple-400" },
  ]

  const features = [
    {
      icon: Users,
      title: "Đăng ký hiến máu",
      description: "Đăng ký thông tin nhóm máu và lịch trình sẵn sàng hiến máu",
    },
    {
      icon: MapPin,
      title: "Tìm kiếm theo vị trí",
      description: "Kết nối người hiến và người cần máu theo khoảng cách gần nhất",
    },
    {
      icon: Clock,
      title: "Yêu cầu khẩn cấp",
      description: "Xử lý các trường hợp cần máu khẩn cấp với độ ưu tiên cao",
    },
    {
      icon: Shield,
      title: "Quản lý an toàn",
      description: "Theo dõi thời gian phục hồi và lịch sử hiến máu",
    },
    {
      icon: Activity,
      title: "Theo dõi kho máu",
      description: "Quản lý số lượng các đơn vị máu có sẵn tại cơ sở",
    },
    {
      icon: Heart,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ y tế chuyên nghiệp hỗ trợ mọi lúc",
    },
  ]

  const stats = [
    { number: "2,500+", label: "Người hiến máu" },
    { number: "15,000+", label: "Đơn vị máu đã hiến" },
    { number: "1,200+", label: "Sinh mạng được cứu" },
    { number: "24/7", label: "Hỗ trợ khẩn cấp" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Header />

      {/* Login Success Alert */}
      {loginSuccess && (
        <div className="container mx-auto px-4 pt-4">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Đăng nhập thành công! Chào mừng bạn đến với BloodConnect.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            {currentUser && (
              <div className="mb-6">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  👋 Xin chào, {currentUser.name}!
                </Badge>
              </div>
            )}
            <Badge className="mb-4 bg-red-100 text-red-800 hover:bg-red-100">
              🩸 Cứu sống một sinh mạng chỉ với một giọt máu
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Kết nối <span className="text-red-600">trái tim</span>,
              <br />
              cứu sống <span className="text-red-600">sinh mạng</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Hệ thống quản lý hiến máu hiện đại, kết nối người hiến máu và người cần máu một cách nhanh chóng, an toàn
              và hiệu quả.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                    <Link href="/donate">
                      <Heart className="w-5 h-5 mr-2" />
                      Đăng ký hiến máu
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href={currentUser.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}>
                      <Activity className="w-5 h-5 mr-2" />
                      Xem Dashboard
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                    <Link href="/register">
                      <Heart className="w-5 h-5 mr-2" />
                      Đăng ký hiến máu
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/request">
                      <Users className="w-5 h-5 mr-2" />
                      Tìm người hiến máu
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-red-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Welcome Section */}
      {currentUser && (
        <section className="py-16 px-4 bg-blue-50">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Chào mừng {currentUser.role === "admin" ? "Quản trị viên" : "Người hiến máu"} {currentUser.name}!
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-red-600" />
                      {currentUser.role === "admin" ? "Quản lý hệ thống" : "Thông tin cá nhân"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentUser.role === "admin" ? (
                      <p className="text-gray-600">Quản lý người dùng, kho máu và yêu cầu khẩn cấp</p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          Nhóm máu: <strong>{currentUser.bloodType}</strong>
                        </p>
                        <p className="text-gray-600">
                          Tổng lần hiến: <strong>{currentUser.totalDonations || 0}</strong>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-blue-600" />
                      Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {currentUser.role === "admin"
                        ? "Xem thống kê và quản lý hệ thống"
                        : "Theo dõi lịch sử và đặt lịch hẹn"}
                    </p>
                    <Button asChild className="w-full">
                      <Link href={currentUser.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}>
                        Mở Dashboard
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-green-600" />
                      Hành động nhanh
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {currentUser.role === "admin" ? (
                        <>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href="/emergency">Xem yêu cầu khẩn cấp</Link>
                          </Button>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href="/admin/users">Quản lý người dùng</Link>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href="/donate">Đăng ký hiến máu</Link>
                          </Button>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href="/emergency">Yêu cầu khẩn cấp</Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blood Types Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Thông tin nhóm máu</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hiểu rõ về các nhóm máu và khả năng tương thích để hiến máu hiệu quả nhất
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bloodTypes.map((blood, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-2">
                  <div
                    className={`w-16 h-16 ${blood.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                  >
                    <span className="text-2xl font-bold text-white">{blood.type}</span>
                  </div>
                  <CardTitle className="text-lg">{blood.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 text-center">{blood.compatibility}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tính năng nổi bật</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hệ thống quản lý hiến máu toàn diện với các tính năng hiện đại
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-20 px-4 bg-red-600 text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Trường hợp khẩn cấp?</h2>
            <p className="text-xl text-red-100 mb-8">
              Chúng tôi sẵn sàng hỗ trợ 24/7 cho các trường hợp cần máu khẩn cấp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/emergency">
                  <Phone className="w-5 h-5 mr-2" />
                  Gọi khẩn cấp: 1900-1234
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-600"
                asChild
              >
                <Link href="/emergency">
                  <Calendar className="w-5 h-5 mr-2" />
                  Đăng ký yêu cầu khẩn cấp
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Liên hệ với chúng tôi</h2>
              <p className="text-xl text-gray-600 mb-8">
                Đội ngũ chuyên gia y tế của chúng tôi luôn sẵn sàng hỗ trợ bạn
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-red-600" />
                  <span>Hotline: 1900-1234 (24/7)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-red-600" />
                  <span>Email: info@bloodconnect.vn</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span>123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Gửi tin nhắn</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Tin nhắn"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700">Gửi tin nhắn</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BloodConnect</span>
              </div>
              <p className="text-gray-400">
                Kết nối trái tim, cứu sống sinh mạng. Hệ thống quản lý hiến máu hiện đại và an toàn.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Dịch vụ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/donate" className="hover:text-white">
                    Đăng ký hiến máu
                  </Link>
                </li>
                <li>
                  <Link href="/request" className="hover:text-white">
                    Tìm người hiến máu
                  </Link>
                </li>
                <li>
                  <Link href="/emergency" className="hover:text-white">
                    Yêu cầu khẩn cấp
                  </Link>
                </li>
                {currentUser && (
                  <li>
                    <Link
                      href={currentUser.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                      className="hover:text-white"
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Thông tin</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Chính sách bảo mật
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
              <div className="space-y-2 text-gray-400">
                <p>📞 1900-1234</p>
                <p>✉️ info@bloodconnect.vn</p>
                <p>📍 123 Đường ABC, Quận 1, TP.HCM</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BloodConnect. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
