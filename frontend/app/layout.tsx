import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ScαrletBlood - Hệ thống quản lý hiến máu",
  description: "Kết nối người hiến máu và người cần máu một cách nhanh chóng, an toàn và hiệu quả",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        {/* 🚩 Uploadcare Widget Styles - Tông đỏ sang trọng */}
        <link
          rel="stylesheet"
          href="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.css"
        />
        {/* 🧩 Uploadcare Widget Script (JS) */}
        <script
          src="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js"
          defer
        ></script>
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}