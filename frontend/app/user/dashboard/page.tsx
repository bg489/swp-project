"use client"
import { ProtectedRoute } from "@/components/auth/protected-route"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Search,
  Phone,
  Droplet,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"
import api from "../../../lib/axios";
import toast, { Toaster } from "react-hot-toast"

export default function UserDashboard() {
  const router = useRouter()
  const [bloodRequests, setBloodRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hospital, setHospital] = useState<{ name: string; address?: string; phone?: string } | null>(null);
  const [hospitalNames, setHospitalNames] = useState<Record<string, string>>({})
  const [donationRecords, setDonationRecords] = useState({})
  const [bloodManageFilter, setBloodManageFilter] = useState("blood-request-history");
  const [donationList, setDonationList] = useState([]);
  const [warehouseDonationsList2, setWarehouseDonationsList2] = useState([]);
  const [receiveCount, setReceiveCount] = useState(0);
  const { user, logout } = useAuth()

  const handleReject = async (donationId: string) => {
    try {
      if (!confirm("Bạn có chắc muốn từ chối đợt hiến máu này không?")) { return; }

      await api.put(`/staff/donations/${donationId}/update-status`, {
        status: "cancelled",
      });

      console.log(donationRecords)

      setDonationRecords((prev: any) => ({
        ...prev,
        data: prev.data.map((donation: any) =>
          donation._id === donationId ? { ...donation, status: "cancelled" } : donation
        ),
      }));


      console.log(donationRecords)

      toast.success("Đã từ chối thành công")


    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái. Vui lòng thử lại!");
      console.error(error);
    }
  };


  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng tính từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const daysUntil = (dateStr: string | undefined) => {
    if (!dateStr) return "-";
    const now = new Date();
    const target = new Date(dateStr);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0; // trả về 0 nếu đã qua ngày cooldown
  };


  type DonorProfile = {
    blood_type: string;
    availability_date: string;
    health_cert_url?: string;
    cooldown_until?: string;
    createdAt?: string;
    updatedAt?: string;
    // Add other fields if needed
  };

  const [donor, setDonor] = useState<DonorProfile | null>(null);
  type RecipientProfile = {
    medical_doc_url: string;
    hospital_name: string;
    createdAt?: string;
    updatedAt?: string;
  };
  const [recipient, setRecipient] = useState<RecipientProfile | null>(null);

  function translateStatus(status: string) {
    const map: Record<string, string> = {
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      matched: "Đã ghép",
      in_progress: "Đang xử lý",
      completed: "Hoàn tất",
      cancelled: "Đã hủy",
      rejected: "Từ chối",
    }

    return map[status] || status
  }

  const handleEdit = async () => {
    setIsLoading(true)
    router.push("/user/dashboard/edit")
    setIsLoading(false)
  }

  const handleResetPassword = async () => {
    setIsLoading(true)
    await api.post("/otp/send", {
      email: user?.email
    })
    router.push(`/user/dashboard/otp?email=${user?.email}`)
    setIsLoading(false)
  }

  useEffect(() => {
    async function fetchProfile() {
      if (user?.role === "donor") {
        try {
          const response = await api.get(`/users/donor-profile/active/${user._id}`);
          setDonor(response.data.profile);
          const hospitalId = response.data.profile?.hospital; // lưu ý: hospital_name phải là ID
          if (hospitalId) {
            const hospitalRes = await api.get(`/hospital/${hospitalId}`);
            setHospital(hospitalRes.data.hospital);
          }
          const donation = await api.get(`/users/donations/donor-id/${user._id}`);
          setDonationRecords(donation.data)
        } catch (error) {
          console.error("Failed to fetch donor profile:", error);
        }
      } if (user?.role === "recipient") {
        try {
          const profileRes = await api.get(`/users/recipient-profile/active/${user._id}`);
          setRecipient(profileRes.data.profile);

          // Lấy thông tin bệnh viện bằng ID từ recipient profile
          const hospitalId = profileRes.data.profile?.hospital; // lưu ý: hospital_name phải là ID
          if (hospitalId) {
            const hospitalRes = await api.get(`/hospital/${hospitalId}`);
            setHospital(hospitalRes.data.hospital);
          }

          const res = await api.get(`/recipient/blood-requests/${user._id}`);
          const requestArray = res.data?.requests || [];
          if (Array.isArray(requestArray)) {
            setBloodRequests(requestArray);

            // Load tên bệnh viện cho từng request
            const namePromises = requestArray.map(async (req) => {
              try {
                const hospitalRes = await api.get(`/hospital/${req.hospital}`);
                return [req._id, hospitalRes.data.hospital.name];
              } catch (error) {
                console.error("Lỗi khi lấy tên bệnh viện:", error);
                return [req._id, "Không xác định"];
              }
            });

            const resolved = await Promise.all(namePromises);
            const namesObject = Object.fromEntries(resolved);
            setHospitalNames(namesObject);

            const profileDList = await api.get(`/users/donations/recipient-id/${user._id}`);
            setDonationList(profileDList.data.data); // Lấy đúng mảng donations

            const wareHouseDonations = await api.get(`/users/donations-warehouse/recipient-id/${user._id}`);
            setWarehouseDonationsList2(wareHouseDonations.data.data);

            setReceiveCount(profileDList.data.count + wareHouseDonations.data.count);

          } else {
            console.error("Data is not array:", requestArray);
            setBloodRequests([]);
          }
        } catch (error) {
          console.error("Failed to fetch recipient profile or hospital:", error);
        }
      }
    }

    if (user?._id) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = () => {
    logout()
  }

  const handleRole = (role?: string): string => {
    if (!role) return 'Unknown';
    if (role === "admin") {
      return "Quản trị viên"
    } else if (role === "donor") {
      return "Người hiến máu"
    } else if (role === "recipient") {
      return "Người nhận máu"
    } else if (role === "staff") {
      return "Nhân viên"
    } else {
      return "Vô danh"
    }
  }

  const handleGender = (gender?: string): string => {
    if (!gender) return 'Unknown';
    if (gender === "male") {
      return "Nam"
    } else if (gender === "female") {
      return "Nữ"
    } else if (gender === "other") {
      return "Khác"
    } else {
      return "Vô danh"
    }
  }

  const handleSecondCard = () => {
    if (user?.role === "donor") {
      return donor?.blood_type;
    } else if (user?.role === "recipient") {
      return hospital?.name || "Chưa có thông tin";
    } else {
      return "unknown"
    }
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

  const achievementRecip = [
    {
      id: 1,
      name: "Người nhận đầu tiên",
      description: "Hoàn tất lần nhận máu đầu tiên",
      icon: "🩸",
      earned: true,
      earnedDate: "15/09/2023",
    },
    {
      id: 2,
      name: "Người nhận tích cực",
      description: "Đã xác nhận 3 lần nhận máu đúng hạn",
      icon: "✅",
      earned: true,
      earnedDate: "15/09/2024",
    },
    {
      id: 3,
      name: "Người nhận kiên trì",
      description: "Đã nhận máu 5 lần mà không bỏ lỡ lịch hẹn",
      icon: "💪",
      earned: false,
      progress: 60,
    },
    {
      id: 4,
      name: "Báo cáo đúng lúc",
      description: "Cập nhật tình trạng sức khỏe sau khi nhận máu trong vòng 24h",
      icon: "📋",
      earned: false,
      progress: 0,
    },
    {
      id: 5,
      name: "Cộng đồng cùng tiến",
      description: "Giới thiệu hệ thống cho ít nhất 3 người khác",
      icon: "🤝",
      earned: false,
      progress: 33,
    },
  ];


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
                  <div className="w-10 h-10 rounded-full flex items-center justify-center">
                    <Image
                      src="/images/logo.webp"
                      alt="ScαrletBlood Logo"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">ScαrletBlood</h1>
                    <p className="text-sm text-gray-600">Bảng điều khiển cá nhân</p>
                  </div>
                </Link>
                {(user?.role === "donor") && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <User className="w-3 h-3 mr-1" />
                    Người hiến máu
                  </Badge>
                )}
                {(user?.role === "recipient") && (
                  <Badge className="bg-blue-100 text-green-800">
                    <User className="w-3 h-3 mr-1" />
                    Người nhận máu
                  </Badge>
                )}

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
                <CardTitle className="text-sm font-medium">{(user?.role === "donor") ? "Tổng lần hiến" : "Tổng lần nhận"}</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{(user?.role === "donor") ? donationRecords.count : receiveCount}</div>
                <p className="text-xs text-muted-foreground">{(user?.role === "donor") ? "lần hiến máu" : "lần nhận máu"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{(user?.role === "donor") ? "Nhóm máu" : "Cơ sở bệnh viện"}</CardTitle>
                <Droplets className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{handleSecondCard()}</div>
                <p className="text-xs text-muted-foreground">{(user?.role === "donor") ? "Nhóm máu của bạn" : "Tên bệnh viện"}</p>
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

          <Tabs defaultValue={`${user.role === "donor" ? "overview" : "history"}`} className="space-y-6">
            <TabsList className={`grid w-full ${user.role === "donor" ? "grid-cols-5" : "grid-cols-4"}`}>
              {(user.role === "donor") ? <> <TabsTrigger value="overview">Tổng quan</TabsTrigger> <TabsTrigger value="history">Lịch sử</TabsTrigger></> : <TabsTrigger value="history">Lịch sử</TabsTrigger>}
              <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
              <TabsTrigger value="achievements">Thành tích</TabsTrigger>
              <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
            </TabsList>

            {(user.role === "donor") &&
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
                        <div className="text-3xl font-bold text-blue-600">{donor?.cooldown_until ? `${daysUntil(donor.cooldown_until)} ngày` : "Không rõ"}</div>
                        <p className="text-gray-600">
                          Bạn có thể hiến máu trở lại từ ngày <strong>{formatDate(donor?.cooldown_until)}</strong>
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
                              className={`flex items-start space-x-3 p-3 rounded-lg ${!notification.read ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
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
                      {(user?.role === "recipient") && (
                        <Button asChild className="h-20 flex-col">
                          <Link href="/reqdonation">
                            <Heart className="w-6 h-6 mb-2" />
                            Đặt lịch nhận máu
                          </Link>
                        </Button>
                      )}
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
            }
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{user?.role === "donor" ? "Lịch sử hiến máu" : "Lịch sử yêu cầu máu"}</CardTitle>
                  <CardDescription>{user?.role === "donor" ? "Tất cả các lần hiến máu của bạn" : "Tất cả các lần yêu cầu của bạn"}</CardDescription>
                </CardHeader>
                {(user?.role === "donor") && (
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

                    <CardContent className="space-y-4">
                      {Array.isArray(donationRecords?.data) && donationRecords?.data?.length > 0 ? (
                        donationRecords?.data.map((donation) => (
                          <div
                            key={donation._id}
                            className="flex flex-col md:flex-row justify-between p-4 border rounded-lg space-y-4 md:space-y-0 md:space-x-6 hover:bg-gray-50 transition"
                          >
                            {/* BÊN TRÁI: DONOR & RECIPIENT */}
                            <div className="flex-1 flex flex-col space-y-2">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                  <Heart className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                  <p className="font-medium">Người hiến: {donation.donor_id?.full_name || "Không rõ"}</p>
                                  <p className="text-sm text-gray-600">{donation.donor_id?.email}</p>
                                  <p className="text-sm text-gray-600">SĐT: {donation.donor_id?.phone}</p>
                                </div>
                              </div>

                              {donation.recipient_id && (
                                <div className="mt-2 border-t pt-2">
                                  <p className="font-medium">Người nhận: {donation.recipient_id?.full_name}</p>
                                  <p className="text-sm text-gray-600">{donation.recipient_id?.email}</p>
                                  <p className="text-sm text-gray-600">SĐT: {donation.recipient_id?.phone}</p>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge className="bg-blue-100 text-blue-800">{donation.donation_type?.join(", ")}</Badge>
                                <Badge className={donation.status === "scheduled" ? "bg-yellow-100 text-yellow-800" : donation.status === "completed" ? "bg-green-100 text-green-800" : donation.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}>
                                  {donation.status}
                                </Badge>
                              </div>

                              <div className="text-sm text-gray-600 mt-1">
                                <p>Ngày hiến: <strong>{formatDate(donation.donation_date)}</strong></p>
                                <p>Khối lượng: <strong>{donation.volume}</strong> đơn vị</p>
                                <p>Ghi chú: {donation.notes || "Không có"}</p>
                                <p>Ngày tạo: {formatDate(donation.createdAt)}</p>
                              </div>
                            </div>

                            {/* BÊN PHẢI: STAFF & NÚT */}
                            <div className="flex flex-col justify-between items-end space-y-3 min-w-[220px]">
                              <div className="text-right text-sm">
                                <p className="font-medium text-gray-800">Cập nhật bởi:</p>
                                <p className="text-gray-600">{donation.updated_by?.full_name || "Chưa rõ"}</p>
                                <p className="text-gray-600">{donation.updated_by?.email || "-"}</p>
                              </div>

                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                >
                                  <Phone className="w-4 h-4 mr-1" />
                                  Gọi
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                >
                                  <Edit className="w-4 h-4" />
                                  Sửa
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="text-white bg-red-500 hover:bg-red-600 transition"
                                  onClick={() => handleReject(donation._id)}
                                >
                                  Từ chối
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">Không tìm thấy lịch trình hiến máu.</p>
                      )}
                    </CardContent>
                  </CardContent>
                )}

                {(user?.role === "recipient") && (
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input placeholder="Tìm kiếm theo tên, email, số điện thoại..." className="pl-10" />
                        </div>
                        <Select onValueChange={setBloodManageFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Nhóm máu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blood-request-history">Yêu Cầu Máu</SelectItem>
                            <SelectItem value="blood-donations-history">Nhận máu từ người hiến</SelectItem>
                            <SelectItem value="blood-donations-blood-inventory-history">Nhận máu từ kho máu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {bloodManageFilter === "blood-request-history" && bloodRequests.map((request) => (
                        <div
                          key={request._id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          {/* Left Icon + Info */}
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                              <Droplets className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium">Yêu cầu máu #{request._id.slice(-5)}</p>
                              <p className="text-sm text-gray-600">{hospitalNames[request._id] || "Đang tải..."}</p>
                              <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                                <span>
                                  {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                                </span>
                                <span>•</span>
                                <span>{request.amount_needed} đơn vị</span>
                                <span>•</span>
                                <span>{request.components_needed.join(", ")}</span>
                                <span>•</span>
                                <span>{request.distance} km</span>
                              </div>
                              {request.comment && (
                                <p className="text-xs text-gray-500 whitespace-pre-line mt-1">
                                  💬 {request.comment}
                                </p>
                              )}
                              {request.is_emergency && (
                                <Badge className="mt-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                                  ⚠️ Khẩn cấp
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Right: Status */}
                          <div className="text-right">
                            <Badge className={getStatusColor(request.status)}>
                              {translateStatus(request.status)}
                            </Badge>
                            <div className="mt-2">
                              <Badge className="bg-red-600 text-white px-3 py-1 rounded-full text-sm shadow-sm">
                                🩸 {request.blood_type_needed}
                              </Badge>
                            </div>
                          </div>

                        </div>
                      ))}
                      {bloodManageFilter === "blood-donations-history" && Array.isArray(donationList) && donationList.length > 0 ? (
                        donationList.map((donation) => (
                          <div
                            key={donation._id}
                            className="flex flex-col md:flex-row justify-between p-4 border rounded-lg space-y-4 md:space-y-0 md:space-x-6 hover:bg-gray-50 transition"
                          >
                            {/* BÊN TRÁI: DONOR & RECIPIENT */}
                            <div className="flex-1 flex flex-col space-y-2">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                  <Heart className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                  <p className="font-medium">Người hiến: {donation.donor_id?.full_name || "Không rõ"}</p>
                                  <p className="text-sm text-gray-600">{donation.donor_id?.email}</p>
                                  <p className="text-sm text-gray-600">SĐT: {donation.donor_id?.phone}</p>
                                </div>
                              </div>

                              {donation.recipient_id && (
                                <div className="mt-2 border-t pt-2">
                                  <p className="font-medium">Người nhận: {donation.recipient_id?.full_name}</p>
                                  <p className="text-sm text-gray-600">{donation.recipient_id?.email}</p>
                                  <p className="text-sm text-gray-600">SĐT: {donation.recipient_id?.phone}</p>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge className="bg-blue-100 text-blue-800">{donation.donation_type?.join(", ")}</Badge>
                                <Badge className={donation.status === "scheduled" ? "bg-yellow-100 text-yellow-800" : donation.status === "completed" ? "bg-green-100 text-green-800" : donation.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}>
                                  {donation.status}
                                </Badge>
                              </div>

                              <div className="text-sm text-gray-600 mt-1">
                                <p>Ngày hiến: <strong>{formatDate(donation.donation_date)}</strong></p>
                                <p>Khối lượng: <strong>{donation.volume}</strong> đơn vị</p>
                                <p>Ghi chú: {donation.notes || "Không có"}</p>
                                <p>Ngày tạo: {formatDate(donation.createdAt)}</p>
                              </div>
                            </div>

                            {/* BÊN PHẢI: STAFF & NÚT */}
                            <div className="flex flex-col justify-between items-end space-y-3 min-w-[220px]">
                              <div className="text-right text-sm">
                                <p className="font-medium text-gray-800">Cập nhật bởi:</p>
                                <p className="text-gray-600">{donation.updated_by?.full_name || "Chưa rõ"}</p>
                                <p className="text-gray-600">{donation.updated_by?.email || "-"}</p>
                              </div>

                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                >
                                  <Phone className="w-4 h-4 mr-1" />
                                  Gọi
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                >
                                  <Edit className="w-4 h-4" />
                                  Sửa
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : bloodManageFilter === "blood-donations-blood-inventory-history" ? (
                        ""
                      ) : bloodManageFilter === "blood-request-history" ? (
                        ""
                      ) : <p className="text-gray-600">Không tìm thấy người hiến máu.</p>}

                      {bloodManageFilter === "blood-donations-blood-inventory-history" && Array.isArray(warehouseDonationsList2) && warehouseDonationsList2.length > 0 ? (
                        warehouseDonationsList2.map((donation) => (
                          <div
                            key={donation._id}
                            className="flex flex-col md:flex-row justify-between p-4 border rounded-lg space-y-4 md:space-y-0 md:space-x-6 hover:bg-gray-50 transition"
                          >
                            {/* BÊN TRÁI: INVENTORY & RECIPIENT */}
                            <div className="flex-1 flex flex-col space-y-2">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Droplet className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    Nhóm máu: {donation.inventory_item?.blood_type || "Không rõ"}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Thành phần: {donation.inventory_item?.component}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Lượng tồn: {donation.inventory_item?.quantity} đơn vị
                                  </p>
                                </div>
                              </div>

                              {donation.recipient_id && (
                                <div className="mt-2 border-t pt-2">
                                  <p className="font-medium">Người nhận: {donation.recipient_id?.full_name}</p>
                                  <p className="text-sm text-gray-600">{donation.recipient_id?.email}</p>
                                  <p className="text-sm text-gray-600">SĐT: {donation.recipient_id?.phone}</p>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge className="bg-blue-100 text-blue-800">{donation.inventory_item?.component}</Badge>
                                <Badge
                                  className={
                                    donation.status === "in_progress"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : donation.status === "fulfilled"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                  }
                                >
                                  {donation.status}
                                </Badge>
                              </div>

                              <div className="text-sm text-gray-600 mt-1">
                                <p>Ngày rút máu: <strong>{formatDate(donation.donation_date)}</strong></p>
                                <p>Khối lượng rút: <strong>{donation.volume}</strong> đơn vị</p>
                                <p>Ghi chú: {donation.notes || "Không có"}</p>
                                <p>Ngày tạo: {formatDate(donation.createdAt)}</p>
                              </div>
                            </div>

                            {/* BÊN PHẢI: STAFF & NÚT */}
                            <div className="flex flex-col justify-between items-end space-y-3 min-w-[220px]">
                              <div className="text-right text-sm">
                                <p className="font-medium text-gray-800">Cập nhật bởi:</p>
                                <p className="text-gray-600">{donation.updated_by?.full_name || "Chưa rõ"}</p>
                                <p className="text-gray-600">{donation.updated_by?.email || "-"}</p>
                              </div>

                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                >
                                  <Phone className="w-4 h-4 mr-1" />
                                  Gọi
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                >
                                  <Edit className="w-4 h-4" />
                                  Sửa
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : bloodManageFilter === "blood-request-history" ? (
                        ""
                      ) : bloodManageFilter === "blood-donations-history" ? (
                        ""
                      ) : <p className="text-gray-600">Không tìm thấy dữ liệu rút máu từ kho.</p>}
                    </div>
                  </CardContent>
                )}

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
                    {(user?.role === "donor") && achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 border rounded-lg ${achievement.earned ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
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
                    {(user?.role === "recipient") && achievementRecip.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 border rounded-lg ${achievement.earned ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
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
                            <label className="text-sm text-gray-600">Vai trò</label>
                            <p className="font-medium">{handleRole(user?.role)}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Số điện thoại</label>
                            <p className="font-medium">{user?.phone}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Giới tính</label>
                            <p className="font-medium">{handleGender(user?.gender)}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Ngày sinh</label>
                            <p className="font-medium">{user?.date_of_birth && new Date(user.date_of_birth).toLocaleDateString("vi-VN")}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Địa chỉ</label>
                            <p className="font-medium">{user?.address}</p>
                          </div>
                        </div>
                      </div>
                      {(user?.role === "donor") && (
                        <div>
                          <h3 className="font-semibold mb-4">Thông tin người hiến máu</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm text-gray-600">Nhóm máu</label>
                              <p className="font-medium text-red-600">{donor?.blood_type}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Ngày có thể bắt đầu hiến máu</label>
                              <p className="font-medium">{donor?.availability_date && new Date(donor.availability_date).toLocaleDateString("vi-VN")}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Tên bệnh viện</label>
                              <p className="font-medium text-red-600">{hospital?.name || "Chưa có thông tin"}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Địa chỉ bệnh viện</label>
                              <p className="font-medium">{hospital?.address || "Chưa có thông tin"}</p>
                            </div>
                            {hospital?.phone && (
                              <div>
                                <label className="text-sm text-gray-600">Số điện thoại bệnh viện</label>
                                <p className="font-medium">{hospital.phone}</p>
                              </div>
                            )}
                            <div>
                              <label className="text-sm text-gray-600">Bằng sức khỏe</label>
                              <Image
                                src={donor?.health_cert_url}
                                alt="ScαrletBlood Logo"
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Nghỉ ngơi cho đến khi</label>
                              <p className="font-medium">{donor?.cooldown_until
                                ? new Date(donor.cooldown_until).toLocaleDateString("vi-VN")
                                : "Chưa có"}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Ngày được tạo</label>
                              <p className="font-medium">{donor?.createdAt && new Date(donor.createdAt).toLocaleDateString("vi-VN")}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Ngày cập nhật</label>
                              <p className="font-medium">{donor?.updatedAt && new Date(donor.updatedAt).toLocaleDateString("vi-VN")}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {(user?.role === "recipient") && (
                        <div>
                          <h3 className="font-semibold mb-4">Thông tin người nhận máu</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm text-gray-600">Tên bệnh viện</label>
                              <p className="font-medium text-red-600">{hospital?.name || "Chưa có thông tin"}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Địa chỉ bệnh viện</label>
                              <p className="font-medium">{hospital?.address || "Chưa có thông tin"}</p>
                            </div>
                            {hospital?.phone && (
                              <div>
                                <label className="text-sm text-gray-600">Số điện thoại bệnh viện</label>
                                <p className="font-medium">{hospital.phone}</p>
                              </div>
                            )}
                            <div>
                              <label className="text-sm text-gray-600">Bằng sức khỏe</label>
                              <Image
                                src={recipient?.medical_doc_url}
                                alt="ScαrletBlood Logo"
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Ngày được tạo</label>
                              <p className="font-medium">{recipient?.createdAt && new Date(recipient.createdAt).toLocaleDateString("vi-VN")}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Ngày cập nhật</label>
                              <p className="font-medium">{recipient?.updatedAt && new Date(recipient.updatedAt).toLocaleDateString("vi-VN")}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-4">
                      <Button onClick={handleEdit} disabled={isLoading}>
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa thông tin
                      </Button>

                      <Button variant="outline" onClick={handleResetPassword} disabled={isLoading}>
                        <Settings className="w-4 h-4 mr-2" />
                        Đổi mật khẩu
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Toaster position="top-center" containerStyle={{
          top: 80,
        }} />
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
