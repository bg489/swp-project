"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, LayoutDashboard, LogOut, Menu, Shield, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  /* ---------- Helpers ---------- */
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const getDashboardLink = () => (user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard")

  const getDashboardLabel = () => (user?.role === "admin" ? "Quản trị" : "Dashboard")

  /* ---------- Navigation data ---------- */
  const publicPages = [
    { href: "/", label: "Trang chủ" },
    { href: "/guide", label: "Hướng dẫn" },
    { href: "/qna", label: "Hỏi đáp" },
    { href: "/blog", label: "Blog" },
  ]

  const protectedPages = [
    { href: "/donate", label: "Hiến máu" },
    { href: "/request", label: "Cần máu" },
    { href: "/emergency", label: "Khẩn cấp" },
  ]

  /* Create ordered menu: Trang chủ + protected (if logged) + rest public */
  const desktopMenu = [publicPages[0], ...(user ? protectedPages : []), ...publicPages.slice(1)]

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* ------------ Logo ------------- */}
        <Link href="/" onClick={scrollTop} className="flex items-center space-x-2 group">
          <div className="h-8 w-8 overflow-hidden rounded-full transition-transform duration-200 group-hover:scale-110">
            <Image
              src="/images/logo.webp"
              alt="ScαrletBlood Logo"
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-lg font-bold text-gray-900 transition-colors duration-200 group-hover:text-red-600">
            ScαrletBlood
          </span>
        </Link>

        {/* ---------- Desktop nav ---------- */}
        <nav className="hidden items-center space-x-1 md:flex">
          {desktopMenu.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={scrollTop}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                isActive(href) ? "bg-red-600 text-white shadow-sm" : "text-gray-700 hover:bg-red-50 hover:text-red-600"
              } ${href === "/emergency" && user ? "font-semibold" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ---------- User area (desktop) ---------- */}
        <div className="hidden items-center space-x-2 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-9 items-center space-x-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600">
                    <Heart className="h-4 w-4 text-white" />
                  </span>
                  <span className="text-sm font-medium">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()}>
                    {user.role === "admin" ? (
                      <Shield className="mr-2 h-4 w-4" />
                    ) : (
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                    )}
                    {getDashboardLabel()}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button size="sm" className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="/register">Đăng ký</Link>
              </Button>
            </>
          )}
        </div>

        {/* ---------- Mobile burger ---------- */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ---------- Mobile menu ---------- */}
      {mobileOpen && (
        <div className="border-t border-gray-200 pb-3 md:hidden">
          <div className="space-y-1 pt-3">
            {desktopMenu.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => {
                  setMobileOpen(false)
                  scrollTop()
                }}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(href) ? "bg-red-600 text-white" : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                } ${href === "/emergency" && user ? "font-semibold" : ""}`}
              >
                {label}
              </Link>
            ))}

            {!user && (
              <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
                <p className="text-sm font-medium text-blue-800">Đăng nhập để truy cập đầy đủ tính năng</p>
                <p className="mt-1 text-xs text-blue-600">Hiến máu • Cần máu • Khẩn cấp</p>
              </div>
            )}

            {/* Mobile user block */}
            <div className="space-y-1 border-t border-gray-200 pt-3">
              {user ? (
                <>
                  <div className="rounded-lg bg-gray-50 px-3 py-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => {
                      setMobileOpen(false)
                      scrollTop()
                    }}
                    className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {getDashboardLabel()}
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMobileOpen(false)
                    }}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => {
                      setMobileOpen(false)
                      scrollTop()
                    }}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => {
                      setMobileOpen(false)
                      scrollTop()
                    }}
                    className="block rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
