"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Heart, LogOut, LayoutDashboard, Shield, Menu, X, BookOpen, ChevronDown } from "lucide-react"
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

  // Các trang công khai (ai cũng có thể xem)
  const publicPages = [
    { href: "/", label: "Trang chủ" },
  ]

  // Các trang thông tin (Guide, Q&A, Blog)
  const infoPages = [
    { href: "/guide", label: "Hướng dẫn" },
    { href: "/qna", label: "Hỏi đáp" },
    { href: "/blog", label: "Blog" },
  ]

  // Các trang yêu cầu đăng nhập - phân quyền theo role
  const getProtectedPagesByRole = () => {
    if (!user) return []
    
    switch (user.role) {
      case "donor":
        return [
          { href: "/donate", label: "Hiến máu" },
          { href: "/history-donor-requests", label: "Lịch sử yêu cầu" },
        ]
      case "recipient":
        return [
          { href: "/blood-request", label: "Yêu cầu máu" },
          { href: "/history-recip", label: "Lịch sử nhận máu" },
        ]
      case "admin":
      case "staff":
        return [
          // Admin và staff không cần hiển thị trang hiến máu và yêu cầu máu
          // Họ chỉ cần trang dashboard riêng để quản lý
        ]
      default:
        return []
    }
  }

  const protectedPages = getProtectedPagesByRole()

  // Navigation items cho mobile menu
  const mobileNavigationItems = user ? [...publicPages, ...infoPages, ...protectedPages] : [...publicPages, ...infoPages]

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
    <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between h-12">
          {/* Logo - Enhanced */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Image
                src="/images/logo.webp"
                alt="ScαrletBlood Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                ScαrletBlood
              </h1>
              <span className="text-xs text-gray-500 leading-none">Kết nối trái tim</span>
            </div>
          </Link>

          {/* Desktop Navigation - Enhanced */}
          <nav className="hidden md:flex items-center space-x-2">
            {/* Trang chủ */}
            <Link
              href="/"
              onClick={scrollToTop}
              className={`
                px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative
                ${isActivePath("/")
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "text-gray-700 hover:text-red-600 hover:bg-red-50 hover:shadow-md"
                }
              `}
            >
              <span className="relative z-10">Trang chủ</span>
            </Link>

            {/* Hiển thị 3 trang thông tin riêng biệt cho guest */}
            {!user && infoPages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={scrollToTop}
                className={`
                  px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative
                  ${isActivePath(item.href)
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50 hover:shadow-md"
                  }
                `}
              >
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}

            {/* Các trang protected khi đã đăng nhập - phân quyền theo role */}
            {user && protectedPages.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={scrollToTop}
                className={`
                  px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative
                  ${isActivePath(item.href)
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50 hover:shadow-md"
                  }
                `}
              >
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}

            {/* Dropdown menu cho thông tin khi đã đăng nhập */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`
                      px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 relative
                      ${(isActivePath("/guide") || isActivePath("/qna") || isActivePath("/blog"))
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                        : "text-gray-700 hover:text-red-600 hover:bg-red-50 hover:shadow-md"
                      }
                    `}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="relative z-10">Thông tin</span>
                    <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44 mt-2 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                  {infoPages.map((infoItem) => (
                    <DropdownMenuItem key={infoItem.href} asChild>
                      <Link
                        href={infoItem.href}
                        onClick={scrollToTop}
                        className="w-full px-4 py-3 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        {infoItem.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile Menu Button - Enhanced */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 rounded-xl hover:bg-red-50 transition-all duration-300 relative group"
          >
            {isMobileMenuOpen ? 
              <X className="w-5 h-5 text-gray-700 group-hover:text-red-600 transition-colors duration-200" /> : 
              <Menu className="w-5 h-5 text-gray-700 group-hover:text-red-600 transition-colors duration-200" />
            }
          </button>

          {/* User Menu - Enhanced */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 h-auto px-4 py-2.5 rounded-xl hover:bg-red-50 transition-all duration-300 group">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-gray-500">{handleRole(user.role)}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-red-600 font-medium mt-1">{handleRole(user.role)}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200">
                      {user.role === "admin" ? (
                        <Shield className="w-4 h-4 mr-3" />
                      ) : (
                        <LayoutDashboard className="w-4 h-4 mr-3" />
                      )}
                      {getDashboardLabel()}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                    <LogOut className="w-4 h-4 mr-3" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" asChild className="px-6 py-2.5 rounded-xl border-gray-300 hover:border-red-300 hover:text-red-600 transition-all duration-300">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" asChild className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-200 transition-all duration-300">
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu - Enhanced */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 bg-gray-50/50 rounded-xl mx-2">
            <div className="pt-4 space-y-2 px-3">
              {mobileNavigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    scrollToTop()
                  }}
                  className={`
                    block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                    ${isActivePath(item.href)
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                      : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}

              {/* Thông báo cho guest về các tính năng bị khóa */}
              {!user && (
                <div className="mt-4 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3">
                  <p className="text-sm font-medium text-blue-800">🔐 Đăng nhập để truy cập đầy đủ tính năng</p>
                  <p className="mt-1 text-xs text-blue-600">Hiến máu • Cần máu • Yêu cầu máu • Khẩn cấp • Lịch sử</p>
                </div>
              )}

              {/* Mobile User Actions - Enhanced */}
              <div className="pt-4 border-t border-gray-200 space-y-3 mt-4">
                {user ? (
                  <>
                    <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-red-600 font-medium mt-1">{handleRole(user.role)}</p>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        scrollToTop()
                      }}
                      className="flex items-center px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-3" />
                      {getDashboardLabel()}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl w-full text-left transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        scrollToTop()
                      }}
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl border border-gray-300 text-center transition-all duration-300"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        scrollToTop()
                      }}
                      className="block px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-center shadow-lg transition-all duration-300"
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
