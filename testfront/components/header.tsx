"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Heart, LogOut, LayoutDashboard, Shield } from "lucide-react"
import Link from "next/link"
import { getCurrentUser, logout, setCurrentUser, type User } from "../lib/auth"
import { useRouter } from "next/navigation"

export function Header() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    setCurrentUserState(getCurrentUser())
  }, [])

  const handleLogout = async () => {
    await logout()
    setCurrentUser(null)
    setCurrentUserState(null)
    router.push("/")
  }

  const getDashboardLink = () => {
    if (!currentUser) return "/"
    return currentUser.role === "admin" ? "/admin/dashboard" : "/user/dashboard"
  }

  const getDashboardLabel = () => {
    if (!currentUser) return "Dashboard"
    return currentUser.role === "admin" ? "Quản trị" : "Dashboard"
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BloodConnect</h1>
              <p className="text-sm text-gray-600">Trung tâm Hiến máu Nhân đạo</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-red-600 transition-colors">
              Trang chủ
            </Link>
            <Link href="/donate" className="text-gray-700 hover:text-red-600 transition-colors">
              Hiến máu
            </Link>
            <Link href="/request" className="text-gray-700 hover:text-red-600 transition-colors">
              Cần máu
            </Link>
            <Link href="/emergency" className="text-gray-700 hover:text-red-600 transition-colors">
              Khẩn cấp
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-red-600 transition-colors">
              Blog
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            {currentUser ? (
              <>
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium">{currentUser.name}</p>
                        <div className="flex items-center space-x-1">
                          <Badge
                            variant="outline"
                            className={
                              currentUser.role === "admin"
                                ? "text-purple-600 border-purple-200"
                                : "text-blue-600 border-blue-200"
                            }
                          >
                            {currentUser.role === "admin" ? "Quản trị viên" : "Người hiến máu"}
                          </Badge>
                          {currentUser.bloodType && (
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              {currentUser.bloodType}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()}>
                        {currentUser.role === "admin" ? (
                          <Shield className="w-4 h-4 mr-2" />
                        ) : (
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                        )}
                        {getDashboardLabel()}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
