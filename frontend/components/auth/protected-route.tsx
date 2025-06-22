"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, type User } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "donor" | "recipient" | "staff" | "admin" | "user"
  redirectTo?: string
}

export function ProtectedRoute({ children, requiredRole, redirectTo = "/login" }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      router.push(redirectTo)
      return
    }

    // if (requiredRole && currentUser.role !== requiredRole) {
    //   // Redirect to appropriate dashboard based on role
    //   if (currentUser.role === "admin") {
    //     router.push("/admin/dashboard")
    //   } else {
    //     router.push("/user/dashboard")
    //   }
    //   return
    // }

    if (requiredRole) {
      if (
        (requiredRole === "user" && currentUser.role === "admin") ||
        (requiredRole !== "user" && currentUser.role !== requiredRole)
      ) {
        // Redirect to appropriate dashboard
        if (currentUser.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/user/dashboard")
        }
        return
      }
    }


    setUser(currentUser)
    setIsLoading(false)
  }, [router, requiredRole, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
