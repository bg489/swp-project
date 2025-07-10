"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, LogIn, UserPlus, Heart, Info } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface GuestAccessWarningProps {
  title?: string
  description?: string
  features?: string[]
}

export function GuestAccessWarning({
  title = "Yêu cầu đăng nhập",
  description = "Để sử dụng tính năng này, bạn cần đăng nhập hoặc tạo tài khoản mới",
  features = [],
}: GuestAccessWarningProps) {
  const pathname = usePathname()

  const getPageFeatures = (path: string) => {
    switch (path) {
      case "/donate":
        return [
          "Đăng ký hiến máu tình nguyện",
          "Theo dõi lịch sử hiến máu",
          "Nhận thông báo khi cần máu khẩn cấp",
          "Kết nối với cộng đồng hiến máu",
        ]
      case "/request":
        return [
          "Tìm kiếm người hiến máu phù hợp",
          "Kiểm tra tương thích nhóm máu",
          "Tra cứu thành phần máu",
          "Liên hệ trực tiếp với người hiến",
        ]
      case "/emergency":
        return [
          "Tạo yêu cầu máu khẩn cấp",
          "Theo dõi trạng thái yêu cầu",
          "Nhận hỗ trợ 24/7",
          "Kết nối nhanh với người hiến",
        ]
      default:
        return features
    }
  }

  const pageFeatures = getPageFeatures(pathname)

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-lg text-gray-600">{description}</p>
          </div>

          {/* Main Card */}
          <Card className="border-red-200 shadow-lg">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center text-red-800">
                <Heart className="w-5 h-5 mr-2" />
                Tại sao cần đăng nhập?
              </CardTitle>
              <CardDescription className="text-red-700">
                Để đảm bảo an toàn và chất lượng dịch vụ hiến máu
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Alert className="mb-6 border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Hệ thống yêu cầu xác thực để bảo vệ thông tin cá nhân và đảm bảo tính chính xác của dữ liệu y tế.
                </AlertDescription>
              </Alert>

              {/* Features List */}
              {pageFeatures.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Các tính năng bạn có thể sử dụng sau khi đăng nhập:
                  </h3>
                  <div className="grid gap-3">
                    {pageFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button asChild className="w-full bg-red-600 hover:bg-red-700 h-12">
                  <Link href={`/login?redirectTo=${encodeURIComponent(pathname)}`}>
                    <LogIn className="w-5 h-5 mr-2" />
                    Đăng nhập ngay
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full h-12 bg-transparent">
                  <Link href={`/register?redirectTo=${encodeURIComponent(pathname)}`}>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Tạo tài khoản mới
                  </Link>
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Đăng ký miễn phí và nhanh chóng</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Chỉ mất 2 phút để tạo tài khoản</li>
                  <li>• Thông tin được bảo mật tuyệt đối</li>
                  <li>• Không có phí sử dụng</li>
                  <li>• Hỗ trợ 24/7</li>
                </ul>
              </div>

              {/* Back to Home */}
              <div className="text-center mt-6">
                <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
                  ← Quay về trang chủ
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
