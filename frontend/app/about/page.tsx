import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Target, Shield, MapPin, Phone, Mail, Droplets, Star, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  const stats = [
    { icon: Droplets, label: "Đơn vị máu đã thu thập", value: "50,000+", color: "text-red-600" },
    { icon: Users, label: "Người hiến máu tham gia", value: "15,000+", color: "text-blue-600" },
    { icon: Heart, label: "Sinh mạng được cứu", value: "25,000+", color: "text-pink-600" },
    { icon: MapPin, label: "Điểm hiến máu", value: "120+", color: "text-green-600" },
  ]

  const teamMembers = [
    {
      name: "BS. Nguyễn Văn Minh",
      role: "Giám đốc Y khoa",
      description: "20+ năm kinh nghiệm trong lĩnh vực huyết học và truyền máu",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "ThS. Trần Thị Lan",
      role: "Trưởng phòng Kỹ thuật",
      description: "Chuyên gia về công nghệ bảo quản và xử lý máu hiện đại",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "BS. Lê Hoàng Nam",
      role: "Phó Giám đốc",
      description: "Chuyên về quản lý chất lượng và an toàn truyền máu",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "CN. Phạm Thị Hoa",
      role: "Trưởng phòng Tuyên truyền",
      description: "Chuyên gia truyền thông và giáo dục cộng đồng về hiến máu",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const achievements = [
    {
      year: "2020",
      title: "Thành lập ScαrletBlood",
      description: "Ra mắt hệ thống quản lý hiến máu trực tuyến đầu tiên tại Việt Nam",
    },
    {
      year: "2021",
      title: "Mở rộng toàn quốc",
      description: "Triển khai hệ thống tại 63 tỉnh thành trên cả nước",
    },
    {
      year: "2022",
      title: "Giải thưởng Công nghệ Y tế",
      description: "Nhận giải thưởng 'Ứng dụng Y tế xuất sắc' từ Bộ Y tế",
    },
    {
      year: "2023",
      title: "Chứng nhận ISO 27001",
      description: "Đạt chứng nhận bảo mật thông tin quốc tế ISO 27001",
    },
    {
      year: "2024",
      title: "Mốc 50,000 đơn vị máu",
      description: "Cột mốc 50,000 đơn vị máu được thu thập thông qua hệ thống",
    },
  ]

  const values = [
    {
      icon: Heart,
      title: "Nhân ái",
      description: "Đặt tình người và sự sống lên hàng đầu trong mọi hoạt động",
    },
    {
      icon: Shield,
      title: "An toàn",
      description: "Đảm bảo an toàn tuyệt đối cho người hiến và người nhận máu",
    },
    {
      icon: CheckCircle,
      title: "Chất lượng",
      description: "Cam kết chất lượng cao trong từng quy trình và dịch vụ",
    },
    {
      icon: Users,
      title: "Cộng đồng",
      description: "Xây dựng cộng đồng hiến máu mạnh mẽ và bền vững",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <Badge className="mb-4 bg-red-100 text-red-800">❤️ Kết nối trái tim - Cứu sống sinh mạng</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Về chúng tôi</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              ScαrletBlood là hệ thống quản lý hiến máu hàng đầu Việt Nam, kết nối những trái tim nhân ái với những sinh
              mạng cần được cứu sống. Chúng tôi tin rằng mỗi giọt máu hiến tặng đều mang trong mình sức mạnh của tình
              yêu thương và hy vọng.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-red-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Sứ mệnh</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Xây dựng hệ thống hiến máu hiện đại, an toàn và hiệu quả, kết nối cộng đồng người hiến máu với những
                  người cần được cứu sống. Chúng tôi cam kết mang đến dịch vụ chất lượng cao, đảm bảo an toàn tuyệt đối
                  và tạo ra tác động tích cực đến xã hội.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Tầm nhìn</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Trở thành hệ thống quản lý hiến máu hàng đầu Đông Nam Á, góp phần xây dựng một xã hội khỏe mạnh và
                  nhân ái. Chúng tôi hướng tới việc ứng dụng công nghệ tiên tiến nhất để tối ưu hóa quy trình hiến máu
                  và nâng cao chất lượng cuộc sống.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Những giá trị định hướng mọi hoạt động của chúng tôi trong sứ mệnh cứu sống sinh mạng
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Hành trình phát triển</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Những cột mốc quan trọng trong quá trình xây dựng và phát triển ScαrletBlood
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-red-200"></div>
              <div className="space-y-8">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <Badge className="mb-3 bg-red-100 text-red-800">{achievement.year}</Badge>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                          <p className="text-gray-600">{achievement.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Đội ngũ lãnh đạo</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Những chuyên gia hàng đầu trong lĩnh vực y tế và công nghệ, dẫn dắt ScαrletBlood phát triển
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-red-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full overflow-hidden bg-white/20">
                <Image
                  src="/images/logo.webp"
                  alt="ScαrletBlood Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-3xl font-bold mb-4">Liên hệ với chúng tôi</h2>
              <p className="text-red-100 mb-8 max-w-2xl mx-auto">
                Bạn có câu hỏi hoặc muốn tham gia vào sứ mệnh cứu sống sinh mạng? Hãy liên hệ với chúng tôi ngay hôm
                nay!
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center justify-center space-x-3">
                  <Phone className="w-5 h-5" />
                  <span>1900-1234</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Mail className="w-5 h-5" />
                  <span>info@scarletblood.vn</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <MapPin className="w-5 h-5" />
                  <span>123 Đường ABC, Q.1, TP.HCM</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/donate">Đăng ký hiến máu</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-red-600"
                  asChild
                >
                  <Link href="/contact">Liên hệ ngay</Link>
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
