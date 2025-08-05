"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  ArrowLeft,
  Search,
  Filter,
  Clock,
  CheckCircle,
  X,
  Users,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  ClipboardList,
  LogOut,
  Home,
  Package,
  Hospital,
  Droplet,
  FileText,
  TestTube,
  Droplets,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/axios"
import toast, { Toaster } from "react-hot-toast"

interface DonationRequest {
  _id: string
  user_id: {
    _id: string
    full_name: string
    email: string
    phone: string
    gender: string
    date_of_birth: string
  }
  hospital: {
    name: string
    address: string
    phone: string
  }
  donation_date: string
  donation_time_range: {
    from: string
    to: string
  }
  donation_type: string
  notes: string
  status: string
  createdAt: string
}

interface DonorDonationRequest {
  _id: string
  user_id: {
    _id: string
    email: string
    full_name?: string
    phone?: string
    gender?: string
    date_of_birth?: string
  }
  hospital: {
    _id: string
    name: string
    address: string
  }
  donation_date: string
  donation_type: "whole" | "separated"
  donation_time_range: {
    from: string
    to: string
  }
  separated_component?: "RBC" | "plasma" | "platelet"
  notes: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

export default function DonationRequestsManagement() {
  const router = useRouter()
  const { user, logout } = useAuth()
  
  // States from main dashboard
  const [staff, setStaff] = useState<any>({})
  const [donationRequests, setDonationRequests] = useState<DonorDonationRequest[]>([])
  const [checkIns, setCheckIns] = useState<any>([])
  const [healthChecks, setHealthChecks] = useState<any>([])
  const [bloodTests, setBloodTests] = useState<any>([])
  const [bloodUnits, setBloodUnits] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [requestFilter, setRequestFilter] = useState("newest")
  
  // Stats states
  const [total, setTotal] = useState(0)
  const [pending, setPending] = useState(0)
  const [approved, setApproved] = useState(0)
  const [rejected, setRejected] = useState(0)

  // Stats
  const stats = {
    pending: pending,
    approved: approved,
    rejected: rejected,
    total: donationRequests.length,
  }

  // Helper functions
  function StatusSummary({ summary }: { summary: { pending: number, approved: number, rejected: number } }) {
    return (
      <div className="flex gap-4 text-sm text-gray-700">
        <Badge className="bg-yellow-100 text-yellow-800">Đang chờ: {summary.pending}</Badge>
        <Badge className="bg-green-100 text-green-800">Đã duyệt: {summary.approved}</Badge>
        <Badge className="bg-red-100 text-red-800">Từ chối: {summary.rejected}</Badge>
      </div>
    )
  }

  function translateStatus(status: string): string {
    switch (status) {
      case "pending": return "Đang chờ duyệt";
      case "approved": return "Đã duyệt";
      case "rejected": return "Đã từ chối";
      case "verified": return "Đã xác minh";
      case "unverified": return "Chưa xác minh";
      case "in_progress": return "Đang xử lý";
      case "donated": return "Đã hiến";
      case "expired": return "Đã hết hạn";
      case "passed": return "Đã thông qua";
      case "failed": return "Bị từ chối";
      default: return "Không rõ";
    }
  }

  function translateDonationType(type: string): string {
    switch (type) {
      case "whole": return "Máu toàn phần";
      case "separated": return "Thành phần máu";
      default: return "Không rõ";
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
      case "passed":
        return "bg-green-100 text-green-800"
      case "verified":
      case "donated":
        return "bg-green-500 text-white";
      case "unverified":
      case "failed":
      case "rejected":
      case "expired":
        return "bg-red-500 text-white";
      case "in_progress":
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Load data
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true)
        if (!user?._id) return;

        const profileRes = await api.get(`/users/staff-profiles/active/${user._id}`);
        const staffData = profileRes.data.staffProfile;
        setStaff(staffData);

        if (staffData?.hospital?._id) {
          // Fetch donation requests from API
          const response2 = await api.get(`/donation-requests/donor-donation-request/hospital/${staffData.hospital._id}`)
          setTotal(response2.data.total || 0)
          setPending(response2.data.status_summary.pending || 0)
          setApproved(response2.data.status_summary.approved || 0)
          setRejected(response2.data.status_summary.rejected || 0)
          setDonationRequests(response2.data.requests || [])

          // Fetch other data for tabs
          const checkInns = await api.get(`/checkin/hospital/${staffData.hospital._id}`);
          setCheckIns(checkInns.data.checkIns);

          const hChecks = await api.get(`/health-check/hospital/${staffData.hospital._id}/checkin-statuses`);
          setHealthChecks(hChecks.data);

          const bTests = await api.get(`/blood-test/hospital/${staffData.hospital._id}/blood-tests`);
          setBloodTests(bTests.data);

          const bUnits = await api.get(`/whole-blood/hospital/${staffData.hospital._id}/whole-blood-units`);
          setBloodUnits(bUnits.data.units);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setDonationRequests([])
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchProfile();
    }
  }, [user])

  async function handleUpdateStatus(_id: any, arg1: string): Promise<void> {
    if (!window.confirm("Bạn có chắc chắn muốn chấp nhận yêu cầu hiến máu này?")) {
      return
    }

    try {
      const response = await api.put(`/donation-requests/donor-donation-request/approve/${_id}`)

      setDonationRequests((prev: DonorDonationRequest[]) =>
        prev.map((req: DonorDonationRequest) =>
          req._id === _id
            ? { ...req, status: "approved" }
            : req
        )
      )

      setApproved((prev: number) => prev + 1)
      setPending((prev: number) => prev - 1)

      const response2 = await api.get(`/users/user-profile/${response.data.request.user_id._id}`)

      await api.post(`/checkin`, {
        user_id: response.data.request.user_id._id,
        userprofile_id: response2.data.profile._id,
        hospital_id: response.data.request.hospital._id,
        donorDonationRequest_id: response.data.request._id
      })

      toast.success("Đã chấp nhận yêu cầu hiến máu thành công!")
    } catch (error: any) {
      console.error("Error accepting request:", error)
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi chấp nhận yêu cầu."
      toast.error(errorMessage)
    }
  }

  async function handleCancelStatus(_id: any, arg1: string): Promise<void> {
    if (!window.confirm("Bạn có chắc chắn muốn hủy yêu cầu hiến máu này?")) {
      return
    }

    try {
      await api.put(`/donation-requests/donor-donation-request/reject/${_id}`)

      setDonationRequests((prev: DonorDonationRequest[]) =>
        prev.map((req: DonorDonationRequest) =>
          req._id === _id
            ? { ...req, status: "rejected" }
            : req
        )
      )

      setRejected((prev: number) => prev + 1)
      setPending((prev: number) => prev - 1)

      toast.success("Đã hủy yêu cầu hiến máu thành công!")
    } catch (error: any) {
      console.error("Error rejecting request:", error)
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi hủy yêu cầu."
      toast.error(errorMessage)
    }
  }

  const filteredRequests = donationRequests
    .filter(req => {
      if (filter === "all") return true
      return req.status === filter
    })
    .filter(req => 
      (req.user_id.full_name || req.user_id.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.user_id.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
    })

  const handleLogout = () => {
    logout()
  }

  async function handleUnverifiedStatus(_id: any, arg1: string): Promise<void> {
    if (!window.confirm("Bạn có chắc chắn muốn hủy xác minh thông tin này?")) {
      return
    }

    try {
      await api.put(`/checkin/unverify/${_id}`)

      // Cập nhật state local
      setCheckIns((prev: any[]) =>
        prev.map(req =>
          req._id === _id
            ? { ...req, status: "unverified" }
            : req
        )
      )

      toast.success("Đã hủy xác minh thành công!")
    } catch (error: any) {
      console.error("Error cancelling request:", error)
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi hủy yêu cầu."
      toast.error(errorMessage)
    }
  }

  async function handleVerifiedStatus(_id: any, arg1: string): Promise<void> {
    if (!window.confirm("Xác nhận xác minh thông tin này?")) {
      return
    }

    try {
      const response = await api.put(`/checkin/checkins/${_id}/verify`)

      // Cập nhật state local
      setCheckIns((prev: any[]) =>
        prev.map(req =>
          req._id === _id
            ? { ...req, status: "verified" }
            : req
        )
      )

      await api.post("/health-check/create", {
        checkin_id: response.data.checkIn._id,
        hospital_id: staff.hospital._id
      })

      toast.success("Đã xác minh thành công!")
    } catch (error: any) {
      console.error("Error cancelling request:", error)
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi hủy yêu cầu."
      toast.error(errorMessage)
    }
  }

  function handleCardClick(_id: any, name: string): void {
    router.push(`/staff/edit/health-check/whole?healthCheck=${_id}&name=${name}`);
  }

  function handleBloodTestClick(_id: any, name: string): void {
    router.push(`/staff/edit/blood-test/whole?bloodTestId=${_id}&name=${name}`);
  }

  function handleBloodUnit(_id: any): void {
    router.push(`/staff/edit/blood-unit/whole?bloodUnitId=${_id}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Staff Header - matching blood-management style */}
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
            <span className="text-gray-900 font-medium">Hệ thống quản lý yêu cầu hiến máu</span>
          </div>
        </div>

        {/* Main header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hệ thống quản lý yêu cầu hiến máu</h1>
          <p className="text-gray-600">Quản lý và xử lý các yêu cầu hiến máu từ người dùng</p>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">yêu cầu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã chấp nhận</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">yêu cầu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã từ chối</CardTitle>
              <X className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">yêu cầu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng cộng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-xs text-muted-foreground">yêu cầu</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bộ lọc và tìm kiếm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="approved">Đã chấp nhận</SelectItem>
                  <SelectItem value="rejected">Đã từ chối</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Donation Requests List */}
        <Tabs defaultValue="donation-requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="donation-requests">Yêu cầu hiến máu</TabsTrigger>
            <TabsTrigger value="check-in">Check In</TabsTrigger>
            <TabsTrigger value="health-check">Khám</TabsTrigger>
            <TabsTrigger value="blood-test">Xét nghiệm máu</TabsTrigger>
            <TabsTrigger value="blood-unit">Đơn vị máu</TabsTrigger>
          </TabsList>

          <TabsContent value="donation-requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Quản lý yêu cầu hiến máu</span>
                  <Select onValueChange={setRequestFilter} defaultValue="newest">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
                <CardDescription>Quản lý các yêu cầu hiến máu đã gửi bởi người dùng</CardDescription>
                <StatusSummary summary={{ pending: pending, approved: approved, rejected: rejected }} />
              </CardHeader>

              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Đang tải...</p>
                  </div>
                ) : donationRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không có yêu cầu nào
                    </h3>
                    <p className="text-gray-600">
                      Chưa có yêu cầu hiến máu nào được gửi
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {donationRequests.map((request: any) => (
                      <div
                        key={request._id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p><strong>Email:</strong> {request.user_id.email}</p>
                            <p><strong>Ngày hiến:</strong> {formatDate(request.donation_date)}</p>
                            <p><strong>Khung giờ:</strong> {request.donation_time_range.from} - {request.donation_time_range.to}</p>
                            <p><strong>Loại hiến:</strong> {translateDonationType(request.donation_type)}</p>
                            <p><strong>Ghi chú:</strong> {request.notes || "Không có"}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge className={getStatusColor(request.status)}>
                              {translateStatus(request.status)}
                            </Badge>
                            <p className="text-sm text-gray-600">Ngày tạo: {formatDate(request.createdAt)}</p>

                            {/* Nút xử lý nếu còn trạng thái pending */}
                            {request.status === "pending" && (
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(request._id, "approved")}
                                >
                                  Chấp nhận
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleCancelStatus(request._id, "rejected")}
                                >
                                  Từ chối
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="check-in" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Check in hiến máu</span>
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
                <CardDescription>
                  Danh sách người dùng đến bệnh viện để check in
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {checkIns.map((checkIn: any) => (
                    <div
                      key={checkIn._id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p><strong>Họ tên:</strong> {checkIn.user_id.full_name}</p>
                          <p><strong>Email:</strong> {checkIn.user_id.email}</p>
                          <p><strong>CCCD:</strong> {checkIn.userprofile_id?.cccd || "Không có"}</p>
                          <p><strong>Giới tính:</strong> {checkIn.user_id.gender}</p>
                          <p><strong>SĐT:</strong> {checkIn.user_id.phone}</p>
                          <p><strong>Ngày sinh:</strong> {formatDate(checkIn.user_id.date_of_birth)}</p>
                          <p><strong>Bệnh viện:</strong> {checkIn.hospital_id.name}</p>
                          <p><strong>Địa chỉ:</strong> {checkIn.hospital_id.address}</p>

                          {/* Nếu có donorDonationRequest_id thì hiển thị */}
                          {checkIn.donorDonationRequest_id && (
                            <>
                              <hr />
                              <p><strong>Ngày đăng ký hiến:</strong> {formatDate(checkIn.donorDonationRequest_id.donation_date)}</p>
                              <p><strong>Thời gian:</strong> {checkIn.donorDonationRequest_id.donation_time_range.from} - {checkIn.donorDonationRequest_id.donation_time_range.to}</p>
                              <p><strong>Loại hiến máu:</strong> {checkIn.donorDonationRequest_id.donation_type === "whole" ? "Toàn phần" : "Tách thành phần"}</p>
                              {checkIn.donorDonationRequest_id.separated_component && (
                                <p><strong>Thành phần:</strong> {checkIn.donorDonationRequest_id.separated_component}</p>
                              )}
                              <p><strong>Ghi chú:</strong> {checkIn.donorDonationRequest_id.notes || "Không có"}</p>
                              <p><strong>Trạng thái yêu cầu:</strong> {translateStatus(checkIn.donorDonationRequest_id.status)}</p>
                            </>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <Badge className={getStatusColor(checkIn.status)}>
                            {translateStatus(checkIn.status)}
                          </Badge>
                          <p className="text-sm text-gray-600">
                            Ngày điểm danh: {formatDate(checkIn.createdAt)}
                          </p>

                          {/* Nút xử lý trạng thái */}
                          {checkIn.status === "in_progress" && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerifiedStatus(checkIn._id, "verified")}
                              >
                                Xác minh
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUnverifiedStatus(checkIn._id, "unverified")}
                              >
                                Huỷ xác minh
                              </Button>
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

          <TabsContent value="health-check" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-gray-900">Quản lý khám hiến máu</span>
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-48 border rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white shadow-md rounded-md">
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Danh sách người dùng khám để hiến máu
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {healthChecks.map((checkInData: any) => (
                  <div
                    key={checkInData.checkIn._id}
                    className="p-4 border rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-200 space-y-4 cursor-pointer"
                    onClick={() => handleCardClick(checkInData.healthCheck._id, checkInData.checkIn.user_id.full_name)}
                  >
                    {/* Thông tin Người Dùng và Bệnh Viện */}
                    <div className="flex justify-between items-start space-x-6">
                      <div className="space-y-2 flex-1">
                        <p className="text-lg font-semibold text-gray-900">{checkInData.checkIn.user_id.full_name}</p>
                        <p className="text-sm text-gray-600"><strong>Email:</strong> {checkInData.checkIn.user_id.email}</p>
                        <p className="text-sm text-gray-600"><strong>CCCD:</strong> {checkInData.checkIn.userprofile_id?.cccd || "Không có"}</p>
                        <p className="text-sm text-gray-600"><strong>Giới tính:</strong> {checkInData.checkIn.user_id.gender}</p>
                        <p className="text-sm text-gray-600"><strong>SĐT:</strong> {checkInData.checkIn.user_id.phone}</p>
                        <p className="text-sm text-gray-600"><strong>Ngày sinh:</strong> {formatDate(checkInData.checkIn.user_id.date_of_birth)}</p>
                        <p className="text-sm text-gray-600"><strong>Bệnh viện:</strong> {checkInData.checkIn.hospital_id.name}</p>
                        <p className="text-sm text-gray-600"><strong>Địa chỉ:</strong> {checkInData.checkIn.hospital_id.address}</p>

                        {/* Hiển thị thông tin đăng ký hiến máu */}
                        {checkInData.checkIn.donorDonationRequest_id && (
                          <div className="mt-4 space-y-2">
                            <hr />
                            <p className="text-sm"><strong>Ngày đăng ký hiến:</strong> {formatDate(checkInData.checkIn.donorDonationRequest_id.donation_date)}</p>
                            <p className="text-sm"><strong>Thời gian:</strong> {checkInData.checkIn.donorDonationRequest_id.donation_time_range.from} - {checkInData.checkIn.donorDonationRequest_id.donation_time_range.to}</p>
                            <p className="text-sm"><strong>Loại hiến máu:</strong> {checkInData.checkIn.donorDonationRequest_id.donation_type === "whole" ? "Toàn phần" : "Tách thành phần"}</p>
                            {checkInData.checkIn.donorDonationRequest_id.separated_component && (
                              <p className="text-sm"><strong>Thành phần:</strong> {checkInData.checkIn.donorDonationRequest_id.separated_component}</p>
                            )}
                            <p className="text-sm"><strong>Ghi chú:</strong> {checkInData.checkIn.donorDonationRequest_id.notes || "Không có"}</p>
                            <p className="text-sm"><strong>Trạng thái yêu cầu:</strong> {translateStatus(checkInData.checkIn.donorDonationRequest_id.status)}</p>
                          </div>
                        )}
                      </div>

                      {/* Thông tin trạng thái và các hành động */}
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getStatusColor(checkInData.status)}>{translateStatus(checkInData.status)}</Badge>
                        {/* Nút xử lý trạng thái */}
                        {checkInData.status === "in_progress" && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerifiedStatus(checkInData.checkIn._id, "verified")}
                              className="bg-green-500 text-white hover:bg-green-600"
                            >
                              Xác minh
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleUnverifiedStatus(checkInData.checkIn._id, "unverified")}
                              className="bg-red-500 text-white hover:bg-red-600"
                            >
                              Huỷ xác minh
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Thông tin HealthCheck */}
                    <div className="mt-4 space-y-2">
                      <div className="text-sm">
                        <strong>Trạng thái sức khỏe:</strong> {translateStatus(checkInData.healthCheck.status)}
                      </div>
                      <div className="text-sm">
                        <strong>Health Check ID:</strong> {checkInData.healthCheck._id}
                      </div>
                    </div>

                    {/* Trạng thái tổng của check-in */}
                    <div className="mt-4 space-y-2">
                      <div className="text-sm">
                        <strong>Trạng thái tổng:</strong> {translateStatus(checkInData.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blood-test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-gray-900">Xét nghiệm máu</span>
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-48 border rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white shadow-md rounded-md">
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Danh sách người dùng xét nghiệm máu
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {bloodTests.map((bloodTestData: any) => (
                  <div
                    key={bloodTestData._id}
                    className="p-4 border rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-200 space-y-4 cursor-pointer"
                    onClick={() => handleBloodTestClick(bloodTestData._id, bloodTestData.user_id.full_name)}
                  >
                    {/* Thông tin Người Dùng và Bệnh Viện */}
                    <div className="flex justify-between items-start space-x-6">
                      <div className="space-y-2 flex-1">
                        <p className="text-lg font-semibold text-gray-900">{bloodTestData.user_id.full_name}</p>
                        <p className="text-sm text-gray-600"><strong>Email:</strong> {bloodTestData.user_id.email}</p>
                        <p className="text-sm text-gray-600"><strong>CCCD:</strong> {bloodTestData.userprofile_id?.cccd || "Không có"}</p>
                        <p className="text-sm text-gray-600"><strong>Giới tính:</strong> {bloodTestData.user_id.gender}</p>
                        <p className="text-sm text-gray-600"><strong>SĐT:</strong> {bloodTestData.user_id.phone}</p>
                        <p className="text-sm text-gray-600"><strong>Ngày sinh:</strong> {formatDate(bloodTestData.user_id.date_of_birth)}</p>
                        <p className="text-sm text-gray-600"><strong>Bệnh viện:</strong> {bloodTestData.hospital_id.name}</p>
                        <p className="text-sm text-gray-600"><strong>Địa chỉ:</strong> {bloodTestData.hospital_id.address}</p>
                      </div>
                    </div>

                    {/* Thông tin trạng thái và các hành động */}
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={getStatusColor(bloodTestData.status)}>{translateStatus(bloodTestData.status)}</Badge>
                    </div>

                    {/* Thông tin HealthCheck */}
                    <div className="mt-4 space-y-2">
                      <div className="text-sm">
                        <strong>Trạng thái sức khỏe:</strong> {translateStatus(bloodTestData.status)}
                      </div>
                      <div className="text-sm">
                        <strong>Test HBsAg:</strong> {bloodTestData.HBsAg ? "Dương tính" : "Âm tính"}
                      </div>
                      <div className="text-sm">
                        <strong>Huyết sắc tố (g/l):</strong> {bloodTestData.hemoglobin}
                      </div>
                    </div>

                    {/* Trạng thái tổng của check-in */}
                    <div className="mt-4 space-y-2">
                      <div className="text-sm">
                        <strong>Trạng thái tổng:</strong> {translateStatus(bloodTestData.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blood-unit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Đơn vị máu
                  </span>
                </CardTitle>
                <CardDescription>Theo dõi đơn vị máu của người hiến</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {bloodUnits.map((blood: any) => (
                    <Card key={blood._id} className="relative cursor-pointer" onClick={() => handleBloodUnit(blood._id)}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-bold text-black-600">{"#" + blood._id}</CardTitle>
                        </div>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-bold text-red-600">{(blood.bloodGroupABO) ? (blood.bloodGroupABO + blood.bloodGroupRh) : "Chưa biết nhóm máu"}</CardTitle>
                          <Badge className={getStatusColor(blood.status)}>{translateStatus(blood.status)}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Tên người hiến máu:</span>
                            <span className="font-semibold">{blood.user_id.full_name}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Ngày hiến:</span>
                            <span className="font-semibold">{blood.collectionDate ? formatDate(blood.collectionDate) : "Chưa có"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Tổng khổi lượng:</span>
                            <span className="font-semibold text-orange-600">{blood.volumeOrWeight} ml</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Ghi chú:</span>
                            <span className="font-semibold">{blood.notes ? blood.notes : ""}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster position="top-center" containerStyle={{
        top: 80,
      }} />
    </div>
  )
}
