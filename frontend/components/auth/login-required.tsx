"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Lock, UserPlus, LogIn } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface LoginRequiredProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function LoginRequired({ children, title, description }: LoginRequiredProps) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">{title || "Yêu cầu đăng nhập"}</CardTitle>
            <CardDescription className="text-gray-600">
              {description || "Bạn cần đăng nhập để truy cập tính năng này"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Tại sao cần đăng nhập?</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Để đảm bảo an toàn và theo dõi các hoạt động hiến máu, chúng tôi yêu cầu người dùng đăng nhập trước
                    khi sử dụng các tính năng chính.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <Link href={`/login?redirectTo=${pathname}`}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Đăng nhập ngay
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href={`/register?redirectTo=${pathname}`}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Tạo tài khoản mới
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                ← Quay về trang chủ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
