"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import api from "../../lib/axios"
import toast, { Toaster } from "react-hot-toast"

export function OTPVerifyForm() {
  const [timeLeft, setTimeLeft] = useState(600); // 600 giây = 10 phút

  

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [otp, setOtp] = useState(Array(6).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleResendOTP = async () => {
    try {
      setIsLoading(true)
      setError("")
      const res = await api.post("/otp/send", { email })

      toast.success("Đã gửi lại mã OTP mới!")
      const { expiresAt } = res.data || {}

      const newTime = expiresAt
        ? Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
        : 600 // fallback

      setTimeLeft(newTime > 0 ? newTime : 600)
      setOtp(Array(6).fill(""))
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      setError("Không thể gửi lại OTP. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    const fetchOTPInfo = async () => {
      try {
        const res = await api.get(`/otp/status?email=${email}`)
        const { expiresAt } = res.data;

        const timeRemaining = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
        setTimeLeft(timeRemaining > 0 ? timeRemaining : 0);
      } catch (error) {
        console.error("Failed to fetch OTP expiration time:", error);
        setTimeLeft(0); // fallback if something went wrong
      }
    };

    fetchOTPInfo();
  }, [email]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);


  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const fullOTP = otp.join("")

    if (fullOTP.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 chữ số")
      setIsLoading(false)
      return
    }
    try {
      const response = await api.post("/otp/verify", {
        email,
        otp: fullOTP,
      })

      const result = response.data

      if(result.message){
        toast.success("Nhập otp thành công!")
        const response = await api.post("/users/reset/email", {
            email: email
          });

        const result = await response.data


        if (result.message && result.token) {
          console.log(result)
          router.push(`/login/reset/new-password?token=${result.token}`)
        } else {
          setError(result.message || "Đăng nhập thất bại")
        }
      }

    } catch (err: any) {
      setError(err?.response?.data?.message || "Xác minh OTP thất bại.")
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full overflow-hidden mx-auto">
          <Image src="/images/logo.webp" alt="ScαrletBlood Logo" width={64} height={64} className="w-full h-full object-cover" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">Xác minh OTP</CardTitle>
          <CardDescription className="text-gray-600">Nhập mã gồm 6 chữ số được gửi qua email</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => void (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={timeLeft <= 0}
                required
              />
            ))}
          </div>


            <p className="text-sm text-gray-600 text-center">
              Mã OTP sẽ hết hạn sau: <span className="font-semibold text-red-600">{formatTime(timeLeft)}</span>
            </p>


            <Button
              type="button"
              onClick={handleResendOTP}
              disabled={isLoading}
              className="w-full border border-red-500 bg-white text-red-500 hover:bg-red-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
                  Đang gửi lại...
                </div>
              ) : (
                "Gửi lại OTP"
              )}
            </Button>


          <Button type="submit" className="w-full" disabled={isLoading || (timeLeft <= 0)}>
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xác minh...
              </div>
            ) : (
              "Xác minh"
            )}
          </Button>
        </form>
      </CardContent>
      <Toaster position="top-center" containerStyle={{ top: 80 }} />
    </Card>
  )
}
