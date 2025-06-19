// Database connection and utilities
export interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
}

// Mock database connection - In production, use real database
class MockDatabase {
  private users: any[] = []
  private donationHistory: any[] = []
  private bloodRequests: any[] = []
  private bloodInventory: any[] = []
  private appointments: any[] = []
  private notifications: any[] = []

  constructor() {
    this.initializeData()
  }

  private initializeData() {
<<<<<<< HEAD
    // Initialize with empty data - no demo accounts
    this.users = []

    // Initialize blood inventory with empty data
    this.bloodInventory = [
      { id: "1", blood_type: "O-", units_available: 0, units_reserved: 0 },
      { id: "2", blood_type: "O+", units_available: 0, units_reserved: 0 },
      { id: "3", blood_type: "A-", units_available: 0, units_reserved: 0 },
      { id: "4", blood_type: "A+", units_available: 0, units_reserved: 0 },
      { id: "5", blood_type: "B-", units_available: 0, units_reserved: 0 },
      { id: "6", blood_type: "B+", units_available: 0, units_reserved: 0 },
      { id: "7", blood_type: "AB-", units_available: 0, units_reserved: 0 },
      { id: "8", blood_type: "AB+", units_available: 0, units_reserved: 0 },
=======
    // Initialize with sample data
    this.users = [
      {
        id: "1",
        email: "admin@bloodconnect.vn",
        password_hash: "$2b$10$hash_for_123456",
        name: "Quản trị viên",
        phone: null,
        address: null,
        blood_type: null,
        role: "admin",
        is_active: true,
        last_donation: null,
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
>>>>>>> i-make-frontend-pro
    ]
  }

  // User operations
  async findUserByEmail(email: string) {
    return this.users.find((user) => user.email === email) || null
  }

  async findUserById(id: string) {
    return this.users.find((user) => user.id === id) || null
  }

  async createUser(userData: any) {
    const newUser = {
      id: `U${Date.now()}`,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.users.push(newUser)
    return newUser
  }

  async updateUser(id: string, userData: any) {
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

<<<<<<< HEAD
  async getAllUsers() {
    return this.users
  }

=======
>>>>>>> i-make-frontend-pro
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
  async createBloodRequest(requestData: any) {
    const newRequest = {
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
  async createAppointment(appointmentData: any) {
    const newAppointment = {
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
  async createDonationRecord(donationData: any) {
    const newDonation = {
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
  async createNotification(notificationData: any) {
    const newNotification = {
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
