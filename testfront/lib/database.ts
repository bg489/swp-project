// Database connection and utilities

export interface DBUser {
  id: string
  email: string
  password_hash: string
  name: string
  phone?: string
  address?: string
  blood_type?: string
  role: "admin" | "user"
  is_active: boolean
  last_donation?: string
  total_donations: number
  created_at: string
  updated_at: string
}

export interface BloodInventory {
  id: string
  blood_type: string
  units_available: number
  units_reserved: number
}

export interface BloodRequest {
  id: string
  user_id: string
  blood_type: string
  units_requested: number
  status: "pending" | "approved" | "denied"
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  user_id: string
  datetime: string
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
}

export interface Donation {
  id: string
  user_id: string
  blood_type: string
  units: number
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  message: string
  is_read: boolean
  created_at: string
}


export interface DBUser {
  id: string
  email: string
  password_hash: string
  name: string
  phone?: string
  address?: string
  blood_type?: string
  role: "admin" | "user"
  is_active: boolean
  last_donation?: string
  total_donations: number
  created_at: string
  updated_at: string
}

export interface BloodInventory {
  id: string
  blood_type: string
  units_available: number
  units_reserved: number
}

export interface BloodRequest {
  id: string
  user_id: string
  blood_type: string
  units_requested: number
  status: "pending" | "approved" | "denied"
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  user_id: string
  datetime: string
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
}

export interface Donation {
  id: string
  user_id: string
  blood_type: string
  units: number
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  message: string
  is_read: boolean
  created_at: string
}


export interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
}

// Mock database connection - In production, use real database
class MockDatabase {
  private users: DBUser[] = []
  private donationHistory: Donation[] = []
  private bloodRequests: BloodRequest[] = []
  private bloodInventory: BloodInventory[] = []
  private appointments: Appointment[] = []
  private notifications: Notification[] = []

  async getAllUsers(): Promise<DBUser[]> {
  return this.users
}

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    // Initialize with sample data
    this.users = [
      {
        id: "1",
        email: "admin@bloodconnect.vn",
        password_hash: "$2b$10$hash_for_123456",
        name: "Quản trị viên",
        phone: "",
        address: "",
        blood_type: "",
        role: "admin",
        is_active: true,
        last_donation: "",
        total_donations: 0,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        email: "user@example.com",
        password_hash: "$2b$10$hash_for_123456",
        name: "Nguyễn Văn A",
        phone: "0901234567",
        address: "Quận 1, TP.HCM",
        blood_type: "O+",
        role: "user",
        is_active: true,
        last_donation: "2024-09-15",
        total_donations: 5,
        created_at: "2024-03-15T00:00:00Z",
        updated_at: "2024-09-15T00:00:00Z",
      },
    ]

    this.bloodInventory = [
      { id: "1", blood_type: "O-", units_available: 45, units_reserved: 5 },
      { id: "2", blood_type: "O+", units_available: 120, units_reserved: 10 },
      { id: "3", blood_type: "A-", units_available: 78, units_reserved: 8 },
      { id: "4", blood_type: "A+", units_available: 156, units_reserved: 15 },
      { id: "5", blood_type: "B-", units_available: 34, units_reserved: 3 },
      { id: "6", blood_type: "B+", units_available: 89, units_reserved: 9 },
      { id: "7", blood_type: "AB-", units_available: 23, units_reserved: 2 },
      { id: "8", blood_type: "AB+", units_available: 67, units_reserved: 7 },
    ]
  }

  // User operations
  async findUserByEmail(email: string): Promise<DBUser | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async findUserById(id: string) {
    return this.users.find((user) => user.id === id) || null
  }

  async createUser(userData: Omit<DBUser, 'id' | 'created_at' | 'updated_at'>): Promise<DBUser> {
    const newUser = {
      id: `U${Date.now()}`,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.users.push(newUser)
    return newUser
  }

  async updateUser(id: string, userData: Partial<DBUser>): Promise<DBUser | null> {
    const index = this.users.findIndex((user) => user.id === id)
    if (index !== -1) {
      this.users[index] = {
        ...this.users[index],
        ...userData,
        updated_at: new Date().toISOString(),
      }
      return this.users[index]
    }
    return null
  }

  // Blood inventory operations
  async getBloodInventory() {
    return this.bloodInventory
  }

  async updateBloodInventory(bloodType: string, units: number) {
    const index = this.bloodInventory.findIndex((item) => item.blood_type === bloodType)
    if (index !== -1) {
      this.bloodInventory[index].units_available = units
      return this.bloodInventory[index]
    }
    return null
  }

  // Blood request operations
  async createBloodRequest(requestData: Omit<BloodRequest, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<BloodRequest> {
  const newRequest: BloodRequest = {
    id: `REQ${Date.now()}`,
    ...requestData,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  this.bloodRequests.push(newRequest)
  return newRequest
}


  async getBloodRequests() {
    return this.bloodRequests
  }

  // Appointment operations
  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'status' | 'created_at'>): Promise<Appointment> {
  const newAppointment: Appointment = {
    id: `APT${Date.now()}`,
    ...appointmentData,
    status: "pending",
    created_at: new Date().toISOString(),
  }
  this.appointments.push(newAppointment)
  return newAppointment
}


  async getUserAppointments(userId: string) {
    return this.appointments.filter((apt) => apt.user_id === userId)
  }

  // Donation history operations
  async createDonationRecord(donationData: Omit<Donation, 'id' | 'created_at'>): Promise<Donation> {
  const newDonation: Donation = {
    id: `DON${Date.now()}`,
    ...donationData,
    created_at: new Date().toISOString(),
  }
  this.donationHistory.push(newDonation)
  return newDonation
}


  async getUserDonationHistory(userId: string) {
    return this.donationHistory.filter((donation) => donation.user_id === userId)
  }

  // Notification operations
  async createNotification(notificationData: Omit<Notification, 'id' | 'is_read' | 'created_at'>): Promise<Notification> {
  const newNotification: Notification = {
    id: `NOT${Date.now()}`,
    ...notificationData,
    is_read: false,
    created_at: new Date().toISOString(),
  }
  this.notifications.push(newNotification)
  return newNotification
}


  async getUserNotifications(userId: string) {
    return this.notifications.filter((notification) => notification.user_id === userId)
  }
}

// Export singleton instance
export const db = new MockDatabase()
