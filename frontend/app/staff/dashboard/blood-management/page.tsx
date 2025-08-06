"use client"

import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuth } from "@/contexts/auth-context"
import { format } from 'date-fns'
import api from "@/lib/axios"
import toast, { Toaster } from "react-hot-toast"
import { vi } from 'date-fns/locale'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  Calendar as CalendarIcon,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Droplets,
  User,
  TestTube,
  Heart,
  FileText,
  BarChart3,
  ArrowLeft,
  Home,
  ClipboardList,
  LogOut,
  RefreshCw,
  Save
} from 'lucide-react'

// Types
interface BloodStock {
  id: string
  bloodType: string
  units: number
  expiryDate: string
  status: 'available' | 'expired' | 'reserved'
  location: string
  donorId?: string
  collectionDate: string
}

interface BloodBag {
  id: string
  stockId: string
  bagNumber: string
  volume: number
  donorId: string
  donorName: string
  collectionDate: string
  expiryDate: string
  status: 'available' | 'expired' | 'used' | 'reserved'
  location: string
  component: 'whole_blood' | 'red_cells' | 'platelets' | 'plasma'
  notes?: string
}

interface BloodRequest {
  id: string
  patientName: string
  patientId: string
  bloodType: string
  component: 'whole_blood' | 'red_cells' | 'platelets' | 'plasma'
  unitsNeeded: number
  urgency: 'low' | 'medium' | 'high' | 'critical'
  requestDate: string
  requiredDate: string
  status: 'pending' | 'approved' | 'in_progress' | 'fulfilled' | 'cancelled'
  hospital: string
  doctorName: string
  reason: string
  notes?: string
  selectedBags?: string[] // Lưu trữ ID của các túi máu đã chọn
}

interface BloodTest {
  id: string
  donorId: string
  donorName: string
  testDate: string
  bloodType: string
  hemoglobin: number
  hiv: boolean
  hepatitisB: boolean
  hepatitisC: boolean
  syphilis: boolean
  status: 'pending' | 'passed' | 'failed'
  technician: string
  notes?: string
}

interface Patient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  bloodType: string
  bloodComponent: string
  urgency: 'critical' | 'high' | 'medium' | 'low'
  phone: string
  email: string
  address: string
  emergencyContact: string
  medicalHistory: string[]
  registrationDate: string
  status: 'active' | 'inactive'
  citizenId: string
}

export default function BloodManagementPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [staff, setStaff] = useState<any>({})
  const [bloodUnits, setBloodUnits] = useState<any>([])

  // State management
  const [activeTab, setActiveTab] = useState('stock')
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([])
  const [bloodBags, setBloodBags] = useState<BloodBag[]>([])
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([])
  const [bloodTests, setBloodTests] = useState<BloodTest[]>([])
  const [bloodTests2, setBloodTests2] = useState<BloodTest[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null)
  const [showBagDetails, setShowBagDetails] = useState(false)
  const [showBloodSelectionDialog, setShowBloodSelectionDialog] = useState(false)
  const [selectedRequestForBloodSelection, setSelectedRequestForBloodSelection] = useState<string | null>(null)
  const [selectedBloodBags, setSelectedBloodBags] = useState<string[]>([])
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false)
  const [showPatientDetailsDialog, setShowPatientDetailsDialog] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isEditingPatient, setIsEditingPatient] = useState(false)

  // States for blood test workflow
  const [showSelectPatientDialog, setShowSelectPatientDialog] = useState(false)
  const [selectedPatientForTest, setSelectedPatientForTest] = useState<Patient | null>(null)
  const [showTestDateDialog, setShowTestDateDialog] = useState(false)
  const [selectedTestDate, setSelectedTestDate] = useState<Date>()
  const [showTestStepsDialog, setShowTestStepsDialog] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState<string>('')

  // States for updating test results
  const [showUpdateResultDialog, setShowUpdateResultDialog] = useState(false)
  const [selectedTestForUpdate, setSelectedTestForUpdate] = useState<BloodTest | null>(null)

  // Refs for form elements to avoid re-render
  const formRef = useRef<HTMLFormElement>(null)
  const editFormRef = useRef<HTMLFormElement>(null)
  const genderRef = useRef<string>('')
  const bloodTypeRef = useRef<string>('')
  const bloodComponentRef = useRef<string>('')
  const urgencyRef = useRef<string>('')
  const editGenderRef = useRef<string>('')
  const editBloodTypeRef = useRef<string>('')
  const editBloodComponentRef = useRef<string>('')
  const editUrgencyRef = useRef<string>('')

  function getStockIdFromBloodGroup(bloodGroupABO: string, bloodGroupRh: string): string {
    const bloodGroup = `${bloodGroupABO}${bloodGroupRh}`;

    switch (bloodGroup) {
      case "O+": return "1";
      case "A+": return "2";
      case "B-": return "3";
      case "O-": return "4";
      case "A-": return "5";
      case "B+": return "6";
      case "AB+": return "7";
      case "AB-": return "8";
      default: return "0"; // fallback nếu không khớp
    }
  }


  // Optimized input handlers - no re-render, direct DOM manipulation
  const handlePhoneInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    let value = target.value

    // Chỉ giữ lại số
    value = value.replace(/[^0-9]/g, '')

    // Giới hạn 10 số
    if (value.length > 10) {
      value = value.slice(0, 10)
    }

    // Bắt buộc bắt đầu bằng số 0
    if (value.length > 0 && value[0] !== '0') {
      value = '0' + value.slice(1)
    }

    target.value = value
  }, [])

  const handleCitizenIdInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    let value = target.value

    // Chỉ giữ lại số
    value = value.replace(/[^0-9]/g, '')

    // Giới hạn 12 số
    if (value.length > 12) {
      value = value.slice(0, 12)
    }

    target.value = value
  }, [])

  const handleEmergencyContactInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    let value = target.value

    // Chỉ giữ lại số
    value = value.replace(/[^0-9]/g, '')

    // Giới hạn 10 số
    if (value.length > 10) {
      value = value.slice(0, 10)
    }

    // Bắt buộc bắt đầu bằng số 0
    if (value.length > 0 && value[0] !== '0') {
      value = '0' + value.slice(1)
    }

    target.value = value
  }, [])

  const handleEmailInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    const value = target.value

    // Kiểm tra format Gmail
    if (value && !value.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
      target.setCustomValidity('Email phải có định dạng @gmail.com')
    } else {
      target.setCustomValidity('')
    }
  }, [])

  const handleNumericKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Chỉ cho phép: số (0-9), Backspace, Delete, Tab, Enter, Arrow keys
    if (!(
      (e.key >= '0' && e.key <= '9') ||
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Enter' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown'
    )) {
      e.preventDefault()
    }
  }, [])

  const handlePhonePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text')
    const target = e.target as HTMLInputElement

    // Chỉ lấy số từ paste
    let cleanPaste = paste.replace(/[^0-9]/g, '')

    // Giới hạn 10 số
    if (cleanPaste.length > 10) {
      cleanPaste = cleanPaste.slice(0, 10)
    }

    // Bắt buộc bắt đầu bằng số 0
    if (cleanPaste.length > 0 && cleanPaste[0] !== '0') {
      cleanPaste = '0' + cleanPaste.slice(1)
    }

    target.value = cleanPaste
  }, [])

  const handleCitizenIdPaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text')
    const target = e.target as HTMLInputElement

    // Chỉ lấy số từ paste
    let cleanPaste = paste.replace(/[^0-9]/g, '')

    // Giới hạn 12 số
    if (cleanPaste.length > 12) {
      cleanPaste = cleanPaste.slice(0, 12)
    }

    target.value = cleanPaste
  }, [])

  const handleEmergencyContactPaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text')
    const target = e.target as HTMLInputElement

    // Chỉ lấy số từ paste
    let cleanPaste = paste.replace(/[^0-9]/g, '')

    // Giới hạn 10 số
    if (cleanPaste.length > 10) {
      cleanPaste = cleanPaste.slice(0, 10)
    }

    // Bắt buộc bắt đầu bằng số 0
    if (cleanPaste.length > 0 && cleanPaste[0] !== '0') {
      cleanPaste = '0' + cleanPaste.slice(1)
    }

    target.value = cleanPaste
  }, [])

  const handleNameInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    let value = target.value

    // Chỉ giữ lại chữ cái, khoảng trắng và dấu tiếng Việt
    value = value.replace(/[^a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÊÔÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐĨŨƠƯĂÊÔĤÕÑäëïöüÿñæøåαβγδεζηθικλμνξοπρστυφχψωАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя\s]/g, '')

    target.value = value
  }, [])

  const handleNameKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Chỉ cho phép: chữ cái, khoảng trắng, Backspace, Delete, Tab, Enter, Arrow keys
    if (!(
      (e.key >= 'a' && e.key <= 'z') ||
      (e.key >= 'A' && e.key <= 'Z') ||
      e.key === ' ' ||
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Enter' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      // Cho phép các dấu tiếng Việt
      /[À-ỹ]/.test(e.key)
    )) {
      e.preventDefault()
    }
  }, [])

  const handleNamePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text')
    const target = e.target as HTMLInputElement

    // Chỉ lấy chữ cái, khoảng trắng và dấu tiếng Việt từ paste
    const cleanPaste = paste.replace(/[^a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÊÔÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐĨŨƠƯĂÊÔĤÕÑäëïöüÿñæøåαβγδεζηθικλμνξοπρστυφχψωАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя\s]/g, '')

    target.value = cleanPaste
  }, [])

  // Age validation with direct DOM manipulation - no re-render
  const handleAgeInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    const value = parseInt(target.value)

    if (!isNaN(value)) {
      if (value > 150) {
        target.value = '150'
      } else if (value < 1 && target.value !== '') {
        target.value = '1'
      }
    }
  }, [])

  const handleAgePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text')
    if (!/^\d+$/.test(paste)) {
      e.preventDefault()
    } else {
      const pasteValue = parseInt(paste)
      if (pasteValue > 150) {
        e.preventDefault()
        const target = e.target as HTMLInputElement
        target.value = '150'
      } else if (pasteValue < 1) {
        e.preventDefault()
        const target = e.target as HTMLInputElement
        target.value = '1'
      }
    }
  }, [])

  // Sample data initialization
  useEffect(() => {
    // Initialize with sample data
    setBloodStock([
      {
        id: '1',
        bloodType: 'O+',
        units: 6, // Available bags only (excluding used B003 and reserved B042)
        expiryDate: '2025-09-15',
        status: 'available',
        location: 'Kho A - Tủ 1',
        collectionDate: '2025-07-15'
      },
      {
        id: '2',
        bloodType: 'A+',
        units: 6, // Available bags only (excluding expired B043)
        expiryDate: '2025-08-28',
        status: 'available',
        location: 'Kho A - Tủ 2',
        collectionDate: '2025-07-01'
      },
      {
        id: '3',
        bloodType: 'B-',
        units: 4, // Available bags only (excluding used B015)
        expiryDate: '2025-08-10',
        status: 'available',
        location: 'Kho B - Tủ 1',
        collectionDate: '2025-06-25'
      },
      {
        id: '4',
        bloodType: 'O-',
        units: 5, // Available bags only (excluding used B021 and B044)
        expiryDate: '2025-09-20',
        status: 'available',
        location: 'Kho A - Tủ 3',
        collectionDate: '2025-07-20'
      },
      {
        id: '5',
        bloodType: 'A-',
        units: 4, // All bags are available
        expiryDate: '2025-08-15',
        status: 'available',
        location: 'Kho B - Tủ 2',
        collectionDate: '2025-06-15'
      },
      {
        id: '6',
        bloodType: 'B+',
        units: 6, // All bags are available
        expiryDate: '2025-09-05',
        status: 'available',
        location: 'Kho A - Tủ 4',
        collectionDate: '2025-07-05'
      },
      {
        id: '7',
        bloodType: 'AB+',
        units: 3, // Available bags only (excluding reserved B037)
        expiryDate: '2025-08-25',
        status: 'available',
        location: 'Kho B - Tủ 3',
        collectionDate: '2025-06-25'
      },
      {
        id: '8',
        bloodType: 'AB-',
        units: 4, // All bags are available
        expiryDate: '2025-09-10',
        status: 'available',
        location: 'Kho A - Tủ 5',
        collectionDate: '2025-07-10'
      }
    ])

    async function fetchProfile() {
      try {
        setLoading(true)
        if (!user?._id) return;

        const profileRes = await api.get(`/users/staff-profiles/active/${user._id}`);
        const staffData = profileRes.data.staffProfile;
        setStaff(staffData);

        if (staffData?.hospital?._id) {
          // Fetch donation requests from API

          const bUnits = await api.get(`/whole-blood/hospital/${staffData.hospital._id}/whole-blood-units`);

          const mappedBloodUnits = bUnits.data.units.map((unit: any, index: number) => {
            const stockId = getStockIdFromBloodGroup(unit.bloodGroupABO, unit.bloodGroupRh);

            return {
              id: unit._id,
              stockId,
              bagNumber: unit._id,
              volume: Number(unit.volumeOrWeight).toFixed(2),
              donorId: unit.user_id?._id || 'N/A',
              donorName: unit.user_id?.full_name || 'Không rõ',
              collectionDate: unit.collectionDate?.split('T')[0] || '',
              expiryDate: unit.expiryDate?.split('T')[0] || '',
              status: unit.status === 'donated' ? 'available' : 'used',
              location: `Kho A - Tủ 1 - Ngăn ${index + 1}`,
              component: 'whole_blood',
              notes: unit.notes || ''
            };
          });

          const rbcUnits = await api.get(`/whole-blood/hospital/${staffData.hospital._id}/red-blood-cells`);

          const mappedRedCellUnits = rbcUnits.data.units.map((unit: any, index: number) => {
            const stockId = getStockIdFromBloodGroup(unit.bloodGroupABO, unit.bloodGroupRh);

            return {
              id: unit._id,
              stockId,
              bagNumber: unit._id,
              volume: Number(unit.volumeOrWeight).toFixed(2),
              donorId: unit.user_id?._id || 'N/A',
              donorName: unit.user_id?.full_name || 'Không rõ',
              collectionDate: unit.collectionDate?.split('T')[0] || '',
              expiryDate: unit.expiryDate?.split('T')[0] || '',
              status: unit.status === 'donated' ? 'available' : 'used',
              location: `Kho A - Tủ 1 - Ngăn ${index + 1}`,
              component: 'red_cells',
              notes: unit.notes || ''
            };
          });


          setBloodBags([
            ...mappedBloodUnits,
            ...mappedRedCellUnits,
          ]);


        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false)
      }
    }

    fetchProfile();

    /*
    setBloodBags([
      // Túi máu cho nhóm O+
      {
        id: 'B001',
        stockId: '1',
        bagNumber: 'OP-2025-001',
        volume: 450,
        donorId: 'D001',
        donorName: 'Nguyễn Văn A',
        collectionDate: '2025-07-15',
        expiryDate: '2025-09-15',
        status: 'available',
        location: 'Kho A - Tủ 1 - Ngăn 1',
        component: 'whole_blood'
      },
      {
        id: 'B002',
        stockId: '1',
        bagNumber: 'OP-2025-002',
        volume: 250,
        donorId: 'D005',
        donorName: 'Trần Thị B',
        collectionDate: '2025-07-15',
        expiryDate: '2025-09-15',
        status: 'available',
        location: 'Kho A - Tủ 1 - Ngăn 2',
        component: 'red_cells'
      },
      {
        id: 'B003',
        stockId: '1',
        bagNumber: 'OP-2025-003',
        volume: 300,
        donorId: 'D012',
        donorName: 'Lê Văn C',
        collectionDate: '2025-07-15',
        expiryDate: '2025-09-15',
        status: 'used',
        location: 'Kho A - Tủ 1 - Ngăn 3',
        component: 'platelets',
        notes: 'Đã sử dụng cho BV Chợ Rẫy'
      },
      {
        id: 'B004',
        stockId: '1',
        bagNumber: 'OP-2025-005',
        volume: 450,
        donorId: 'D150',
        donorName: 'Võ Minh Quang',
        collectionDate: '2025-07-16',
        expiryDate: '2025-09-16',
        status: 'available',
        location: 'Kho A - Tủ 1 - Ngăn 4',
        component: 'whole_blood'
      },
      {
        id: 'B005',
        stockId: '1',
        bagNumber: 'OP-2025-006',
        volume: 250,
        donorId: 'D151',
        donorName: 'Lê Thị Hương',
        collectionDate: '2025-07-17',
        expiryDate: '2025-09-17',
        status: 'available',
        location: 'Kho A - Tủ 1 - Ngăn 5',
        component: 'red_cells'
      },
      {
        id: 'B006',
        stockId: '1',
        bagNumber: 'OP-2025-007',
        volume: 300,
        donorId: 'D152',
        donorName: 'Pham Văn Tài',
        collectionDate: '2025-07-18',
        expiryDate: '2025-09-18',
        status: 'available',
        location: 'Kho A - Tủ 1 - Ngăn 6',
        component: 'platelets'
      },
      {
        id: 'B007',
        stockId: '1',
        bagNumber: 'OP-2025-008',
        volume: 200,
        donorId: 'D153',
        donorName: 'Cao Thị J',
        collectionDate: '2025-07-18',
        expiryDate: '2025-09-18',
        status: 'available',
        location: 'Kho A - Tủ 1 - Ngăn 7',
        component: 'plasma'
      },

      // Túi máu cho nhóm A+
      {
        id: 'B008',
        stockId: '2',
        bagNumber: 'AP-2025-001',
        volume: 450,
        donorId: 'D008',
        donorName: 'Phạm Thị D',
        collectionDate: '2025-07-01',
        expiryDate: '2025-08-28',
        status: 'available',
        location: 'Kho A - Tủ 2 - Ngăn 1',
        component: 'whole_blood'
      },
      {
        id: 'B009',
        stockId: '2',
        bagNumber: 'AP-2025-002',
        volume: 200,
        donorId: 'D015',
        donorName: 'Hoàng Văn E',
        collectionDate: '2025-07-01',
        expiryDate: '2025-08-28',
        status: 'available',
        location: 'Kho A - Tủ 2 - Ngăn 2',
        component: 'plasma'
      },
      {
        id: 'B010',
        stockId: '2',
        bagNumber: 'AP-2025-003',
        volume: 250,
        donorId: 'D060',
        donorName: 'Đinh Văn K',
        collectionDate: '2025-07-02',
        expiryDate: '2025-08-30',
        status: 'available',
        location: 'Kho A - Tủ 2 - Ngăn 3',
        component: 'red_cells'
      },
      {
        id: 'B011',
        stockId: '2',
        bagNumber: 'AP-2025-004',
        volume: 450,
        donorId: 'D160',
        donorName: 'Nguyễn Thị Mai',
        collectionDate: '2025-07-03',
        expiryDate: '2025-08-31',
        status: 'available',
        location: 'Kho A - Tủ 2 - Ngăn 4',
        component: 'whole_blood'
      },
      {
        id: 'B012',
        stockId: '2',
        bagNumber: 'AP-2025-005',
        volume: 300,
        donorId: 'D161',
        donorName: 'Trần Văn Long',
        collectionDate: '2025-07-04',
        expiryDate: '2025-09-01',
        status: 'available',
        location: 'Kho A - Tủ 2 - Ngăn 5',
        component: 'platelets'
      },
      {
        id: 'B013',
        stockId: '2',
        bagNumber: 'AP-2025-006',
        volume: 250,
        donorId: 'D162',
        donorName: 'Lý Thị Lan',
        collectionDate: '2025-07-05',
        expiryDate: '2025-09-02',
        status: 'available',
        location: 'Kho A - Tủ 2 - Ngăn 6',
        component: 'red_cells'
      },

      // Túi máu cho nhóm B-
      {
        id: 'B014',
        stockId: '3',
        bagNumber: 'BN-2025-001',
        volume: 450,
        donorId: 'D022',
        donorName: 'Võ Thị F',
        collectionDate: '2025-06-25',
        expiryDate: '2025-08-10',
        status: 'available',
        location: 'Kho B - Tủ 1 - Ngăn 1',
        component: 'whole_blood'
      },
      {
        id: 'B015',
        stockId: '3',
        bagNumber: 'BN-2025-002',
        volume: 250,
        donorId: 'D028',
        donorName: 'Đặng Văn G',
        collectionDate: '2025-06-25',
        expiryDate: '2025-08-10',
        status: 'used',
        location: 'Kho B - Tủ 1 - Ngăn 2',
        component: 'red_cells',
        notes: 'Đã sử dụng cho ca phẫu thuật khẩn cấp'
      },
      {
        id: 'B016',
        stockId: '3',
        bagNumber: 'BN-2025-003',
        volume: 300,
        donorId: 'D070',
        donorName: 'Trương Thị L',
        collectionDate: '2025-06-28',
        expiryDate: '2025-08-12',
        status: 'available',
        location: 'Kho B - Tủ 1 - Ngăn 3',
        component: 'platelets'
      },
      {
        id: 'B017',
        stockId: '3',
        bagNumber: 'BN-2025-004',
        volume: 450,
        donorId: 'D170',
        donorName: 'Bùi Văn Hùng',
        collectionDate: '2025-06-29',
        expiryDate: '2025-08-13',
        status: 'available',
        location: 'Kho B - Tủ 1 - Ngăn 4',
        component: 'whole_blood'
      },
      {
        id: 'B018',
        stockId: '3',
        bagNumber: 'BN-2025-005',
        volume: 200,
        donorId: 'D171',
        donorName: 'Đỗ Thị Nga',
        collectionDate: '2025-06-30',
        expiryDate: '2025-08-14',
        status: 'available',
        location: 'Kho B - Tủ 1 - Ngăn 5',
        component: 'plasma'
      },

      // Túi máu cho nhóm O-
      {
        id: 'B019',
        stockId: '4',
        bagNumber: 'ON-2025-001',
        volume: 450,
        donorId: 'D035',
        donorName: 'Bùi Thị H',
        collectionDate: '2025-07-20',
        expiryDate: '2025-09-20',
        status: 'available',
        location: 'Kho A - Tủ 3 - Ngăn 1',
        component: 'whole_blood'
      },
      {
        id: 'B020',
        stockId: '4',
        bagNumber: 'ON-2025-002',
        volume: 300,
        donorId: 'D041',
        donorName: 'Ngô Văn I',
        collectionDate: '2025-07-20',
        expiryDate: '2025-09-20',
        status: 'available',
        location: 'Kho A - Tủ 3 - Ngăn 2',
        component: 'platelets'
      },
      {
        id: 'B021',
        stockId: '4',
        bagNumber: 'ON-2025-003',
        volume: 180,
        donorId: 'D080',
        donorName: 'Lâm Văn M',
        collectionDate: '2025-07-22',
        expiryDate: '2025-09-22',
        status: 'used',
        location: 'Kho A - Tủ 3 - Ngăn 3',
        component: 'plasma',
        notes: 'Đã sử dụng cho trẻ em'
      },
      {
        id: 'B022',
        stockId: '4',
        bagNumber: 'ON-2025-004',
        volume: 450,
        donorId: 'D180',
        donorName: 'Nguyễn Văn Dũng',
        collectionDate: '2025-07-23',
        expiryDate: '2025-09-23',
        status: 'available',
        location: 'Kho A - Tủ 3 - Ngăn 4',
        component: 'whole_blood'
      },
      {
        id: 'B023',
        stockId: '4',
        bagNumber: 'ON-2025-005',
        volume: 250,
        donorId: 'D181',
        donorName: 'Phạm Thị Linh',
        collectionDate: '2025-07-24',
        expiryDate: '2025-09-24',
        status: 'available',
        location: 'Kho A - Tủ 3 - Ngăn 5',
        component: 'red_cells'
      },
      {
        id: 'B024',
        stockId: '4',
        bagNumber: 'ON-2025-006',
        volume: 300,
        donorId: 'D182',
        donorName: 'Lê Văn Thành',
        collectionDate: '2025-07-25',
        expiryDate: '2025-09-25',
        status: 'available',
        location: 'Kho A - Tủ 3 - Ngăn 6',
        component: 'platelets'
      },

      // Túi máu cho nhóm A-
      {
        id: 'B025',
        stockId: '5',
        bagNumber: 'AN-2025-001',
        volume: 250,
        donorId: 'D090',
        donorName: 'Phan Thị N',
        collectionDate: '2025-06-18',
        expiryDate: '2025-08-18',
        status: 'available',
        location: 'Kho B - Tủ 2 - Ngăn 1',
        component: 'red_cells'
      },
      {
        id: 'B026',
        stockId: '5',
        bagNumber: 'AN-2025-002',
        volume: 450,
        donorId: 'D190',
        donorName: 'Trần Văn Phúc',
        collectionDate: '2025-06-19',
        expiryDate: '2025-08-19',
        status: 'available',
        location: 'Kho B - Tủ 2 - Ngăn 2',
        component: 'whole_blood'
      },
      {
        id: 'B027',
        stockId: '5',
        bagNumber: 'AN-2025-003',
        volume: 300,
        donorId: 'D191',
        donorName: 'Võ Thị Hồng',
        collectionDate: '2025-06-20',
        expiryDate: '2025-08-20',
        status: 'available',
        location: 'Kho B - Tủ 2 - Ngăn 3',
        component: 'platelets'
      },
      {
        id: 'B028',
        stockId: '5',
        bagNumber: 'AN-2025-004',
        volume: 200,
        donorId: 'D192',
        donorName: 'Đặng Văn Minh',
        collectionDate: '2025-06-21',
        expiryDate: '2025-08-21',
        status: 'available',
        location: 'Kho B - Tủ 2 - Ngăn 4',
        component: 'plasma'
      },

      // Túi máu cho nhóm B+
      {
        id: 'B029',
        stockId: '6',
        bagNumber: 'BP-2025-001',
        volume: 450,
        donorId: 'D100',
        donorName: 'Mai Văn O',
        collectionDate: '2025-07-08',
        expiryDate: '2025-09-08',
        status: 'available',
        location: 'Kho A - Tủ 4 - Ngăn 1',
        component: 'whole_blood'
      },
      {
        id: 'B030',
        stockId: '6',
        bagNumber: 'BP-2025-002',
        volume: 250,
        donorId: 'D200',
        donorName: 'Nguyễn Thị Xuân',
        collectionDate: '2025-07-09',
        expiryDate: '2025-09-09',
        status: 'available',
        location: 'Kho A - Tủ 4 - Ngăn 2',
        component: 'red_cells'
      },
      {
        id: 'B031',
        stockId: '6',
        bagNumber: 'BP-2025-003',
        volume: 300,
        donorId: 'D201',
        donorName: 'Lê Văn Tuấn',
        collectionDate: '2025-07-10',
        expiryDate: '2025-09-10',
        status: 'available',
        location: 'Kho A - Tủ 4 - Ngăn 3',
        component: 'platelets'
      },
      {
        id: 'B032',
        stockId: '6',
        bagNumber: 'BP-2025-004',
        volume: 200,
        donorId: 'D202',
        donorName: 'Phạm Thị Thu',
        collectionDate: '2025-07-11',
        expiryDate: '2025-09-11',
        status: 'available',
        location: 'Kho A - Tủ 4 - Ngăn 4',
        component: 'plasma'
      },
      {
        id: 'B033',
        stockId: '6',
        bagNumber: 'BP-2025-005',
        volume: 450,
        donorId: 'D203',
        donorName: 'Cao Văn Hải',
        collectionDate: '2025-07-12',
        expiryDate: '2025-09-12',
        status: 'available',
        location: 'Kho A - Tủ 4 - Ngăn 5',
        component: 'whole_blood'
      },

      // Túi máu cho nhóm AB+
      {
        id: 'B034',
        stockId: '7',
        bagNumber: 'ABP-2025-001',
        volume: 200,
        donorId: 'D110',
        donorName: 'Tô Thị P',
        collectionDate: '2025-06-28',
        expiryDate: '2025-08-28',
        status: 'available',
        location: 'Kho B - Tủ 3 - Ngăn 1',
        component: 'plasma'
      },
      {
        id: 'B035',
        stockId: '7',
        bagNumber: 'ABP-2025-002',
        volume: 450,
        donorId: 'D210',
        donorName: 'Nguyễn Văn Kiên',
        collectionDate: '2025-06-29',
        expiryDate: '2025-08-29',
        status: 'available',
        location: 'Kho B - Tủ 3 - Ngăn 2',
        component: 'whole_blood'
      },
      {
        id: 'B036',
        stockId: '7',
        bagNumber: 'ABP-2025-003',
        volume: 250,
        donorId: 'D211',
        donorName: 'Lý Thị Hoa',
        collectionDate: '2025-06-30',
        expiryDate: '2025-08-30',
        status: 'available',
        location: 'Kho B - Tủ 3 - Ngăn 3',
        component: 'red_cells'
      },
      {
        id: 'B037',
        stockId: '7',
        bagNumber: 'ABP-2025-004',
        volume: 300,
        donorId: 'D212',
        donorName: 'Trần Văn Đức',
        collectionDate: '2025-07-01',
        expiryDate: '2025-08-31',
        status: 'reserved',
        location: 'Kho B - Tủ 3 - Ngăn 4',
        component: 'platelets'
      },

      // Túi máu cho nhóm AB-
      {
        id: 'B038',
        stockId: '8',
        bagNumber: 'ABN-2025-001',
        volume: 300,
        donorId: 'D120',
        donorName: 'Hồ Văn Q',
        collectionDate: '2025-07-12',
        expiryDate: '2025-09-12',
        status: 'available',
        location: 'Kho A - Tủ 5 - Ngăn 1',
        component: 'platelets'
      },
      {
        id: 'B039',
        stockId: '8',
        bagNumber: 'ABN-2025-002',
        volume: 450,
        donorId: 'D220',
        donorName: 'Bùi Thị Lan',
        collectionDate: '2025-07-13',
        expiryDate: '2025-09-13',
        status: 'available',
        location: 'Kho A - Tủ 5 - Ngăn 2',
        component: 'whole_blood'
      },
      {
        id: 'B040',
        stockId: '8',
        bagNumber: 'ABN-2025-003',
        volume: 250,
        donorId: 'D221',
        donorName: 'Võ Văn Nam',
        collectionDate: '2025-07-14',
        expiryDate: '2025-09-14',
        status: 'available',
        location: 'Kho A - Tủ 5 - Ngăn 3',
        component: 'red_cells'
      },
      {
        id: 'B041',
        stockId: '8',
        bagNumber: 'ABN-2025-004',
        volume: 200,
        donorId: 'D222',
        donorName: 'Đào Thị Kim',
        collectionDate: '2025-07-15',
        expiryDate: '2025-09-15',
        status: 'available',
        location: 'Kho A - Tủ 5 - Ngăn 4',
        component: 'plasma'
      },

      // Thêm các túi máu có trạng thái khác nhau để test
      {
        id: 'B042',
        stockId: '1',
        bagNumber: 'OP-2025-009',
        volume: 450,
        donorId: 'D230',
        donorName: 'Lê Văn Bình',
        collectionDate: '2025-08-01',
        expiryDate: '2025-10-01',
        status: 'reserved',
        location: 'Kho A - Tủ 1 - Ngăn 8',
        component: 'whole_blood',
        notes: 'Đã đặt trước cho BV Đại học Y Dược'
      },
      {
        id: 'B043',
        stockId: '2',
        bagNumber: 'AP-2025-007',
        volume: 250,
        donorId: 'D231',
        donorName: 'Phạm Thị Yến',
        collectionDate: '2025-08-02',
        expiryDate: '2025-10-02',
        status: 'expired',
        location: 'Kho A - Tủ 2 - Ngăn 7',
        component: 'red_cells',
        notes: 'Hết hạn, cần loại bỏ'
      },
      {
        id: 'B044',
        stockId: '4',
        bagNumber: 'ON-2025-007',
        volume: 300,
        donorId: 'D232',
        donorName: 'Trần Văn Hòa',
        collectionDate: '2025-08-03',
        expiryDate: '2025-10-03',
        status: 'used',
        location: 'Kho A - Tủ 3 - Ngăn 7',
        component: 'platelets',
        notes: 'Đã sử dụng cho ca cấp cứu'
      },
      {
        id: 'B045',
        stockId: '6',
        bagNumber: 'BP-2025-006',
        volume: 200,
        donorId: 'D233',
        donorName: 'Nguyễn Thị Oanh',
        collectionDate: '2025-08-04',
        expiryDate: '2025-10-04',
        status: 'available',
        location: 'Kho A - Tủ 4 - Ngăn 6',
        component: 'plasma'
      }
    ])*/

    setBloodRequests([])

    setBloodTests([])

    // Load patients from localStorage or use default data
    const storedPatients = localStorage.getItem('patients')
    const defaultPatients: Patient[] = []

    let patientsData = defaultPatients

    // Kiểm tra và xử lý dữ liệu từ localStorage
    if (storedPatients) {
      try {
        const parsedPatients = JSON.parse(storedPatients)
        patientsData = parsedPatients
      } catch (error) {
        // Lỗi parse JSON, dùng default data
        localStorage.removeItem('patients')
        console.log('Đã khôi phục dữ liệu bệnh nhân')
      }
    }

    setPatients(patientsData)
  }, [user])

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'active':
      case 'passed':
      case 'approved':
      case 'fulfilled':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'expired':
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'reserved':
        return 'bg-blue-100 text-blue-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Functions to handle blood request actions
  const handleApproveRequest = useCallback((requestId: string) => {
    setSelectedRequestForBloodSelection(requestId)
    setShowBloodSelectionDialog(true)
    setSelectedBloodBags([])
  }, [])

  const handleConfirmApproval = useCallback(() => {
    if (selectedRequestForBloodSelection && selectedBloodBags.length > 0) {
      setBloodRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === selectedRequestForBloodSelection
            ? { ...request, status: 'approved' as const, selectedBags: [...selectedBloodBags] }
            : request
        )
      )

      // Cập nhật trạng thái túi máu đã chọn thành reserved
      setBloodBags(prevBags =>
        prevBags.map(bag =>
          selectedBloodBags.includes(bag.id)
            ? { ...bag, status: 'reserved' as const }
            : bag
        )
      )

      console.log(`Đã duyệt yêu cầu máu ID: ${selectedRequestForBloodSelection}`)
      console.log(`Đã chọn ${selectedBloodBags.length} túi máu:`, selectedBloodBags)

      setShowBloodSelectionDialog(false)
      setSelectedRequestForBloodSelection(null)
      setSelectedBloodBags([])
    }
  }, [selectedRequestForBloodSelection, selectedBloodBags])

  const handleRejectRequest = useCallback((requestId: string) => {
    setBloodRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId
          ? { ...request, status: 'cancelled' as const }
          : request
      )
    )
    console.log(`Đã từ chối yêu cầu máu ID: ${requestId}`)
  }, [])

  const handleStartTransfusion = useCallback((requestId: string) => {
    const request = bloodRequests.find(req => req.id === requestId)

    setBloodRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId
          ? { ...request, status: 'in_progress' as const }
          : request
      )
    )

    // Update selected bags status to 'in_progress' to indicate they are being prepared
    if (request && request.selectedBags) {
      setBloodBags(prevBags =>
        prevBags.map(bag => {
          if (request.selectedBags!.includes(bag.id)) {
            return {
              ...bag,
              notes: `Đang chuẩn bị truyền cho ${request.patientName}`
            }
          }
          return bag
        })
      )
    }

    console.log(`Đã bắt đầu truyền máu cho yêu cầu ID: ${requestId}`)
  }, [bloodRequests])

  const handleCompleteTransfusion = useCallback((requestId: string) => {
    // Find the request to get blood type and units needed
    const request = bloodRequests.find(req => req.id === requestId)

    if (request) {
      // Update blood requests status
      setBloodRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId
            ? { ...req, status: 'fulfilled' as const }
            : req
        )
      )

      // If request has selected bags, mark those specific bags as used
      if (request.selectedBags && request.selectedBags.length > 0) {
        setBloodBags(prevBags =>
          prevBags.map(bag => {
            if (request.selectedBags!.includes(bag.id)) {
              return {
                ...bag,
                status: 'used' as const,
                notes: `Đã sử dụng cho yêu cầu ${requestId} - ${request.patientName}`
              }
            }
            return bag
          })
        )

        // Update blood stock by reducing units based on selected bags
        const stockUpdates = new Map<string, number>()

        // Count bags per stock
        request.selectedBags.forEach(bagId => {
          const bag = bloodBags.find(b => b.id === bagId)
          if (bag) {
            const currentCount = stockUpdates.get(bag.stockId) || 0
            stockUpdates.set(bag.stockId, currentCount + 1)
          }
        })

        setBloodStock(prevStock =>
          prevStock.map(stock => {
            const unitsToReduce = stockUpdates.get(stock.id) || 0
            if (unitsToReduce > 0) {
              const newUnits = Math.max(0, stock.units - unitsToReduce)
              return {
                ...stock,
                units: newUnits,
                status: newUnits === 0 ? 'expired' as const : stock.status
              }
            }
            return stock
          })
        )

        console.log(`Đã hoàn tất truyền máu cho yêu cầu ID: ${requestId}. Đã sử dụng ${request.selectedBags.length} túi máu đã chọn trước đó.`)
      } else {
        // Fallback: Old logic for requests without selected bags
        setBloodStock(prevStock =>
          prevStock.map(stock => {
            if (stock.bloodType === request.bloodType) {
              const newUnits = Math.max(0, stock.units - request.unitsNeeded)
              return {
                ...stock,
                units: newUnits,
                status: newUnits === 0 ? 'expired' as const : stock.status
              }
            }
            return stock
          })
        )

        setBloodBags(prevBags => {
          const stockForBloodType = bloodStock.find(s => s.bloodType === request.bloodType)
          if (!stockForBloodType) return prevBags

          let unitsToMark = request.unitsNeeded
          return prevBags.map(bag => {
            if (bag.stockId === stockForBloodType.id &&
              bag.status === 'available' &&
              unitsToMark > 0) {
              unitsToMark--
              return {
                ...bag,
                status: 'used' as const,
                notes: `Đã sử dụng cho yêu cầu ${requestId} - ${request.patientName}`
              }
            }
            return bag
          })
        })

        console.log(`Đã hoàn tất truyền máu cho yêu cầu ID: ${requestId}. Đã trừ ${request.unitsNeeded} đơn vị máu ${request.bloodType} từ kho (fallback logic).`)
      }
    } else {
      console.error(`Không tìm thấy yêu cầu máu với ID: ${requestId}`)
    }
  }, [bloodRequests, bloodStock, bloodBags, setBloodStock, setBloodBags])

  // Handle test result update
  const handleUpdateTestResult = useCallback((test: BloodTest) => {
    setSelectedTestForUpdate(test)
    setShowUpdateResultDialog(true)
  }, [])

  const handleSaveTestResult = useCallback((e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTestForUpdate) return

    const form = e.target as HTMLFormElement

    // Get values from form
    const notes = (form.querySelector('#testNotes') as HTMLTextAreaElement)?.value || ''
    const confirmedBloodType = (form.querySelector('#confirmedBloodType') as HTMLSelectElement)?.value || selectedTestForUpdate?.bloodType
    const confirmedBloodComponent = (form.querySelector('#confirmedBloodComponent') as HTMLSelectElement)?.value || ''
    const bloodUnits = parseInt((form.querySelector('#bloodUnits') as HTMLSelectElement)?.value || '1')

    // Set default values since fields were removed
    const hemoglobin = selectedTestForUpdate?.hemoglobin || 0
    const technician = selectedTestForUpdate?.technician || 'KTV. Chưa xác định'

    // Set all infectious disease tests to false since they were removed
    const hiv = false
    const hepatitisB = false
    const hepatitisC = false
    const syphilis = false

    // Get patient info for comparison
    const patientInfo = patients.find(p => p.id === selectedTestForUpdate.donorId)
    const originalBloodComponent = patientInfo?.bloodComponent || ''

    // Check if blood type or component was actually changed
    const bloodTypeChanged = confirmedBloodType !== selectedTestForUpdate?.bloodType
    const componentChanged = confirmedBloodComponent !== '' && confirmedBloodComponent !== originalBloodComponent

    // Determine test status - will always be 'passed' since infectious disease tests are removed
    const status = 'passed'

    // Create updated notes with corrections if any
    let updatedNotes = notes
    if (bloodTypeChanged) {
      updatedNotes += `\n[Sửa nhóm máu: ${selectedTestForUpdate?.bloodType} → ${confirmedBloodType}]`
    }
    if (componentChanged) {
      const originalComponentName = originalBloodComponent === 'whole_blood' ? 'Máu toàn phần' :
        originalBloodComponent === 'red_cells' ? 'Hồng cầu' :
          originalBloodComponent === 'platelets' ? 'Tiểu cầu' : 'Huyết tương'
      const newComponentName = confirmedBloodComponent === 'whole_blood' ? 'Máu toàn phần' :
        confirmedBloodComponent === 'red_cells' ? 'Hồng cầu' :
          confirmedBloodComponent === 'platelets' ? 'Tiểu cầu' : 'Huyết tương'
      updatedNotes += `\n[Sửa thành phần máu: ${originalComponentName} → ${newComponentName}]`
    }

    // Update test object
    const updatedTest = {
      ...selectedTestForUpdate,
      bloodType: confirmedBloodType, // Use confirmed blood type
      hemoglobin,
      hiv,
      hepatitisB,
      hepatitisC,
      syphilis,
      technician,
      notes: updatedNotes.trim(),
      status: status as 'passed' | 'failed'
    }

    console.log('Đã cập nhật kết quả xét nghiệm:', updatedTest)

    // Update blood tests state
    setBloodTests(prev => prev.map(t => t.id === selectedTestForUpdate.id ? updatedTest : t))

    // Automatically create blood request when test is confirmed
    if (patientInfo) {
      const newRequestId = `R${Date.now().toString().slice(-6)}`

      // Use the confirmed blood component or the original one if not changed
      const finalBloodComponent = componentChanged ? confirmedBloodComponent : originalBloodComponent

      // Ensure component type is valid
      const validComponent = ['whole_blood', 'red_cells', 'platelets', 'plasma'].includes(finalBloodComponent)
        ? finalBloodComponent as 'whole_blood' | 'red_cells' | 'platelets' | 'plasma'
        : 'whole_blood' as const

      const newBloodRequest = {
        id: newRequestId,
        patientName: patientInfo.name,
        patientId: patientInfo.id,
        bloodType: confirmedBloodType, // Use confirmed blood type
        component: validComponent,
        unitsNeeded: bloodUnits, // Use selected units
        urgency: patientInfo.urgency || 'medium' as const, // Use patient's urgency level
        requestDate: new Date().toISOString().split('T')[0],
        requiredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        status: 'pending' as const,
        hospital: 'Trung tâm máu',
        doctorName: 'BS. Tự động tạo',
        reason: `Yêu cầu ${bloodUnits} đơn vị máu sau xét nghiệm xác nhận cho bệnh nhân ${patientInfo.name}`,
        selectedBags: [] // Khởi tạo mảng rỗng cho túi máu đã chọn
      }

      // Add to blood requests
      setBloodRequests(prev => [newBloodRequest, ...prev])

      console.log('Đã tự động tạo yêu cầu máu:', newBloodRequest)
    }

    // Show success message
    const urgencyText = patientInfo?.urgency === 'critical' ? ' (CỰC KỲ KHẨN CẤP)' :
      patientInfo?.urgency === 'high' ? ' (KHẨN CẤP)' :
        patientInfo?.urgency === 'low' ? ' (ÍT KHẨN CẤP)' :
          ' (TRUNG BÌNH)'
    setShowSuccessMessage(`Đã cập nhật kết quả xét nghiệm và tự động tạo yêu cầu ${bloodUnits} đơn vị máu${urgencyText} cho ${selectedTestForUpdate.donorName}`)
    setTimeout(() => setShowSuccessMessage(''), 5000)

    // Close dialog and reset
    setShowUpdateResultDialog(false)
    setSelectedTestForUpdate(null)
  }, [selectedTestForUpdate])

  // Handle add patient - no reload, switch to patients tab
  const handleAddPatient = useCallback((e: React.FormEvent) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement

    // Get values directly from form
    const name = (form.querySelector('#patientName') as HTMLInputElement)?.value || ''
    const age = (form.querySelector('#age') as HTMLInputElement)?.value || ''
    const gender = genderRef.current || ''
    const bloodType = bloodTypeRef.current || ''
    const bloodComponent = bloodComponentRef.current || ''
    const urgency = urgencyRef.current || 'medium'
    const phone = (form.querySelector('#phone') as HTMLInputElement)?.value || ''
    const citizenId = (form.querySelector('#citizenId') as HTMLInputElement)?.value || ''
    const email = (form.querySelector('#email') as HTMLInputElement)?.value || ''
    const address = (form.querySelector('#address') as HTMLInputElement)?.value || ''
    const emergencyContact = (form.querySelector('#emergencyContact') as HTMLInputElement)?.value || ''
    const medicalHistory = (form.querySelector('#medicalHistory') as HTMLTextAreaElement)?.value || ''

    // Generate ID without depending on state
    const timestamp = Date.now()
    const newId = `P${timestamp.toString().slice(-3).padStart(3, '0')}`

    // Create new patient object
    const patientToAdd = {
      id: newId,
      name,
      age: parseInt(age),
      gender: gender as 'male' | 'female' | 'other',
      bloodType,
      bloodComponent,
      urgency: urgency as 'critical' | 'high' | 'medium' | 'low',
      phone,
      email,
      address,
      emergencyContact,
      medicalHistory: medicalHistory ? [medicalHistory] : [],
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'active' as const,
      citizenId
    }

    console.log('Đã thêm bệnh nhân mới:', patientToAdd)

    // Update patients state
    setPatients(prev => [...prev, patientToAdd])

    // Store in localStorage to persist data
    const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]')
    existingPatients.push(patientToAdd)
    localStorage.setItem('patients', JSON.stringify(existingPatients))

    // Close dialog
    setShowAddPatientDialog(false)

    // Reset form
    if (formRef.current) {
      formRef.current.reset()
    }

    // Reset refs
    genderRef.current = ''
    bloodTypeRef.current = ''
    bloodComponentRef.current = ''
    urgencyRef.current = ''

    // Switch to patients tab
    setActiveTab('patients')

  }, []) // Empty dependency array - no re-render dependency

  // Handle patient actions
  const handleViewPatient = useCallback((patient: Patient) => {
    setSelectedPatient(patient)
    setIsEditingPatient(false)
    setShowPatientDetailsDialog(true)

    // Set edit refs with patient data
    editGenderRef.current = patient.gender || ''
    editBloodTypeRef.current = patient.bloodType || ''
    editBloodComponentRef.current = patient.bloodComponent || ''
    editUrgencyRef.current = patient.urgency || 'medium'
  }, [])

  const handleEditPatient = useCallback(() => {
    setIsEditingPatient(true)
  }, [])

  const handleSavePatientEdit = useCallback((e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPatient) return

    const form = e.target as HTMLFormElement

    // Get values from form
    const name = (form.querySelector('#editPatientName') as HTMLInputElement)?.value || ''
    const age = (form.querySelector('#editAge') as HTMLInputElement)?.value || ''
    const gender = editGenderRef.current || ''
    const bloodType = editBloodTypeRef.current || ''
    const bloodComponent = editBloodComponentRef.current || ''
    const urgency = editUrgencyRef.current || 'medium'
    const phone = (form.querySelector('#editPhone') as HTMLInputElement)?.value || ''
    const citizenId = (form.querySelector('#editCitizenId') as HTMLInputElement)?.value || ''
    const email = (form.querySelector('#editEmail') as HTMLInputElement)?.value || ''
    const address = (form.querySelector('#editAddress') as HTMLInputElement)?.value || ''
    const emergencyContact = (form.querySelector('#editEmergencyContact') as HTMLInputElement)?.value || ''
    const medicalHistory = (form.querySelector('#editMedicalHistory') as HTMLTextAreaElement)?.value || ''

    // Update patient object
    const updatedPatient = {
      ...selectedPatient,
      name,
      age: parseInt(age),
      gender: gender as 'male' | 'female' | 'other',
      bloodType,
      bloodComponent,
      urgency: urgency as 'critical' | 'high' | 'medium' | 'low',
      phone,
      email,
      address,
      emergencyContact,
      medicalHistory: medicalHistory ? [medicalHistory] : [],
      citizenId
    }

    console.log('Đã cập nhật bệnh nhân:', updatedPatient)

    // Update patients state
    setPatients(prev => prev.map(p => p.id === selectedPatient.id ? updatedPatient : p))

    // Update localStorage
    const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]')
    const updatedPatients = existingPatients.map((p: Patient) => p.id === selectedPatient.id ? updatedPatient : p)
    localStorage.setItem('patients', JSON.stringify(updatedPatients))

    // Update selected patient and switch to view mode
    setSelectedPatient(updatedPatient)
    setIsEditingPatient(false)
  }, [selectedPatient])

  const handleDeletePatient = useCallback(() => {
    if (!selectedPatient) return

    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa bệnh nhân "${selectedPatient.name}"?`)

    if (confirmDelete) {
      console.log('Đã xóa bệnh nhân:', selectedPatient.id)

      // Remove from patients state
      setPatients(prev => prev.filter(p => p.id !== selectedPatient.id))

      // Remove from localStorage
      const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]')
      const updatedPatients = existingPatients.filter((p: Patient) => p.id !== selectedPatient.id)
      localStorage.setItem('patients', JSON.stringify(updatedPatients))

      // Close dialog
      setShowPatientDetailsDialog(false)
      setSelectedPatient(null)
      setIsEditingPatient(false)
    }
  }, [selectedPatient])

  const handleCancelEdit = useCallback(() => {
    setIsEditingPatient(false)
    // Reset edit refs to original patient data
    if (selectedPatient) {
      editGenderRef.current = selectedPatient.gender || ''
      editBloodTypeRef.current = selectedPatient.bloodType || ''
      editBloodComponentRef.current = selectedPatient.bloodComponent || ''
      editUrgencyRef.current = selectedPatient.urgency || 'medium'
    }
  }, [selectedPatient])

  const handleClosePatientDetails = useCallback(() => {
    setShowPatientDetailsDialog(false)
    setSelectedPatient(null)
    setIsEditingPatient(false)
    // Reset edit refs
    editGenderRef.current = ''
    editBloodTypeRef.current = ''
    editBloodComponentRef.current = ''
    editUrgencyRef.current = ''
  }, [])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyName = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return '🔴 Cực kỳ khẩn cấp'
      case 'high':
        return '🟠 Khẩn cấp'
      case 'medium':
        return '🟡 Trung bình'
      case 'low':
        return '🟢 Thấp'
      default:
        return '🟡 Trung bình'
    }
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return "Không rõ";

    const parsedDate = new Date(dateStr);
    if (isNaN(parsedDate.getTime())) return "Không rõ";

    return format(parsedDate, "dd/MM/yyyy");
  }


  const getComponentName = (component: string) => {
    switch (component) {
      case 'whole_blood':
        return 'Máu toàn phần'
      case 'red_cells':
        return 'Hồng cầu'
      case 'platelets':
        return 'Tiểu cầu'
      case 'plasma':
        return 'Huyết tương'
      default:
        return 'Huyết tương' // Default to plasma instead of "Không xác định"
    }
  }

  const getComponentColor = (component: string) => {
    switch (component) {
      case 'whole_blood':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'red_cells':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'platelets':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'plasma':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200' // Default to plasma color
    }
  }

  // Blood Stock Management Component
  const BloodStockTab = () => (
    <div className="space-y-6">
      {!showBagDetails ? (
        <>
          {/* Header with actions */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quản lý kho máu</h2>
              <p className="text-gray-600">Theo dõi và quản lý lượng máu trong kho</p>
            </div>
          </div>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng đơn vị</CardTitle>
                <Droplets className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {bloodStock.reduce((sum, stock) => sum + stock.units, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Tất cả nhóm máu</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Có sẵn</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {bloodStock.filter(stock => stock.units > 0).reduce((sum, stock) => sum + stock.units, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Đơn vị sẵn sàng</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã hết</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {bloodStock.filter(stock => stock.units === 0).length}
                </div>
                <p className="text-xs text-muted-foreground">Nhóm máu hết</p>
              </CardContent>
            </Card>
          </div>

          {/* Blood stock table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách kho máu</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhóm máu</TableHead>
                    <TableHead>Số đơn vị</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bloodStock.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          {stock.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell>{stock.units}</TableCell>
                      <TableCell>
                        <Badge className={stock.units > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {stock.units > 0 ? 'Có sẵn' : 'Đã hết'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedStockId(stock.id)
                            setShowBagDetails(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem túi máu
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        <BloodBagDetailsView />
      )}
    </div>
  )

  // Blood Bag Details View Component
  const BloodBagDetailsView = () => {
    const selectedStock = bloodStock.find(stock => stock.id === selectedStockId)
    const filteredBags = bloodBags.filter(bag => bag.stockId === selectedStockId)

    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBagDetails(false)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Chi tiết túi máu - Nhóm {selectedStock?.bloodType}
              </h2>
              <p className="text-gray-600">
                Danh sách túi máu trong kho
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-red-600 border-red-600 text-lg px-3 py-1">
            {selectedStock?.bloodType}
          </Badge>
        </div>

        {/* Summary info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng túi máu</CardTitle>
              <Droplets className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{filteredBags.length}</div>
              <p className="text-xs text-muted-foreground">Tất cả túi</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Có sẵn</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {filteredBags.filter(bag => bag.status === 'available').length}
              </div>
              <p className="text-xs text-muted-foreground">Sẵn sàng sử dụng</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã sử dụng</CardTitle>
              <Clock className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {filteredBags.filter(bag => bag.status === 'used').length}
              </div>
              <p className="text-xs text-muted-foreground">Đã được sử dụng</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng thể tích</CardTitle>
              <TestTube className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                586 ml
              </div>
              <p className="text-xs text-muted-foreground">Tổng lượng máu</p>
            </CardContent>
          </Card>
        </div>

        {/* Blood bags table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách túi máu chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã túi</TableHead>
                  <TableHead>Người hiến</TableHead>
                  <TableHead>Thể tích (ml)</TableHead>
                  <TableHead>Ngày lấy máu</TableHead>
                  <TableHead>Hạn sử dụng</TableHead>
                  <TableHead>Thành phần máu</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBags.map((bag) => (
                  <TableRow key={bag.id}>
                    <TableCell className="font-medium">
                      {bag.bagNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{bag.donorName}</div>
                        <div className="text-sm text-gray-500">{bag.donorId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{bag.volume}</TableCell>
                    <TableCell>{formatDate(bag.collectionDate)}</TableCell>
                    <TableCell>{formatDate(bag.expiryDate)}</TableCell>
                    <TableCell>
                      <Badge className={getComponentColor(bag.component)}>
                        {getComponentName(bag.component)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        bag.status === 'available' ? 'bg-green-100 text-green-800' :
                          bag.status === 'used' ? 'bg-gray-100 text-gray-800' :
                            bag.status === 'expired' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                      }>
                        {bag.status === 'available' ? 'Có sẵn' :
                          bag.status === 'used' ? 'Đã sử dụng' :
                            bag.status === 'expired' ? 'Hết hạn' : 'Đã sử dụng'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm max-w-40">
                      {bag.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Blood Requests Management Component
  const BloodRequestsTab = () => {
    const selectedRequest = useMemo(() =>
      bloodRequests.find(req => req.id === selectedRequestForBloodSelection),
      [bloodRequests, selectedRequestForBloodSelection]
    )

    const availableBags = useMemo(() =>
      bloodBags.filter(bag =>
        bag.status === 'available' &&
        selectedRequest &&
        bag.component === selectedRequest.component &&
        bag.stockId && bloodStock.find(stock => stock.id === bag.stockId)?.bloodType === selectedRequest.bloodType
      ),
      [bloodBags, selectedRequest, bloodStock]
    )

    const handleBagSelection = useCallback((bagId: string) => {
      setSelectedBloodBags(prev => {
        const isCurrentlySelected = prev.includes(bagId)

        if (isCurrentlySelected) {
          // Bỏ chọn túi máu - chỉ tạo array mới nếu thực sự có thay đổi
          const newSelection = prev.filter(id => id !== bagId)
          return newSelection.length !== prev.length ? newSelection : prev
        } else {
          // Thêm túi máu nếu chưa đạt giới hạn
          if (selectedRequest && prev.length < selectedRequest.unitsNeeded) {
            return [...prev, bagId]
          }
          // Không thay đổi nếu đã đạt giới hạn
          return prev
        }
      })
    }, [selectedRequest])

    const handleDialogClose = useCallback((open: boolean) => {
      if (!open) {
        setShowBloodSelectionDialog(false)
        setSelectedBloodBags([])
        setSelectedRequestForBloodSelection(null)
      }
    }, [])

    const handleCancelDialog = useCallback((e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setShowBloodSelectionDialog(false)
      setSelectedBloodBags([])
      setSelectedRequestForBloodSelection(null)
    }, [])

    const handleConfirmDialog = useCallback((e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleConfirmApproval()
    }, [handleConfirmApproval])

    // Memoized table row component to prevent unnecessary re-renders
    const BloodBagTableRow = memo(({ bag, isSelected, isDisabled, onToggle }: {
      bag: BloodBag
      isSelected: boolean
      isDisabled: boolean
      onToggle: (bagId: string) => void
    }) => {
      const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        onToggle(bag.id)
      }, [bag.id, onToggle])

      // Get blood type from stock
      const bloodType = bloodStock.find(stock => stock.id === bag.stockId)?.bloodType || 'N/A'

      return (
        <TableRow key={bag.id} className={isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}>
          <TableCell className="text-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              disabled={isDisabled}
              className="w-4 h-4 cursor-pointer accent-blue-600"
            />
          </TableCell>
          <TableCell className="font-medium font-mono text-sm">
            {bag.bagNumber}
          </TableCell>
          <TableCell>
            <div className="space-y-1">
              <div className="font-medium text-sm">{bag.donorName}</div>
              <div className="text-xs text-gray-500 font-mono">{bag.donorId}</div>
            </div>
          </TableCell>
          <TableCell className="text-center font-medium">
            {bag.volume}
          </TableCell>
          <TableCell className="text-center text-sm">
            {formatDate(bag.collectionDate)}
          </TableCell>
          <TableCell className="text-center text-sm">
            {formatDate(bag.expiryDate)}
          </TableCell>
          <TableCell className="text-center">
            <Badge variant="outline" className="text-red-600 border-red-600 font-semibold">
              {bloodType}
            </Badge>
          </TableCell>
          <TableCell className="text-center">
            <Badge className={`${getComponentColor(bag.component)} font-medium`}>
              {getComponentName(bag.component)}
            </Badge>
          </TableCell>
        </TableRow>
      )
    })

    BloodBagTableRow.displayName = 'BloodBagTableRow'

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý yêu cầu máu</h2>
            <p className="text-gray-600">Xử lý và theo dõi các yêu cầu máu từ bệnh viện</p>
          </div>
        </div>
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng yêu cầu</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{bloodRequests.length}</div>
              <p className="text-xs text-muted-foreground">yêu cầu cần máu</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {bloodRequests.filter(req => req.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Cần xem xét</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khẩn cấp</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {bloodRequests.filter(req => req.urgency === 'critical' || req.urgency === 'high').length}
              </div>
              <p className="text-xs text-muted-foreground">Ưu tiên cao</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã hoàn tất truyền máu</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {bloodRequests.filter(req => req.status === 'fulfilled').length}
              </div>
              <p className="text-xs text-muted-foreground">Hoàn thành</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách yêu cầu máu</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bệnh nhân</TableHead>
                  <TableHead>Nhóm máu</TableHead>
                  <TableHead>Thành phần máu</TableHead>
                  <TableHead>Số đơn vị</TableHead>
                  <TableHead>Mức độ</TableHead>
                  <TableHead>Bệnh viện</TableHead>
                  <TableHead>Ngày yêu cầu</TableHead>
                  <TableHead>Ngày cần</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bloodRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.patientName}</div>
                        <div className="text-sm text-gray-500">{request.patientId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        {request.bloodType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getComponentColor(request.component)}>
                        {getComponentName(request.component)}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.unitsNeeded}</TableCell>
                    <TableCell>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency === 'critical' ? 'Cực kỳ khẩn cấp' :
                          request.urgency === 'high' ? 'Khẩn cấp' :
                            request.urgency === 'medium' ? 'Trung bình' : 'Thấp'}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.hospital}</TableCell>
                    <TableCell>{formatDate(request.requestDate)}</TableCell>
                    <TableCell>{formatDate(request.requiredDate)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status === 'pending' ? 'Chờ xử lý' :
                          request.status === 'approved' ? 'Đã duyệt' :
                            request.status === 'in_progress' ? 'Đang truyền máu' :
                              request.status === 'fulfilled' ? 'Đã hoàn tất truyền máu' : 'Đã hủy'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleApproveRequest(request.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Duyệt
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleRejectRequest(request.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Từ chối
                            </Button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            onClick={() => handleStartTransfusion(request.id)}
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            Bắt đầu truyền máu
                          </Button>
                        )}
                        {request.status === 'in_progress' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleCompleteTransfusion(request.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Hoàn tất truyền máu
                          </Button>
                        )}
                        {(request.status === 'fulfilled' || request.status === 'cancelled') && (
                          <span className="text-sm text-gray-500 italic">
                            Không có thao tác
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {bloodRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-lg font-medium mb-1">Chưa có yêu cầu máu nào</p>
                      <p className="text-sm">Tạo yêu cầu từ kết quả xét nghiệm</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Blood Selection Dialog */}
        <Dialog open={showBloodSelectionDialog} onOpenChange={handleDialogClose}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Chọn túi máu từ kho</DialogTitle>
              {selectedRequest && (
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>Yêu cầu cho bệnh nhân:</span>
                    <strong>{selectedRequest.patientName}</strong>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span>Nhóm máu:</span>
                      <Badge variant="outline" className="text-red-600 border-red-600">{selectedRequest.bloodType}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Thành phần:</span>
                      <Badge className={getComponentColor(selectedRequest.component)}>{getComponentName(selectedRequest.component)}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Cần:</span>
                      <strong>{selectedRequest.unitsNeeded} đơn vị</strong>
                    </div>
                  </div>
                </div>
              )}
            </DialogHeader>

            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-blue-800">
                    Tiến độ chọn túi máu: {selectedBloodBags.length}/{selectedRequest?.unitsNeeded || 0} túi
                  </div>
                  <div className="text-xs text-blue-600">
                    {selectedBloodBags.length === (selectedRequest?.unitsNeeded || 0)
                      ? "✓ Đã đủ số lượng yêu cầu"
                      : `Còn thiếu ${(selectedRequest?.unitsNeeded || 0) - selectedBloodBags.length} túi`}
                  </div>
                </div>
                <div className="mt-2 bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(selectedBloodBags.length / (selectedRequest?.unitsNeeded || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              {availableBags.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Droplets className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Không có túi máu phù hợp</h3>
                  <p className="text-sm">Không tìm thấy túi máu với nhóm máu và thành phần phù hợp trong kho</p>
                </div>
              ) : (
                <>
                  {/* Warning when not enough bags selected */}
                  {selectedBloodBags.length > 0 && selectedBloodBags.length < (selectedRequest?.unitsNeeded || 0) && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-amber-800">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-medium">Chưa đủ số lượng yêu cầu</span>
                      </div>
                      <p className="text-sm text-amber-700 mt-1">
                        Cần chọn thêm {(selectedRequest?.unitsNeeded || 0) - selectedBloodBags.length} túi máu nữa để có thể duyệt yêu cầu này.
                      </p>
                    </div>
                  )}

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="w-16 text-center">Chọn</TableHead>
                          <TableHead className="min-w-[120px]">Mã túi</TableHead>
                          <TableHead className="min-w-[160px]">Người hiến</TableHead>
                          <TableHead className="min-w-[100px] text-center">Thể tích (ml)</TableHead>
                          <TableHead className="min-w-[120px] text-center">Ngày lấy máu</TableHead>
                          <TableHead className="min-w-[120px] text-center">Hạn sử dụng</TableHead>
                          <TableHead className="min-w-[100px] text-center">Nhóm máu</TableHead>
                          <TableHead className="min-w-[120px] text-center">Thành phần</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availableBags.map((bag) => {
                          const isSelected = selectedBloodBags.includes(bag.id)
                          const isDisabled = !isSelected && selectedBloodBags.length >= (selectedRequest?.unitsNeeded || 0)

                          return (
                            <BloodBagTableRow
                              key={bag.id}
                              bag={bag}
                              isSelected={isSelected}
                              isDisabled={isDisabled}
                              onToggle={handleBagSelection}
                            />
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {selectedBloodBags.length > 0 && (
                  <div className="space-y-1">
                    <p className="font-medium">Túi máu đã chọn:</p>
                    <p>{selectedBloodBags.length} túi</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancelDialog}
                  className="min-w-[100px]"
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={handleConfirmDialog}
                  disabled={selectedBloodBags.length === 0 || selectedBloodBags.length < (selectedRequest?.unitsNeeded || 0)}
                  className="bg-green-600 hover:bg-green-700 min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {selectedBloodBags.length < (selectedRequest?.unitsNeeded || 0)
                    ? `Cần thêm ${(selectedRequest?.unitsNeeded || 0) - selectedBloodBags.length} túi nữa`
                    : `Duyệt và phân bổ (${selectedBloodBags.length} túi)`
                  }
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Blood Tests Management Component
  const BloodTestsTab = () => (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {showSuccessMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý xét nghiệm máu</h2>
          <p className="text-gray-600">Chọn bệnh nhân để tiến hành xét nghiệm trước truyền máu</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showSelectPatientDialog} onOpenChange={setShowSelectPatientDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <User className="w-4 h-4 mr-2" />
                Chọn bệnh nhân
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Chọn bệnh nhân để xét nghiệm</DialogTitle>
              </DialogHeader>

              {/* Search */}
              <div className="mb-4">
                <Input
                  placeholder="Tìm kiếm bệnh nhân theo tên hoặc mã..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {/* Patients list */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {patients
                  .filter(patient =>
                    patient.status === 'active' &&
                    (patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      patient.id.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((patient) => (
                    <div
                      key={patient.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedPatientForTest(patient)
                        setShowSelectPatientDialog(false)

                        // Kiểm tra mức độ khẩn cấp
                        const urgency = patient.urgency || 'medium'
                        if (urgency === 'critical' || urgency === 'high') {
                          // Trường hợp khẩn cấp: tự động đặt ngày hôm nay và chuyển thẳng đến xét nghiệm
                          setSelectedTestDate(new Date())
                          setShowTestStepsDialog(true)
                        } else {
                          // Trường hợp thường: cho phép chọn ngày
                          setShowTestDateDialog(true)
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{patient.name}</h3>
                            <Badge variant="outline" className="text-xs">{patient.id}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{patient.age} tuổi</span>
                            <span>{patient.gender === 'male' ? 'Nam' : patient.gender === 'female' ? 'Nữ' : 'Khác'}</span>
                            <span>{patient.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              🩸 {patient.bloodType}
                            </Badge>
                            <Badge variant="outline" className="text-blue-600 border-blue-600">
                              {patient.bloodComponent === 'whole_blood' && '🩸 Máu toàn phần'}
                              {patient.bloodComponent === 'red_cells' && '🔴 Hồng cầu'}
                              {patient.bloodComponent === 'platelets' && '🟡 Tiểu cầu'}
                              {patient.bloodComponent === 'plasma' && '🔵 Huyết tương'}
                            </Badge>
                            <Badge variant="outline" className={`${getUrgencyColor(patient.urgency || 'medium')} font-medium text-xs border`}>
                              {getUrgencyName(patient.urgency || 'medium')}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {(patient.urgency === 'critical' || patient.urgency === 'high') && (
                            <div className="text-xs text-red-600 font-medium text-right">
                              ⚠️ Xét nghiệm ngay
                            </div>
                          )}
                          <Button size="sm" variant="outline" className={
                            (patient.urgency === 'critical' || patient.urgency === 'high')
                              ? 'border-red-600 text-red-600 hover:bg-red-50'
                              : ''
                          }>
                            Chọn
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {patients.filter(p => p.status === 'active').length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Không có bệnh nhân nào đang hoạt động
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Test Date Selection Dialog */}
      <Dialog open={showTestDateDialog} onOpenChange={setShowTestDateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn ngày xét nghiệm</DialogTitle>
            {selectedPatientForTest && (
              <p className="text-sm text-gray-600">
                Bệnh nhân: <strong>{selectedPatientForTest.name}</strong> ({selectedPatientForTest.id})
              </p>
            )}
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Ngày xét nghiệm</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedTestDate ? format(selectedTestDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedTestDate}
                    onSelect={setSelectedTestDate}
                    disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    initialFocus
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowTestDateDialog(false)
                  setSelectedPatientForTest(null)
                  setSelectedTestDate(undefined)
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  if (selectedTestDate) {
                    setShowTestDateDialog(false)
                    setShowTestStepsDialog(true)
                  }
                }}
                disabled={!selectedTestDate}
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Test Steps Guide Dialog */}
      <Dialog open={showTestStepsDialog} onOpenChange={setShowTestStepsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quy trình xét nghiệm máu trước truyền máu</DialogTitle>
            {selectedPatientForTest && (
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Bệnh nhân:</strong> {selectedPatientForTest.name} ({selectedPatientForTest.id})</p>
                <p><strong>Ngày xét nghiệm:</strong> {selectedTestDate ? format(selectedTestDate, 'dd/MM/yyyy', { locale: vi }) : ''}</p>
                <p><strong>Nhóm máu:</strong> {selectedPatientForTest.bloodType}</p>
                <p><strong>Thành phần cần:</strong> {
                  selectedPatientForTest.bloodComponent === 'whole_blood' ? 'Máu toàn phần' :
                    selectedPatientForTest.bloodComponent === 'red_cells' ? 'Hồng cầu' :
                      selectedPatientForTest.bloodComponent === 'platelets' ? 'Tiểu cầu' : 'Huyết tương'
                }</p>
                <p><strong>Mức độ khẩn cấp:</strong> <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(selectedPatientForTest.urgency || 'medium')}`}>
                  {getUrgencyName(selectedPatientForTest.urgency || 'medium')}
                </span></p>
              </div>
            )}
          </DialogHeader>

          <div className="space-y-6">
            {/* Thông báo trường hợp khẩn cấp */}
            {selectedPatientForTest && (selectedPatientForTest.urgency === 'critical' || selectedPatientForTest.urgency === 'high') && (
              <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>⚠️ TRƯỜNG HỢP KHẨN CẤP!</strong> Xét nghiệm sẽ được thực hiện ngay lập tức để đảm bảo an toàn cho bệnh nhân.
                </AlertDescription>
              </Alert>
            )}

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Các bước xét nghiệm bắt buộc trước khi truyền máu để đảm bảo an toàn cho bệnh nhân
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Quy trình xét nghiệm máu</h4>
                <p className="text-sm text-blue-700">
                  Hệ thống sẽ tự động tạo yêu cầu xét nghiệm cho bệnh nhân.
                  Kỹ thuật viên có thể cập nhật kết quả xét nghiệm sau khi hoàn tất.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowTestStepsDialog(false)
                  setSelectedPatientForTest(null)
                  setSelectedTestDate(undefined)
                }}
              >
                Đóng
              </Button>
              <Button
                onClick={() => {
                  if (selectedPatientForTest && selectedTestDate) {
                    // Tạo ID xét nghiệm mới
                    const newTestId = `T${Date.now().toString().slice(-6)}`

                    // Tạo bản ghi xét nghiệm mới
                    const newBloodTest: BloodTest = {
                      id: newTestId,
                      donorId: selectedPatientForTest.id, // Sử dụng ID bệnh nhân làm donorId
                      donorName: selectedPatientForTest.name,
                      testDate: format(selectedTestDate, 'yyyy-MM-dd'),
                      bloodType: selectedPatientForTest.bloodType,
                      hemoglobin: 0, // Sẽ được cập nhật sau khi có kết quả
                      hiv: false,
                      hepatitisB: false,
                      hepatitisC: false,
                      syphilis: false,
                      status: 'pending',
                      technician: 'Đang chờ phân công',
                      notes: `Xét nghiệm trước truyền máu cho bệnh nhân ${selectedPatientForTest.name}. Thành phần cần: ${getComponentName(selectedPatientForTest.bloodComponent)}`
                    }

                    // Thêm vào danh sách xét nghiệm
                    setBloodTests(prev => [newBloodTest, ...prev])

                    // Hiển thị thông báo thành công
                    setShowSuccessMessage(`Đã tạo yêu cầu xét nghiệm cho bệnh nhân ${selectedPatientForTest.name}`)
                    setTimeout(() => setShowSuccessMessage(''), 5000) // Ẩn thông báo sau 5 giây

                    console.log('Đã tạo yêu cầu xét nghiệm:', newBloodTest)

                    // Reset và đóng dialog
                    setShowTestStepsDialog(false)
                    setSelectedPatientForTest(null)
                    setSelectedTestDate(undefined)

                    // Tự động chuyển sang tab xét nghiệm để xem kết quả
                    setActiveTab('tests')
                  }
                }}
              >
                Bắt đầu xét nghiệm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Test Result Dialog */}
      <Dialog open={showUpdateResultDialog} onOpenChange={setShowUpdateResultDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cập nhật kết quả xét nghiệm</DialogTitle>
            {selectedTestForUpdate && (
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Bệnh nhân:</strong> {selectedTestForUpdate.donorName} ({selectedTestForUpdate.donorId})</p>
                <p><strong>Nhóm máu:</strong> {selectedTestForUpdate.bloodType}</p>
                <p><strong>Ngày xét nghiệm:</strong> {formatDate(selectedTestForUpdate.testDate)}</p>
              </div>
            )}
          </DialogHeader>

          <form onSubmit={handleSaveTestResult}>
            <div className="space-y-6">
              {(() => {
                // Find patient info for blood component
                const patient = patients.find(p => p.id === selectedTestForUpdate?.donorId)
                const patientBloodComponent = patient?.bloodComponent || ''

                return (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nhóm máu xác nhận</Label>
                      <select
                        id="confirmedBloodType"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={selectedTestForUpdate?.bloodType || ''}
                      >
                        <option value="">Chọn nhóm máu</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div>
                      <Label>Thành phần máu xác nhận</Label>
                      <select
                        id="confirmedBloodComponent"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={patientBloodComponent}
                      >
                        <option value="">Chọn thành phần máu</option>
                        <option value="whole_blood">Máu toàn phần</option>
                        <option value="red_cells">Hồng cầu</option>
                        <option value="platelets">Tiểu cầu</option>
                        <option value="plasma">Huyết tương</option>
                      </select>
                    </div>
                  </div>
                )
              })()}

              {/* Số đơn vị máu cần */}
              <div>
                <Label htmlFor="bloodUnits">Số đơn vị máu cần</Label>
                <div className="flex items-center space-x-2">
                  <select
                    id="bloodUnits"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="1"
                  >
                    <option value="1">1 đơn vị</option>
                    <option value="2">2 đơn vị</option>
                    <option value="3">3 đơn vị</option>
                    <option value="4">4 đơn vị</option>
                    <option value="5">5 đơn vị</option>
                    <option value="6">6 đơn vị</option>
                    <option value="7">7 đơn vị</option>
                    <option value="8">8 đơn vị</option>
                    <option value="9">9 đơn vị</option>
                    <option value="10">10 đơn vị</option>
                  </select>
                  <div className="text-sm text-gray-500 min-w-max">
                    (450ml/đơn vị)
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Chọn số đơn vị máu cần thiết cho bệnh nhân dựa trên kết quả xét nghiệm
                </p>
              </div>

              <div>
                <Label htmlFor="testNotes">Ghi chú</Label>
                <Textarea
                  id="testNotes"
                  placeholder="Ghi chú thêm về kết quả xét nghiệm..."
                  defaultValue={selectedTestForUpdate?.notes || ''}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (selectedTestForUpdate) {
                      // Cập nhật trạng thái thành hủy
                      const updatedTest = {
                        ...selectedTestForUpdate,
                        status: 'failed' as const,
                        notes: (selectedTestForUpdate.notes || '') + '\n[Đã hủy xét nghiệm]'
                      }

                      setBloodTests(prev => prev.map(t => t.id === selectedTestForUpdate.id ? updatedTest : t))
                      console.log('Đã hủy xét nghiệm:', updatedTest)

                      setShowSuccessMessage(`Đã hủy xét nghiệm cho ${selectedTestForUpdate.donorName}`)
                      setTimeout(() => setShowSuccessMessage(''), 5000)

                      setShowUpdateResultDialog(false)
                      setSelectedTestForUpdate(null)
                    }
                  }}
                >
                  Hủy xét nghiệm
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Xác nhận
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tests table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách xét nghiệm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Nhóm máu</TableHead>
                <TableHead>Thành phần máu</TableHead>
                <TableHead>Mức độ khẩn cấp</TableHead>
                <TableHead>Ngày XN</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bloodTests.map((test) => {
                // Find patient info for blood component
                const patient = patients.find(p => p.id === test.donorId)
                const bloodComponent = patient?.bloodComponent || ''

                // Extract result information from notes
                const getTestResult = () => {
                  if (test.status === 'pending') {
                    return <span className="text-gray-400 italic">Chờ xét nghiệm</span>
                  }

                  const notes = test.notes || ''
                  const hasBloodTypeChange = notes.includes('[Sửa nhóm máu:')
                  const hasComponentChange = notes.includes('[Sửa thành phần máu:')

                  if (hasBloodTypeChange || hasComponentChange) {
                    const changes = []

                    if (hasBloodTypeChange) {
                      const bloodTypeMatch = notes.match(/\[Sửa nhóm máu: (.+?) → (.+?)\]/)
                      if (bloodTypeMatch) {
                        changes.push(`Nhóm máu: ${bloodTypeMatch[1]} → ${bloodTypeMatch[2]}`)
                      }
                    }

                    if (hasComponentChange) {
                      const componentMatch = notes.match(/\[Sửa thành phần máu: (.+?) → (.+?)\]/)
                      if (componentMatch) {
                        changes.push(`Thành phần: ${componentMatch[1]} → ${componentMatch[2]}`)
                      }
                    }

                    return (
                      <div className="text-xs">
                        <div className="text-orange-600 font-medium mb-1">Có thay đổi:</div>
                        {changes.map((change, index) => (
                          <div key={index} className="text-orange-700">{change}</div>
                        ))}
                      </div>
                    )
                  } else {
                    return <span className="text-green-600 text-xs font-medium">Không thay đổi</span>
                  }
                }

                return (
                  <TableRow key={test.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{test.donorName}</div>
                        <div className="text-sm text-gray-500">{test.donorId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        {test.bloodType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {bloodComponent && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          {bloodComponent === 'whole_blood' && 'Máu toàn phần'}
                          {bloodComponent === 'red_cells' && 'Hồng cầu'}
                          {bloodComponent === 'platelets' && 'Tiểu cầu'}
                          {bloodComponent === 'plasma' && 'Huyết tương'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {patient && (
                        <Badge variant="outline" className={`${getUrgencyColor(patient.urgency || 'medium')} font-medium text-xs border`}>
                          {getUrgencyName(patient.urgency || 'medium')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(test.testDate)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(test.status)}>
                        {test.status === 'passed' ? 'Đã xác nhận' :
                          test.status === 'failed' && test.notes?.includes('[Đã hủy xét nghiệm]') ? 'Đã hủy' :
                            test.status === 'failed' ? 'Cần sửa' : 'Chờ xác nhận'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getTestResult()}
                    </TableCell>
                    <TableCell>
                      {test.notes ? (
                        <div className="text-xs text-blue-600 max-w-60 truncate" title={test.notes}>
                          {test.notes.replace(/\[.*?\]/g, '').trim() || 'Không có ghi chú thêm'}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Không có ghi chú</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {test.status === 'pending' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => handleUpdateTestResult(test)}
                        >
                          Kết quả xét nghiệm
                        </Button>
                      ) : test.status === 'failed' && test.notes?.includes('[Đã hủy xét nghiệm]') ? (
                        <span className="text-red-500 text-xs italic">Đã hủy</span>
                      ) : (
                        <span className="text-gray-500 text-xs italic">Đã xác nhận</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {bloodTests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    <TestTube className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-lg font-medium mb-1">Chưa có xét nghiệm nào</p>
                    <p className="text-sm">Chọn bệnh nhân để bắt đầu quy trình xét nghiệm</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  // Patients Management Component
  const PatientsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý bệnh nhân</h2>
          <p className="text-gray-600">Thông tin bệnh nhân cần truyền máu</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Xóa dữ liệu cũ 
              localStorage.removeItem('patients')
              const defaultPatients: Patient[] = []
              localStorage.setItem('patients', JSON.stringify(defaultPatients))
              setPatients(defaultPatients)
              console.log('Đã làm mới dữ liệu bệnh nhân')
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới dữ liệu
          </Button>
          <Dialog open={showAddPatientDialog} onOpenChange={setShowAddPatientDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Thêm bệnh nhân
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm bệnh nhân mới</DialogTitle>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleAddPatient}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Họ và tên</Label>
                    <Input
                      id="patientName"
                      placeholder="Nhập họ tên bệnh nhân"
                      defaultValue=""
                      required
                      onKeyDown={handleNameKeyDown}
                      onInput={handleNameInput}
                      onPaste={handleNamePaste}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Tuổi</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="35"
                      min="1"
                      max="150"
                      required
                      defaultValue=""
                      onKeyDown={handleNumericKeyDown}
                      onInput={handleAgeInput}
                      onPaste={handleAgePaste}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Giới tính</Label>
                    <Select onValueChange={(value) => genderRef.current = value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="patientBloodType">Nhóm máu</Label>
                    <Select onValueChange={(value) => bloodTypeRef.current = value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhóm máu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bloodComponent">Thành phần máu yêu cầu</Label>
                    <Select onValueChange={(value) => bloodComponentRef.current = value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thành phần máu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whole_blood">Máu toàn phần</SelectItem>
                        <SelectItem value="red_cells">Hồng cầu</SelectItem>
                        <SelectItem value="platelets">Tiểu cầu</SelectItem>
                        <SelectItem value="plasma">Huyết tương</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="urgency">Mức độ khẩn cấp</Label>
                    <Select onValueChange={(value) => urgencyRef.current = value} defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mức độ khẩn cấp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">🔴 Cực kỳ khẩn cấp</SelectItem>
                        <SelectItem value="high">🟠 Khẩn cấp</SelectItem>
                        <SelectItem value="medium">🟡 Trung bình</SelectItem>
                        <SelectItem value="low">🟢 Thấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      placeholder="0901234567"
                      pattern="^0[0-9]{9}$"
                      maxLength={10}
                      title="Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số"
                      required
                      defaultValue=""
                      onKeyDown={handleNumericKeyDown}
                      onInput={handlePhoneInput}
                      onPaste={handlePhonePaste}
                    />
                  </div>
                  <div>
                    <Label htmlFor="citizenId">Căn cước công dân</Label>
                    <Input
                      id="citizenId"
                      placeholder="001234567890"
                      pattern="^[0-9]{12}$"
                      maxLength={12}
                      title="Căn cước công dân phải có đúng 12 chữ số"
                      required
                      defaultValue=""
                      onKeyDown={handleNumericKeyDown}
                      onInput={handleCitizenIdInput}
                      onPaste={handleCitizenIdPaste}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@gmail.com"
                      pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                      title="Email phải có định dạng @gmail.com"
                      required
                      defaultValue=""
                      onInput={handleEmailInput}
                      onBlur={(e) => {
                        const target = e.target as HTMLInputElement
                        const value = target.value

                        // Hiển thị validation message khi blur
                        if (value && !value.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
                          target.reportValidity()
                        }
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      placeholder="Nhập địa chỉ đầy đủ"
                      defaultValue=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">Liên hệ khẩn cấp</Label>
                    <Input
                      id="emergencyContact"
                      placeholder="0907654321"
                      pattern="^0[0-9]{9}$"
                      maxLength={10}
                      title="Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số"
                      required
                      defaultValue=""
                      onKeyDown={handleNumericKeyDown}
                      onInput={handleEmergencyContactInput}
                      onPaste={handleEmergencyContactPaste}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="medicalHistory">Tiền sử bệnh</Label>
                    <Textarea
                      id="medicalHistory"
                      placeholder="Mô tả tiền sử bệnh..."
                      defaultValue=""
                    />
                  </div>
                  <div className="col-span-2 flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        // Reset form first
                        if (formRef.current) {
                          formRef.current.reset()
                        }
                        // Reset refs
                        genderRef.current = ''
                        bloodTypeRef.current = ''
                        bloodComponentRef.current = ''
                        urgencyRef.current = ''
                        // Close dialog
                        setShowAddPatientDialog(false)
                      }}
                    >
                      Hủy
                    </Button>
                    <Button type="submit">Thêm bệnh nhân</Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Patient Details Dialog */}
          <Dialog open={showPatientDetailsDialog} onOpenChange={handleClosePatientDetails}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditingPatient ? 'Chỉnh sửa bệnh nhân' : 'Thông tin bệnh nhân'}
                </DialogTitle>
              </DialogHeader>

              {selectedPatient && (
                <>
                  {!isEditingPatient ? (
                    // View Mode
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Họ và tên</Label>
                          <p className="text-lg font-medium">{selectedPatient.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Mã bệnh nhân</Label>
                          <p className="text-lg font-mono">{selectedPatient.id}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Tuổi</Label>
                          <p className="text-lg">{selectedPatient.age} tuổi</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Giới tính</Label>
                          <p className="text-lg">
                            {selectedPatient.gender === 'male' ? 'Nam' :
                              selectedPatient.gender === 'female' ? 'Nữ' : 'Khác'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Nhóm máu</Label>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-red-600 border-red-600 text-lg px-4 py-2 font-bold">
                              🩸 {selectedPatient.bloodType || 'N/A'}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Thành phần máu cần</Label>
                          <div className="mt-2">
                            <Badge variant="outline" className={`${getComponentColor(selectedPatient.bloodComponent || 'plasma')} text-sm px-4 py-2 font-medium border`}>
                              {selectedPatient.bloodComponent === 'whole_blood' && '🩸'}
                              {selectedPatient.bloodComponent === 'red_cells' && '🔴'}
                              {selectedPatient.bloodComponent === 'platelets' && '🟡'}
                              {selectedPatient.bloodComponent === 'plasma' && '🔵'}
                              {!selectedPatient.bloodComponent && '🔵'}
                              {' '}{getComponentName(selectedPatient.bloodComponent || 'plasma')}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Mức độ khẩn cấp</Label>
                          <div className="mt-2">
                            <Badge variant="outline" className={`${getUrgencyColor(selectedPatient.urgency || 'medium')} text-sm px-4 py-2 font-medium border`}>
                              {getUrgencyName(selectedPatient.urgency || 'medium')}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Số điện thoại</Label>
                          <p className="text-lg font-mono">{selectedPatient.phone}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Email</Label>
                          <p className="text-lg">{selectedPatient.email}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">CCCD</Label>
                          <p className="text-lg font-mono">{selectedPatient.citizenId}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Liên hệ khẩn cấp</Label>
                          <p className="text-lg font-mono">{selectedPatient.emergencyContact}</p>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-sm font-semibold text-gray-600">Địa chỉ</Label>
                          <p className="text-lg">{selectedPatient.address}</p>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-sm font-semibold text-gray-600">Tiền sử bệnh</Label>
                          {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
                            <div className="space-y-2">
                              {selectedPatient.medicalHistory.map((history, index) => (
                                <div key={index} className="bg-yellow-50 text-yellow-800 px-3 py-2 rounded-lg">
                                  {history}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 italic">Không có tiền sử bệnh</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Ngày đăng ký</Label>
                          <p className="text-lg">{formatDate(selectedPatient.registrationDate)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Trạng thái</Label>
                          <div className="mt-1">
                            <Badge
                              className={`${getStatusColor(selectedPatient.status)} text-xs px-2 py-1 font-medium flex items-center gap-1 w-fit`}
                            >
                              {selectedPatient.status === 'active' ? (
                                <>
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                  Hoạt động
                                </>
                              ) : (
                                <>
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                  Không hoạt động
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons for view mode */}
                      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <Button
                          variant="outline"
                          onClick={handleEditPatient}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeletePatient}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Edit Mode
                    <form ref={editFormRef} onSubmit={handleSavePatientEdit}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="editPatientName">Họ và tên</Label>
                          <Input
                            id="editPatientName"
                            placeholder="Nhập họ tên bệnh nhân"
                            defaultValue={selectedPatient.name}
                            required
                            onKeyDown={handleNameKeyDown}
                            onInput={handleNameInput}
                            onPaste={handleNamePaste}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editAge">Tuổi</Label>
                          <Input
                            id="editAge"
                            type="number"
                            placeholder="35"
                            min="1"
                            max="150"
                            required
                            defaultValue={selectedPatient.age.toString()}
                            onKeyDown={handleNumericKeyDown}
                            onInput={handleAgeInput}
                            onPaste={handleAgePaste}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editGender">Giới tính</Label>
                          <Select
                            defaultValue={selectedPatient.gender}
                            onValueChange={(value) => editGenderRef.current = value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Nam</SelectItem>
                              <SelectItem value="female">Nữ</SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="editPatientBloodType">Nhóm máu</Label>
                          <Select
                            defaultValue={selectedPatient.bloodType}
                            onValueChange={(value) => editBloodTypeRef.current = value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhóm máu" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="editBloodComponent">Thành phần máu yêu cầu</Label>
                          <Select
                            defaultValue={selectedPatient.bloodComponent}
                            onValueChange={(value) => editBloodComponentRef.current = value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn thành phần máu" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="whole_blood">Máu toàn phần</SelectItem>
                              <SelectItem value="red_cells">Hồng cầu</SelectItem>
                              <SelectItem value="platelets">Tiểu cầu</SelectItem>
                              <SelectItem value="plasma">Huyết tương</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="editUrgency">Mức độ khẩn cấp</Label>
                          <Select
                            defaultValue={selectedPatient.urgency || 'medium'}
                            onValueChange={(value) => editUrgencyRef.current = value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn mức độ khẩn cấp" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="critical">🔴 Cực kỳ khẩn cấp</SelectItem>
                              <SelectItem value="high">🟠 Khẩn cấp</SelectItem>
                              <SelectItem value="medium">🟡 Trung bình</SelectItem>
                              <SelectItem value="low">🟢 Thấp</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="editPhone">Số điện thoại</Label>
                          <Input
                            id="editPhone"
                            placeholder="0901234567"
                            pattern="^0[0-9]{9}$"
                            maxLength={10}
                            title="Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số"
                            required
                            defaultValue={selectedPatient.phone}
                            onKeyDown={handleNumericKeyDown}
                            onInput={handlePhoneInput}
                            onPaste={handlePhonePaste}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editCitizenId">Căn cước công dân</Label>
                          <Input
                            id="editCitizenId"
                            placeholder="001234567890"
                            pattern="^[0-9]{12}$"
                            maxLength={12}
                            title="Căn cước công dân phải có đúng 12 chữ số"
                            required
                            defaultValue={selectedPatient.citizenId}
                            onKeyDown={handleNumericKeyDown}
                            onInput={handleCitizenIdInput}
                            onPaste={handleCitizenIdPaste}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editEmail">Email</Label>
                          <Input
                            id="editEmail"
                            type="email"
                            placeholder="email@gmail.com"
                            pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                            title="Email phải có định dạng @gmail.com"
                            required
                            defaultValue={selectedPatient.email}
                            onInput={handleEmailInput}
                            onBlur={(e) => {
                              const target = e.target as HTMLInputElement
                              const value = target.value

                              if (value && !value.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
                                target.reportValidity()
                              }
                            }}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="editAddress">Địa chỉ</Label>
                          <Input
                            id="editAddress"
                            placeholder="Nhập địa chỉ đầy đủ"
                            defaultValue={selectedPatient.address}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editEmergencyContact">Liên hệ khẩn cấp</Label>
                          <Input
                            id="editEmergencyContact"
                            placeholder="0907654321"
                            pattern="^0[0-9]{9}$"
                            maxLength={10}
                            title="Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số"
                            required
                            defaultValue={selectedPatient.emergencyContact}
                            onKeyDown={handleNumericKeyDown}
                            onInput={handleEmergencyContactInput}
                            onPaste={handleEmergencyContactPaste}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="editMedicalHistory">Tiền sử bệnh</Label>
                          <Textarea
                            id="editMedicalHistory"
                            placeholder="Mô tả tiền sử bệnh..."
                            defaultValue={selectedPatient.medicalHistory?.join(', ') || ''}
                          />
                        </div>
                        <div className="col-span-2 flex justify-end gap-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            Hủy
                          </Button>
                          <Button type="submit">
                            <Save className="w-4 h-4 mr-2" />
                            Lưu thay đổi
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm bệnh nhân..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Patients table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bệnh nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Tuổi/Giới tính</TableHead>
                <TableHead>Nhóm máu</TableHead>
                <TableHead>Thành phần cần</TableHead>
                <TableHead>Mức độ khẩn cấp</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>CCCD</TableHead>
                <TableHead>Liên hệ khẩn cấp</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Tiền sử bệnh</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                const filteredPatients = patients.filter(patient =>
                  !searchTerm ||
                  patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  patient.phone.includes(searchTerm) ||
                  patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  patient.citizenId.includes(searchTerm)
                )

                if (filteredPatients.length === 0) {
                  return (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <User className="w-12 h-12 text-gray-300" />
                          <p className="text-gray-500">
                            {searchTerm ? `Không tìm thấy bệnh nhân nào với từ khóa "${searchTerm}"` : 'Chưa có bệnh nhân nào'}
                          </p>
                          {searchTerm && (
                            <p className="text-sm text-gray-400">
                              Thử tìm kiếm với tên, mã BN, số điện thoại, email hoặc CCCD
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                }

                return filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleViewPatient(patient)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{patient.age} tuổi</div>
                        <div className="text-gray-500">
                          {patient.gender === 'male' ? 'Nam' : patient.gender === 'female' ? 'Nữ' : 'Khác'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-red-600 border-red-600 font-bold">
                        🩸 {patient.bloodType || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getComponentColor(patient.bloodComponent || 'plasma')} font-medium text-xs border`}>
                        {patient.bloodComponent === 'whole_blood' && '🩸'}
                        {patient.bloodComponent === 'red_cells' && '🔴'}
                        {patient.bloodComponent === 'platelets' && '🟡'}
                        {patient.bloodComponent === 'plasma' && '🔵'}
                        {!patient.bloodComponent && '🔵'}
                        {' '}{getComponentName(patient.bloodComponent || 'plasma')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getUrgencyColor(patient.urgency || 'medium')} font-medium text-xs border`}>
                        {getUrgencyName(patient.urgency || 'medium')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{patient.phone}</div>
                        <div className="text-gray-500 truncate max-w-32">{patient.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{patient.citizenId}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{patient.emergencyContact}</div>
                    </TableCell>
                    <TableCell className="max-w-36 truncate text-sm">{patient.address}</TableCell>
                    <TableCell className="max-w-32 text-sm">
                      {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                        <div className="space-y-1">
                          {patient.medicalHistory.slice(0, 2).map((history, index) => (
                            <div key={index} className="text-xs bg-yellow-50 text-yellow-800 px-2 py-1 rounded truncate">
                              {history}
                            </div>
                          ))}
                          {patient.medicalHistory.length > 2 && (
                            <div className="text-xs text-gray-500">+{patient.medicalHistory.length - 2} khác</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Không có</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(patient.registrationDate)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              })()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Staff Header - matching dashboard style */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="/images/logo.webp"
                    alt="ScαrletBlood Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">ScαrletBlood Staff</h1>
                  <p className="text-sm text-gray-600">Bảng điều khiển nhân viên</p>
                </div>
              </Link>
              <Badge className="bg-blue-100 text-blue-800">
                <ClipboardList className="w-3 h-3 mr-1" />
                Nhân viên
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Xin chào, <strong>Staff</strong>
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Về trang chủ
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/staff/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Main header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hệ thống quản lý truyền máu</h1>
          <p className="text-gray-600">Hệ thống quản lý kho máu, yêu cầu, xét nghiệm và bệnh nhân</p>
        </div>
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stock" className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              kho máu
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Yêu cầu máu
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Xét nghiệm
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Bệnh nhân
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stock">
            <BloodStockTab />
          </TabsContent>

          <TabsContent value="requests">
            <BloodRequestsTab />
          </TabsContent>

          <TabsContent value="tests">
            <BloodTestsTab />
          </TabsContent>

          <TabsContent value="patients">
            <PatientsTab />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster position="top-center" containerStyle={{
        top: 80,
      }} />
    </div>
  )
}
