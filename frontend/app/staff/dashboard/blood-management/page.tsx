"use client"

import React, { useState, useEffect } from 'react'
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
import { format } from 'date-fns'
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
  LogOut
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

interface BloodRequest {
  id: string
  patientName: string
  patientId: string
  bloodType: string
  unitsNeeded: number
  urgency: 'low' | 'medium' | 'high' | 'critical'
  requestDate: string
  requiredDate: string
  status: 'pending' | 'approved' | 'fulfilled' | 'cancelled'
  hospital: string
  doctorName: string
  reason: string
  notes?: string
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
  phone: string
  email: string
  address: string
  emergencyContact: string
  medicalHistory: string[]
  registrationDate: string
  status: 'active' | 'inactive'
}

export default function BloodManagementPage() {
  const router = useRouter()
  
  // State management
  const [activeTab, setActiveTab] = useState('stock')
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([])
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([])
  const [bloodTests, setBloodTests] = useState<BloodTest[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedDate, setSelectedDate] = useState<Date>()

  // Sample data initialization
  useEffect(() => {
    // Initialize with sample data
    setBloodStock([
      {
        id: '1',
        bloodType: 'O+',
        units: 25,
        expiryDate: '2025-09-15',
        status: 'available',
        location: 'Kho A - Tủ 1',
        collectionDate: '2025-07-15'
      },
      {
        id: '2',
        bloodType: 'A+',
        units: 18,
        expiryDate: '2025-08-28',
        status: 'available',
        location: 'Kho A - Tủ 2',
        collectionDate: '2025-07-01'
      },
      {
        id: '3',
        bloodType: 'B-',
        units: 8,
        expiryDate: '2025-08-10',
        status: 'reserved',
        location: 'Kho B - Tủ 1',
        collectionDate: '2025-06-25'
      }
    ])

    setBloodRequests([
      {
        id: '1',
        patientName: 'Nguyễn Văn A',
        patientId: 'P001',
        bloodType: 'O+',
        unitsNeeded: 3,
        urgency: 'high',
        requestDate: '2025-08-05',
        requiredDate: '2025-08-06',
        status: 'pending',
        hospital: 'Bệnh viện Chợ Rẫy',
        doctorName: 'BS. Trần Thị B',
        reason: 'Phẫu thuật tim'
      },
      {
        id: '2',
        patientName: 'Lê Thị C',
        patientId: 'P002',
        bloodType: 'A+',
        unitsNeeded: 2,
        urgency: 'medium',
        requestDate: '2025-08-04',
        requiredDate: '2025-08-07',
        status: 'approved',
        hospital: 'Bệnh viện 115',
        doctorName: 'BS. Phạm Văn D',
        reason: 'Tai nạn giao thông'
      }
    ])

    setBloodTests([
      {
        id: '1',
        donorId: 'D001',
        donorName: 'Hoàng Văn E',
        testDate: '2025-08-03',
        bloodType: 'O+',
        hemoglobin: 14.5,
        hiv: false,
        hepatitisB: false,
        hepatitisC: false,
        syphilis: false,
        status: 'passed',
        technician: 'KTV. Nguyễn F'
      },
      {
        id: '2',
        donorId: 'D002',
        donorName: 'Vũ Thị G',
        testDate: '2025-08-02',
        bloodType: 'A+',
        hemoglobin: 12.8,
        hiv: false,
        hepatitisB: false,
        hepatitisC: false,
        syphilis: false,
        status: 'passed',
        technician: 'KTV. Lê H'
      }
    ])

    setPatients([
      {
        id: 'P001',
        name: 'Nguyễn Văn A',
        age: 45,
        gender: 'male',
        bloodType: 'O+',
        phone: '0901234567',
        email: 'nguyenvana@email.com',
        address: '123 Nguyễn Huệ, Q1, TP.HCM',
        emergencyContact: '0907654321',
        medicalHistory: ['Cao huyết áp', 'Tiểu đường'],
        registrationDate: '2025-01-15',
        status: 'active'
      },
      {
        id: 'P002',
        name: 'Lê Thị C',
        age: 28,
        gender: 'female',
        bloodType: 'A+',
        phone: '0902345678',
        email: 'lethic@email.com',
        address: '456 Lê Lợi, Q3, TP.HCM',
        emergencyContact: '0908765432',
        medicalHistory: [],
        registrationDate: '2025-02-20',
        status: 'active'
      }
    ])
  }, [])

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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi })
  }

  // Blood Stock Management Component
  const BloodStockTab = () => (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý tồn kho máu</h2>
          <p className="text-gray-600">Theo dõi và quản lý lượng máu tồn kho</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Thêm kho máu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm kho máu mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bloodType">Nhóm máu</Label>
                  <Select>
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
                  <Label htmlFor="units">Số đơn vị</Label>
                  <Input id="units" type="number" placeholder="Nhập số đơn vị" />
                </div>
                <div>
                  <Label htmlFor="location">Vị trí lưu trữ</Label>
                  <Input id="location" placeholder="Ví dụ: Kho A - Tủ 1" />
                </div>
                <div>
                  <Label>Ngày hết hạn</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">Hủy</Button>
                  <Button>Thêm mới</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo nhóm máu, vị trí..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="available">Có sẵn</SelectItem>
            <SelectItem value="reserved">Đã đặt trước</SelectItem>
            <SelectItem value="expired">Hết hạn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              {bloodStock.filter(stock => stock.status === 'available').reduce((sum, stock) => sum + stock.units, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Đơn vị sẵn sàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã đặt trước</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {bloodStock.filter(stock => stock.status === 'reserved').reduce((sum, stock) => sum + stock.units, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Đơn vị đã đặt</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hết hạn</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {bloodStock.filter(stock => stock.status === 'expired').reduce((sum, stock) => sum + stock.units, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Cần xử lý</p>
          </CardContent>
        </Card>
      </div>

      {/* Blood stock table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tồn kho</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhóm máu</TableHead>
                <TableHead>Số đơn vị</TableHead>
                <TableHead>Ngày thu thập</TableHead>
                <TableHead>Ngày hết hạn</TableHead>
                <TableHead>Vị trí</TableHead>
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
                  <TableCell>{formatDate(stock.collectionDate)}</TableCell>
                  <TableCell>{formatDate(stock.expiryDate)}</TableCell>
                  <TableCell>{stock.location}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(stock.status)}>
                      {stock.status === 'available' ? 'Có sẵn' : 
                       stock.status === 'reserved' ? 'Đã đặt trước' : 'Hết hạn'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  // Blood Requests Management Component
  const BloodRequestsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý yêu cầu máu</h2>
          <p className="text-gray-600">Xử lý và theo dõi các yêu cầu máu từ bệnh viện</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất danh sách
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo tên bệnh nhân, bệnh viện..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="fulfilled">Đã cung cấp</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
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
            <p className="text-xs text-muted-foreground">Trong tháng này</p>
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
            <CardTitle className="text-sm font-medium">Đã cung cấp</CardTitle>
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
                       request.status === 'fulfilled' ? 'Đã cung cấp' : 'Đã hủy'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="sm" className="text-green-600">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  // Blood Tests Management Component
  const BloodTestsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý xét nghiệm máu</h2>
          <p className="text-gray-600">Theo dõi kết quả xét nghiệm máu từ người hiến</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Nhập kết quả
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Thêm xét nghiệm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm kết quả xét nghiệm</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="donorId">Mã người hiến</Label>
                  <Input id="donorId" placeholder="Nhập mã người hiến" />
                </div>
                <div>
                  <Label htmlFor="donorName">Tên người hiến</Label>
                  <Input id="donorName" placeholder="Nhập tên người hiến" />
                </div>
                <div>
                  <Label htmlFor="testDate">Ngày xét nghiệm</Label>
                  <Input id="testDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="bloodType">Nhóm máu</Label>
                  <Select>
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
                  <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
                  <Input id="hemoglobin" type="number" step="0.1" placeholder="12.5" />
                </div>
                <div>
                  <Label htmlFor="technician">Kỹ thuật viên</Label>
                  <Input id="technician" placeholder="Tên kỹ thuật viên" />
                </div>
                <div className="col-span-2">
                  <Label>Xét nghiệm bệnh truyền nhiễm</Label>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="hiv" />
                      <Label htmlFor="hiv">HIV</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="hepatitisB" />
                      <Label htmlFor="hepatitisB">Viêm gan B</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="hepatitisC" />
                      <Label htmlFor="hepatitisC">Viêm gan C</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="syphilis" />
                      <Label htmlFor="syphilis">Giang mai</Label>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea id="notes" placeholder="Ghi chú thêm..." />
                </div>
                <div className="col-span-2 flex justify-end gap-2 pt-4">
                  <Button variant="outline">Hủy</Button>
                  <Button>Lưu kết quả</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tests table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách xét nghiệm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người hiến</TableHead>
                <TableHead>Nhóm máu</TableHead>
                <TableHead>Ngày XN</TableHead>
                <TableHead>Hemoglobin</TableHead>
                <TableHead>HIV</TableHead>
                <TableHead>HBV</TableHead>
                <TableHead>HCV</TableHead>
                <TableHead>Giang mai</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead>KTV</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bloodTests.map((test) => (
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
                  <TableCell>{formatDate(test.testDate)}</TableCell>
                  <TableCell>{test.hemoglobin}</TableCell>
                  <TableCell>
                    <Badge className={test.hiv ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                      {test.hiv ? '(+)' : '(-)'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={test.hepatitisB ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                      {test.hepatitisB ? '(+)' : '(-)'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={test.hepatitisC ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                      {test.hepatitisC ? '(+)' : '(-)'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={test.syphilis ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                      {test.syphilis ? '(+)' : '(-)'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(test.status)}>
                      {test.status === 'passed' ? 'Đạt' : 
                       test.status === 'failed' ? 'Không đạt' : 'Chờ kết quả'}
                    </Badge>
                  </TableCell>
                  <TableCell>{test.technician}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất danh sách
          </Button>
          <Dialog>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientName">Họ và tên</Label>
                  <Input id="patientName" placeholder="Nhập họ tên bệnh nhân" />
                </div>
                <div>
                  <Label htmlFor="age">Tuổi</Label>
                  <Input id="age" type="number" placeholder="35" />
                </div>
                <div>
                  <Label htmlFor="gender">Giới tính</Label>
                  <Select>
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
                  <Select>
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
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" placeholder="0901234567" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input id="address" placeholder="Nhập địa chỉ đầy đủ" />
                </div>
                <div>
                  <Label htmlFor="emergencyContact">Liên hệ khẩn cấp</Label>
                  <Input id="emergencyContact" placeholder="0907654321" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="medicalHistory">Tiền sử bệnh</Label>
                  <Textarea id="medicalHistory" placeholder="Mô tả tiền sử bệnh..." />
                </div>
                <div className="col-span-2 flex justify-end gap-2 pt-4">
                  <Button variant="outline">Hủy</Button>
                  <Button>Thêm bệnh nhân</Button>
                </div>
              </div>
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
                <TableHead>Liên hệ</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.age} tuổi / {patient.gender === 'male' ? 'Nam' : patient.gender === 'female' ? 'Nữ' : 'Khác'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      {patient.bloodType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{patient.phone}</div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-48 truncate">{patient.address}</TableCell>
                  <TableCell>{formatDate(patient.registrationDate)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/staff/dashboard" className="hover:text-gray-700">
              Dashboard
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Hệ thống quản lý truyền máu</span>
          </div>
        </div>

        {/* Main header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hệ thống quản lý truyền máu</h1>
          <p className="text-gray-600">Hệ thống quản lý tồn kho máu, yêu cầu, xét nghiệm và bệnh nhân</p>
        </div>

        {/* Quick Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Tổng tồn kho</CardTitle>
              <Droplets className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {bloodStock.reduce((sum, stock) => sum + stock.units, 0)} đơn vị
              </div>
              <p className="text-xs text-red-600">Tất cả nhóm máu</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Yêu cầu chờ</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {bloodRequests.filter(req => req.status === 'pending').length}
              </div>
              <p className="text-xs text-yellow-600">Cần xử lý</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Xét nghiệm</CardTitle>
              <TestTube className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{bloodTests.length}</div>
              <p className="text-xs text-green-600">Tổng số mẫu</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Bệnh nhân</CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
              <p className="text-xs text-blue-600">Đã đăng ký</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stock" className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              Tồn kho máu
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
    </div>
  )
}
