"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoginRequiredMessage } from "./login-required-message"

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
        router.push(`/login?redirectTo=${window.location.pathname}`)
      } else if (requiredRole === "admin" && user.role !== "admin") {
        router.push("/")
      } else if (requiredRole === "staff" && user.role !== "staff" && user.role !== "admin") {
        router.push("/")
      } else if (requiredRole === "user" && user.role !== "user" && user.role !== "admin" && user.role !== "staff") {
        router.push("/")
      }
    }
  }, [user, isLoading, router, requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    )
  }

  if (!isLoading && !user) {
    return <LoginRequiredMessage />
  }

  if (requiredRole === "admin" && user.role !== "admin") {
    return (
      <LoginRequiredMessage
        title="Không có quyền truy cập"
        description="Bạn không có quyền truy cập vào trang này. Chỉ admin mới có thể truy cập."
      />
    )
  }

  if (requiredRole === "staff" && user.role !== "staff" && user.role !== "admin") {
    return (
      <LoginRequiredMessage
        title="Không có quyền truy cập"
        description="Bạn không có quyền truy cập vào trang này. Chỉ nhân viên và admin mới có thể truy cập."
      />
    )
  }

  if (requiredRole === "user" && user.role !== "user" && user.role !== "admin" && user.role !== "staff") {
    return (
      <LoginRequiredMessage
        title="Không có quyền truy cập"
        description="Bạn cần đăng nhập với tài khoản người dùng để truy cập tính năng này."
      />
    )
  }

  return <>{children}</>
}
