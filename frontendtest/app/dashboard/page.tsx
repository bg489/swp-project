"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Heart, Users, Droplets, AlertTriangle, Phone, Plus, BarChart3, PieChart, LineChart } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const stats = {
    totalDonors: 2547,
    activeDonors: 1823,
    bloodUnits: 15420,
    emergencyRequests: 23,
    monthlyGrowth: 12.5,
    successfulDonations: 98.2,
  }

  const bloodInventory = [
    { type: "O-", units: 45, status: "low", color: "bg-red-500" },
    { type: "O+", units: 120, status: "good", color: "bg-red-400" },
    { type: "A-", units: 78, status: "medium", color: "bg-blue-500" },
    { type: "A+", units: 156, status: "good", color: "bg-blue-400" },
    { type: "B-", units: 34, status: "low", color: "bg-green-500" },
    { type: "B+", units: 89, status: "medium", color: "bg-green-400" },
    { type: "AB-", units: 23, status: "critical", color: "bg-purple-500" },
    { type: "AB+", units: 67, status: "medium", color: "bg-purple-400" },
  ]

  const recentRequests = [
    {
      id: "REQ001",
      patient: "Nguyễn Văn A",
      bloodType: "O-",
      units: 2,
      priority: "Khẩn cấp",
      status: "Đang xử lý",
      time: "2 giờ trước",
    },
    {
      id: "REQ002",
      patient: "Trần Thị B",
      bloodType: "A+",
      units: 1,
      priority: "Cao",
      status: "Đã hoàn thành",
      time: "5 giờ trước",
    },
    {
      id: "REQ003",
      patient: "Lê Văn C",
      bloodType: "B+",
      units: 3,
      priority: "Trung bình",
      status: "Chờ xử lý",
      time: "1 ngày trước",
    },
  ]

  const upcomingDonations = [
    {
      donor: "Phạm Thị D",
      bloodType: "O+",
      time: "09:00 - Hôm nay",
      phone: "0901234567",
    },
    {
      donor: "Hoàng Văn E",
      bloodType: "A-",
      time: "14:00 - Hôm nay",
      phone: "0907654321",
    },
    {
      donor: "Ngô Thị F",
      bloodType: "AB+",
      time: "10:00 - Ngày mai",
      phone: "0912345678",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "low":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "good":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BloodConnect</h1>
                <p className="text-sm text-gray-600">Dashboard Quản lý</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/emergency">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Khẩn cấp
                </Link>
              </Button>
              <Button asChild>
                <Link href="/donate">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm người hiến
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Quản lý</h1>
          <p className="text-gray-600">Tổng quan hệ thống hiến máu và quản lý hoạt động</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="inventory">Kho máu</TabsTrigger>
            <TabsTrigger value="requests">Yêu cầu</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng người hiến</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDonors.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+{stats.monthlyGrowth}%</span> so với tháng trước
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Người hiến hoạt động</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeDonors.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.activeDonors / stats.totalDonors) * 100).toFixed(1)}% tổng số người hiến
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Đơn vị máu</CardTitle>
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.bloodUnits.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Tổng số đơn vị máu đã thu thập</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Yêu cầu khẩn cấp</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.emergencyRequests}</div>
                  <p className="text-xs text-muted-foreground">Đang chờ xử lý</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Yêu cầu gần đây</CardTitle>
                  <CardDescription>Các yêu cầu máu mới nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Droplets className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">{request.patient}</p>
                            <p className="text-sm text-gray-600">
                              {request.bloodType} - {request.units} đơn vị
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                          <p className="text-xs text-gray-500 mt-1">{request.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lịch hiến máu hôm nay</CardTitle>
                  <CardDescription>Người hiến đã đăng ký</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDonations.map((donation, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{donation.donor}</p>
                            <p className="text-sm text-gray-600">
                              {donation.bloodType} - {donation.time}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-1" />
                          Gọi
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
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
                    <div className="text-2xl font-bold mb-2">{blood.units}</div>
                    <div className="text-sm text-gray-600 mb-2">đơn vị có sẵn</div>
                    <Progress value={blood.units} max={200} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {blood.units < 50 ? "Cần bổ sung khẩn cấp" : blood.units < 100 ? "Cần bổ sung" : "Đủ dự trữ"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cảnh báo kho máu</CardTitle>
                <CardDescription>Các nhóm máu cần bổ sung</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bloodInventory
                    .filter((b) => b.status === "critical" || b.status === "low")
                    .map((blood) => (
                      <div
                        key={blood.type}
                        className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50"
                      >
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="font-medium">Nhóm máu {blood.type}</p>
                            <p className="text-sm text-gray-600">Chỉ còn {blood.units} đơn vị</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Tìm người hiến
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Quản lý yêu cầu</h2>
              <Button asChild>
                <Link href="/emergency">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo yêu cầu mới
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tất cả yêu cầu</CardTitle>
                <CardDescription>Danh sách các yêu cầu máu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <Droplets className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{request.patient}</p>
                          <p className="text-sm text-gray-600">Mã: {request.id}</p>
                          <p className="text-sm text-gray-600">
                            {request.bloodType} - {request.units} đơn vị
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                          <p className="text-xs text-gray-500 mt-1">{request.time}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Chi tiết
                          </Button>
                          <Button size="sm">Xử lý</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Thống kê tháng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Người hiến mới:</span>
                      <span className="font-semibold">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lần hiến máu:</span>
                      <span className="font-semibold">342</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đơn vị máu:</span>
                      <span className="font-semibold">856</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Phân bố nhóm máu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>O+:</span>
                      <span className="font-semibold">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>A+:</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>B+:</span>
                      <span className="font-semibold">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Khác:</span>
                      <span className="font-semibold">17%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="w-5 h-5 mr-2" />
                    Hiệu suất
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tỷ lệ thành công:</span>
                      <span className="font-semibold text-green-600">98.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thời gian phản hồi:</span>
                      <span className="font-semibold">2.3h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hài lòng:</span>
                      <span className="font-semibold text-green-600">4.8/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Báo cáo chi tiết</CardTitle>
                <CardDescription>Xuất báo cáo theo thời gian</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button variant="outline">Báo cáo tuần</Button>
                  <Button variant="outline">Báo cáo tháng</Button>
                  <Button variant="outline">Báo cáo quý</Button>
                  <Button>Xuất Excel</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
