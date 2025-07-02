"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole: "admin" | "user" | "staff"
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/login?redirectTo=${router.asPath}`)
      } else if (requiredRole === "admin" && user.role !== "admin") {
        router.push("/")
      } else if (requiredRole === "staff" && user.role !== "staff" && user.role !== "admin") {
        router.push("/")
      } else if (requiredRole === "user" && user.role !== "user" && user.role !== "admin" && user.role !== "staff") {
        router.push("/")
      }
    }
  }, [user, isLoading, router, requiredRole])

  if (isLoading || !user) {
    return <div>Loading...</div>
  }

  if (requiredRole === "admin" && user.role !== "admin") {
    return null // Or render a "Unauthorized" component
  }

  if (requiredRole === "staff" && user.role !== "staff" && user.role !== "admin") {
    return null
  }

  if (requiredRole === "user" && user.role !== "user" && user.role !== "admin" && user.role !== "staff") {
    return null
  }

  return <>{children}</>
}
