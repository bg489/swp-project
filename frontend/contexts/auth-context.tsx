"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCurrentUser, setCurrentUser as setStoredUser, type User } from "@/lib/auth"

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

  useEffect(() => {
    // Initialize user state from localStorage
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const updateUser = (newUser: User | null) => {
    setUser(newUser)
    setStoredUser(newUser)
  }

  const logout = () => {
    setUser(null)
    setStoredUser(null)
    // Force page refresh to ensure all components are reset
    window.location.href = "/"
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
