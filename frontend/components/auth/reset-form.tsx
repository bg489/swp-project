"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Image from "next/image"
import api from "../../lib/axios";
import Link from "next/link"

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export function ResetForm({ onSuccess, redirectTo }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

      // Call API instead of direct function
      // const response = await api.post("/users/reset/email", {
      //     email: email
      //   });

      // const result = await response.data


      // if (result.message && result.token) {
      //   console.log(result)
      //   router.push(`/login/reset/new-password?token=${result.token}`)
      // } else {
      //   setError(result.message || "Đăng nhập thất bại")
      // }
  
      try {
      // Call API instead of direct function
        await api.post("/otp/send", {
          email: email
        })
        router.push(`/login/reset/otp?email=${email}`);
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại. Vui lòng nhập đúng mật khẩu, tài khoản.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full overflow-hidden mx-auto">
          <Image
            src="/images/logo.webp"
            alt="ScαrletBlood Logo"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">Reset Mật Khẩu</CardTitle>
          <CardDescription className="text-gray-600">Nhập email của bạn</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="admin@scarletblood.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Tìm kiếm...
              </div>
            ) : (
              "Tìm kiếm"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

