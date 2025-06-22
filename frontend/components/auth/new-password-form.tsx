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
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import api from "../../lib/axios";
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export function NewPasswordForm({ onSuccess, redirectTo }: LoginFormProps) {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [formData, setFormData] = useState({
      password: "",
      confirmPassword: "",
    })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      setIsLoading(false)
      return
    }

    try {
      // Call API instead of direct function
      const response = await api.post("/users/reset/email/confirm", {
          token: token,
          newPassword: formData.password
        });

      const result = await response.data


      if (result.message) {
        toast.success("Reset mật khẩu thành công")
        console.log(result)
        router.push("/login");
      } else {
        setError(result.message || "Đăng nhập thất bại")
      }
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
          <CardDescription className="text-gray-600">Hãy xác nhận mật khẩu</CardDescription>
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

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu mới *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Xác nhận...
              </div>
            ) : (
              "Xác nhận"
            )}
          </Button>
        </form>
      </CardContent>
      <Toaster position="top-center" containerStyle={{
        top: 80,
      }}/>
    </Card>
  )
}
