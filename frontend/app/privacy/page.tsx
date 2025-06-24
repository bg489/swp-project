"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Eye, Users, FileText, Mail, Phone, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  const sections = [
    {
      id: "collection",
      title: "Thu thập thông tin",
      icon: Users,
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
  ]

  const contactInfo = [
    {
      icon: Mail,
      label: "Email bảo mật",
      value: "privacy@scarletblood.vn",
      description: "Gửi câu hỏi về chính sách bảo mật",
    },
    {
      icon: Phone,
      label: "Hotline",
      value: "1900-1234",
      description: "Hỗ trợ 24/7",
    },
    {
      icon: MapPin,
      label: "Địa chỉ",
      value: "123 Đường ABC, Quận 1, TP.HCM",
      description: "Văn phòng chính",
    },
    {
      icon: Clock,
      label: "Thời gian phản hồi",
      value: "Trong 48 giờ",
      description: "Cam kết phản hồi nhanh",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white shadow-lg border-2 border-blue-100 flex items-center justify-center">
              <Image
                src="/images/logo.webp"
                alt="ScαrletBlood Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-cover rounded-full"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Chính sách bảo mật</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn với các biện pháp bảo mật cao nhất. Tìm hiểu cách chúng
            tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Cập nhật lần cuối: 15 tháng 12, 2024 • Có hiệu lực từ: 01 tháng 01, 2024</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {contactInfo.map((contact, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <contact.icon className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contact.label}</h3>
                        <p className="text-gray-600">{contact.value}</p>
                        <p className="text-sm text-gray-500">{contact.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Introduction */}
            <Card className="shadow-lg mb-8">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="w-6 h-6 mr-3" />
                  Cam kết bảo mật thông tin
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Tại ScαrletBlood, chúng tôi hiểu rằng thông tin cá nhân và y tế của bạn là vô cùng quan trọng và nhạy
                  cảm. Chúng tôi cam kết áp dụng các tiêu chuẩn bảo mật cao nhất để bảo vệ dữ liệu của bạn.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Chính sách này áp dụng cho tất cả thông tin được thu thập thông qua website, ứng dụng di động và các
                  dịch vụ của ScαrletBlood. Bằng cách sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản được
                  nêu trong chính sách này.
                </p>
              </CardContent>
            </Card>

            {/* Main Sections */}
            <div className="space-y-6">
              {sections.map((section, index) => (
                <Card key={section.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <section.icon className="w-5 h-5 text-red-600" />
                      </div>
                      {index + 1}. {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {section.content.map((item, itemIndex) => (
                        <div key={itemIndex}>
                          <h4 className="font-semibold text-gray-900 mb-2">{item.subtitle}</h4>
                          <p className="text-gray-600 leading-relaxed text-sm">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Data Retention */}
            <Card className="mt-6 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  7. Thời gian lưu trữ dữ liệu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Thông tin tài khoản</h4>
                    <p className="text-gray-600 text-sm">
                      Được lưu trữ trong suốt thời gian tài khoản còn hoạt động và 2 năm sau khi đóng tài khoản.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Lịch sử hiến máu</h4>
                    <p className="text-gray-600 text-sm">
                      Được lưu trữ vĩnh viễn để phục vụ mục đích y tế và tuân thủ quy định pháp luật.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Dữ liệu phân tích</h4>
                    <p className="text-gray-600 text-sm">
                      Được lưu trữ tối đa 24 tháng và được ẩn danh hóa để bảo vệ quyền riêng tư.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card className="mt-6 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  8. Cập nhật chính sách
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian để phản ánh các thay đổi trong dịch
                    vụ hoặc yêu cầu pháp lý. Mọi thay đổi quan trọng sẽ được thông báo qua:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 text-sm">
                    <li>Email thông báo đến tất cả người dùng đã đăng ký</li>
                    <li>Thông báo nổi bật trên website</li>
                    <li>Cập nhật ngày hiệu lực tại đầu tài liệu này</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Chúng tôi khuyến khích bạn xem lại chính sách này định kỳ để cập nhật thông tin mới nhất.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Thông báo pháp lý</h3>
              <p className="text-red-100 mb-6 leading-relaxed">
                Chính sách bảo mật này được soạn thảo tuân thủ Luật An toàn thông tin mạng 2015, Nghị định 13/2023/NĐ-CP
                về bảo vệ dữ liệu cá nhân và các quy định pháp luật Việt Nam có liên quan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" asChild>
                  <Link href="/contact">Liên hệ về bảo mật</Link>
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600" asChild>
                  <Link href="/">Về trang chủ</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
