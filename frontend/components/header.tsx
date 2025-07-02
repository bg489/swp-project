"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, LogOut, LayoutDashboard, Shield, Menu, X, ClipboardList } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
  }

  const getDashboardLink = () => {
    if (!user) return "/"

    // Force role-specific dashboard routing
    switch (user.role) {
      case "admin":
        return "/admin/dashboard"
      case "staff":
        return "/staff/dashboard"
      case "user":
      default:
        return "/user/dashboard"
    }
  }

  const getDashboardLabel = () => {
    if (!user) return "Dashboard"

    switch (user.role) {
      case "admin":
        return "Bảng điều khiển Admin"
      case "staff":
        return "Bảng điều khiển Staff"
      case "user":
      default:
        return "Bảng điều khiển"
    }
  }

  const getDashboardIcon = () => {
    if (!user) return LayoutDashboard

    switch (user.role) {
      case "admin":
        return Shield
      case "staff":
        return ClipboardList
      case "user":
      default:
        return LayoutDashboard
    }
  }

  const getRoleDisplayName = () => {
    if (!user) return ""

    switch (user.role) {
      case "admin":
        return "Quản trị viên"
      case "staff":
        return "Nhân viên"
      case "user":
      default:
        return "Người hiến máu"
    }
  }

  const getRoleBadgeColor = () => {
    if (!user) return "bg-gray-100 text-gray-800"

    switch (user.role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "staff":
        return "bg-blue-100 text-blue-800"
      case "user":
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const navigationItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/donate", label: "Hiến máu" },
    { href: "/request", label: "Cần máu" },
    { href: "/emergency", label: "Khẩn cấp" },
    { href: "/guide", label: "Hướng dẫn" },
    { href: "/qna", label: "Hỏi đáp" },
    { href: "/blog", label: "Blog" },
  ]

  const isActivePath = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Compact */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-200">
              <Image
                src="/images/logo.webp"
                alt="ScαrletBlood Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                ScαrletBlood
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation - Compact */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={scrollToTop}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActivePath(item.href)
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* User Menu - Compact */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 h-auto py-2 px-3">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                          {getRoleDisplayName()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-3 border-b">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                      {getRoleDisplayName()}
                    </div>
                  </div>
                  <div className="py-1">
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()} className="flex items-center px-3 py-2">
                        {(() => {
                          const IconComponent = getDashboardIcon()
                          return <IconComponent className="w-4 h-4 mr-3" />
                        })()}
                        <div>
                          <div className="text-sm font-medium">{getDashboardLabel()}</div>
                          <div className="text-xs text-gray-500">Quản lý tài khoản của bạn</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <div className="border-t py-1">
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 px-3 py-2">
                      <LogOut className="w-4 h-4 mr-3" />
                      <div>
                        <div className="text-sm font-medium">Đăng xuất</div>
                        <div className="text-xs text-gray-500">Thoát khỏi tài khoản</div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-gray-200">
            <div className="pt-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    scrollToTop()
                  }}
                  className={`
                    block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${
                      isActivePath(item.href)
                        ? "bg-red-600 text-white"
                        : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile User Actions */}
              <div className="pt-3 border-t border-gray-200 space-y-1">
                {user ? (
                  <>
                    <div className="px-3 py-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                        {getRoleDisplayName()}
                      </div>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        scrollToTop()
                      }}
                      className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-50 rounded-lg"
                    >
                      {(() => {
                        const IconComponent = getDashboardIcon()
                        return <IconComponent className="w-4 h-4 mr-3" />
                      })()}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{getDashboardLabel()}</div>
                        <div className="text-xs text-gray-500">Quản lý tài khoản của bạn</div>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      <div>
                        <div className="text-sm font-medium">Đăng xuất</div>
                        <div className="text-xs text-gray-500">Thoát khỏi tài khoản</div>
                      </div>
                    </button>
                  </>
                ) : (
                  <div className="space-y-1">
                    <Link
                      href="/login"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        scrollToTop()
                      }}
                      className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        scrollToTop()
                      }}
                      className="block px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg"
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
