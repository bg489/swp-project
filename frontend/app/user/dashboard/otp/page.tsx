"use client"

import { OTPVerifyForm } from "@/components/auth/update-password-otp-verification"
import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-md">
          {message && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{decodeURIComponent(message)}</AlertDescription>
            </Alert>
          )}

          <OTPVerifyForm/>
        </div>
      </div>

      <Footer />
    </div>
  )
}
