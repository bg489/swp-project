"use client"

import { LoginForm } from "@/components/auth/login-form"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import MapboxMap from "@/components/ui/MapboxMap"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col">
        <Header />

        <MapboxMap/>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
