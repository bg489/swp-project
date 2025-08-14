"use client"
import { ProtectedRoute } from "@/components/auth/protected-route"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  const [userProfile, setUserProfile] = useState({ cccd: "", blood_type: undefined });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get(`/users/user-profile/${user?._id}`)
        setUserProfile(response.data.profile)
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

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Chưa có thông tin";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng tính từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
    } else if (role === "user") {
      return "Người dùng"
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
          <Tabs defaultValue="profile" className="space-y-6">
            

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
                        
                        </div>

                        <p className="text-gray-600 mt-3 text-sm">
                          <span className="inline-flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            {donor?.cooldown_until
                              ? (
                                <>
                                  Ngày nghỉ ngơi: {formatDate(donor.cooldown_until)}
                                  <span className="mx-2">•</span>
                                  Thêm 7 ngày nghỉ ngơi: {formatDate(new Date(new Date(donor.cooldown_until).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString())}
                                </>
                              )
                              : "Không có hạn chế"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-1 gap-8">
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
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Số CCCD</label>
                              <p className="font-semibold text-gray-800 text-base">{userProfile.cccd || "Chưa có thông tin"}</p>
                              <p className="text-xs text-gray-500 mt-1">Mã số Căn Cước Công Dân</p>
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

                            {/* Thành tích đã được gỡ bỏ */}
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

                            {/* Trạng thái thành viên theo thành tích đã gỡ bỏ */}

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
