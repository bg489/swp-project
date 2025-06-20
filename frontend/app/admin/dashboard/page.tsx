"use client"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Users,
  Droplets,
  AlertTriangle,
  Plus,
  Settings,
  UserCheck,
  UserX,
  Shield,
  Activity,
  TrendingUp,
  Eye,
  Edit,
  LogOut,
  Home,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"

export default function AdminDashboard() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  // Mock admin data
  const adminStats = {
    totalUsers: 2547,
    activeUsers: 1823,
    pendingApprovals: 45,
    totalDonations: 15420,
    emergencyRequests: 23,
    bloodUnitsAvailable: 1250,
    monthlyGrowth: 12.5,
    systemHealth: 98.2,
  }

  const bloodInventory = [
    { type: "O-", units: 45, status: "low", target: 100, color: "bg-red-500" },
    { type: "O+", units: 120, status: "good", target: 150, color: "bg-red-400" },
    { type: "A-", units: 78, status: "medium", target: 100, color: "bg-blue-500" },
    { type: "A+", units: 156, status: "good", target: 150, color: "bg-blue-400" },
    { type: "B-", units: 34, status: "critical", target: 80, color: "bg-green-500" },
    { type: "B+", units: 89, status: "medium", target: 120, color: "bg-green-400" },
    { type: "AB-", units: 23, status: "critical", target: 60, color: "bg-purple-500" },
    { type: "AB+", units: 67, status: "medium", target: 80, color: "bg-purple-400" },
  ]

  const pendingUsers = [
    {
      id: "U001",
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      bloodType: "O+",
      phone: "0901234567",
      registeredAt: "2 giờ trước",
      status: "pending",
    },
    {
      id: "U002",
      name: "Trần Thị B",
      email: "tranthib@email.com",
      bloodType: "A-",
      phone: "0907654321",
      registeredAt: "5 giờ trước",
      status: "pending",
    },
    {
      id: "U003",
      name: "Lê Văn C",
      email: "levanc@email.com",
      bloodType: "B+",
      phone: "0912345678",
      registeredAt: "1 ngày trước",
      status: "pending",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "donation",
      message: "Nguyễn Văn A đã hoàn thành hiến máu",
      time: "10 phút trước",
      icon: Heart,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "emergency",
      message: "Yêu cầu khẩn cấp từ BV Chợ Rẫy - O- 2 đơn vị",
      time: "25 phút trước",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      id: 3,
      type: "registration",
      message: "3 người dùng mới đăng ký hiến máu",
      time: "1 giờ trước",
      icon: UserCheck,
      color: "text-blue-600",
    },
    {
      id: 4,
      type: "system",
      message: "Cập nhật hệ thống thành công",
      time: "2 giờ trước",
      icon: Settings,
      color: "text-gray-600",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "low":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "good":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Admin Header */}
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
                    <h1 className="text-xl font-bold text-gray-900">ScαrletBlood Admin</h1>
                    <p className="text-sm text-gray-600">Bảng điều khiển quản trị</p>
                  </div>
                </Link>
                <Badge className="bg-red-100 text-red-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Quản trị viên
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
          {/* Admin Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />+{adminStats.monthlyGrowth}%
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{adminStats.pendingApprovals}</div>
                <p className="text-xs text-muted-foreground">Cần xem xét</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kho máu</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.bloodUnitsAvailable}</div>
                <p className="text-xs text-muted-foreground">Đơn vị có sẵn</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Khẩn cấp</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{adminStats.emergencyRequests}</div>
                <p className="text-xs text-muted-foreground">Đang xử lý</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="users">Người dùng</TabsTrigger>
              <TabsTrigger value="inventory">Kho máu</TabsTrigger>
              <TabsTrigger value="requests">Yêu cầu</TabsTrigger>
              <TabsTrigger value="settings">Cài đặt</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* System Health */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-green-600" />
                      Tình trạng hệ thống
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Hiệu suất hệ thống</span>
                          <span className="text-sm font-medium">{adminStats.systemHealth}%</span>
                        </div>
                        <Progress value={adminStats.systemHealth} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Người dùng hoạt động</span>
                          <span className="text-sm font-medium">
                            {((adminStats.activeUsers / adminStats.totalUsers) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={(adminStats.activeUsers / adminStats.totalUsers) * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hoạt động gần đây</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                            <activity.icon className={`w-4 h-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              {/* Pending Approvals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Người dùng chờ duyệt</span>
                    <Badge variant="outline">{pendingUsers.length} chờ duyệt</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-red-600">
                                {user.bloodType}
                              </Badge>
                              <span className="text-xs text-gray-500">{user.registeredAt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Xem
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <UserCheck className="w-4 h-4 mr-1" />
                            Duyệt
                          </Button>
                          <Button size="sm" variant="destructive">
                            <UserX className="w-4 h-4 mr-1" />
                            Từ chối
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              {/* Blood Inventory Management */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {bloodInventory.map((blood) => (
                  <Card key={blood.type}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 ${blood.color} rounded-full flex items-center justify-center`}>
                          <span className="text-xl font-bold text-white">{blood.type}</span>
                        </div>
                        <Badge className={getStatusColor(blood.status)}>
                          {blood.status === "critical"
                            ? "Rất thấp"
                            : blood.status === "low"
                              ? "Thấp"
                              : blood.status === "medium"
                                ? "Trung bình"
                                : "Tốt"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-2xl font-bold">{blood.units}</span>
                          <span className="text-sm text-gray-500">/ {blood.target}</span>
                        </div>
                        <Progress value={(blood.units / blood.target) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Hiện có</span>
                          <span>Mục tiêu</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Sửa
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Plus className="w-3 h-3 mr-1" />
                          Thêm
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quản lý yêu cầu máu</CardTitle>
                  <CardDescription>Tất cả yêu cầu máu trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                    <p>Chức năng quản lý yêu cầu đang được phát triển</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Cài đặt hệ thống
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Cài đặt chung</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Tự động duyệt người dùng</p>
                            <p className="text-sm text-gray-600">Tự động duyệt đăng ký người hiến máu mới</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Bật
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Thông báo khẩn cấp</p>
                            <p className="text-sm text-gray-600">Gửi thông báo khi có yêu cầu khẩn cấp</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Cấu hình
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Sao lưu dữ liệu</p>
                            <p className="text-sm text-gray-600">Tự động sao lưu dữ liệu hàng ngày</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Cài đặt
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
