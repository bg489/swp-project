"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Users, Shield, Clock, AlertTriangle, CheckCircle, Phone, Mail, MapPin, Search, HelpCircle, BookOpen, MessageSquare } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

const qnaData = [
  {
    id: "1",
    question: "Ai có thể tham gia hiến máu?",
    answer: `
      • Tất cả mọi người từ 18 - 60 tuổi, thực sự tình nguyện hiến máu của mình để cứu chữa người bệnh.
      • Cân nặng ít nhất là 45kg đối với phụ nữ, nam giới. Lượng máu hiến mỗi lần không quá 9ml/kg cân nặng và không quá 500ml mỗi lần.
      • Không bị nhiễm hoặc không có các hành vi lây nhiễm HIV và các bệnh lây nhiễm qua đường truyền máu khác.
      • Thời gian giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ.
      • Có giấy tờ tùy thân.
    `,
    icon: Users,
    category: "Điều kiện hiến máu",
  },
  {
    id: "2",
    question: "Ai là người không nên hiến máu?",
    answer: `
      • Người đã nhiễm hoặc đã thực hiện hành vi có nguy cơ nhiễm HIV, viêm gan B, viêm gan C, và các virus lây qua đường truyền máu.
      • Người có các bệnh mãn tính: tim mạch, huyết áp, hô hấp, dạ dày…
    `,
    icon: AlertTriangle,
    category: "Điều kiện hiến máu",
  },
  {
    id: "3",
    question: "Máu của tôi sẽ được làm những xét nghiệm gì?",
    answer: `
      • Tất cả những đơn vị máu thu được sẽ được kiểm tra nhóm máu (hệ ABO, hệ Rh), HIV, virus viêm gan B, virus viêm gan C, giang mai, sốt rét.
      • Bạn sẽ được thông báo kết quả, được giữ kín và được tư vấn (miễn phí) khi phát hiện ra các bệnh nhiễm trùng nói trên.
    `,
    icon: Shield,
    category: "Xét nghiệm",
  },
  {
    id: "4",
    question: "Máu gồm những thành phần và chức năng gì?",
    answer: `
      Máu là một chất lỏng lưu thông trong các mạch máu của cơ thể, gồm nhiều thành phần, mỗi thành phần làm nhiệm vụ khác nhau:
      • Hồng cầu làm nhiệm vụ chính là vận chuyển oxy.
      • Bạch cầu làm nhiệm vụ bảo vệ cơ thể.
      • Tiểu cầu tham gia vào quá trình đông cầm máu.
      • Huyết tương: gồm nhiều thành phần khác nhau: kháng thể, các yếu tố đông máu, các chất dinh dưỡng...
    `,
    icon: Heart,
    category: "Kiến thức cơ bản",
  },
  {
    id: "5",
    question: "Tại sao lại có nhiều người cần phải được truyền máu?",
    answer: `
      Mỗi giờ có hàng trăm người bệnh cần phải được truyền máu vì:
      • Bị mất máu do chấn thương, tai nạn, thảm hoạ, xuất huyết tiêu hoá...
      • Do bị các bệnh gây thiếu máu, chảy máu: ung thư máu, suy tuỷ xương, máu khó đông...
      • Các phương pháp điều trị hiện đại cần truyền nhiều máu: phẫu thuật tim mạch, ghép tạng...
    `,
    icon: AlertTriangle,
    category: "Nhu cầu máu",
  },
  {
    id: "6",
    question: "Nhu cầu máu điều trị ở nước ta hiện nay?",
    answer: `
      • Mỗi năm nước ta cần khoảng 1.800.000 đơn vị máu điều trị.
      • Máu cần cho điều trị hằng ngày, cho cấp cứu, cho dự phòng các thảm họa, tai nạn cần truyền máu với số lượng lớn.
      • Hiện tại chúng ta đã đáp ứng được khoảng 54% nhu cầu máu cho điều trị.
    `,
    icon: Heart,
    category: "Nhu cầu máu",
  },
  {
    id: "7",
    question: "Tại sao khi tham gia hiến máu lại cần phải có giấy CMND?",
    answer: `
      Mỗi đơn vị máu đều phải có hồ sơ, trong đó có các thông tin về người hiến máu. Theo quy định, đây là một thủ tục cần thiết trong quy trình hiến máu để đảm bảo tính xác thực thông tin về người hiến máu.
    `,
    icon: Shield,
    category: "Thủ tục",
  },
  {
    id: "8",
    question: "Hiến máu nhân đạo có hại đến sức khoẻ không?",
    answer: `
      Hiến máu theo hướng dẫn của thầy thuốc không có hại cho sức khỏe. Điều đó đã được chứng minh bằng các cơ sở khoa học và cơ sở thực tế:

      Cơ sở khoa học:
      • Máu có nhiều thành phần, mỗi thành phần chỉ có đời sống nhất định và luôn luôn được đổi mới hằng ngày.
      • Nhiều công trình nghiên cứu đã chứng minh rằng, sau khi hiến máu, các chỉ số máu có thay đổi chút ít nhưng vẫn nằm trong giới hạn sinh lý bình thường.

      Cơ sở thực tế:
      • Thực tế đã có hàng triệu người hiến máu nhiều lần mà sức khỏe vẫn hoàn toàn tốt.
      • Trên thế giới có người hiến máu trên 400 lần. Ở Việt Nam, người hiến máu nhiều lần nhất đã hiến gần 100 lần, sức khỏe hoàn toàn tốt.
    `,
    icon: CheckCircle,
    category: "An toàn",
  },
  {
    id: "9",
    question: "Tôi có thể hiến máu sau khi tiêm vắc xin Covid-19 không?",
    answer: `
      Khi tiêm vắc xin ngừa Covid-19, có thể tham gia hiến máu sau: 7 NGÀY, để đảm bảo bạn không bị tác dụng phụ và đảm bảo đủ sức khỏe vào ngày hiến máu.
    `,
    icon: Shield,
    category: "COVID-19",
  },
  {
    id: "10",
    question: "Tôi bị nhiễm Covid-19. Tôi có thể hiến máu sau khi hồi phục không?",
    answer: `
      Khi mắc bệnh Covid-19, có thể tham gia hiến máu sau: 14 ngày kể từ thời điểm có kết quả khẳng định "ÂM TÍNH" với virus SarS-CoV-2.
    `,
    icon: Shield,
    category: "COVID-19",
  },
]

const categories = [
  { id: "all", name: "Tất cả", icon: BookOpen },
  { id: "Điều kiện hiến máu", name: "Điều kiện", icon: Users },
  { id: "Xét nghiệm", name: "Xét nghiệm", icon: Shield },
  { id: "An toàn", name: "An toàn", icon: CheckCircle },
  { id: "COVID-19", name: "COVID-19", icon: AlertTriangle },
  { id: "Kiến thức cơ bản", name: "Kiến thức", icon: Heart },
]

export default function QnAPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredQnA = qnaData.filter((item) => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-red-500/5 via-red-400/10 to-red-600/5"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-red-200/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-300/15 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-100/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10 max-w-5xl">
          {/* Main Icon with Animation */}
          <div className="relative mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
              <HelpCircle className="w-12 h-12 text-white relative z-10" />
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-red-300 rounded-full animate-bounce delay-300"></div>
          </div>
          
          {/* Badge with improved styling */}
          <div className="mb-6">
            <Badge className="bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:from-red-100 hover:to-red-150 px-6 py-3 text-base font-medium border border-red-200 shadow-sm">
              <span className="mr-2">💡</span>
              Hỏi đáp về hiến máu
            </Badge>
          </div>
          
          {/* Enhanced Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Câu hỏi
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
              thường gặp
            </span>
          </h1>
          
          {/* Enhanced Description */}
          <div className="max-w-3xl mx-auto mb-10">
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
              Tìm hiểu thông tin chi tiết về quy trình hiến máu, điều kiện tham gia và các quyền lợi của người hiến máu
            </p>
            <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                Thông tin chính xác
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-blue-500 mr-1" />
                Được xác minh y khoa
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 text-red-500 mr-1" />
                Cập nhật liên tục
              </div>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative max-w-xl mx-auto mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-2xl blur-lg"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-red-200/50 shadow-xl">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-red-400 w-6 h-6" />
              <Input
                type="text"
                placeholder="Tìm kiếm câu hỏi của bạn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-6 py-4 text-lg border-0 bg-transparent focus:ring-2 focus:ring-red-500/20 rounded-2xl placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Enhanced Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group relative rounded-2xl px-5 py-3 transition-all duration-300 font-medium ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl shadow-red-500/25 scale-105 border-0"
                      : "border-2 border-red-200/60 text-red-600 hover:bg-red-50 hover:border-red-300 hover:shadow-lg bg-white/70 backdrop-blur-sm"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 transition-transform duration-300 ${
                      selectedCategory === category.id ? "scale-110" : "group-hover:scale-110"
                    }`} />
                    <span>{category.name}</span>
                  </div>
                  {selectedCategory === category.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
                  )}
                </Button>
              )
            })}
          </div>

          {/* Statistics Banner */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-red-100 shadow-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-red-600 mb-1">{qnaData.length}</div>
                  <div className="text-sm text-gray-600 font-medium">Câu hỏi thường gặp</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">1.8M</div>
                  <div className="text-sm text-gray-600 font-medium">Nhu cầu đơn vị máu/năm</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-1">24/7</div>
                  <div className="text-sm text-gray-600 font-medium">Hỗ trợ khẩn cấp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick Stats */}
                <Card className="bg-white/80 backdrop-blur-sm border-red-100 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-red-700 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Thống kê
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{qnaData.length}</div>
                      <div className="text-sm text-gray-600">Câu hỏi</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{filteredQnA.length}</div>
                      <div className="text-sm text-gray-600">Kết quả tìm kiếm</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="bg-white/80 backdrop-blur-sm border-red-100 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-red-700">Liên hệ hỗ trợ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Hotline 24/7</p>
                        <p className="text-sm text-gray-600">1900 1234</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">support@scarletblood.vn</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Địa chỉ</p>
                        <p className="text-sm text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Q&A Content */}
            <div className="lg:col-span-3">
              <Card className="bg-white/80 backdrop-blur-sm border-red-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                    Danh sách câu hỏi
                  </CardTitle>
                  <p className="text-gray-600">
                    {filteredQnA.length > 0 
                      ? `Tìm thấy ${filteredQnA.length} câu hỏi${searchQuery ? ` cho "${searchQuery}"` : ""}`
                      : "Không tìm thấy câu hỏi nào phù hợp"}
                  </p>
                </CardHeader>
                <CardContent>
                  {filteredQnA.length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-4">
                      {filteredQnA.map((item) => {
                        const IconComponent = item.icon
                        return (
                          <AccordionItem
                            key={item.id}
                            value={item.id}
                            className="border border-red-100 rounded-xl px-6 py-2 bg-gradient-to-r from-white to-red-50/30 hover:shadow-md transition-all duration-200"
                          >
                            <AccordionTrigger className="hover:no-underline py-4">
                              <div className="flex items-start space-x-4 text-left">
                                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                  <IconComponent className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">{item.question}</h3>
                                  <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">
                                    {item.category}
                                  </Badge>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6">
                              <div className="ml-14 text-gray-700 leading-relaxed">
                                {item.answer.split("\n").map((line, index) => (
                                  <div key={index} className="mb-2">
                                    {line.trim() && (
                                      <p className={`${line.trim().startsWith("•") ? "ml-4 flex items-start" : ""} ${
                                        line.trim().includes(":") && !line.trim().startsWith("•") ? "font-semibold text-gray-900 mt-3 mb-1" : ""
                                      }`}>
                                        {line.trim().startsWith("•") && (
                                          <span className="text-red-500 mr-2 flex-shrink-0">•</span>
                                        )}
                                        <span>{line.trim().replace(/^•\s*/, "")}</span>
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      })}
                    </Accordion>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                      <p className="text-gray-600 mb-4">Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
                      <Button
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedCategory("all")
                        }}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Xem tất cả câu hỏi
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
