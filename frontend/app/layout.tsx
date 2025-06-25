import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ScαrletBlood - Hệ thống quản lý hiến máu",
  description: "Kết nối người hiến máu và người cần máu một cách nhanh chóng, an toàn và hiệu quả",
  generator: "v0.dev"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        {/* ✅ Uploadcare Widget Styles */}
        <link
          rel="stylesheet"
          href="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.css"
        />
      </head>
      <body className={inter.className}>
        {/* ✅ Uploadcare Widget Script */}
        <Script
          src="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js"
          strategy="beforeInteractive"
        />
        {/* ✅ Google Maps JavaScript API */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBc5ttNvh_OwNs1JimroHz0qAaHukdkpHg&libraries=places`}
          strategy="beforeInteractive"
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
