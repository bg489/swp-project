"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  User,
  Clock,
  ArrowRight,
  Droplets,
  BookOpen,
  Search,
  Heart,
  Star,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Tất cả")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])

  // Refs for category sections
  const categoryRefs = {
    "Tất cả": useRef<HTMLDivElement>(null),
    "Hướng dẫn": useRef<HTMLDivElement>(null),
    "Sức khỏe": useRef<HTMLDivElement>(null),
    "Kiến thức": useRef<HTMLDivElement>(null),
    "Câu chuyện": useRef<HTMLDivElement>(null),
    "Dinh dưỡng": useRef<HTMLDivElement>(null),
    "Công nghệ": useRef<HTMLDivElement>(null),
    "Tin tức": useRef<HTMLDivElement>(null),
    "An toàn": useRef<HTMLDivElement>(null),
  }

  const featuredPost = {
    id: 1,
    title: "Hướng dẫn toàn diện cho người hiến máu lần đầu",
    excerpt:
      "Bạn đang cân nhắc hiến máu lần đầu? Đây là hướng dẫn chi tiết từ A-Z giúp bạn chuẩn bị tốt nhất cho lần hiến máu đầu tiên, từ điều kiện sức khỏe, quy trình đăng ký đến những lưu ý quan trọng sau khi hiến máu.",
    author: "BS. Nguyễn Văn Minh",
    date: "15/12/2024",
    readTime: "8 phút đọc",
    category: "Hướng dẫn",
    featured: true,
    views: 2547,
    likes: 189,
    comments: 23,
    image: "/placeholder.svg?height=400&width=600",
  }

  const blogPosts = [
    // Hướng dẫn
    {
      id: 2,
      title: "Quy trình hiến máu chi tiết từ A đến Z",
      excerpt:
        "Tìm hiểu từng bước trong quy trình hiến máu: đăng ký trực tuyến, khám sàng lọc sức khỏe, quy trình lấy máu và chăm sóc sau hiến. Hướng dẫn này sẽ giúp bạn hiểu rõ những gì sẽ xảy ra khi đến trung tâm hiến máu.",
      author: "BS. Trần Thị Lan Anh",
      date: "12/12/2024",
      readTime: "6 phút đọc",
      category: "Hướng dẫn",
      views: 1823,
      likes: 145,
      comments: 18,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 3,
      title: "Chuẩn bị gì trước khi hiến máu? Checklist hoàn chỉnh",
      excerpt:
        "Danh sách kiểm tra hoàn chỉnh những gì cần chuẩn bị trước 24-48 giờ hiến máu: chế độ ăn uống, giấy tờ cần thiết, trang phục phù hợp và những điều tuyệt đối không nên làm trước khi hiến máu.",
      author: "Y tá trưởng Phạm Thị Hoa",
      date: "10/12/2024",
      readTime: "5 phút đọc",
      category: "Hướng dẫn",
      views: 1456,
      likes: 98,
      comments: 12,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 4,
      title: "Chăm sóc bản thân sau khi hiến máu - Bí quyết phục hồi nhanh",
      excerpt:
        "Hướng dẫn chi tiết cách chăm sóc bản thân trong 24-48 giờ đầu sau hiến máu: chế độ nghỉ ngơi, dinh dưỡng bổ sung, dấu hiệu cần lưu ý và khi nào cần liên hệ bác sĩ.",
      author: "BS. Lê Văn Nam",
      date: "08/12/2024",
      readTime: "7 phút đọc",
      category: "Hướng dẫn",
      views: 1234,
      likes: 87,
      comments: 15,
      image: "/placeholder.svg?height=300&width=400",
    },

    // Sức khỏe
    {
      id: 5,
      title: "7 lợi ích sức khỏe bất ngờ từ việc hiến máu định kỳ",
      excerpt:
        "Nghiên cứu khoa học chứng minh hiến máu định kỳ không chỉ cứu sống người khác mà còn mang lại nhiều lợi ích cho sức khỏe người hiến: giảm nguy cơ bệnh tim mạch, cân bằng sắt trong máu, tăng cường hệ miễn dịch.",
      author: "TS.BS. Hoàng Văn Đức",
      date: "14/12/2024",
      readTime: "8 phút đọc",
      category: "Sức khỏe",
      views: 2156,
      likes: 167,
      comments: 28,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 6,
      title: "Hiến máu có ảnh hưởng đến sức khỏe sinh sản không?",
      excerpt:
        "Giải đáp những thắc mắc phổ biến về tác động của hiến máu đến khả năng sinh sản, chu kỳ kinh nguyệt và sức khỏe phụ nữ. Dựa trên các nghiên cứu y khoa uy tín và kinh nghiệm thực tế.",
      author: "BS. Sản phụ khoa Nguyễn Thị Mai",
      date: "11/12/2024",
      readTime: "6 phút đọc",
      category: "Sức khỏe",
      views: 1789,
      likes: 134,
      comments: 21,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 7,
      title: "Hiến máu và hệ miễn dịch: Mối liên hệ khoa học",
      excerpt:
        "Phân tích sâu về cách hiến máu kích thích hệ miễn dịch sản xuất tế bào máu mới, tăng cường khả năng chống lại bệnh tật và cải thiện sức khỏe tổng thể dựa trên các nghiên cứu y học hiện đại.",
      author: "GS.TS. Trần Văn Hùng",
      date: "09/12/2024",
      readTime: "9 phút đọc",
      category: "Sức khỏe",
      views: 1345,
      likes: 89,
      comments: 16,
      image: "/placeholder.svg?height=300&width=400",
    },

    // Kiến thức
    {
      id: 8,
      title: "Bí ẩn các nhóm máu hiếm: Khi tìm người hiến trở thành thử thách",
      excerpt:
        "Khám phá thế giới các nhóm máu hiếm như Rh-null, Diego(b-), Kidd(b-) và những thách thức trong việc tìm kiếm người hiến máu tương thích. Câu chuyện về ngân hàng máu hiếm quốc tế và tầm quan trọng của việc xét nghiệm nhóm máu chi tiết.",
      author: "TS. Huyết học Lê Văn Cường",
      date: "13/12/2024",
      readTime: "12 phút đọc",
      category: "Kiến thức",
      views: 1967,
      likes: 156,
      comments: 34,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 9,
      title: "Khoa học đằng sau việc tương thích nhóm máu ABO và Rh",
      excerpt:
        "Giải thích chi tiết cơ chế sinh học của hệ thống nhóm máu ABO và Rh, tại sao O- được gọi là 'người hiến máu vạn năng', AB+ là 'người nhận vạn năng' và những quy tắc tương thích phức tạp khác.",
      author: "GS. Sinh học phân tử Phạm Thị Linh",
      date: "07/12/2024",
      readTime: "10 phút đọc",
      category: "Kiến thức",
      views: 1678,
      likes: 123,
      comments: 19,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 10,
      title: "Lịch sử 400 năm phát triển của y học truyền máu",
      excerpt:
        "Hành trình từ những thí nghiệm đầu tiên của William Harvey (1628) đến công nghệ tách máu hiện đại. Những cột mốc quan trọng: phát hiện nhóm máu (1901), ngân hàng máu đầu tiên (1937), đến kỹ thuật bảo quản máu tiên tiến ngày nay.",
      author: "PGS. Lịch sử Y học Nguyễn Văn Thành",
      date: "05/12/2024",
      readTime: "15 phút đọc",
      category: "Kiến thức",
      views: 1234,
      likes: 98,
      comments: 14,
      image: "/placeholder.svg?height=300&width=400",
    },

    // Câu chuyện
    {
      id: 11,
      title: "Giọt máu cứu sinh mạng: 5 câu chuyện cảm động nhất năm 2024",
      excerpt:
        "Những câu chuyện có thật về sự sống được cứu nhờ máu hiến: em bé sinh non được cứu sống nhờ 15 đơn vị máu, tai nạn giao thông nghiêm trọng và cuộc giải cứu trong đêm, bệnh nhân ung thư máu tìm thấy hy vọng.",
      author: "Nhóm phóng viên ScαrletBlood",
      date: "06/12/2024",
      readTime: "12 phút đọc",
      category: "Câu chuyện",
      views: 3456,
      likes: 289,
      comments: 67,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 12,
      title: "Anh Nguyễn Văn Hùng - 150 lần hiến máu, một trái tim vàng",
      excerpt:
        "Câu chuyện về anh Nguyễn Văn Hùng (45 tuổi, Hà Nội) - người đã hiến máu 150 lần trong 20 năm. Từ lần hiến đầu tiên năm 18 tuổi đến việc trở thành 'đại sứ hiến máu', anh đã truyền cảm hứng cho hàng nghìn người.",
      author: "Phóng viên Lê Thị Bích Ngọc",
      date: "04/12/2024",
      readTime: "10 phút đọc",
      category: "Câu chuyện",
      views: 2789,
      likes: 234,
      comments: 45,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 13,
      title: "Cuộc giải cứu thần kỳ: Tìm nhóm máu Rh-null trong 6 giờ",
      excerpt:
        "Câu chuyện ly kỳ về việc tìm kiếm nhóm máu 'vàng' Rh-null để cứu sống bé Minh An 3 tuổi. Cuộc huy động toàn quốc, sự hỗ trợ của cộng đồng mạng và kết cục có hậu sau 6 giờ căng thẳng.",
      author: "BS. Cấp cứu Trần Thị Cẩm Ly",
      date: "02/12/2024",
      readTime: "8 phút đọc",
      category: "Câu chuyện",
      views: 2345,
      likes: 198,
      comments: 38,
      image: "/placeholder.svg?height=300&width=400",
    },

    // Dinh dưỡng
    {
      id: 14,
      title: "Thực đơn 7 ngày phục hồi hoàn hảo sau hiến máu",
      excerpt:
        "Menu chi tiết 7 ngày sau hiến máu với các món ăn giàu sắt, protein và vitamin. Bao gồm công thức nấu ăn cụ thể, thời gian ăn uống hợp lý và những thực phẩm nên tránh để tối ưu quá trình phục hồi.",
      author: "Chuyên gia dinh dưỡng Phạm Thị Dung",
      date: "03/12/2024",
      readTime: "8 phút đọc",
      category: "Dinh dưỡng",
      views: 1567,
      likes: 112,
      comments: 22,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 15,
      title: "Top 20 thực phẩm vàng giúp tăng cường sản xuất máu tự nhiên",
      excerpt:
        "Danh sách chi tiết 20 thực phẩm giàu sắt, folate, vitamin B12 và C giúp cơ thể sản xuất hồng cầu hiệu quả: từ gan bò, rau bina đến các loại hạt và trái cây. Kèm theo hướng dẫn chế biến và kết hợp thực phẩm.",
      author: "TS. Dinh dưỡng Lê Văn Minh",
      date: "01/12/2024",
      readTime: "6 phút đọc",
      category: "Dinh dưỡng",
      views: 1890,
      likes: 145,
      comments: 19,
      image: "/placeholder.svg?height=300&width=400",
    },

    // Công nghệ
    {
      id: 16,
      title: "Công nghệ bảo quản máu thế hệ mới: Từ -80°C đến công nghệ đông khô",
      excerpt:
        "Khám phá những tiến bộ vượt bậc trong công nghệ bảo quản máu: hệ thống làm lạnh thông minh, công nghệ đông khô bảo quản tiểu cầu, và phương pháp bảo quản máu ở nhiệt độ phòng lên đến 21 ngày.",
      author: "KS. Công nghệ sinh học Hoàng Văn Phúc",
      date: "30/11/2024",
      readTime: "9 phút đọc",
      category: "Công nghệ",
      views: 1234,
      likes: 87,
      comments: 13,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 17,
      title: "AI và Big Data: Cách mạng trong quản lý ngân hàng máu",
      excerpt:
        "Ứng dụng trí tuệ nhân tạo dự đoán nhu cầu máu theo mùa, phân tích dữ liệu người hiến để tối ưu chiến dịch, và hệ thống cảnh báo thiếu hụt máu thông minh. Tương lai của ngành hiến máu trong kỷ nguyên số.",
      author: "TS. Khoa học máy tính Nguyễn Văn Giang",
      date: "28/11/2024",
      readTime: "7 phút đọc",
      category: "Công nghệ",
      views: 1456,
      likes: 98,
      comments: 16,
      image: "/placeholder.svg?height=300&width=400",
    },

    // Tin tức
    {
      id: 18,
      title: "Ngày Hiến máu Thế giới 2024: Việt Nam đạt 1.7 triệu đơn vị máu",
      excerpt:
        "Báo cáo toàn diện về thành tựu hiến máu tình nguyện Việt Nam năm 2024: 1.7 triệu đơn vị máu được thu thập, tăng 15% so với năm trước. Những con số ấn tượng và kế hoạch phát triển 2025.",
      author: "Ban biên tập ScαrletBlood",
      date: "14/06/2024",
      readTime: "6 phút đọc",
      category: "Tin tức",
      views: 3456,
      likes: 267,
      comments: 45,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 19,
      title: "Chính sách mới 2024: Ưu đãi đặc biệt cho người hiến máu tình nguyện",
      excerpt:
        "Thông tin chi tiết về Nghị định mới của Chính phủ về ưu đãi người hiến máu: miễn phí khám chữa bệnh, ưu tiên trong tuyển dụng công chức, hỗ trợ học bổng cho con em và nhiều chính sách hấp dẫn khác.",
      author: "Luật sư Trần Văn Hải",
      date: "25/11/2024",
      readTime: "8 phút đọc",
      category: "Tin tức",
      views: 1789,
      likes: 134,
      comments: 28,
      image: "/placeholder.svg?height=300&width=400",
    },

    // An toàn
    {
      id: 20,
      title: "Giao thức an toàn hiến máu mới nhất: Cập nhật từ WHO 2024",
      excerpt:
        "Hướng dẫn mới nhất từ Tổ chức Y tế Thế giới về các biện pháp an toàn trong hiến máu: quy trình khử trùng nâng cao, kiểm tra sức khỏe người hiến, và các biện pháp phòng chống lây nhiễm trong bối cảnh hậu COVID-19.",
      author: "BS. Kiểm soát nhiễm khuẩn Phạm Thị Ích",
      date: "22/11/2024",
      readTime: "7 phút đọc",
      category: "An toàn",
      views: 2134,
      likes: 178,
      comments: 32,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 21,
      title: "Quy trình kiểm tra chất lượng máu 15 bước: Đảm bảo an toàn tuyệt đối",
      excerpt:
        "Hé lộ quy trình kiểm tra chất lượng máu 15 bước nghiêm ngặt: từ xét nghiệm nhóm máu, tầm soát bệnh truyền nhiễm, đến kiểm tra chất lượng bảo quản. Tìm hiểu các tiêu chuẩn quốc tế được áp dụng tại Việt Nam.",
      author: "KTV. Xét nghiệm Lê Thị Thanh Hương",
      date: "20/11/2024",
      readTime: "10 phút đọc",
      category: "An toàn",
      views: 1567,
      likes: 123,
      comments: 21,
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  const categories = [
    { name: "Tất cả", count: blogPosts.length + 1, active: true },
    { name: "Hướng dẫn", count: blogPosts.filter((p) => p.category === "Hướng dẫn").length + 1, active: false },
    { name: "Sức khỏe", count: blogPosts.filter((p) => p.category === "Sức khỏe").length, active: false },
    { name: "Kiến thức", count: blogPosts.filter((p) => p.category === "Kiến thức").length, active: false },
    { name: "Câu chuyện", count: blogPosts.filter((p) => p.category === "Câu chuyện").length, active: false },
    { name: "Dinh dưỡng", count: blogPosts.filter((p) => p.category === "Dinh dưỡng").length, active: false },
    { name: "Công nghệ", count: blogPosts.filter((p) => p.category === "Công nghệ").length, active: false },
    { name: "Tin tức", count: blogPosts.filter((p) => p.category === "Tin tức").length, active: false },
    { name: "An toàn", count: blogPosts.filter((p) => p.category === "An toàn").length, active: false },
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      "Hướng dẫn": "bg-blue-100 text-blue-800",
      "Sức khỏe": "bg-green-100 text-green-800",
      "Kiến thức": "bg-purple-100 text-purple-800",
      "Câu chuyện": "bg-pink-100 text-pink-800",
      "Dinh dưỡng": "bg-orange-100 text-orange-800",
      "Công nghệ": "bg-gray-100 text-gray-800",
      "Tin tức": "bg-red-100 text-red-800",
      "An toàn": "bg-yellow-100 text-yellow-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName)

    // Scroll to the category section after a short delay to ensure content is rendered
    setTimeout(() => {
      const targetRef = categoryRefs[categoryName as keyof typeof categoryRefs]
      if (targetRef?.current) {
        const headerHeight = 120 // Adjust based on your header height
        const elementPosition = targetRef.current.offsetTop - headerHeight

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        })
      } else if (categoryName === "Tất cả") {
        // For "Tất cả", scroll to the featured post section
        const featuredRef = categoryRefs["Hướng dẫn"]
        if (featuredRef?.current) {
          const headerHeight = 120
          const elementPosition = featuredRef.current.offsetTop - headerHeight

          window.scrollTo({
            top: elementPosition,
            behavior: "smooth",
          })
        }
      }
    }, 100)
  }

  const getFilteredPosts = (category: string) => {
    if (category === "Tất cả") {
      return blogPosts
    }
    return blogPosts.filter((post) => post.category === category)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      setFilteredPosts([])
      return
    }

    const filtered = blogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(term.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(term.toLowerCase()) ||
        post.author.toLowerCase().includes(term.toLowerCase()) ||
        post.category.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredPosts(filtered)
  }

  const postsToShow = searchTerm.trim() !== "" ? filteredPosts : getFilteredPosts(activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Header />

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <Badge className="mb-4 bg-red-100 text-red-800">📚 Kiến thức & Chia sẻ kinh nghiệm</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Blog ScαrletBlood</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nơi chia sẻ kiến thức chuyên sâu, kinh nghiệm thực tế và những câu chuyện cảm động về hiến máu cứu người
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="max-w-3xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm bài viết, tác giả, chủ đề..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-2 border-red-200 focus:border-red-500 rounded-xl"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => handleSearch("")}
                >
                  ✕
                </Button>
              )}
            </div>
            {searchTerm && (
              <p className="text-center mt-4 text-gray-600">
                Tìm thấy <span className="font-semibold text-red-600">{filteredPosts.length}</span> kết quả cho "
                <span className="font-medium">{searchTerm}</span>"
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Danh mục bài viết</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.name}
                          onClick={() => handleCategoryClick(category.name)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
                            activeCategory === category.name
                              ? "bg-red-100 text-red-800 border-2 border-red-300"
                              : "hover:bg-gray-100 border-2 border-transparent"
                          }`}
                        >
                          <span className="font-medium">{category.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {category.count}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Facts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Droplets className="w-5 h-5 mr-2 text-red-600" />
                      Thông tin hữu ích
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <h4 className="font-semibold text-red-800 mb-1">Chu kỳ hiến máu</h4>
                        <p className="text-sm text-red-700">Nam: 3 tháng/lần, Nữ: 4 tháng/lần</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-1">Điều kiện hiến máu</h4>
                        <p className="text-sm text-blue-700">18-60 tuổi, cân nặng ≥ 45kg</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-1">Lượng máu hiến</h4>
                        <p className="text-sm text-green-700">250-450ml tùy theo cân nặng</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-1">Thời gian hiến máu</h4>
                        <p className="text-sm text-purple-700">8-15 phút cho toàn bộ quy trình</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-600" />
                      Bài viết được quan tâm
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {blogPosts
                        .sort((a, b) => b.views - a.views)
                        .slice(0, 5)
                        .map((post, index) => (
                          <Link key={post.id} href={`/blog/${post.id}`} className="block">
                            <div className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-red-600">{index + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-2 mb-1 hover:text-red-600 transition-colors">
                                  {post.title}
                                </h4>
                                <div className="flex items-center text-xs text-gray-500 space-x-2">
                                  <Eye className="w-3 h-3" />
                                  <span>{post.views.toLocaleString()}</span>
                                  <Heart className="w-3 h-3" />
                                  <span>{post.likes}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Featured Post */}
              {(activeCategory === "Tất cả" || activeCategory === "Hướng dẫn") && searchTerm === "" && (
                <div ref={categoryRefs["Hướng dẫn"]}>
                  <Card className="overflow-hidden border-red-200 shadow-xl">
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <div className="w-full h-64 md:h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Droplets className="w-10 h-10 text-white" />
                            </div>
                            <p className="text-red-700 font-medium">Bài viết nổi bật</p>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-1/2 p-6">
                        <Badge className={`mb-3 ${getCategoryColor(featuredPost.category)}`}>
                          {featuredPost.category}
                        </Badge>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">{featuredPost.title}</h2>
                        <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {featuredPost.author}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {featuredPost.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {featuredPost.readTime}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {featuredPost.views.toLocaleString()}
                            </div>
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {featuredPost.likes}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {featuredPost.comments}
                            </div>
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/blog/${featuredPost.id}`}>
                            Đọc bài viết
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Category Sections */}
              {activeCategory === "Tất cả" && searchTerm === "" ? (
                // Show all categories
                categories
                  .slice(1)
                  .map((category) => {
                    const categoryPosts = blogPosts.filter((post) => post.category === category.name)
                    if (categoryPosts.length === 0) return null

                    return (
                      <div key={category.name} ref={categoryRefs[category.name as keyof typeof categoryRefs]}>
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <span className="w-1 h-8 bg-red-500 rounded mr-3"></span>
                            {category.name}
                          </h2>
                          <Badge variant="outline" className="text-gray-600">
                            {category.count} bài viết
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                          {categoryPosts.slice(0, 4).map((post) => (
                            <Card
                              key={post.id}
                              className="hover:shadow-lg transition-all duration-300 overflow-hidden group"
                            >
                              <div className="aspect-video relative overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                  <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                      <BookOpen className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="text-blue-700 text-sm font-medium">{post.category}</p>
                                  </div>
                                </div>
                                <Badge className={`absolute top-3 left-3 ${getCategoryColor(post.category)}`}>
                                  {post.category}
                                </Badge>
                              </div>
                              <CardContent className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                                  {post.title}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                  <div className="flex items-center">
                                    <User className="w-4 h-4 mr-1" />
                                    {post.author}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {post.readTime}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                                    <div className="flex items-center">
                                      <Eye className="w-4 h-4 mr-1" />
                                      {post.views.toLocaleString()}
                                    </div>
                                    <div className="flex items-center">
                                      <Heart className="w-4 h-4 mr-1" />
                                      {post.likes}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm">
                                      <Bookmark className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Share2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                      <Link href={`/blog/${post.id}`}>Đọc thêm</Link>
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  })
              ) : (
                // Show specific category or search results
                <div>
                  <div ref={categoryRefs[activeCategory as keyof typeof categoryRefs]}>
                    {searchTerm === "" && (
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                          <span className="w-1 h-8 bg-red-500 rounded mr-3"></span>
                          {activeCategory}
                        </h2>
                        <Badge variant="outline" className="text-gray-600">
                          {postsToShow.length} bài viết
                        </Badge>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {postsToShow.map((post) => (
                        <Card
                          key={post.id}
                          className="hover:shadow-lg transition-all duration-300 overflow-hidden group"
                        >
                          <div className="aspect-video relative overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <BookOpen className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-blue-700 text-sm font-medium">{post.category}</p>
                              </div>
                            </div>
                            <Badge className={`absolute top-3 left-3 ${getCategoryColor(post.category)}`}>
                              {post.category}
                            </Badge>
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {post.author}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {post.readTime}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  {post.views.toLocaleString()}
                                </div>
                                <div className="flex items-center">
                                  <Heart className="w-4 h-4 mr-1" />
                                  {post.likes}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Bookmark className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/blog/${post.id}`}>Đọc thêm</Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {postsToShow.length === 0 && searchTerm !== "" && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                        <p className="text-gray-600 mb-4">Thử tìm kiếm với từ khóa khác hoặc xem tất cả bài viết</p>
                        <Button onClick={() => handleSearch("")}>Xem tất cả bài viết</Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Load More */}
              {postsToShow.length > 0 && searchTerm === "" && (
                <div className="text-center">
                  <Button variant="outline" size="lg">
                    Xem thêm bài viết
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <section className="mt-12 py-8 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white">
            <div className="container mx-auto text-center max-w-4xl">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/logo.webp"
                  alt="ScαrletBlood Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">Sẵn sàng hiến máu cứu người?</h3>
              <p className="text-red-100 mb-4">Hãy đăng ký ngay để trở thành người hùng thầm lặng cứu sinh mạng</p>
              <div className="flex justify-center">
                <Link
                  href="/donate"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors duration-200 min-w-[200px]"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Đăng ký hiến máu ngay
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
