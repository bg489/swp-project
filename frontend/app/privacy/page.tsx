"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, Users, FileText, Mail, Phone, MapPin, Clock, ChevronDown, Heart } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"

export default function PrivacyPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const sections = [
    {
      id: "collection",
      title: "Thu thập thông tin",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      content: [
        {
          subtitle: "Thông tin cá nhân",
          text: "Chúng tôi thu thập thông tin cá nhân khi bạn đăng ký tài khoản, bao gồm: họ tên, email, số điện thoại, địa chỉ, nhóm máu, và thông tin y tế liên quan đến hiến máu.",
        },
        {
          subtitle: "Thông tin tự động",
          text: "Hệ thống tự động thu thập thông tin về thiết bị, địa chỉ IP, trình duyệt, và hoạt động sử dụng website để cải thiện trải nghiệm người dùng.",
        },
        {
          subtitle: "Cookies và công nghệ theo dõi",
          text: "Chúng tôi sử dụng cookies để ghi nhớ thông tin đăng nhập, tùy chọn cá nhân và phân tích lưu lượng truy cập website.",
        },
      ],
    },
    {
      id: "usage",
      title: "Sử dụng thông tin",
      icon: Eye,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      content: [
        {
          subtitle: "Cung cấp dịch vụ",
          text: "Thông tin của bạn được sử dụng để quản lý tài khoản, kết nối người hiến máu với người cần máu, và xử lý các yêu cầu hiến máu.",
        },
        {
          subtitle: "Liên lạc",
          text: "Chúng tôi sử dụng thông tin liên lạc để gửi thông báo quan trọng, nhắc nhở lịch hiến máu, và cập nhật về dịch vụ.",
        },
        {
          subtitle: "Cải thiện dịch vụ",
          text: "Dữ liệu được phân tích để hiểu nhu cầu người dùng, cải thiện tính năng và phát triển dịch vụ mới.",
        },
        {
          subtitle: "Tuân thủ pháp luật",
          text: "Thông tin có thể được sử dụng để tuân thủ các yêu cầu pháp lý và bảo vệ quyền lợi của ScαrletBlood và người dùng.",
        },
      ],
    },
    {
      id: "sharing",
      title: "Chia sẻ thông tin",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      content: [
        {
          subtitle: "Đối tác y tế",
          text: "Thông tin có thể được chia sẻ với bệnh viện, trung tâm y tế đối tác để phục vụ việc hiến máu và cấp cứu khẩn cấp.",
        },
        {
          subtitle: "Nhà cung cấp dịch vụ",
          text: "Chúng tôi có thể chia sẻ thông tin với các nhà cung cấp dịch vụ đáng tin cậy để hỗ trợ vận hành hệ thống.",
        },
        {
          subtitle: "Yêu cầu pháp lý",
          text: "Thông tin có thể được tiết lộ khi có yêu cầu từ cơ quan pháp luật hoặc để bảo vệ quyền lợi hợp pháp.",
        },
        {
          subtitle: "Không bán thông tin",
          text: "Chúng tôi cam kết không bán, cho thuê hoặc trao đổi thông tin cá nhân của bạn với bên thứ ba vì mục đích thương mại.",
        },
      ],
    },
    {
      id: "security",
      title: "Bảo mật dữ liệu",
      icon: Lock,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      content: [
        {
          subtitle: "Mã hóa dữ liệu",
          text: "Tất cả thông tin nhạy cảm được mã hóa bằng công nghệ SSL/TLS tiên tiến trong quá trình truyền tải và lưu trữ.",
        },
        {
          subtitle: "Kiểm soát truy cập",
          text: "Chỉ nhân viên được ủy quyền mới có thể truy cập thông tin cá nhân, và họ phải tuân thủ nghiêm ngặt các quy định bảo mật.",
        },
        {
          subtitle: "Sao lưu và phục hồi",
          text: "Dữ liệu được sao lưu định kỳ và lưu trữ an toàn để đảm bảo tính toàn vẹn và khả năng phục hồi.",
        },
        {
          subtitle: "Giám sát bảo mật",
          text: "Hệ thống được giám sát 24/7 để phát hiện và ngăn chặn các hoạt động bất thường hoặc tấn công mạng.",
        },
      ],
    },
    {
      id: "rights",
      title: "Quyền của người dùng",
      icon: Shield,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      content: [
        {
          subtitle: "Quyền truy cập",
          text: "Bạn có quyền yêu cầu xem thông tin cá nhân mà chúng tôi đang lưu trữ về bạn.",
        },
        {
          subtitle: "Quyền chỉnh sửa",
          text: "Bạn có thể cập nhật, sửa đổi thông tin cá nhân bất kỳ lúc nào thông qua tài khoản của mình.",
        },
        {
          subtitle: "Quyền xóa",
          text: "Bạn có quyền yêu cầu xóa tài khoản và thông tin cá nhân, trừ khi pháp luật yêu cầu lưu trữ.",
        },
        {
          subtitle: "Quyền từ chối",
          text: "Bạn có thể từ chối nhận email marketing hoặc thông báo không bắt buộc bất kỳ lúc nào.",
        },
        {
          subtitle: "Quyền khiếu nại",
          text: "Bạn có quyền khiếu nại về việc xử lý dữ liệu cá nhân đến cơ quan có thẩm quyền.",
        },
      ],
    },
    {
      id: "cookies",
      title: "Chính sách Cookies",
      icon: FileText,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      content: [
        {
          subtitle: "Cookies cần thiết",
          text: "Cookies cần thiết để website hoạt động bình thường, bao gồm thông tin đăng nhập và tùy chọn bảo mật.",
        },
        {
          subtitle: "Cookies phân tích",
          text: "Chúng tôi sử dụng Google Analytics và các công cụ tương tự để hiểu cách người dùng tương tác với website.",
        },
        {
          subtitle: "Cookies chức năng",
          text: "Cookies giúp ghi nhớ tùy chọn của bạn như ngôn ngữ, múi giờ và các thiết lập cá nhân khác.",
        },
        {
          subtitle: "Quản lý cookies",
          text: "Bạn có thể quản lý hoặc xóa cookies thông qua cài đặt trình duyệt, nhưng điều này có thể ảnh hưởng đến trải nghiệm sử dụng.",
        },
      ],
    },
    {
      id: "retention",
      title: "Thời gian lưu trữ dữ liệu",
      icon: Clock,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
      content: [
        {
          subtitle: "Thông tin tài khoản",
          text: "Được lưu trữ trong suốt thời gian tài khoản còn hoạt động và 2 năm sau khi đóng tài khoản.",
        },
        {
          subtitle: "Lịch sử hiến máu",
          text: "Được lưu trữ vĩnh viễn để phục vụ mục đích y tế và tuân thủ quy định pháp luật.",
        },
        {
          subtitle: "Dữ liệu phân tích",
          text: "Được lưu trữ tối đa 24 tháng và được ẩn danh hóa để bảo vệ quyền riêng tư.",
        },
      ],
    },
    {
      id: "updates",
      title: "Cập nhật chính sách",
      icon: FileText,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      content: [
        {
          subtitle: "Email thông báo đến tất cả người dùng đã đăng ký",
          text: "Chúng tôi sẽ gửi email thông báo đến tất cả người dùng đã đăng ký khi có thay đổi quan trọng trong chính sách bảo mật.",
        },
        {
          subtitle: "Thông báo nổi bật trên website",
          text: "Các thay đổi quan trọng sẽ được hiển thị dưới dạng thông báo nổi bật trên trang chủ và các trang chính của website.",
        },
        {
          subtitle: "Cập nhật ngày hiệu lực tại đầu tài liệu này",
          text: "Ngày cập nhật và ngày có hiệu lực mới sẽ được cập nhật rõ ràng tại phần đầu của tài liệu chính sách này.",
        },
      ],
    },
  ]

  const contactInfo = [
    {
      icon: Mail,
      label: "Email bảo mật",
      value: "privacy@scarletblood.vn",
      description: "Gửi câu hỏi về chính sách bảo mật",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Phone,
      label: "Hotline",
      value: "1900-1234",
      description: "Hỗ trợ 24/7",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: MapPin,
      label: "Địa chỉ",
      value: "123 Đường ABC, Quận 1, TP.HCM",
      description: "Văn phòng chính",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Clock,
      label: "Thời gian phản hồi",
      value: "Trong 48 giờ",
      description: "Cam kết phản hồi nhanh",
      color: "bg-orange-100 text-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white shadow-xl border-4 border-red-100 flex items-center justify-center animate-pulse">
              <Heart className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <Badge className="mb-4 bg-red-100 text-red-800 px-4 py-2 text-sm font-medium">
            🔒 Chính sách bảo mật thông tin
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-6">
            Chính sách bảo mật
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn với các biện pháp bảo mật cao nhất. Tìm hiểu cách chúng
            tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
          </p>
          <div className="mt-6 inline-flex items-center space-x-4 text-sm text-gray-500 bg-white px-6 py-3 rounded-full shadow-md">
            <span>📅 Cập nhật: 15/12/2024</span>
            <span>•</span>
            <span>⚡ Hiệu lực: 01/01/2025</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-8">
          {/* Contact Information Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📞 Liên hệ hỗ trợ</h3>
              {contactInfo.map((contact, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${contact.color}`}>
                        <contact.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{contact.label}</h4>
                        <p className="text-gray-600 text-sm">{contact.value}</p>
                        <p className="text-xs text-gray-500">{contact.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Introduction */}
            <Card className="shadow-xl mb-8 border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8">
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="w-8 h-8 mr-4" />
                  Cam kết bảo mật thông tin
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-gradient-to-br from-white to-red-50">
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Tại <span className="font-semibold text-red-600">ScαrletBlood</span>, chúng tôi hiểu rằng thông tin
                    cá nhân và y tế của bạn là vô cùng quan trọng và nhạy cảm. Chúng tôi cam kết áp dụng các tiêu chuẩn
                    bảo mật cao nhất để bảo vệ dữ liệu của bạn.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Chính sách này áp dụng cho tất cả thông tin được thu thập thông qua website, ứng dụng di động và các
                    dịch vụ của ScαrletBlood. Bằng cách sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản
                    được nêu trong chính sách này.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Main Sections */}
            <div className="space-y-6">
              {sections.map((section, index) => (
                <Card
                  key={section.id}
                  className="hover:shadow-xl transition-all duration-500 border-0 shadow-lg overflow-hidden"
                >
                  <CardHeader
                    className={`cursor-pointer hover:${section.bgColor} transition-all duration-300 p-6`}
                    onClick={() => toggleSection(section.id)}
                  >
                    <CardTitle className="flex items-center justify-between text-xl">
                      <div className="flex items-center">
                        <div
                          className={`w-12 h-12 ${section.bgColor} rounded-full flex items-center justify-center mr-4 shadow-md`}
                        >
                          <section.icon className={`w-6 h-6 ${section.iconColor}`} />
                        </div>
                        <div>
                          <span className="text-2xl font-bold text-gray-800">{index + 1}.</span>
                          <span className="ml-2 text-gray-800">{section.title}</span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-6 h-6 text-gray-400 transition-all duration-500 ${
                          expandedSections.includes(section.id) ? "rotate-180 text-red-600" : ""
                        }`}
                      />
                    </CardTitle>
                  </CardHeader>
                  <div
                    className={`transition-all duration-700 ease-in-out overflow-hidden ${
                      expandedSections.includes(section.id) ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50">
                      <div className="space-y-6">
                        {section.content.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="border-l-4 border-red-200 pl-4 hover:border-red-400 transition-colors duration-300"
                          >
                            <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center">
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                              {item.subtitle}
                            </h4>
                            <p className="text-gray-700 leading-relaxed">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Thông báo pháp lý</h3>
                <p className="text-red-100 mb-8 leading-relaxed text-lg max-w-4xl mx-auto">
                  Chính sách bảo mật này được soạn thảo tuân thủ Luật An toàn thông tin mạng 2015, Nghị định
                  13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân và các quy định pháp luật Việt Nam có liên quan.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-3"
                    asChild
                  >
                    <Link href="/contact">📞 Liên hệ về bảo mật</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-3"
                    asChild
                  >
                    <Link href="/">🏠 Về trang chủ</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
