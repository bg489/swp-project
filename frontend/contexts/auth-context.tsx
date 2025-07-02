"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCurrentUser, setCurrentUser as setStoredUser, type User } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initialize user state from localStorage
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const updateUser = (newUser: User | null) => {
    setUser(newUser)
    setStoredUser(newUser)

    // Redirect to appropriate dashboard after login
    if (newUser) {
      switch (newUser.role) {
        case "admin":
          router.push("/admin/dashboard")
          break
        case "staff":
          router.push("/staff/dashboard")
          break
        case "user":
        default:
          router.push("/user/dashboard")
          break
      }
    }
  }

  const logout = () => {
    setUser(null)
    setStoredUser(null)
    // Redirect to home page after logout
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser, isLoading, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
