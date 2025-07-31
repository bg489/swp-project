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
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { toast, Toaster } from "react-hot-toast"

type BloodRequest = {
  _id: string;
  hospital: string;
  createdAt: string;
  amount_needed: number;
  components_needed: string[];
  distance: number;
  comment?: string;
  is_emergency?: boolean;
  status: string;
  blood_type_needed: string;
  // Add other fields as needed
};

type DonationRecord = {
  _id: string;
  donor_id?: {
    full_name: string;
    email: string;
    phone: string;
  };
  recipient_id?: {
    full_name: string;
    email: string;
    phone: string;
  };
  donation_type?: string[];
  status: string;
  donation_date: string;
  volume: number;
  notes?: string;
  createdAt: string;
  updated_by?: {
    full_name: string;
    email: string;
  };
};

type DonationRecords = {
  count: number;
  data: DonationRecord[];
};

type WarehouseDonation = {
  _id: string;
  recipient_id?: {
    full_name: string;
    email: string;
    phone: string;
  };
  inventory_item?: {
    blood_type: string;
    component: string;
    quantity: number;
  };
  status: string;
  donation_date: string;
  volume: number;
  notes?: string;
  createdAt: string;
  updated_by?: {
    full_name: string;
    email: string;
  };
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

type RecipientProfile = {
  medical_doc_url: string;
  hospital_name: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function UserDashboard() {
  const router = useRouter()
  const { user, logout, isLoading: authLoading } = useAuth()
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hospital, setHospital] = useState<{ name: string; address?: string; phone?: string } | null>(null);
  const [hospitalNames, setHospitalNames] = useState<Record<string, string>>({})
  const [donationRecords, setDonationRecords] = useState<DonationRecords>({ count: 0, data: [] })
  const [bloodManageFilter, setBloodManageFilter] = useState("blood-request-history");
  const [donationList, setDonationList] = useState<DonationRecord[]>([]);
  const [warehouseDonationsList2, setWarehouseDonationsList2] = useState<WarehouseDonation[]>([]);
  const [receiveCount, setReceiveCount] = useState(0);
  const [donor, setDonor] = useState<DonorProfile | null>(null);
  const [recipient, setRecipient] = useState<RecipientProfile | null>(null);

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
        } catch (error: any) {
          console.error("Failed to fetch donor profile:", error);
          if (error.response?.status === 404) {
            console.log("User does not have a donor profile yet");
            // User hasn't created donor profile yet - this is okay
          } else {
            console.error("Unexpected error:", error.response?.data);
          }
        }
      } else if (user?.role === "recipient") {
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
        } catch (error: any) {
          console.error("Failed to fetch recipient profile or hospital:", error);
          if (error.response?.status === 404) {
            console.log("User does not have a recipient profile yet");
            // User hasn't created recipient profile yet - this is okay
          } else {
            console.error("Unexpected error:", error.response?.data);
          }
        }
      }
    }

    if (user?._id) {
      fetchProfile();
    }
  }, [user]);

  // Add loading check and null safety
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 animate-pulse mx-auto">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Đang tải dashboard...</p>
        </div>
      </div>
    )
  }

  const handleReject = async (donationId: string) => {
    try {
      if (!confirm("Bạn có chắc muốn từ chối đợt hiến máu này không?")) { return; }

      await api.put(`/staff/donations/${donationId}/update-status`, {
        status: "cancelled",
      });

      console.log(donationRecords)

      setDonationRecords((prev: DonationRecords) => ({
        ...prev,
        data: prev.data.map((donation: DonationRecord) =>
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


  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Chưa có thông tin";
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

  function translateStatus(status: string) {
    const map: Record<string, string> = {
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      matched: "Đã ghép",
      in_progress: "Đang xử lý",
      completed: "Hoàn tất",
      cancelled: "Đã hủy",
      rejected: "Từ chối",
      scheduled: "Đã lên lịch",
      fulfilled: "Đã thực hiện",
    }

    return map[status] || status
  }

  // Function to translate blood components from English to Vietnamese
  function translateComponent(component: string) {
    const map: Record<string, string> = {
      whole: "Máu toàn phần",
      plasma: "Huyết tương",
      rbc: "Hồng cầu",
      platelet: "Tiểu cầu",
    }

    return map[component?.toLowerCase()] || component
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



  // Calculate achievements for donors based on real data
  const getDonorAchievements = () => {
    const totalDonations = donationRecords.count;
    const completedDonations = donationRecords.data.filter(d => d.status === "completed").length;
    
    return [
      {
        id: 1,
        name: "Người hiến đầu tiên",
        description: "Hoàn thành lần hiến máu đầu tiên",
        icon: "🏆",
        earned: completedDonations >= 1,
        earnedDate: completedDonations >= 1 ? formatDate(donationRecords.data.find(d => d.status === "completed")?.donation_date) : null,
      },
      {
        id: 2,
        name: "Người hùng Đồng",
        description: "Hiến máu 3 lần",
        icon: "🥉",
        earned: completedDonations >= 3,
        earnedDate: completedDonations >= 3 ? formatDate(donationRecords.data.filter(d => d.status === "completed")[2]?.donation_date) : null,
        progress: Math.min((completedDonations / 3) * 100, 100),
      },
      {
        id: 3,
        name: "Người hùng Bạc",
        description: "Hiến máu 5 lần",
        icon: "🥈",
        earned: completedDonations >= 5,
        earnedDate: completedDonations >= 5 ? formatDate(donationRecords.data.filter(d => d.status === "completed")[4]?.donation_date) : null,
        progress: Math.min((completedDonations / 5) * 100, 100),
      },
      {
        id: 4,
        name: "Người hùng Vàng",
        description: "Hiến máu 10 lần",
        icon: "🥇",
        earned: completedDonations >= 10,
        earnedDate: completedDonations >= 10 ? formatDate(donationRecords.data.filter(d => d.status === "completed")[9]?.donation_date) : null,
        progress: Math.min((completedDonations / 10) * 100, 100),
      },
      {
        id: 5,
        name: "Người hùng Kim cương",
        description: "Hiến máu 20 lần",
        icon: "💎",
        earned: completedDonations >= 20,
        earnedDate: completedDonations >= 20 ? formatDate(donationRecords.data.filter(d => d.status === "completed")[19]?.donation_date) : null,
        progress: Math.min((completedDonations / 20) * 100, 100),
      },
      {
        id: 6,
        name: "Nhà từ thiện",
        description: "Tổng thể tích hiến máu đạt 2000ml",
        icon: "❤️",
        earned: donationRecords.data.reduce((total, d) => d.status === "completed" ? total + (d.volume || 0) : total, 0) >= 2000,
        earnedDate: null,
        progress: Math.min((donationRecords.data.reduce((total, d) => d.status === "completed" ? total + (d.volume || 0) : total, 0) / 2000) * 100, 100),
      },
    ];
  };

  const achievements = getDonorAchievements();

  // Calculate achievements for recipients based on real data
  const getRecipientAchievements = () => {
    const totalRequests = bloodRequests.length;
    const completedRequests = bloodRequests.filter(r => r.status === "completed" || r.status === "matched").length;
    const emergencyRequests = bloodRequests.filter(r => r.is_emergency).length;
    const totalReceived = receiveCount;
    
    return [
      {
        id: 1,
        name: "Người nhận đầu tiên",
        description: "Hoàn tất lần nhận máu đầu tiên",
        icon: "🩸",
        earned: totalReceived >= 1,
        earnedDate: totalReceived >= 1 ? formatDate(donationList[0]?.donation_date || warehouseDonationsList2[0]?.donation_date) : null,
      },
      {
        id: 2,
        name: "Người nhận tích cực",
        description: "Đã tạo 3 yêu cầu máu thành công",
        icon: "✅",
        earned: completedRequests >= 3,
        earnedDate: completedRequests >= 3 ? formatDate(bloodRequests.filter(r => r.status === "completed" || r.status === "matched")[2]?.createdAt) : null,
        progress: Math.min((completedRequests / 3) * 100, 100),
      },
      {
        id: 3,
        name: "Người nhận kiên trì",
        description: "Đã nhận máu 5 lần",
        icon: "💪",
        earned: totalReceived >= 5,
        earnedDate: null,
        progress: Math.min((totalReceived / 5) * 100, 100),
      },
      {
        id: 4,
        name: "Yêu cầu khẩn cấp",
        description: "Đã tạo yêu cầu khẩn cấp",
        icon: "🚨",
        earned: emergencyRequests > 0,
        earnedDate: emergencyRequests > 0 ? formatDate(bloodRequests.find(r => r.is_emergency)?.createdAt) : null,
        progress: emergencyRequests > 0 ? 100 : 0,
      },
      {
        id: 5,
        name: "Quản lý tốt",
        description: "Tạo 10 yêu cầu máu",
        icon: "📋",
        earned: totalRequests >= 10,
        earnedDate: totalRequests >= 10 ? formatDate(bloodRequests[9]?.createdAt) : null,
        progress: Math.min((totalRequests / 10) * 100, 100),
      },
      {
        id: 6,
        name: "Cộng đồng cùng tiến",
        description: "Sử dụng hệ thống thường xuyên (5+ yêu cầu)",
        icon: "🤝",
        earned: totalRequests >= 5,
        earnedDate: totalRequests >= 5 ? formatDate(bloodRequests[4]?.createdAt) : null,
        progress: Math.min((totalRequests / 5) * 100, 100),
      },
    ];
  };

  const achievementRecip = getRecipientAchievements();


  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "fulfilled":
        return "bg-green-100 text-green-800"
      case "confirmed":
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
      case "in_progress":
        return "bg-orange-100 text-orange-800"
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-800"
      case "matched":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return Clock
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
          <Tabs defaultValue="history" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history">Lịch hẹn</TabsTrigger>
              <TabsTrigger value="achievements">Thành tích</TabsTrigger>
              <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-800">
                          {user?.role === "donor" ? "Lịch hẹn hiến máu" : "Lịch sử yêu cầu máu"}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {user?.role === "donor" ? "Các lịch hẹn hiến máu của bạn" : "Tất cả các lần yêu cầu của bạn"}
                        </CardDescription>
                      </div>
                    </div>
                    {(user?.role === "recipient") && (
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={setBloodManageFilter} defaultValue={bloodManageFilter}>
                          <SelectTrigger className="w-60 bg-white border-gray-200">
                            <SelectValue placeholder="Loại lịch sử" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blood-request-history">🩸 Yêu Cầu Máu</SelectItem>
                            <SelectItem value="blood-donations-history">❤️ Nhận từ người hiến</SelectItem>
                            <SelectItem value="blood-donations-blood-inventory-history">🏥 Nhận từ kho máu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardHeader>
                {(user?.role === "donor") && (
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {Array.isArray(donationRecords?.data) && donationRecords?.data?.length > 0 ? (
                        donationRecords?.data.map((donation) => (
                          <div
                            key={donation._id}
                            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-red-200"
                          >
                            <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                              {/* BÊN TRÁI: DONOR & RECIPIENT */}
                              <div className="flex-1 space-y-4">
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
                                  <Badge className="bg-blue-100 text-blue-800">{donation.donation_type?.map(type => translateComponent(type)).join(", ")}</Badge>
                                  <Badge className={getStatusColor(donation.status)}>
                                    {translateStatus(donation.status)}
                                  </Badge>
                                </div>

                                <div className="text-sm text-gray-600 mt-1">
                                  <p>Ngày hiến: <strong>{formatDate(donation.donation_date)}</strong></p>
                                  <p>Lượng máu hiến: <strong>{donation.volume}</strong> ml</p>
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
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 text-center py-8">Không tìm thấy lịch trình hiến máu.</p>
                      )}
                    </div>
                  </CardContent>
                )}

                {(user?.role === "recipient") && (
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {bloodManageFilter === "blood-request-history" && 
                        // Sort blood requests by creation date (most recent first)
                        [...bloodRequests]
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map((request, index) => (
                        <div
                          key={request._id}
                          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-red-200"
                        >
                          <div className="flex items-center justify-between">
                            {/* Left Icon + Info */}
                            <div className="flex items-center space-x-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center shadow-sm">
                                <Droplets className="w-7 h-7 text-red-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="font-semibold text-gray-800">Yêu cầu #{bloodRequests.length - index}</p>
                                  {request.is_emergency && (
                                    <Badge className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                                      ⚠️ Khẩn cấp
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 font-medium">{hospitalNames[request._id] || "Đang tải..."}</p>
                                <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(request.createdAt).toLocaleDateString("vi-VN")}</span>
                                  </div>
                                  <span>•</span>
                                  <span className="font-medium">{request.amount_needed} ml</span>
                                  <span>•</span>
                                  <span>{request.components_needed.map(c => translateComponent(c)).join(", ")}</span>
                                  <span>•</span>
                                  <span>{request.distance} km</span>
                                </div>
                                {request.comment && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 whitespace-pre-line">
                                      💬 {request.comment}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right: Status */}
                            <div className="flex flex-col items-end space-y-2">
                              <Badge className={getStatusColor(request.status)}>
                                {translateStatus(request.status)}
                              </Badge>
                              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-sm shadow-sm">
                                🩸 {request.blood_type_needed}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                      {bloodManageFilter === "blood-donations-history" && Array.isArray(donationList) && donationList.length > 0 ? (
                        // Sort donation list by creation date (most recent first)
                        [...donationList]
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map((donation, index) => (
                          <div
                            key={donation._id}
                            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-red-200"
                          >
                            {/* BÊN TRÁI: DONOR & RECIPIENT */}
                            <div className="flex-1 flex flex-col space-y-3">
                              <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center shadow-sm">
                                  <Heart className="w-7 h-7 text-red-600" />
                                </div>
                                <div>
                                  <p className="font-bold text-lg text-gray-800">❤️ Hiến máu #{donationList.length - index}</p>
                                  <p className="text-sm text-gray-600">Người hiến: <span className="font-semibold text-red-600">{donation.donor_id?.full_name || "Không rõ"}</span></p>
                                  <p className="text-sm text-gray-600">{donation.donor_id?.email}</p>
                                  <p className="text-sm text-gray-600">📞 {donation.donor_id?.phone}</p>
                                </div>
                              </div>

                              {donation.recipient_id && (
                                <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-300 rounded-r-lg">
                                  <p className="font-semibold text-gray-800">🏥 Người nhận: <span className="text-red-700">{donation.recipient_id?.full_name}</span></p>
                                  <p className="text-sm text-gray-600">{donation.recipient_id?.email}</p>
                                  <p className="text-sm text-gray-600">📞 {donation.recipient_id?.phone}</p>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-2 mt-3">
                                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full shadow-sm">
                                  🩸 {donation.donation_type?.map(type => translateComponent(type)).join(", ")}
                                </Badge>
                                <Badge className={getStatusColor(donation.status)}>
                                  {translateStatus(donation.status)}
                                </Badge>
                              </div>

                              <div className="text-sm text-gray-700 mt-3 space-y-1 bg-white/60 p-3 rounded-lg">
                                <p className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-red-500" />
                                  <span>Ngày hiến: <strong className="text-red-600">{formatDate(donation.donation_date)}</strong></span>
                                </p>
                                <p className="flex items-center space-x-2">
                                  <Droplets className="w-4 h-4 text-red-500" />
                                  <span>Lượng máu hiến: <strong className="text-red-600">{donation.volume}</strong> ml</span>
                                </p>
                                <p>💬 Ghi chú: <span className="italic">{donation.notes || "Không có"}</span></p>
                                <p className="text-xs text-gray-500">🕒 Ngày tạo: {formatDate(donation.createdAt)}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : bloodManageFilter === "blood-donations-blood-inventory-history" ? (
                        ""
                      ) : bloodManageFilter === "blood-donations-history" && Array.isArray(donationList) && donationList.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-10 h-10 text-red-400" />
                          </div>
                          <p className="text-gray-600 text-lg font-medium">Chưa có lịch sử nhận máu từ người hiến</p>
                          <p className="text-gray-500 text-sm mt-1">Khi có người hiến máu cho bạn, thông tin sẽ hiển thị tại đây</p>
                        </div>
                      ) : bloodManageFilter === "blood-request-history" ? (
                        ""
                      ) : <p className="text-gray-600">Không tìm thấy người hiến máu.</p>}

                      {bloodManageFilter === "blood-donations-blood-inventory-history" && Array.isArray(warehouseDonationsList2) && warehouseDonationsList2.length > 0 ? (
                        // Sort warehouse donations by creation date (most recent first)
                        [...warehouseDonationsList2]
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map((donation, index) => (
                          <div
                            key={donation._id}
                            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-red-200"
                          >
                            {/* BÊN TRÁI: INVENTORY & RECIPIENT */}
                            <div className="flex-1 flex flex-col space-y-3">
                              <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-sm">
                                  <Droplets className="w-7 h-7 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-bold text-lg text-gray-800">🏥 Kho máu #{warehouseDonationsList2.length - index}</p>
                                  <p className="text-sm text-gray-600">
                                    Nhóm máu: <span className="font-semibold text-blue-600">{donation.inventory_item?.blood_type || "Không rõ"}</span>
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Thành phần: <span className="font-medium">{translateComponent(donation.inventory_item?.component || "")}</span>
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Lượng tồn: <span className="font-medium text-blue-600">{donation.inventory_item?.quantity} ml</span>
                                  </p>
                                </div>
                              </div>

                              {donation.recipient_id && (
                                <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-300 rounded-r-lg">
                                  <p className="font-semibold text-gray-800">👤 Người nhận: <span className="text-blue-700">{donation.recipient_id?.full_name}</span></p>
                                  <p className="text-sm text-gray-600">{donation.recipient_id?.email}</p>
                                  <p className="text-sm text-gray-600">📞 {donation.recipient_id?.phone}</p>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-2 mt-3">
                                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full shadow-sm">
                                  🧪 {translateComponent(donation.inventory_item?.component || "")}
                                </Badge>
                                <Badge className={getStatusColor(donation.status)}>
                                  {translateStatus(donation.status)}
                                </Badge>
                              </div>

                              <div className="text-sm text-gray-700 mt-3 space-y-1 bg-white/60 p-3 rounded-lg">
                                <p className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-blue-500" />
                                  <span>Ngày rút máu: <strong className="text-blue-600">{formatDate(donation.donation_date)}</strong></span>
                                </p>
                                <p className="flex items-center space-x-2">
                                  <Droplets className="w-4 h-4 text-blue-500" />
                                  <span>Lượng máu rút: <strong className="text-blue-600">{donation.volume}</strong> ml</span>
                                </p>
                                <p>💬 Ghi chú: <span className="italic">{donation.notes || "Không có"}</span></p>
                                <p className="text-xs text-gray-500">🕒 Ngày tạo: {formatDate(donation.createdAt)}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : bloodManageFilter === "blood-donations-blood-inventory-history" && Array.isArray(warehouseDonationsList2) && warehouseDonationsList2.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Droplets className="w-10 h-10 text-blue-400" />
                          </div>
                          <p className="text-gray-600 text-lg font-medium">Chưa có lịch sử nhận máu từ kho</p>
                          <p className="text-gray-500 text-sm mt-1">Khi có giao dịch từ kho máu, thông tin sẽ hiển thị tại đây</p>
                        </div>
                      ) : bloodManageFilter === "blood-request-history" ? (
                        ""
                      ) : bloodManageFilter === "blood-donations-history" ? (
                        ""
                      ) : <p className="text-gray-600 text-center py-8">Không tìm thấy dữ liệu rút máu từ kho.</p>}
                    </div>
                  </CardContent>
                )}

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
                                Đã đạt được{achievement.earnedDate ? ` • ${achievement.earnedDate}` : ""}
                              </Badge>
                            ) : (
                              <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Tiến độ</span>
                                  <span>{Math.round(achievement.progress || 0)}%</span>
                                </div>
                                <Progress value={achievement.progress || 0} className="h-2" />
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
                                Đã đạt được{achievement.earnedDate ? ` • ${achievement.earnedDate}` : ""}
                              </Badge>
                            ) : (
                              <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Tiến độ</span>
                                  <span>{Math.round(achievement.progress || 0)}%</span>
                                </div>
                                <Progress value={achievement.progress || 0} className="h-2" />
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
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-800">Thông tin cá nhân</CardTitle>
                      <CardDescription className="text-gray-600">Quản lý thông tin tài khoản của bạn</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {/* Profile Avatar & Basic Info */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="relative">
                        <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                          <User className="w-14 h-14 text-white" />
                        </div>
                        {/* Status indicator */}
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex-1 text-center lg:text-left">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{user?.full_name || "Chưa có thông tin"}</h2>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-3">
                          <Badge className="bg-blue-100 text-blue-800 px-3 py-1.5 text-sm">
                            <User className="w-3 h-3 mr-1" />
                            {handleRole(user?.role)}
                          </Badge>
                          {user?.role === "donor" && donor?.blood_type && (
                            <Badge className="bg-red-100 text-red-800 px-3 py-1.5 text-sm">
                              <Droplets className="w-3 h-3 mr-1" />
                              Nhóm máu {donor.blood_type}
                            </Badge>
                          )}
                          {/* Loyalty Level Badge - chỉ hiển thị khi đạt thành tích */}
                          {user?.role === "donor" && (donationRecords?.count || 0) >= 3 && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 text-sm shadow-sm">
                              <Award className="w-3 h-3 mr-1" />
                              {(donationRecords?.count || 0) >= 10 ? "Người hùng Vàng" : 
                               (donationRecords?.count || 0) >= 5 ? "Người hùng Bạc" : "Người hùng Đồng"}
                            </Badge>
                          )}
                          {user?.role === "recipient" && (bloodRequests?.length || 0) >= 2 && (
                            <Badge className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-3 py-1.5 text-sm shadow-sm">
                              <Award className="w-3 h-3 mr-1" />
                              Thành viên tích cực
                            </Badge>
                          )}
                        </div>
                        
                        {/* Account Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center border border-white/50">
                            <div className="text-2xl font-bold text-yellow-600">
                              {user?.role === "donor" 
                                ? (donationRecords?.count || 0) * 50  // 50 điểm mỗi lần hiến máu
                                : (bloodRequests?.length || 0) * 10   // 10 điểm mỗi yêu cầu máu
                              }
                            </div>
                            <div className="text-xs text-gray-600 font-medium">Điểm tích lũy</div>
                          </div>
                          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center border border-white/50">
                            <div className="text-2xl font-bold text-green-600">
                              {user?.role === "donor" ? (donationRecords?.count || 0) : (bloodRequests?.length || 0)}
                            </div>
                            <div className="text-xs text-gray-600 font-medium">
                              {user?.role === "donor" ? "Lần hiến máu" : "Yêu cầu máu"}
                            </div>
                          </div>
                          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center border border-white/50">
                            <div className="text-2xl font-bold text-blue-600">
                              {user?.createdAt ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                            </div>
                            <div className="text-xs text-gray-600 font-medium">Ngày tham gia</div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mt-3 text-sm">
                          <span className="inline-flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            Hoạt động • {user?.email || "Chưa có thông tin"}
                          </span>
                          {/* Hiển thị thông tin cấp độ dựa trên thành tích */}
                          {user?.role === "donor" && (donationRecords?.count || 0) > 0 && (
                            <span className="block mt-1 text-xs">
                              🏆 Cấp độ: {(donationRecords?.count || 0) >= 10 ? "Người hùng Vàng" : 
                                         (donationRecords?.count || 0) >= 5 ? "Người hùng Bạc" : 
                                         (donationRecords?.count || 0) >= 3 ? "Người hùng Đồng" : "Thành viên mới"}
                            </span>
                          )}
                          {user?.role === "donor" && (donationRecords?.count || 0) === 0 && (
                            <span className="block mt-1 text-xs text-gray-500">
                              💡 Hãy hiến máu lần đầu để nhận cấp độ đầu tiên!
                            </span>
                          )}
                          {user?.role === "recipient" && (bloodRequests?.length || 0) >= 2 && (
                            <span className="block mt-1 text-xs">
                              🏆 Cấp độ: Thành viên tích cực
                            </span>
                          )}
                          {user?.role === "recipient" && (bloodRequests?.length || 0) < 2 && (
                            <span className="block mt-1 text-xs text-gray-500">
                              💡 Thành viên mới - Chào mừng bạn đến với hệ thống!
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Thông tin cơ bản */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">Thông tin cơ bản</h3>
                            <p className="text-xs text-gray-500">Thông tin cá nhân của bạn</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Họ và tên</label>
                              <p className="font-semibold text-gray-800 text-base">{user?.full_name || "Chưa có thông tin"}</p>
                              <p className="text-xs text-gray-500 mt-1">Tên hiển thị trên hệ thống</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <Bell className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Email</label>
                              <p className="font-semibold text-gray-800 text-base">{user?.email || "Chưa có thông tin"}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <p className="text-xs text-green-600 font-medium">Đã xác thực</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Phone className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Số điện thoại</label>
                              <p className="font-semibold text-gray-800 text-base">{user?.phone || "Chưa có thông tin"}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <p className="text-xs text-green-600 font-medium">Đã xác thực</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Giới tính</label>
                              <p className="font-semibold text-gray-800 text-base">{handleGender(user?.gender)}</p>
                              <p className="text-xs text-gray-500 mt-1">Thông tin cá nhân</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Ngày sinh</label>
                              <p className="font-semibold text-gray-800 text-base">{user?.date_of_birth ? formatDate(user.date_of_birth) : "Chưa có thông tin"}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {user?.date_of_birth ? `${Math.floor((new Date().getTime() - new Date(user.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365))} tuổi` : "Chưa có thông tin"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                              <Home className="w-5 h-5 text-teal-600" />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Địa chỉ</label>
                              <p className="font-semibold text-gray-800 text-base">{user?.address || "Chưa có thông tin"}</p>
                              <p className="text-xs text-gray-500 mt-1">Địa chỉ thường trú</p>
                            </div>
                          </div>
                          
                          {/* Account Status */}
                          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1 block">Trạng thái tài khoản</label>
                                <p className="font-semibold text-green-800 text-base">Đã kích hoạt</p>
                                <p className="text-xs text-green-600 mt-1">
                                  Tham gia từ {user?.createdAt ? formatDate(user.createdAt) : "Chưa rõ"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Thông tin chuyên biệt */}
                      {(user?.role === "donor") && (
                        <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                          <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                              <Heart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">Thông tin người hiến máu</h3>
                              <p className="text-xs text-red-600">Hồ sơ y tế và hiến máu</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-red-100 hover:border-red-200 transition-colors">
                              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Droplets className="w-6 h-6 text-red-500" />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1 block">Nhóm máu</label>
                                <p className="font-bold text-red-700 text-2xl">{donor?.blood_type || "Chưa có thông tin"}</p>
                                <p className="text-xs text-red-500 mt-1">Nhóm máu của bạn</p>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-red-500 text-white px-2 py-1 text-xs">
                                  Đã xác định
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-red-100 hover:border-red-200 transition-colors">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-green-500" />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1 block">Ngày có thể hiến máu</label>
                                <p className="font-semibold text-gray-800 text-base">{donor?.availability_date ? formatDate(donor.availability_date) : "Chưa có thông tin"}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                  <p className="text-xs text-green-600 font-medium">Sẵn sàng hiến máu</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-red-100 hover:border-red-200 transition-colors">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Home className="w-6 h-6 text-blue-500" />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1 block">Bệnh viện đăng ký</label>
                                <p className="font-semibold text-blue-700 text-base">{hospital?.name || "Chưa có thông tin"}</p>
                                {hospital?.address && (
                                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                                    <Home className="w-3 h-3 mr-1" />
                                    {hospital.address}
                                  </p>
                                )}
                                {hospital?.phone && (
                                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {hospital.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {/* Health Certificate */}
                            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-red-100">
                              <label className="text-xs font-semibold text-red-600 uppercase tracking-wide block mb-3">Giấy chứng nhận sức khỏe</label>
                              {donor?.health_cert_url ? (
                                <div className="relative group">
                                  <Image
                                    src={donor.health_cert_url}
                                    alt="Bằng sức khỏe"
                                    width={300}
                                    height={200}
                                    className="w-full h-48 object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-shadow"
                                  />
                                  <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-2 shadow-lg">
                                    <CheckCircle className="w-4 h-4" />
                                  </div>
                                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                                    <p className="text-xs text-gray-700 font-medium">Đã xác thực</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                                  <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
                                  <p className="text-gray-500 text-sm font-medium">Chưa có giấy chứng nhận</p>
                                  <p className="text-gray-400 text-xs">Vui lòng cập nhật để hoàn thiện hồ sơ</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Cooldown Period */}
                            <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-red-100 hover:border-red-200 transition-colors">
                              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-orange-500" />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1 block">Thời gian nghỉ ngơi</label>
                                <p className="font-semibold text-gray-800 text-base">{donor?.cooldown_until ? formatDate(donor.cooldown_until) : "Không có hạn chế"}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  <p className="text-xs text-orange-600 font-medium">
                                    {donor?.cooldown_until ? "Đang trong thời gian nghỉ" : "Có thể hiến máu"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Donation Statistics */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center border border-red-100">
                                <div className="text-2xl font-bold text-red-600">{donationRecords?.count || 0}</div>
                                <div className="text-xs text-gray-600 font-medium">Lần hiến máu</div>
                              </div>
                              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center border border-red-100">
                                <div className="text-2xl font-bold text-red-600">
                                  {donationRecords?.data ? donationRecords.data.reduce((total, record) => total + (record.volume || 0), 0) : 0}ml
                                </div>
                                <div className="text-xs text-gray-600 font-medium">Tổng lượng máu</div>
                              </div>
                            </div>
                            
                            {/* Achievement Progress */}
                            {(donationRecords?.count || 0) > 0 && (
                              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Award className="w-5 h-5 text-yellow-600" />
                                  </div>
                                  <div className="flex-1">
                                    <label className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1 block">Tiến độ thành tích</label>
                                    <p className="font-semibold text-yellow-800 text-base">
                                      {(donationRecords?.count || 0) >= 10 ? "🏆 Đã đạt cấp cao nhất!" : 
                                       (donationRecords?.count || 0) >= 5 ? `Còn ${10 - (donationRecords?.count || 0)} lần để đạt Người hùng Vàng` : 
                                       (donationRecords?.count || 0) >= 3 ? `Còn ${5 - (donationRecords?.count || 0)} lần để đạt Người hùng Bạc` : 
                                       `Còn ${3 - (donationRecords?.count || 0)} lần để đạt Người hùng Đồng`}
                                    </p>
                                    <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                                      <div 
                                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                                        style={{ 
                                          width: `${Math.min(((donationRecords?.count || 0) / 10) * 100, 100)}%` 
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* First Time Donor Encouragement */}
                            {(donationRecords?.count || 0) === 0 && (
                              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1 block">Bắt đầu hành trình</label>
                                    <p className="font-semibold text-blue-800 text-base">Hãy hiến máu lần đầu để bắt đầu hành trình cứu người!</p>
                                    <p className="text-xs text-blue-600 mt-1">
                                      ✨ Bạn sẽ nhận được 50 điểm và cấp độ "Người hùng Đồng" sau lần hiến đầu tiên
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {(user?.role === "recipient") && (
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                          <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-sm">
                              <Droplets className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">Thông tin người nhận máu</h3>
                              <p className="text-xs text-blue-600">Hồ sơ y tế và bệnh viện</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Home className="w-6 h-6 text-blue-500" />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1 block">Bệnh viện điều trị</label>
                                <p className="font-semibold text-blue-700 text-base">{hospital?.name || "Chưa có thông tin"}</p>
                                {hospital?.address && (
                                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                                    <Home className="w-3 h-3 mr-1" />
                                    {hospital.address}
                                  </p>
                                )}
                                {hospital?.phone && (
                                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {hospital.phone}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <Badge className="bg-blue-500 text-white px-2 py-1 text-xs">
                                  Đã đăng ký
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Medical Documents */}
                            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-100">
                              <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide block mb-3">Giấy tờ y tế</label>
                              {recipient?.medical_doc_url ? (
                                <div className="relative group">
                                  <Image
                                    src={recipient.medical_doc_url}
                                    alt="Giấy tờ y tế"
                                    width={300}
                                    height={200}
                                    className="w-full h-48 object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-shadow"
                                  />
                                  <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-2 shadow-lg">
                                    <CheckCircle className="w-4 h-4" />
                                  </div>
                                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                                    <p className="text-xs text-gray-700 font-medium">Đã xác thực</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                                  <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
                                  <p className="text-gray-500 text-sm font-medium">Chưa có giấy tờ y tế</p>
                                  <p className="text-gray-400 text-xs">Vui lòng cập nhật để hoàn thiện hồ sơ</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Profile Created Date */}
                            <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-green-500" />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1 block">Ngày tạo hồ sơ</label>
                                <p className="font-semibold text-gray-800 text-base">{recipient?.createdAt ? formatDate(recipient.createdAt) : "Chưa rõ"}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <p className="text-xs text-green-600 font-medium">Hồ sơ đã được tạo</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Last Update */}
                            <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-purple-500" />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1 block">Cập nhật gần nhất</label>
                                <p className="font-semibold text-gray-800 text-base">{recipient?.updatedAt ? formatDate(recipient.updatedAt) : "Chưa có cập nhật"}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  <p className="text-xs text-purple-600 font-medium">Thông tin đã được cập nhật</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Blood Request Statistics */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center border border-blue-100">
                                <div className="text-2xl font-bold text-blue-600">{bloodRequests?.length || 0}</div>
                                <div className="text-xs text-gray-600 font-medium">Yêu cầu máu</div>
                              </div>
                              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center border border-blue-100">
                                <div className="text-2xl font-bold text-blue-600">
                                  {warehouseDonationsList2?.length || 0}
                                </div>
                                <div className="text-xs text-gray-600 font-medium">Lần nhận máu</div>
                              </div>
                            </div>
                            
                            {/* Achievement Status for Recipients */}
                            {(bloodRequests?.length || 0) >= 2 && (
                              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Award className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1 block">Trạng thái thành viên</label>
                                    <p className="font-semibold text-blue-800 text-base">Thành viên tích cực</p>
                                    <p className="text-xs text-blue-600 mt-1">
                                      🎉 Bạn đã sử dụng hệ thống {bloodRequests?.length || 0} lần - Cảm ơn sự tin tưởng!
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* New Member Welcome */}
                            {(bloodRequests?.length || 0) < 2 && (
                              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-green-600" />
                                  </div>
                                  <div className="flex-1">
                                    <label className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1 block">Thành viên mới</label>
                                    <p className="font-semibold text-green-800 text-base">Chào mừng bạn đến với hệ thống!</p>
                                    <p className="text-xs text-green-600 mt-1">
                                      💚 Chúng tôi luôn sẵn sàng hỗ trợ bạn trong việc tìm kiếm máu khi cần thiết
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                      <Button 
                        onClick={handleEdit} 
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa thông tin
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleResetPassword} 
                        disabled={isLoading}
                        className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
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
