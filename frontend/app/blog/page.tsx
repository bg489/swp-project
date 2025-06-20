import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, ArrowRight, Droplets, Shield, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function BlogPage() {
  const featuredPost = {
    id: 1,
    title: "10 Điều cần biết trước khi hiến máu lần đầu",
    excerpt: "Hướng dẫn chi tiết cho người hiến máu lần đầu, từ chuẩn bị trước khi hiến đến chăm sóc sau hiến máu.",
    author: "BS. Nguyễn Văn A",
    date: "15/12/2024",
    readTime: "5 phút đọc",
    category: "Hướng dẫn",
    featured: true,
  }

  const blogPosts = [
    {
      id: 2,
      title: "Tầm quan trọng của việc hiến máu định kỳ",
      excerpt:
        "Hiến máu định kỳ không chỉ giúp cứu sống người khác mà còn mang lại nhiều lợi ích cho sức khỏe của bạn.",
      author: "BS. Trần Thị B",
      date: "12/12/2024",
      readTime: "4 phút đọc",
      category: "Sức khỏe",
    },
    {
      id: 3,
      title: "Các nhóm máu hiếm và thách thức trong hiến máu",
      excerpt: "Tìm hiểu về các nhóm máu hiếm gặp và những khó khăn trong việc tìm kiếm người hiến máu phù hợp.",
      author: "TS. Lê Văn C",
      date: "10/12/2024",
      readTime: "6 phút đọc",
      category: "Kiến thức",
    },
    {
      id: 4,
      title: "Chế độ dinh dưỡng sau khi hiến máu",
      excerpt: "Hướng dẫn chế độ ăn uống và nghỉ ngơi phù hợp để phục hồi nhanh chóng sau khi hiến máu.",
      author: "Dinh dưỡng viên Phạm Thị D",
      date: "08/12/2024",
      readTime: "3 phút đọc",
      category: "Dinh dưỡng",
    },
    {
      id: 5,
      title: "Câu chuyện cảm động từ những người được cứu sống",
      excerpt: "Những câu chuyện thật về cuộc sống được cứu nhờ sự hào hiệp của các nhà hảo tâm hiến máu.",
      author: "Biên tập viên",
      date: "05/12/2024",
      readTime: "7 phút đọc",
      category: "Câu chuyện",
    },
    {
      id: 6,
      title: "Công nghệ mới trong bảo quản và xử lý máu",
      excerpt: "Những tiến bộ công nghệ giúp cải thiện chất lượng bảo quản máu và tăng hiệu quả sử dụng.",
      author: "KS. Hoàng Văn E",
      date: "03/12/2024",
      readTime: "5 phút đọc",
      category: "Công nghệ",
    },
  ]

  const categories = [
    { name: "Tất cả", count: 25, active: true },
    { name: "Hướng dẫn", count: 8, active: false },
    { name: "Sức khỏe", count: 6, active: false },
    { name: "Kiến thức", count: 5, active: false },
    { name: "Câu chuyện", count: 4, active: false },
    { name: "Công nghệ", count: 2, active: false },
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      "Hướng dẫn": "bg-blue-100 text-blue-800",
      "Sức khỏe": "bg-green-100 text-green-800",
      "Kiến thức": "bg-purple-100 text-purple-800",
      "Câu chuyện": "bg-pink-100 text-pink-800",
      "Dinh dưỡng": "bg-orange-100 text-orange-800",
      "Công nghệ": "bg-gray-100 text-gray-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <Badge className="mb-4 bg-red-100 text-red-800">📚 Kiến thức & Chia sẻ kinh nghiệm</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Blog hiến máu</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chia sẻ kiến thức, kinh nghiệm và những câu chuyện cảm động về hiến máu nhân đạo
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Featured Post */}
              <Card className="overflow-hidden border-red-200">
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
                    <Badge className={`mb-3 ${getCategoryColor(featuredPost.category)}`}>{featuredPost.category}</Badge>
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
                    <Button asChild>
                      <Link href={`/blog/${featuredPost.id}`}>
                        Đọc tiếp
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Blog Posts Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-video relative">
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
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
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
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
                        <span className="text-sm text-gray-500">{post.date}</span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/blog/${post.id}`}>Đọc thêm</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center">
                <Button variant="outline" size="lg">
                  Xem thêm bài viết
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Danh mục</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                          category.active ? "bg-red-100 text-red-800" : "hover:bg-gray-100"
                        }`}
                      >
                        <span>{category.name}</span>
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
                    Thông tin nhanh
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
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src="/images/logo.webp"
                      alt="ScαrletBlood Logo"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Sẵn sàng hiến máu?</h3>
                  <p className="text-red-100 mb-4">Hãy đăng ký ngay để trở thành người hùng cứu sinh mạng</p>
                  <Button variant="secondary" className="w-full" asChild>
                    <Link href="/donate">Đăng ký hiến máu</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-6 text-center">
                  <Shield className="w-10 h-10 mx-auto mb-3 text-orange-600" />
                  <h3 className="font-semibold text-orange-800 mb-2">Trường hợp khẩn cấp</h3>
                  <p className="text-sm text-orange-700 mb-3">Liên hệ ngay hotline 24/7</p>
                  <Button
                    variant="outline"
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                    asChild
                  >
                    <Link href="/emergency">Gọi 1900-1234</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
