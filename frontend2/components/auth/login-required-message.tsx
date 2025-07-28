"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface LoginRequiredMessageProps {
  title?: string
  description?: string
  redirectTo?: string
}

export function LoginRequiredMessage({
  title = "Yêu cầu đăng nhập",
  description = "Bạn cần đăng nhập để truy cập tính năng này",
  redirectTo,
}: LoginRequiredMessageProps) {
  const router = useRouter()

  const currentPath = redirectTo || (typeof window !== "undefined" ? window.location.pathname : "/")

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">{title}</CardTitle>
          <CardDescription className="text-gray-600">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button asChild className="w-full bg-red-600 hover:bg-red-700">
              <Link href={`/login?redirectTo=${encodeURIComponent(currentPath)}`}>
                <LogIn className="w-4 h-4 mr-2" />
                Đăng nhập
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href={`/register?redirectTo=${encodeURIComponent(currentPath)}`}>
                <UserPlus className="w-4 h-4 mr-2" />
                Đăng ký tài khoản
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-500 hover:text-gray-700">
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
