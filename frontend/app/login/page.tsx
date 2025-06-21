"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Button from "@/components/ui/button"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid Credentials")
        return
      }

      router.replace("/dashboard")
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center">Đăng nhập</h2>
        <LoginForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          error={error}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

interface LoginFormProps {
  formData: { email: string; password: string }
  setFormData: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>
  handleSubmit: (e: React.FormEvent) => Promise<void>
  error: string | null
  isLoading: boolean
}

const LoginForm: React.FC<LoginFormProps> = ({ formData, setFormData, handleSubmit, error, isLoading }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="form-label">Email</label>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          className="form-input"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label className="form-label">Mật khẩu</label>
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={formData.password}
          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
          className="form-input"
          disabled={isLoading}
          required
        />
      </div>

      {error && <div className="form-error">{error}</div>}

      <Button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Đang đăng nhập...
          </div>
        ) : (
          "Đăng nhập"
        )}
      </Button>
    </form>
  )
}
