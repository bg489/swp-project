"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Footer() {
  const { user } = useAuth()

  return (
    <footer className="relative bg-gray-900 text-white py-12 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src="/images/logo.webp"
                  alt="ScαrletBlood Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold">ScαrletBlood</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Kết nối trái tim, cứu sống sinh mạng. Hệ thống quản lý hiến máu hiện đại và an toàn.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Dịch vụ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/donate" className="hover:text-white transition-colors">
                  Đăng ký hiến máu
                </Link>
              </li>
              <li>
                <Link href="/request" className="hover:text-white transition-colors">
                  Tìm người hiến máu
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="hover:text-white transition-colors">
                  Yêu cầu khẩn cấp
                </Link>
              </li>
              {user && (
                <li>
                  <Link
                    href={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Thông tin</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-red-500" />
                <span className="text-sm">1900-1234</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-red-500" />
                <span className="text-sm">admin@scarletblood.vn</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                <span className="text-sm">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p className="text-sm">&copy; 2024 ScαrletBlood. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
