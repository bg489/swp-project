/* lib/database.ts
   Unified mock database with optional Neon connection.
   Keeps the filename `.ts` so `import { db } from "./database"` works everywhere.
*/

import { neon, neonConfig } from "@neondatabase/serverless"

/* ----------  Neon client (optional) ---------- */
let sql: ReturnType<typeof neon> | null = null
const databaseUrl = process.env.DATABASE_URL

if (databaseUrl) {
  neonConfig.fetchConnectionCache = true
  sql = neon(databaseUrl)
} else {
  console.warn("DATABASE_URL is not set – skipping Neon connection and using in-memory MockDatabase instead.")
}

/* ----------  In-memory mock database ---------- */
class MockDatabase {
  private users: any[] = []
  private donationHistory: any[] = []
  private bloodRequests: any[] = []
  private bloodInventory: any[] = []
  private appointments: any[] = []
  private notifications: any[] = []

  constructor() {
    this.seed()
  }

  private seed() {
    this.users = [
      {
        id: "1",
        email: "admin@scarletblood.vn",
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
      {
        id: "3",
        email: "staff@scarletblood.vn",
        password_hash: "$2b$10$hash_for_123456",
        name: "Staff",
        phone: "0907654321",
        address: "Trung tâm hiến máu",
        blood_type: null,
        role: "staff",
        is_active: true,
        last_donation: null,
        total_donations: 0,
        created_at: "2024-02-01T00:00:00Z",
        updated_at: "2024-02-01T00:00:00Z",
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

    this.bloodRequests = [
      {
        id: "REQ001",
        patient_name: "Nguyễn Văn C",
        hospital: "Bệnh viện Chợ Rẫy",
        blood_type: "O-",
        units_needed: 2,
        urgency: "Khẩn cấp",
        contact_phone: "0901111111",
        doctor_name: "BS. Trần Văn D",
        reason: "Phẫu thuật tim",
        status: "pending",
        created_at: "2024-12-24T08:00:00Z",
        needed_by: "2024-12-24T14:00:00Z",
      },
      {
        id: "REQ002",
        patient_name: "Lê Thị E",
        hospital: "Bệnh viện Bình Dân",
        blood_type: "A+",
        units_needed: 1,
        urgency: "Cao",
        contact_phone: "0902222222",
        doctor_name: "BS. Phạm Thị F",
        reason: "Tai nạn giao thông",
        status: "approved",
        created_at: "2024-12-24T09:30:00Z",
        needed_by: "2024-12-24T16:00:00Z",
      },
    ]
  }

  /* ---------- User helpers ---------- */
  async findUserByEmail(email: string) {
    return this.users.find((u) => u.email === email) ?? null
  }

  async findUserById(id: string) {
    return this.users.find((u) => u.id === id) ?? null
  }

  async createUser(data: any) {
    const user = {
      id: `U${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.users.push(user)
    return user
  }

  async updateUser(id: string, changes: any) {
    const idx = this.users.findIndex((u) => u.id === id)
    if (idx === -1) return null
    this.users[idx] = { ...this.users[idx], ...changes, updated_at: new Date().toISOString() }
    return this.users[idx]
  }

  /* ---------- Inventory helpers (examples) ---------- */
  async getBloodInventory() {
    return this.bloodInventory
  }

  async updateBloodInventory(bloodType: string, units: number) {
    const item = this.bloodInventory.find((i) => i.blood_type === bloodType)
    if (!item) return null
    item.units_available = units
    return item
  }

  /* Additional helpers (requests, appointments, etc.) would go here… */
}

/* ----------  Exports ---------- */
export const db = new MockDatabase()
export { sql } // will be null when DATABASE_URL is absent
