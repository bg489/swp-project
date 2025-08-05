"use client"

import type React from "react"
import toast, { Toaster } from "react-hot-toast";

import api from "../lib/axios";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  Users,
  MapPin,
  Clock,
  Shield,
  Activity,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  X,
  Send,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { useSearchParams } from "next/navigation"

export default function HomePage() {
  const { user } = useAuth()
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showLoginAlert, setShowLoginAlert] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const searchParams = useSearchParams()
  const loginSuccess = searchParams.get("login") === "success"


  const handleRole = (role: string) => {
    if(role === "admin"){
      return "Quản trị viên"
    } else if(role === "donor"){
      return "Người hiến máu"
    } else if(role === "recipient"){
      return "Người nhận máu"
    } else if(role === "staff"){
      return "Nhân viên"
    } else {
      return "Vô danh"
    }
  }

  const findDashboardByRole = (role: string) => {
    if(role === "admin") 
      return "/admin/dashboard" 
    else if((role === "donor") || (role === "recipient")) 
      return "/user/dashboard"
    else{
      return "/staff/dashboard"
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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

    if (loginSuccess) {
      setShowLoginAlert(true)
      // Tự động ẩn thông báo sau 5 giây
      const timer = setTimeout(() => {
        setShowLoginAlert(false)
      }, 5000)
      

      // Cleanup timer khi component unmount
      return () => clearTimeout(timer)
    }
  }, [loginSuccess])

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    // Validate form
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Vui lòng điền đầy đủ thông tin",
      })
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactForm.email)) {
      setSubmitStatus({
        type: "error",
        message: "Email không hợp lệ",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success
      setSubmitStatus({
        type: "success",
        message: "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.",
      })

      // Reset form
      setContactForm({
        name: "",
        email: "",
        message: "",
      })

      // Auto hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" })
      }, 5000)
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
    <div className="min-h-screen bg-white">
      <Header />

      {/* Login Success Modal - Hiển thị ở giữa màn hình */}
      {showLoginAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="relative w-full max-w-md animate-in zoom-in-95 duration-300">
            <div className="bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden">
              {/* Header với gradient */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Đăng nhập thành công!</h3>
                      <p className="text-red-100 text-sm">Chào mừng bạn trở lại</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
                    onClick={() => setShowLoginAlert(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                    <Image
                      src="/images/logo.webp"
                      alt="ScαrletBlood Logo"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Chào mừng đến với ScαrletBlood!</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Bạn đã đăng nhập thành công. Hãy cùng chúng tôi kết nối trái tim và cứu sống sinh mạng.
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-red-500 h-1 rounded-full transition-all duration-5000 ease-linear"
                      style={{
                        animation: "progress 5s linear forwards",
                        width: "0%",
                      }}
                    ></div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowLoginAlert(false)}>
                      Đóng
                    </Button>
                    <Button className="flex-1 bg-red-600 hover:bg-red-700" asChild>
                      <Link href={ findDashboardByRole(user?.role) } onClick={scrollToTop}>Xem Dashboard</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section với background image */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero-bg.png" alt="Blood donation background" fill className="object-cover" priority />
          {/* Overlay để đảm bảo text dễ đọc */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {user && <div className="mb-6"></div>}
            <Badge className="mb-4 bg-red-100 text-red-800 hover:bg-red-100">
              🩸 Cứu sống một sinh mạng chỉ với một giọt máu
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Kết nối <span className="text-red-400">trái tim</span>,
              <br />
              cứu sống <span className="text-red-400">sinh mạng</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Hệ thống quản lý hiến máu hiện đại, kết nối người hiến máu và người cần máu một cách nhanh chóng, an toàn
              và hiệu quả.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                    <Link href="/donate" onClick={scrollToTop}>
                      <Heart className="w-5 h-5 mr-2" />
                      Đăng ký hiến máu
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white text-white hover:bg-white hover:text-gray-900"
                    asChild
                  >
                    <Link href={findDashboardByRole(user?.role)} onClick={scrollToTop}>
                      <Activity className="w-5 h-5 mr-2" />
                      Xem Dashboard
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                    <Link href="/register" onClick={scrollToTop}>
                      <Heart className="w-5 h-5 mr-2" />
                      Đăng ký hiến máu
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white text-white hover:bg-white hover:text-gray-900"
                    asChild
                  >
                    <Link href="/request" onClick={scrollToTop}>
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
      {user && (
        <section className="py-16 px-4 bg-blue-50">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Chào mừng {handleRole(user.role)} {user.full_name}!
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-red-600" />
                      {user.role === "admin" ? "Quản lý hệ thống" : "Thông tin cá nhân"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.role === "admin" ? (
                      <p className="text-gray-600">Quản lý người dùng, kho máu và yêu cầu khẩn cấp</p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          Nhóm máu: <strong>{user.role}</strong>
                        </p>
                        <p className="text-gray-600">
                          Tổng lần hiến: <strong>{user.role || 0}</strong>
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
                      {user.role === "admin" ? "Xem thống kê và quản lý hệ thống" : "Theo dõi lịch sử và đặt lịch hẹn"}
                    </p>
                    <Button asChild className="w-full">
                      <Link href={findDashboardByRole(user?.role)} onClick={scrollToTop}>Mở Dashboard</Link>
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
                      {user.role === "admin" ? (
                        <>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href="/emergency">Xem yêu cầu khẩn cấp</Link>
                          </Button>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href="/admin/users" onClick={scrollToTop}>Quản lý người dùng</Link>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href="/donate" onClick={scrollToTop}>Đăng ký hiến máu</Link>
                          </Button>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href="/emergency" onClick={scrollToTop}>Yêu cầu khẩn cấp</Link>
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
      <section className="py-20 px-4 bg-gray-50">
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
      <section className="py-20 px-4 bg-white">
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
                <Link href="/emergency" onClick={scrollToTop}>
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
                <Link href="/emergency" onClick={scrollToTop}>
                  <Calendar className="w-5 h-5 mr-2" />
                  Đăng ký yêu cầu khẩn cấp
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gray-50">
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
                  <span>Email: info@scarletblood.vn</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span>123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Gửi tin nhắn</h3>

              {/* Status Messages */}
              {submitStatus.type && (
                <Alert
                  className={`mb-4 ${submitStatus.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                >
                  <div className="flex items-center">
                    {submitStatus.type === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription
                      className={`ml-2 ${submitStatus.type === "success" ? "text-green-800" : "text-red-800"}`}
                    >
                      {submitStatus.message}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Tin nhắn"
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang gửi...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Gửi tin nhắn
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
      <Toaster position="top-center" containerStyle={{
        top: 80,
      }}/>
    </div>
  )
}
