"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "user" | "admin" | "staff"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push("/login")
        return
      }

      if (requiredRole && user.role !== requiredRole) {
        // Wrong role, redirect to appropriate dashboard
        switch (user.role) {
          case "admin":
            router.push("/admin/dashboard")
            break
          case "staff":
            router.push("/staff/dashboard")
            break
          case "user":
          default:
            router.push("/user/dashboard")
            break
        }
        return
      }
    }
  }, [user, isLoading, requiredRole, router])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  // Don't render if not authenticated or wrong role
  if (!user || (requiredRole && user.role !== requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
