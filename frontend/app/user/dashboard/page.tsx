"use client"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Calendar,
  Clock,
  Droplets,
  User,
  Award,
  Bell,
  Settings,
  LogOut,
  Edit,
  Plus,
  CheckCircle,
  AlertCircle,
  Gift,
  Home,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"

export default function UserDashboard() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  // Mock user data
  const userStats = {
    totalDonations: 5,
    nextEligibleDate: "2024-12-15",
    bloodType: "O+",
    lastDonation: "2024-09-15",
    points: 250,
    level: "Người hùng Bạc",
    daysUntilNext: 45,
  }

  const donationHistory = [
    {
      id: "D001",
      date: "15/09/2024",
      location: "Trung tâm Hiến máu Nhân đạo",
      units: 350,
      status: "completed",
      points: 50,
    },
    {
      id: "D002",
      date: "15/06/2024",
      location: "Bệnh viện Chợ Rẫy",
      units: 350,
      status: "completed",
      points: 50,
    },
    {
      id: "D003",
      date: "15/03/2024",
      location: "Trung tâm Hiến máu Nhân đạo",
      units: 350,
      status: "completed",
      points: 50,
    },
    {
      id: "D004",
      date: "15/12/2023",
      location: "Bệnh viện Bình Dan",
      units: 350,
      status: "completed",
      points: 50,
    },
    {
      id: "D005",
      date: "15/09/2023",
      location: "Trung tâm Hiến máu Nhân đạo",
      units: 350,
      status: "completed",
      points: 50,
    },
  ]

  const upcomingAppointments = [
    {
      id: "A001",
      date: "2024-12-20",
      time: "09:00",
      location: "Trung tâm Hiến máu Nhân đạo",
      type: "Hiến máu định kỳ",
      status: "confirmed",
    },
  ]

  const notifications = [
    {
      id: 1,
      type: "reminder",
      title: "Nhắc nhở hiến máu",
      message: "Bạn có thể hiến máu trở lại từ ngày 15/12/2024",
      time: "2 ngày trước",
      read: false,
    },
    {
      id: 2,
      type: "emergency",
      title: "Yêu cầu khẩn cấp",
      message: "Cần gấp nhóm máu O+ tại BV Chợ Rẫy",
      time: "1 tuần trước",
      read: true,
    },
    {
      id: 3,
      type: "achievement",
      title: "Chúc mừng!",
      message: "Bạn đã đạt cấp độ 'Người hùng Bạc'",
      time: "2 tuần trước",
      read: true,
    },
  ]

  const achievements = [
    {
      id: 1,
      name: "Người hiến đầu tiên",
      description: "Hoàn thành lần hiến máu đầu tiên",
      icon: "🏆",
      earned: true,
      earnedDate: "15/09/2023",
    },
    {
      id: 2,
      name: "Người hùng Bạc",
      description: "Hiến máu 5 lần",
      icon: "🥈",
      earned: true,
      earnedDate: "15/09/2024",
    },
    {
      id: 3,
      name: "Người hùng Vàng",
      description: "Hiến máu 10 lần",
      icon: "🥇",
      earned: false,
      progress: 50,
    },
    {
      id: 4,
      name: "Cứu tinh khẩn cấp",
      description: "Phản hồi yêu cầu khẩn cấp trong 1 giờ",
      icon: "⚡",
      earned: false,
      progress: 0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return Clock
      case "emergency":
        return AlertCircle
      case "achievement":
        return Award
      default:
        return Bell
    }
  }

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* User Header */}
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">BloodConnect</h1>
                    <p className="text-sm text-gray-600">Bảng điều khiển cá nhân</p>
                  </div>
                </Link>
                <Badge className="bg-blue-100 text-blue-800">
                  <User className="w-3 h-3 mr-1" />
                  Người hiến máu
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Xin chào, <strong>{user?.full_name}</strong>
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
          {/* User Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng lần hiến</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{userStats.totalDonations}</div>
                <p className="text-xs text-muted-foreground">lần hiến máu</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nhóm máu</CardTitle>
                <Droplets className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.bloodType}</div>
                <p className="text-xs text-muted-foreground">Nhóm máu của bạn</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Điểm thưởng</CardTitle>
                <Gift className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{userStats.points}</div>
                <p className="text-xs text-muted-foreground">điểm tích lũy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cấp độ</CardTitle>
                <Award className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-purple-600">{userStats.level}</div>
                <p className="text-xs text-muted-foreground">Cấp độ hiện tại</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="history">Lịch sử</TabsTrigger>
              <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
              <TabsTrigger value="achievements">Thành tích</TabsTrigger>
              <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Next Donation Countdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      Lần hiến tiếp theo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-3xl font-bold text-blue-600">{userStats.daysUntilNext} ngày</div>
                      <p className="text-gray-600">
                        Bạn có thể hiến máu trở lại từ ngày <strong>{userStats.nextEligibleDate}</strong>
                      </p>
                      <Progress value={((90 - userStats.daysUntilNext) / 90) * 100} className="h-2" />
                      <Button className="w-full" disabled={userStats.daysUntilNext > 0}>
                        <Calendar className="w-4 h-4 mr-2" />
                        {userStats.daysUntilNext > 0 ? "Chưa đến thời gian" : "Đặt lịch hiến máu"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Bell className="w-5 h-5 mr-2 text-yellow-600" />
                        Thông báo
                      </span>
                      <Badge variant="outline">{notifications.filter((n) => !n.read).length} mới</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.slice(0, 3).map((notification) => {
                        const IconComponent = getNotificationIcon(notification.type)
                        return (
                          <div
                            key={notification.id}
                            className={`flex items-start space-x-3 p-3 rounded-lg ${
                              !notification.read ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                              <IconComponent className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-sm text-gray-600">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Hành động nhanh</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button asChild className="h-20 flex-col">
                      <Link href="/user/donate">
                        <Heart className="w-6 h-6 mb-2" />
                        Đặt lịch hiến máu
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="h-20 flex-col">
                      <Link href="/emergency">
                        <AlertCircle className="w-6 h-6 mb-2" />
                        Yêu cầu khẩn cấp
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="h-20 flex-col">
                      <Link href="/user/profile">
                        <Settings className="w-6 h-6 mb-2" />
                        Cập nhật hồ sơ
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử hiến máu</CardTitle>
                  <CardDescription>Tất cả các lần hiến máu của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {donationHistory.map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">Hiến máu #{donation.id}</p>
                            <p className="text-sm text-gray-600">{donation.location}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">{donation.date}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">{donation.units}ml</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(donation.status)}>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Hoàn thành
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">+{donation.points} điểm</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Lịch hẹn sắp tới</span>
                    <Button asChild>
                      <Link href="/user/donate">
                        <Plus className="w-4 h-4 mr-2" />
                        Đặt lịch mới
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.type}</p>
                              <p className="text-sm text-gray-600">{appointment.location}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Clock className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-500">
                                  {appointment.date} lúc {appointment.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-1" />
                              Sửa
                            </Button>
                            <Badge className={getStatusColor(appointment.status)}>Đã xác nhận</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4" />
                      <p>Bạn chưa có lịch hẹn nào</p>
                      <Button asChild className="mt-4">
                        <Link href="/user/donate">Đặt lịch hiến máu</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thành tích & Huy hiệu</CardTitle>
                  <CardDescription>Các thành tích bạn đã đạt được</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 border rounded-lg ${
                          achievement.earned ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                            {achievement.earned ? (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Đã đạt được • {achievement.earnedDate}
                              </Badge>
                            ) : (
                              <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Tiến độ</span>
                                  <span>{achievement.progress}%</span>
                                </div>
                                <Progress value={achievement.progress} className="h-2" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>Quản lý thông tin tài khoản của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-4">Thông tin cơ bản</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-600">Họ và tên</label>
                            <p className="font-medium">{user?.full_name}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Email</label>
                            <p className="font-medium">{user?.email}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Số điện thoại</label>
                            <p className="font-medium">{user?.phone}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Địa chỉ</label>
                            <p className="font-medium">{user?.address}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-4">Thông tin y tế</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-600">Nhóm máu</label>
                            <p className="font-medium text-red-600">O+</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Lần hiến cuối</label>
                            <p className="font-medium">Chưa hiến</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Tổng lần hiến</label>
                            <p className="font-medium">5 lần</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <Button>
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa thông tin
                      </Button>
                      <Button variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Cài đặt tài khoản
                      </Button>
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
