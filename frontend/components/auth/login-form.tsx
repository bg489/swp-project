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
import toast, { Toaster } from "react-hot-toast"
import ReCAPTCHA from "react-google-recaptcha"

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export function LoginForm({ onSuccess, redirectTo }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [capVal, setCapVal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { setUser } = useAuth()

  const handleResendOTP = async () => {
    setIsLoading(true)
    router.push("/login/otp")
    setIsLoading(false)
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Call API instead of direct function
      const response = await api.post("/users/login", {
          email: formData.email,
          password: formData.password
        });

      const result = await response.data


      if (result.message && result.user) {
        console.log(result)
        if(!result.user.user.is_verified){
          setError("Tài khoản chưa được xác minh, Hãy xác minh tài khoản!");
          return;
        }
        setUser(result.user.user)
        toast.success("Chào mừng, " + result.user.user.full_name)
        if (onSuccess) {
          router.push(redirectTo || "/");
        } else {
          // Always redirect to home page after login
          router.push(redirectTo || "/login")
        }
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
          <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
          <CardDescription className="text-gray-600">Đăng nhập vào hệ thống ScαrletBlood</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-2">
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
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
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
            {/* <ReCAPTCHA
              sitekey="6Le19mkrAAAAAKWFaDg-rfWGbuBAGxpt5m5yoXDd"
              onChange={(val: boolean | ((prevState: boolean) => boolean)) => setCapVal(val)}
            /> */}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang đăng nhập...
              </div>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>
        <div className="space-y-2">
          <Button
            type="button"
            onClick={handleResendOTP}
            disabled={isLoading}
            className="w-full border border-red-500 bg-white text-red-500 hover:bg-red-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
                Đang chuẩn bị...
              </div>
            ) : (
              "Xác minh tài khoản"
            )}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-800">Tài khoản demo:</h4>
          <div className="text-sm space-y-1">
            <p className="text-gray-600">
              <strong>Admin:</strong> admin@scarletblood.vn / 123456
            </p>
            <p className="text-gray-600">
              <strong>Donor:</strong> donor@example.com / 123456
            </p>
            <p className="text-gray-600">
              <strong>Recipient:</strong> recipient@example.com / 123456
            </p>
            <p className="text-gray-600">
              <strong>Staff:</strong> staff@example.com / 123456
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Bạn quên mật khẩu?{" "}
            <Link href="/login/reset" className="text-red-600 hover:underline font-medium">
              Lấy lại mật khẩu
            </Link>
          </p>
        </div>
      </CardContent>
      <Toaster position="top-center" containerStyle={{
              top: 80,
            }}/>
    </Card>
  )
}
