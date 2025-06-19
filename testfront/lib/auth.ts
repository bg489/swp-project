import { db } from "./database"
import { DBUser } from "./database"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  bloodType?: string
  phone?: string
  address?: string
  lastDonation?: string
  totalDonations?: number
  isActive: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  address: string
  bloodType: string
}

// Hash password utility
const hashPassword = async (password: string): Promise<string> => {
  // Mock hash - in production use bcrypt
  return `$2b$10$hash_for_${password}`
}

// Verify password utility
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  // Mock verification - in production use bcrypt.compare
  return hash === `$2b$10$hash_for_${password}`
}

// Convert database user to app user format
const formatUser = (dbUser: DBUser): User => ({
  id: dbUser.id,
  email: dbUser.email,
  name: dbUser.name,
  role: dbUser.role,
  bloodType: dbUser.blood_type,
  phone: dbUser.phone,
  address: dbUser.address,
  lastDonation: dbUser.last_donation,
  totalDonations: dbUser.total_donations,
  isActive: dbUser.is_active,
  createdAt: dbUser.created_at,
})

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    // Find user in database
    const dbUser = await db.findUserByEmail(email)
    if (!dbUser) {
      return null
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, dbUser.password_hash)
    if (!isValidPassword) {
      return null
    }

    // Check if user is active
    if (!dbUser.is_active) {
      return null
    }

    return formatUser(dbUser)
  } catch (error) {
    console.error("Login error:", error)
    return null
  }
}

export const register = async (userData: RegisterData): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    // Check if email already exists
    const existingUser = await db.findUserByEmail(userData.email)
    if (existingUser) {
      return { success: false, message: "Email đã được sử dụng" }
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password)

    // Create user in database
    const dbUser = await db.createUser({
      email: userData.email,
      password_hash: passwordHash,
      name: userData.name,
      phone: userData.phone,
      address: userData.address,
      blood_type: userData.bloodType,
      role: "user",
      is_active: true,
      last_donation: "",
      total_donations: 0,
    })

    const user = formatUser(dbUser)

    return {
      success: true,
      message: "Đăng ký thành công! Bạn có thể đăng nhập ngay.",
      user,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "Đã xảy ra lỗi. Vui lòng thử lại." }
  }
}

export const logout = async (): Promise<void> => {
  // Clear session/token
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("authToken")
  }
}

export const getCurrentUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("currentUser")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export const setCurrentUser = (user: User | null): void => {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
      // In production, also set auth token
      localStorage.setItem("authToken", `token_${user.id}`)
    } else {
      localStorage.removeItem("currentUser")
      localStorage.removeItem("authToken")
    }
  }
}

export const getAllUsers = async (): Promise<User[]> => {
  try {
    // This would be an admin-only function
    const users = (await db.getAllUsers()) || []
    return users.map(formatUser)
  } catch (error) {
    console.error("Get all users error:", error)
    return []
  }
}

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const dbUser = await db.findUserById(id)
    return dbUser ? formatUser(dbUser) : null
  } catch (error) {
    console.error("Get user by ID error:", error)
    return null
  }
}

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updateData: Partial<RegisterData>,
): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const updatedUser = await db.updateUser(userId, {
      name: updateData.name,
      phone: updateData.phone,
      address: updateData.address,
      blood_type: updateData.bloodType,
    })

    if (updatedUser) {
      return {
        success: true,
        message: "Cập nhật thông tin thành công",
        user: formatUser(updatedUser),
      }
    }

    return { success: false, message: "Không tìm thấy người dùng" }
  } catch (error) {
    console.error("Update profile error:", error)
    return { success: false, message: "Đã xảy ra lỗi. Vui lòng thử lại." }
  }
}
