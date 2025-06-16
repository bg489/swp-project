"use client"

import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span>BloodConnect</span>
          </Link>
        </div>

        {message && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{decodeURIComponent(message)}</AlertDescription>
          </Alert>
        )}

        <LoginForm redirectTo="/?login=success" />

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-red-600 hover:underline font-medium">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-red-600">
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
