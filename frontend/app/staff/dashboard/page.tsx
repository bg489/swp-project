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
  Search,
  Edit,
  Package,
  UserPlus,
  Hospital,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"
import api from "@/lib/axios"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"


export default function StaffDashboard() {
  const { user, logout } = useAuth()
  const [staff, setStaff] = useState({});
  const [donorList, setDonorList] = useState([]);
  const [bloodReqList, setBloodReqList] = useState([]);
  const [donationList, setDonationList] = useState([]);
  const [bloodInven, setBloodInven] = useState([])
  const [selectedDonationStatus, setSelectedDonationStatus] = useState("");

  const handleStatusUpdate = async (newStatus: string, donationId: string) => {
    try {
      await api.put(`/staff/donations/${donationId}/update-status`, {
        status: newStatus,
      });


      setDonationList((prev) =>
        prev.map((donation) =>
          donation._id === donationId ? { ...donation, status: newStatus } : donation
        )
      );

      toast.success(`Đã thay đổi status thành ${newStatus}`)

      if (newStatus === "completed") {
        const donation = await api.get(`/staff/donations/id/${donationId}`);
        const donorId = donation.data.donation.donor_id._id;
        const donationDateStr = donation.data.donation.donation_date; // e.g. "2025-07-01T00:00:00.000Z"

        const donationDate = new Date(donationDateStr);

        // Tăng 7 ngày (7 * 24 * 60 * 60 * 1000 milliseconds)
        const cooldownUntilDate = new Date(donationDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Convert về ISO string nếu cần lưu vào DB hoặc gửi API
        const cooldownUntilStr = cooldownUntilDate.toISOString();

        await api.put(`/users/donor/update-cooldown`, {
          user_id: donorId,
          cooldown_until: cooldownUntilStr
        });

      }


    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái. Vui lòng thử lại!");
      console.error(error);
    }
  };

  const isActive = (availabilityDate: string) => {
    const now = new Date();
    const availDate = new Date(availabilityDate);
    return availDate <= now;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng tính từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleLogout = () => {
    logout()
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileRes = await api.get(`/users/staff-profiles/active/${user._id}`);
        const staffData = profileRes.data.staffProfile;
        setStaff(staffData);

        // Chỉ fetch donor list sau khi staffData có hospital
        if (staffData?.hospital?._id) {
          const profileDonList = await api.get(`/users/donor-profiles-by-hospital/${staffData.hospital._id}`);
          setDonorList(profileDonList.data);

          const profileBRList = await api.get(`/staff/blood-requests/get-list/${staffData.hospital._id}`);
          setBloodReqList(profileBRList.data);

          const profileDList = await api.get(`/staff/donations/by-staff/${user._id}`);
          setDonationList(profileDList.data.data); // Lấy đúng mảng donations

          const bloodInvent = await api.get(`/blood-in/blood-inventory/hospital/${staffData.hospital._id}`);
          setBloodInven(bloodInvent.data.inventories);
        }
      } catch (error) {
        console.error("Failed to fetch staff profile or hospital:", error);
      }
    }

    if (user?._id) {
      fetchProfile();
    }
  }, [user]);


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
    { type: "O-", available: 45, reserved: 5, status: "low", target: 100, color: "bg-red-500" },
    { type: "O+", available: 120, reserved: 10, status: "good", target: 150, color: "bg-red-400" },
    { type: "A-", available: 78, reserved: 8, status: "good", target: 100, color: "bg-blue-500" },
    { type: "A+", available: 156, reserved: 15, status: "good", target: 150, color: "bg-blue-400" },
    { type: "B-", available: 34, reserved: 3, status: "critical", target: 80, color: "bg-green-500" },
    { type: "B+", available: 89, reserved: 9, status: "good", target: 120, color: "bg-green-400" },
    { type: "AB-", available: 23, reserved: 2, status: "critical", target: 60, color: "bg-purple-500" },
    { type: "AB+", available: 67, reserved: 7, status: "good", target: 80, color: "bg-purple-400" },
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
      name: "Hoàng Văn G",
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

  const getBloodStatusColor = (quantity: number) => {
    if (quantity < 30) {
      return "bg-red-100 text-red-800"
    } else if (quantity < 150) {
      return "bg-yellow-100 text-yellow-800"
    } else {
      return "bg-green-100 text-green-800"
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
                  Xin chào, <strong>Staff</strong>
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
                <p className="text-xs text-muted-foreground">{donorList?.count || "__"} đang hoạt động</p>
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
                <div className="text-2xl font-bold text-orange-600">{bloodReqList?.count || "0"}</div>
                <p className="text-xs text-muted-foreground">đang chờ xử lý</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cơ sở làm việc</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{staff?.hospital?.name || "Không có thông tin"}</div>
                <p className="text-xs text-muted-foreground">{staff?.hospital?.address || "Không có thông tin"}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="donors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="donors">Người hiến máu</TabsTrigger>
              <TabsTrigger value="inventory">Kho máu</TabsTrigger>
              <TabsTrigger value="requests">Yêu cầu máu</TabsTrigger>
              <TabsTrigger value="reports">Quản lý lịch trình hiến máu</TabsTrigger>
            </TabsList>

            <TabsContent value="donors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Quản lý người hiến máu</span>
                    <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
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
                    {Array.isArray(donorList?.donors) && donorList.donors.map((donor) => (
                      <div key={donor.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{donor.user_id.full_name}</p>
                            <p className="text-sm text-gray-600">{donor.user_id.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-red-600">
                                {donor.blood_type}
                              </Badge>
                              <Badge className={isActive(donor.availability_date) ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                {isActive(donor.availability_date) ? "Hoạt động" : "Không hoạt động"}
                              </Badge>
                              <span className="text-xs text-gray-500">{donor.totalDonations || "0"} lần hiến</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right text-sm">
                            <p className="text-gray-600">Lần cuối: {donor.lastDonation || "0"}</p>
                            <p className="text-gray-500">Có thể hiến: {formatDate(donor.availability_date)}</p>
                          </div>
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
                    <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nhập máu mới
                    </Button>
                  </CardTitle>
                  <CardDescription>Theo dõi tồn kho và tình trạng máu theo từng nhóm</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {bloodInven.map((blood) => (
                      <Card key={blood.blood_type} className="relative">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold text-red-600">{blood.blood_type}</CardTitle>
                            <Badge className={getBloodStatusColor(blood.quantity)}>
                              {blood.quantity < 30
                                ? "Rất thấp"
                                : blood.quantity < 150
                                  ? "Thấp"
                                  : "Tốt"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Có sẵn:</span>
                              <span className="font-semibold">{blood.quantity} đơn vị</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Đã đặt:</span>
                              <span className="font-semibold">0 đơn vị</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Sắp hết hạn:</span>
                              <span className="font-semibold text-orange-600">{blood.expiring_quantity} đơn vị</span>
                            </div>
                            <Progress
                              value={Math.min((blood.quantity / 500) * 100, 100)}
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
                                    className={`w-5 h-5 ${blood.status === "critical" ? "text-red-600" : "text-yellow-600"
                                      }`}
                                  />
                                  <div>
                                    <p className="font-medium">Nhóm máu {blood.type}</p>
                                    <p className="text-sm text-gray-600">Còn {blood.available} đơn vị</p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                >
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
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                >
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
                    <span>Quản lý yêu cầu máu</span>
                    <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Thêm người hiến
                    </Button>
                  </CardTitle>
                  <CardDescription>Quản lý thông tin về yêu cầu máu</CardDescription>
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
                    {Array.isArray(bloodReqList.data) && bloodReqList.data.map((recipient) => (
                      <Link
                        key={recipient._id}
                        href={`/staff/edit/request?requestId=${recipient._id}`}
                        className="block"
                      >
                        <div
                          className="flex flex-col md:flex-row justify-between p-4 border rounded-lg space-y-4 md:space-y-0 md:space-x-6 hover:bg-gray-50 transition"
                        >
                          {/* BÊN TRÁI: THÔNG TIN NGƯỜI NHẬN & YÊU CẦU */}
                          <div className="flex-1 flex flex-col space-y-2">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-orange-600" />
                              </div>
                              <div>
                                <p className="font-medium">{recipient.recipient_id.full_name}</p>
                                <p className="text-sm text-gray-600">{recipient.recipient_id.email}</p>
                                <p className="text-sm text-gray-600">SĐT: {recipient.recipient_id.phone}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-red-600">{recipient.blood_type_needed}</Badge>
                              <Badge className="bg-blue-100 text-blue-800">{recipient.components_needed.join(", ")}</Badge>
                              <Badge className={recipient.is_emergency ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                                {recipient.is_emergency ? "Khẩn cấp" : "Không khẩn cấp"}
                              </Badge>
                              <Badge className={getStatusColor(recipient.status)}>{recipient.status}</Badge>
                            </div>

                            <div className="text-sm text-gray-600">
                              <p>Số lượng cần: <strong>{recipient.amount_needed}</strong> đơn vị</p>
                              <p>Khoảng cách: <strong>{recipient.distance} km</strong></p>
                              <p>Ghi chú: {recipient.comment || "Không có"}</p>
                              <p>Ngày tạo: {formatDate(recipient.createdAt)}</p>
                            </div>
                          </div>

                          {/* BÊN PHẢI: BỆNH VIỆN & NÚT */}
                          <div className="flex flex-col justify-between items-end space-y-3 min-w-[220px]">
                            <div className="text-right text-sm">
                              <p className="font-medium text-gray-800">{recipient.hospital.name}</p>
                              <p className="text-gray-600">{recipient.hospital.address}</p>
                              <p className="text-gray-600">SĐT: {recipient.hospital.phone}</p>
                            </div>

                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.preventDefault(); // Ngăn Link điều hướng khi click nút
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                              >
                                <Phone className="w-4 h-4 mr-1" />
                                Gọi
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.preventDefault(); // Ngăn Link điều hướng khi click nút
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                              >
                                <Edit className="w-4 h-4" />
                                Sửa
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Quản lý lịch trình hiến máu</span>
                    <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Thêm người hiến
                    </Button>
                  </CardTitle>
                  <CardDescription>Quản lý thông tin về lịch trình hiến máu</CardDescription>
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

                  <CardContent className="space-y-4">
                    {Array.isArray(donationList) && donationList.length > 0 ? (
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
                              <Badge className={donation.status === "scheduled" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
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
                              <p className="font-medium text-gray-800">🛠 Cập nhật trạng thái:</p>
                              <Select onValueChange={setSelectedDonationStatus} value={selectedDonationStatus}>
                                <SelectTrigger className="w-full md:w-[300px] border-gray-300">
                                  <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    { key: "scheduled", label: "Đã lên lịch" },
                                    { key: "completed", label: "Đã hoàn tất" },
                                    { key: "cancelled", label: "Đã hủy" },
                                  ].map((status) => (
                                    <SelectItem key={status.key} value={status.key}>
                                      {status.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Button
                                className="mt-2 bg-blue-600 text-white hover:bg-blue-700"
                                disabled={!selectedDonationStatus || selectedDonationStatus === donation?.status}
                                onClick={() => handleStatusUpdate(selectedDonationStatus, donation._id)}
                              >
                                Cập nhật trạng thái
                              </Button>
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
                    ) : (
                      <p className="text-gray-600">Không tìm thấy lịch trình hiến máu.</p>
                    )}
                  </CardContent>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Toaster position="top-center" containerStyle={{
          top: 80,
        }} />
        <Footer />
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
