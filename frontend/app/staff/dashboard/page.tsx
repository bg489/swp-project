"use client"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Droplets,
  AlertTriangle,
  Plus,
  Users,
  Phone,
  LogOut,
  Home,
  ClipboardList,
  FileText,
  Search,
  Edit,
  Package,
  UserPlus,
  Hospital,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"

export default function StaffDashboard() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  // Mock staff data
  const staffStats = {
    totalDonors: 1247,
    activeDonors: 892,
    totalBloodUnits: 612,
    lowStockTypes: 3,
    pendingRequests: 7,
    completedToday: 12,
  }

  // Mock donors data
  const donors = [
    {
      id: "D001",
      name: "Nguyễn Văn A",
      bloodType: "O+",
      phone: "0901234567",
      email: "nguyenvana@email.com",
      lastDonation: "2024-09-15",
      totalDonations: 5,
      status: "active",
      nextEligible: "2024-12-15",
    },
    {
      id: "D002",
      name: "Trần Thị B",
      bloodType: "A-",
      phone: "0907654321",
      email: "tranthib@email.com",
      lastDonation: "2024-08-20",
      totalDonations: 3,
      status: "active",
      nextEligible: "2024-11-20",
    },
    {
      id: "D003",
      name: "Lê Văn C",
      bloodType: "B+",
      phone: "0912345678",
      email: "levanc@email.com",
      lastDonation: "2024-10-01",
      totalDonations: 8,
      status: "inactive",
      nextEligible: "2025-01-01",
    },
    {
      id: "D004",
      name: "Phạm Thị D",
      bloodType: "AB+",
      phone: "0909876543",
      email: "phamthid@email.com",
      lastDonation: "2024-11-10",
      totalDonations: 2,
      status: "active",
      nextEligible: "2025-02-10",
    },
  ]

  // Mock blood inventory
  const bloodInventory = [
    { type: "O-", available: 45, reserved: 5, status: "low", expiringSoon: 3 },
    { type: "O+", available: 120, reserved: 10, status: "good", expiringSoon: 8 },
    { type: "A-", available: 78, reserved: 8, status: "good", expiringSoon: 5 },
    { type: "A+", available: 156, reserved: 15, status: "good", expiringSoon: 12 },
    { type: "B-", available: 34, reserved: 3, status: "low", expiringSoon: 2 },
    { type: "B+", available: 89, reserved: 9, status: "good", expiringSoon: 7 },
    { type: "AB-", available: 23, reserved: 2, status: "critical", expiringSoon: 1 },
    { type: "AB+", available: 67, reserved: 7, status: "good", expiringSoon: 4 },
  ]

  // Mock blood requests
  const bloodRequests = [
    {
      id: "REQ001",
      patientName: "Nguyễn Văn C",
      hospital: "Bệnh viện Chợ Rẫy",
      bloodType: "O-",
      unitsNeeded: 2,
      urgency: "Khẩn cấp",
      contactPhone: "0901111111",
      doctorName: "BS. Trần Văn D",
      reason: "Phẫu thuật tim",
      status: "pending",
      requestTime: "08:00 - 24/12/2024",
      neededBy: "14:00 - 24/12/2024",
    },
    {
      id: "REQ002",
      patientName: "Lê Thị E",
      hospital: "Bệnh viện Bình Dan",
      bloodType: "A+",
      unitsNeeded: 1,
      urgency: "Cao",
      contactPhone: "0902222222",
      doctorName: "BS. Phạm Thị F",
      reason: "Tai nạn giao thông",
      status: "approved",
      requestTime: "09:30 - 24/12/2024",
      neededBy: "16:00 - 24/12/2024",
    },
    {
      id: "REQ003",
      patientName: "Hoàng Văn G",
      hospital: "Bệnh viện Từ Dũ",
      bloodType: "B+",
      unitsNeeded: 3,
      urgency: "Trung bình",
      contactPhone: "0903333333",
      doctorName: "BS. Nguyễn Văn H",
      reason: "Sinh con khó",
      status: "completed",
      requestTime: "15:00 - 23/12/2024",
      neededBy: "10:00 - 24/12/2024",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getBloodStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800"
      case "low":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Khẩn cấp":
        return "bg-red-100 text-red-800"
      case "Cao":
        return "bg-orange-100 text-orange-800"
      case "Trung bình":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <ProtectedRoute requiredRole="staff">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Staff Header */}
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
                  Xin chào, <strong>{user?.name}</strong>
                </span>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Về trang chủ
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 flex-grow">
          {/* Staff Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Người hiến máu</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{staffStats.totalDonors}</div>
                <p className="text-xs text-muted-foreground">{staffStats.activeDonors} đang hoạt động</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kho máu</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{staffStats.totalBloodUnits}</div>
                <p className="text-xs text-muted-foreground">{staffStats.lowStockTypes} loại sắp hết</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Yêu cầu máu</CardTitle>
                <Hospital className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{staffStats.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">đang chờ xử lý</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hoàn thành hôm nay</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{staffStats.completedToday}</div>
                <p className="text-xs text-muted-foreground">giao dịch</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="donors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="donors">Người hiến máu</TabsTrigger>
              <TabsTrigger value="inventory">Kho máu</TabsTrigger>
              <TabsTrigger value="requests">Yêu cầu máu</TabsTrigger>
              <TabsTrigger value="reports">Báo cáo</TabsTrigger>
            </TabsList>

            <TabsContent value="donors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Quản lý người hiến máu</span>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Thêm người hiến
                    </Button>
                  </CardTitle>
                  <CardDescription>Quản lý thông tin và lịch sử hiến máu của người hiến</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input placeholder="Tìm kiếm theo tên, email, số điện thoại..." className="pl-10" />
                    </div>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Nhóm máu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
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
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {donors.map((donor) => (
                      <div key={donor.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{donor.name}</p>
                            <p className="text-sm text-gray-600">{donor.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-red-600">
                                {donor.bloodType}
                              </Badge>
                              <Badge className={getStatusColor(donor.status)}>
                                {donor.status === "active" ? "Hoạt động" : "Không hoạt động"}
                              </Badge>
                              <span className="text-xs text-gray-500">{donor.totalDonations} lần hiến</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right text-sm">
                            <p className="text-gray-600">Lần cuối: {donor.lastDonation}</p>
                            <p className="text-gray-500">Có thể hiến: {donor.nextEligible}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4 mr-1" />
                            Gọi
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Quản lý kho máu
                    </span>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nhập máu mới
                    </Button>
                  </CardTitle>
                  <CardDescription>Theo dõi tồn kho và tình trạng máu theo từng nhóm</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {bloodInventory.map((blood) => (
                      <Card key={blood.type} className="relative">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold text-red-600">{blood.type}</CardTitle>
                            <Badge className={getBloodStatusColor(blood.status)}>
                              {blood.status === "good" ? "Đủ" : blood.status === "low" ? "Ít" : "Thiếu"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Có sẵn:</span>
                              <span className="font-semibold">{blood.available} đơn vị</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Đã đặt:</span>
                              <span className="font-semibold">{blood.reserved} đơn vị</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Sắp hết hạn:</span>
                              <span className="font-semibold text-orange-600">{blood.expiringSoon} đơn vị</span>
                            </div>
                            <Progress
                              value={blood.status === "critical" ? 15 : blood.status === "low" ? 40 : 80}
                              className="h-2 mt-2"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Cảnh báo tồn kho</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {bloodInventory
                            .filter((blood) => blood.status === "critical" || blood.status === "low")
                            .map((blood) => (
                              <div key={blood.type} className="flex items-center justify-between p-3 border rounded">
                                <div className="flex items-center space-x-3">
                                  <AlertTriangle
                                    className={`w-5 h-5 ${
                                      blood.status === "critical" ? "text-red-600" : "text-yellow-600"
                                    }`}
                                  />
                                  <div>
                                    <p className="font-medium">Nhóm máu {blood.type}</p>
                                    <p className="text-sm text-gray-600">Còn {blood.available} đơn vị</p>
                                  </div>
                                </div>
                                <Button size="sm" variant="outline">
                                  Liên hệ người hiến
                                </Button>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Máu sắp hết hạn</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {bloodInventory
                            .filter((blood) => blood.expiringSoon > 0)
                            .map((blood) => (
                              <div key={blood.type} className="flex items-center justify-between p-3 border rounded">
                                <div className="flex items-center space-x-3">
                                  <Clock className="w-5 h-5 text-orange-600" />
                                  <div>
                                    <p className="font-medium">Nhóm máu {blood.type}</p>
                                    <p className="text-sm text-gray-600">{blood.expiringSoon} đơn vị sắp hết hạn</p>
                                  </div>
                                </div>
                                <Button size="sm" variant="outline">
                                  Ưu tiên sử dụng
                                </Button>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Hospital className="w-5 h-5 mr-2" />
                      Quản lý yêu cầu máu
                    </span>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tạo yêu cầu mới
                    </Button>
                  </CardTitle>
                  <CardDescription>Xử lý yêu cầu máu từ bệnh viện và cơ sở y tế</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input placeholder="Tìm kiếm theo bệnh viện, bệnh nhân..." className="pl-10" />
                    </div>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Mức độ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="emergency">Khẩn cấp</SelectItem>
                        <SelectItem value="high">Cao</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="pending">Chờ xử lý</SelectItem>
                        <SelectItem value="approved">Đã duyệt</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {bloodRequests.map((request) => (
                      <div
                        key={request.id}
                        className={`p-4 border rounded-lg ${
                          request.urgency === "Khẩn cấp" ? "border-red-200 bg-red-50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                              <Hospital className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-medium">{request.hospital}</h3>
                                <Badge className={getUrgencyColor(request.urgency)}>{request.urgency}</Badge>
                                <Badge className={getStatusColor(request.status)}>
                                  {request.status === "pending"
                                    ? "Chờ xử lý"
                                    : request.status === "approved"
                                      ? "Đã duyệt"
                                      : "Hoàn thành"}
                                </Badge>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p>
                                    <strong>Bệnh nhân:</strong> {request.patientName}
                                  </p>
                                  <p>
                                    <strong>Bác sĩ:</strong> {request.doctorName}
                                  </p>
                                  <p>
                                    <strong>Lý do:</strong> {request.reason}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Nhóm máu:</strong>{" "}
                                    <span className="text-red-600 font-semibold">{request.bloodType}</span>
                                  </p>
                                  <p>
                                    <strong>Số lượng:</strong> {request.unitsNeeded} đơn vị
                                  </p>
                                  <p>
                                    <strong>Cần trước:</strong> {request.neededBy}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4 mr-1" />
                              Gọi
                            </Button>
                            {request.status === "pending" && (
                              <>
                                <Button size="sm">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Duyệt
                                </Button>
                                <Button size="sm" variant="outline">
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Từ chối
                                </Button>
                              </>
                            )}
                            {request.status === "approved" && (
                              <Button size="sm">
                                <Droplets className="w-4 h-4 mr-1" />
                                Giao máu
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Báo cáo tổng quan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Tổng số người hiến máu:</span>
                        <span className="font-semibold">{staffStats.totalDonors}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Người hiến đang hoạt động:</span>
                        <span className="font-semibold text-green-600">{staffStats.activeDonors}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Tổng đơn vị máu trong kho:</span>
                        <span className="font-semibold text-red-600">{staffStats.totalBloodUnits}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Yêu cầu đang chờ xử lý:</span>
                        <span className="font-semibold text-orange-600">{staffStats.pendingRequests}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Giao dịch hoàn thành hôm nay:</span>
                        <span className="font-semibold text-blue-600">{staffStats.completedToday}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Thao tác nhanh</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full justify-start">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Đăng ký người hiến mới
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Nhập máu vào kho
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Hospital className="w-4 h-4 mr-2" />
                        Tạo yêu cầu máu
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Cảnh báo tồn kho
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Xuất báo cáo chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
