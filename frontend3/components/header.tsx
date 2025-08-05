"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Heart, LogOut, LayoutDashboard, Shield, Menu, X } from "lucide-react"
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

  const handleRole = (role: string) => {
    if (role === "admin") {
      return "Quản trị viên"
    } else if (role === "donor") {
      return "Người hiến máu"
    } else if (role === "recipient") {
      return "Người nhận máu"
    } else if (role === "staff") {
      return "Nhân viên"
    } else {
      return "Vô danh"
    }
  }
  const findDashboardByRole = (role: string) => {
    if (role === "admin")
      return "/admin/dashboard"
    else if ((role === "donor") || (role === "recipient"))
      return "/user/dashboard"
    else {
      return "/staff/dashboard"
    }
  }

  const getDashboardLink = () => {
    if (!user) return "/"
    return findDashboardByRole(user.role)
  }

  const getDashboardLabel = () => {
    if (!user) return "Dashboard"
    return user.role === "admin" ? "Quản trị" : "Dashboard"
  }

  const getNavigationItems = () => {
    if (!user) {
      return [
        { href: "/", label: "Trang chủ" },
        { href: "/blog", label: "Blog" },
        { href: "/qna", label: "Hỏi đáp" },
        { href: "/guide", label: "Hướng dẫn" },
      ]
    } else if (user.role === "donor") {
      return [
        { href: "/", label: "Trang chủ" },
        { href: "/donate", label: "Hiến máu" },
        { href: "/blog", label: "Blog" },
        { href: "/history-donor-requests", label: "Lịch sử" },
        { href: "/qna", label: "Hỏi đáp" },
        { href: "/guide", label: "Hướng dẫn" },
      ]
    } else if (user.role === "recipient") {
      return [
        { href: "/", label: "Trang chủ" },
        { href: "/reqdonation", label: "Yêu cầu máu" },
        { href: "/blog", label: "Blog" },
        { href: "/history-recip", label: "Lịch sử" },
        { href: "/qna", label: "Hỏi đáp" },
        { href: "/guide", label: "Hướng dẫn" },
      ]
    } else if (user.role === "staff") {
      return [
        { href: "/", label: "Trang chủ" },
        { href: "/staff/dashboard", label: "Quản Lý Máu" },
        { href: "/blog", label: "Blog" },
        { href: "/qna", label: "Hỏi đáp" },
        { href: "/guide", label: "Hướng dẫn" },
      ]
    } else if (user.role === "admin") {
      return [
        { href: "/", label: "Trang chủ" },
        { href: "/admin/dashboard", label: "Quản trị" },
        { href: "/blog", label: "Blog" },
        { href: "/qna", label: "Hỏi đáp" },
        { href: "/guide", label: "Hướng dẫn" },
      ]
    }
  }

  const navigationItems = getNavigationItems();

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
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${item.href === "/donate" ? "bg-blue-600 text-white" : ""} ${item.href === "/reqdonation" ? "bg-green-600 text-white" : ""} ${item.href === "/staff/dashboard" ? "bg-yellow-600 text-white" : ""} ${item.href === "/admin/dashboard" ? "bg-black text-white" : ""}
                  ${isActivePath(item.href)
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
                  <Button variant="ghost" className="flex items-center space-x-2 h-9">
                    <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{handleRole(user.role)}: {user.full_name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()}>
                      {user.role === "admin" ? (
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
                    block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${item.href === "/donate" ? "bg-blue-50 text-blue-600" : ""} ${item.href === "/reqdonation" ? "bg-green-600 text-white" : ""} ${item.href === "/staff/dashboard" ? "bg-yellow-600 text-white" : ""} ${item.href === "/admin/dashboard" ? "bg-black text-white" : ""}
                    ${isActivePath(item.href)
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
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">{user.full_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        scrollToTop()
                      }}
                      className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      {getDashboardLabel()}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
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
