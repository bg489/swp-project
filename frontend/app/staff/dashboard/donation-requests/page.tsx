"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  status: "pending" | "approved" | "rejected" | "completed"
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
  const [rbcUnits, setRbcUnits] = useState<any>([])
  const [plasmaUnits, setPlasmaUnits] = useState<any>([])
  const [platelet, setPlateletUnits] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [bloodSeperated, setBloodSeperated] = useState("whole")
  const [requestFilter, setRequestFilter] = useState("newest")
  const [checkInOrder, setCheckInOrder] = useState("newest")
  const [healthCheckOrder, setHealthCheckOrder] = useState("newest")
  const [bloodTestOrder, setBloodTestOrder] = useState("newest")

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
  case "completed": return "Đã hoàn tất";
      case "rejected": return "Đã từ chối";
      case "verified": return "Đã xác minh";
      case "unverified": return "Chưa xác minh";
      case "in_progress": return "Đang xử lý";
      case "donated": return "Đã hiến";
      case "expired": return "Đã hết hạn";
      case "passed": return "Đã thông qua";
      case "failed": return "Bị từ chối";
      case "not_eligible": return "Không phù hợp truyền";
      case "transfused": return "Đã truyền";
      default: return "Không có vấn đề";
    }
  }

  function translateDonationType(type: string): string {
    switch (type) {
      case "whole": return "Máu toàn phần";
      case "separated": return "Thành phần máu";
      default: return "Không có vấn đề";
    }
  }

  function translateBloodComponent(component: string) {
    const componentMap: Record<string, string> = {
      "whole": "Máu toàn phần",
      "RBC": "Hồng cầu",
      "plasma": "Huyết tương",
      "platelet": "Tiểu cầu",
    }
    return componentMap[component] || component
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
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
      case "transfused":
        return "bg-green-500 text-white";
      case "unverified":
      case "failed":
      case "rejected":
      case "expired":
      case "not_eligible":
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

          const rbcUnits = await api.get(`/whole-blood/hospital/${staffData.hospital._id}/red-blood-cells`);
          setRbcUnits(rbcUnits.data.units);

          const plasUnits = await api.get(`/whole-blood/hospital/${staffData.hospital._id}/plasmas`);
          setPlasmaUnits(plasUnits.data.units);

          const platUnits = await api.get(`/whole-blood/hospital/${staffData.hospital._id}/platelets`);
          setPlateletUnits(platUnits.data.units);
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

  async function handleCancelStatus(_id: any, currentStatus?: string): Promise<void> {
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

      // Adjust counters based on previous status
      setRejected((prev: number) => prev + 1)
      if (currentStatus === "pending") {
        setPending((prev: number) => (prev > 0 ? prev - 1 : 0))
      } else if (currentStatus === "approved") {
        setApproved((prev: number) => (prev > 0 ? prev - 1 : 0))
      }

      toast.success("Đã hủy yêu cầu hiến máu thành công!")
    } catch (error: any) {
      console.error("Error rejecting request:", error)
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi hủy yêu cầu."
      toast.error(errorMessage)
    }
  }

  async function handleCompleteStatus(_id: any, currentStatus?: string): Promise<void> {
    if (!window.confirm("Xác nhận người hiến đã hiến máu thành công và hoàn tất yêu cầu?")) {
      return
    }

    try {
      const res = await api.put(`/donation-requests/donor-donation-request/complete/${_id}`)

      // Update list locally
      setDonationRequests((prev: DonorDonationRequest[]) =>
        prev.map((req: any) => (req._id === _id ? { ...req, status: "completed" } : req))
      )
      // Adjust counters if transitioning from approved -> completed
      if (currentStatus === "approved") {
        setApproved((prev: number) => (prev > 0 ? prev - 1 : 0))
      }

      toast.success("Đã đánh dấu hoàn tất và cập nhật ngày nghỉ ngơi cho người dùng")
    } catch (error: any) {
      console.error("Error completing request:", error)
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi hoàn tất yêu cầu."
      toast.error(errorMessage)
    }
  }

  const handleLogout = () => {
    logout()
  }

  // Sort donation requests by Ngày đăng ký hiến (donation_date) primarily, fallback to createdAt
  const orderedDonationRequests = [...donationRequests].sort((a, b) => {
    const at = new Date(a?.donation_date ?? a?.createdAt ?? 0).getTime()
    const bt = new Date(b?.donation_date ?? b?.createdAt ?? 0).getTime()
    return requestFilter === "oldest" ? at - bt : bt - at
  })

  // Sort check-ins by donor's Ngày đăng ký hiến if present, else by check-in createdAt
  const orderedCheckIns = [...checkIns].sort((a, b) => {
    const at = new Date(a?.donorDonationRequest_id?.donation_date ?? a?.createdAt ?? 0).getTime()
    const bt = new Date(b?.donorDonationRequest_id?.donation_date ?? b?.createdAt ?? 0).getTime()
    return checkInOrder === "oldest" ? at - bt : bt - at
  })

  // Sort health-checks by donor's Ngày đăng ký hiến via checkIn if present, else by checkIn/healthCheck timestamps
  const orderedHealthChecks = [...healthChecks].sort((a: any, b: any) => {
    const at = new Date(
      a?.checkIn?.donorDonationRequest_id?.donation_date ??
      a?.checkIn?.createdAt ??
      a?.healthCheck?.createdAt ?? 0
    ).getTime()
    const bt = new Date(
      b?.checkIn?.donorDonationRequest_id?.donation_date ??
      b?.checkIn?.createdAt ??
      b?.healthCheck?.createdAt ?? 0
    ).getTime()
    return healthCheckOrder === "oldest" ? at - bt : bt - at
  })

  // Sort blood-tests by donor's Ngày đăng ký hiến if available on the record, else by createdAt
  const orderedBloodTests = [...bloodTests].sort((a: any, b: any) => {
    const at = new Date(a?.donorDonationRequest_id?.donation_date ?? a?.createdAt ?? 0).getTime()
    const bt = new Date(b?.donorDonationRequest_id?.donation_date ?? b?.createdAt ?? 0).getTime()
    return bloodTestOrder === "oldest" ? at - bt : bt - at
  })

  // Sort blood units (Đơn vị máu) by collectionDate primarily, then by createdAt — newest first
  const orderedWholeUnits = [...bloodUnits].sort((a: any, b: any) => {
    const at = new Date(a?.collectionDate ?? a?.createdAt ?? 0).getTime()
    const bt = new Date(b?.collectionDate ?? b?.createdAt ?? 0).getTime()
    return bt - at
  })
  const orderedRbcUnits = [...rbcUnits].sort((a: any, b: any) => {
    const at = new Date(a?.collectionDate ?? a?.createdAt ?? 0).getTime()
    const bt = new Date(b?.collectionDate ?? b?.createdAt ?? 0).getTime()
    return bt - at
  })
  const orderedPlasmaUnits = [...plasmaUnits].sort((a: any, b: any) => {
    const at = new Date(a?.collectionDate ?? a?.createdAt ?? 0).getTime()
    const bt = new Date(b?.collectionDate ?? b?.createdAt ?? 0).getTime()
    return bt - at
  })
  const orderedPlateletUnits = [...platelet].sort((a: any, b: any) => {
    const at = new Date(a?.collectionDate ?? a?.createdAt ?? 0).getTime()
    const bt = new Date(b?.collectionDate ?? b?.createdAt ?? 0).getTime()
    return bt - at
  })

  // Tìm Ngày hiến thực tế (actual) gần nhất từ các đơn vị máu theo user và bệnh viện
  const getLatestDonationDate = (userId?: string, hospitalId?: string): Date | undefined => {
    if (!userId || !hospitalId) return undefined;
    const takeDate = (u: any): number => new Date(u?.collectionDate ?? u?.createdAt ?? 0).getTime();
    const sameUserHosp = (u: any) =>
      (u?.user_id?._id ?? u?.user_id) === userId && (u?.hospital_id?._id ?? u?.hospital_id) === hospitalId;

    const allUnits = [
      ...bloodUnits.filter(sameUserHosp),
      ...rbcUnits.filter(sameUserHosp),
      ...plasmaUnits.filter(sameUserHosp),
      ...platelet.filter(sameUserHosp),
    ];
    if (!allUnits.length) return undefined;
    const latest = allUnits.reduce((acc, cur) => (takeDate(cur) > takeDate(acc) ? cur : acc));
    const t = takeDate(latest);
    return t ? new Date(t) : undefined;
  }

  // Build a set of donor donation request IDs that already have a blood unit marked as 'donated'
  const getRequestIdFromUnit = (unit: any): string | undefined => {
    const id = unit?.donorDonationRequest_id?._id
      ?? unit?.donorDonationRequest_id
      ?? unit?.donor_donation_request_id?._id
      ?? unit?.donor_donation_request_id
      ?? unit?.donorRequest_id?._id
      ?? unit?.donorRequest_id
      ?? unit?.donationRequest_id?._id
      ?? unit?.donationRequest_id
      ?? unit?.checkin?.donorDonationRequest_id?._id
      ?? unit?.checkin?.donorDonationRequest_id
      ?? unit?.checkIn?.donorDonationRequest_id?._id
      ?? unit?.checkIn?.donorDonationRequest_id
      ?? unit?.bloodTest?.donorDonationRequest_id?._id
      ?? unit?.bloodTest?.donorDonationRequest_id
      ?? unit?.healthCheck?.donorDonationRequest_id?._id
      ?? unit?.healthCheck?.donorDonationRequest_id
    return id ? String(id) : undefined
  }

  const donatedRequestIds = new Set<string>([
    ...orderedWholeUnits,
    ...orderedRbcUnits,
    ...orderedPlasmaUnits,
    ...orderedPlateletUnits,
  ]
    .filter((u: any) => u?.status === "donated")
    .map((u: any) => getRequestIdFromUnit(u))
    .filter(Boolean) as string[])

  // Display helper: if any blood unit is marked 'donated' for this request, show status 'donated'
  const getDisplayStatusForRequest = (req: DonorDonationRequest): string => {
    const id = String(req?._id)
    if (!id) return req?.status as string
    if (req?.status === "completed") return "completed"
    return donatedRequestIds.has(id) ? "donated" : (req?.status as string)
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

  function handleCardClick(_id: any, name: string, donation_type: string): void {
    if (donation_type === "whole") {
      router.push(`/staff/edit/health-check/whole?healthCheck=${_id}&name=${name}`);
    } else {
      router.push(`/staff/edit/health-check/separated?healthCheck=${_id}&name=${name}`);
    }
  }

  function handleBloodTestClick(_id: any, name: string, is_seperated: boolean, separated_component: any): void {
    if (is_seperated) {
      router.push(`/staff/edit/blood-test/separated?bloodTestId=${_id}&name=${name}&separated_component=${separated_component}`);
    } else {
      router.push(`/staff/edit/blood-test/whole?bloodTestId=${_id}&name=${name}`);
    }
  }

  function handleBloodUnit(_id: any): void {
    if (bloodSeperated === "whole") {
      router.push(`/staff/edit/blood-unit/whole?bloodUnitId=${_id}`);
    } else if (bloodSeperated === "RBC") {
      router.push(`/staff/edit/blood-unit/rbc?bloodUnitId=${_id}`);
    } else if (bloodSeperated === "plasma") {
      router.push(`/staff/edit/blood-unit/plasma?bloodUnitId=${_id}`);
    } else if (bloodSeperated === "platelet") {
      router.push(`/staff/edit/blood-unit/platelet?bloodUnitId=${_id}`);
    }
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
                  <span>Quản lý hiến máu</span>
                  <Select onValueChange={setRequestFilter} value={requestFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
                <CardDescription>Quản lý hiến máu đã gửi bởi người dùng</CardDescription>
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
                    {orderedDonationRequests.map((request: any) => (
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
                            {(request.donation_type === "separated") ? <p><strong>Các thành phần:</strong> {request.separated_component.map(translateBloodComponent).join(", ")}</p> : ""}
                            <p><strong>Ghi chú:</strong> {request.notes || "Không có"}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {(() => {
                              const displayStatus = getDisplayStatusForRequest(request)
                              return (
                                <Badge className={getStatusColor(displayStatus)}>
                                  {translateStatus(displayStatus)}
                                </Badge>
                              )
                            })()}
                            <p className="text-sm text-gray-600">Ngày tạo: {formatDate(request.createdAt)}</p>

                            {/* Nút xử lý theo trạng thái */}
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
                                  onClick={() => handleCancelStatus(request._id, request.status)}
                                >
                                  Từ chối
                                </Button>
                              </div>
                            )}
                            {request.status === "approved" && (
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="default" onClick={() => handleCompleteStatus(request._id, request.status)}>
                                  Hoàn tất
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleCancelStatus(request._id, request.status)}
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
      <Select value={checkInOrder} onValueChange={setCheckInOrder}>
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
                  {orderedCheckIns.map((checkIn: any) => (
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
                              {checkIn.donorDonationRequest_id.donation_type === "separated" && (
                                <p><strong>Thành phần:</strong> {checkIn.donorDonationRequest_id.separated_component.map(translateBloodComponent).join(", ")}</p>
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
                          {/* Ngày điểm danh removed per request */}

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
      <Select value={healthCheckOrder} onValueChange={setHealthCheckOrder}>
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
                {orderedHealthChecks.map((checkInData: any) => (
                  <div
                    key={checkInData.checkIn._id}
                    className="p-4 border rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-200 space-y-4 cursor-pointer"
                    onClick={() =>
                      handleCardClick(
                        checkInData.healthCheck._id,
                        checkInData.checkIn.user_id.full_name,
                        // Safely determine donation_type for navigation
                        checkInData.checkIn?.donorDonationRequest_id?.donation_type ??
                          checkInData.healthCheck?.donation_type ??
                          "whole"
                      )
                    }
                  >
                    {/* 1) Yêu cầu hiến máu */}
                    {checkInData.checkIn.donorDonationRequest_id && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Yêu cầu hiến máu</h4>
                        <p className="text-sm"><strong>Ngày đăng ký hiến:</strong> {formatDate(checkInData.checkIn.donorDonationRequest_id.donation_date)}</p>
                        <p className="text-sm"><strong>Thời gian:</strong> {checkInData.checkIn.donorDonationRequest_id.donation_time_range.from} - {checkInData.checkIn.donorDonationRequest_id.donation_time_range.to}</p>
                        <p className="text-sm"><strong>Loại hiến máu:</strong> {checkInData.checkIn.donorDonationRequest_id.donation_type === "whole" ? "Toàn phần" : "Tách thành phần"}</p>
                        {checkInData.checkIn.donorDonationRequest_id.donation_type === "separated" && (
                          <p className="text-sm"><strong>Thành phần:</strong> {checkInData.checkIn.donorDonationRequest_id.separated_component.map(translateBloodComponent).join(", ")}</p>
                        )}
                        <p className="text-sm"><strong>Ghi chú:</strong> {checkInData.checkIn.donorDonationRequest_id.notes || "Không có"}</p>
                        <p className="text-sm"><strong>Trạng thái yêu cầu:</strong> {translateStatus(checkInData.checkIn.donorDonationRequest_id.status)}</p>
                        <hr />
                      </div>
                    )}

                    {/* 2) Check-in */}
                    <div className="flex justify-between items-start space-x-6">
                      <div className="space-y-2 flex-1">
                        <h4 className="font-semibold text-gray-900">Check-in</h4>
                        <p className="text-sm text-gray-600"><strong>Họ tên:</strong> {checkInData.checkIn.user_id.full_name}</p>
                        <p className="text-sm text-gray-600"><strong>Email:</strong> {checkInData.checkIn.user_id.email}</p>
                        <p className="text-sm text-gray-600"><strong>CCCD:</strong> {checkInData.checkIn.userprofile_id?.cccd || "Không có"}</p>
                        <p className="text-sm text-gray-600"><strong>Giới tính:</strong> {checkInData.checkIn.user_id.gender}</p>
                        <p className="text-sm text-gray-600"><strong>SĐT:</strong> {checkInData.checkIn.user_id.phone}</p>
                        <p className="text-sm text-gray-600"><strong>Ngày sinh:</strong> {formatDate(checkInData.checkIn.user_id.date_of_birth)}</p>
                        <p className="text-sm text-gray-600"><strong>Bệnh viện:</strong> {checkInData.checkIn.hospital_id.name}</p>
                        <p className="text-sm text-gray-600"><strong>Địa chỉ:</strong> {checkInData.checkIn.hospital_id.address}</p>
                        {/* Ngày điểm danh removed per request */}
                      </div>

                      {/* Trạng thái và hành động của Check-in */}
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getStatusColor(checkInData.status)}>{translateStatus(checkInData.status)}</Badge>
                        {checkInData.status === "in_progress" && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => { e.stopPropagation(); handleVerifiedStatus(checkInData.checkIn._id, "verified") }}
                              className="bg-green-500 text-white hover:bg-green-600"
                            >
                              Xác minh
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => { e.stopPropagation(); handleUnverifiedStatus(checkInData.checkIn._id, "unverified") }}
                              className="bg-red-500 text-white hover:bg-red-600"
                            >
                              Huỷ xác minh
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3) Khám */}
                    <div className="mt-2 space-y-2">
                      <h4 className="font-semibold text-gray-900">Khám</h4>
                      <div className="text-sm">
                        <strong>Trạng thái sức khỏe:</strong> {translateStatus(checkInData.healthCheck.status)}
                      </div>
                      <div className="text-sm">
                        <strong>Health Check ID:</strong> {checkInData.healthCheck._id}
                      </div>
                      {checkInData.healthCheck?.createdAt && (
                        <div className="text-sm">
                          <strong>Ngày khám:</strong> {formatDate(checkInData.healthCheck.createdAt)}
                        </div>
                      )}
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
      <Select value={bloodTestOrder} onValueChange={setBloodTestOrder}>
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
                {orderedBloodTests.map((bloodTestData: any) => (
                  <div
                    key={bloodTestData._id}
                    className="p-4 border rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-200 space-y-4 cursor-pointer"
                    onClick={() => handleBloodTestClick(bloodTestData._id, bloodTestData.user_id.full_name, bloodTestData.is_seperated, bloodTestData.separated_component)}
                  >
                    {/* Thông tin Người Dùng và Bệnh Viện (giống Check-in của Khám) */}
                    <div className="flex justify-between items-start space-x-6">
                      <div className="space-y-1 flex-1">
                        <p className="text-sm text-gray-600"><strong>Họ tên:</strong> {bloodTestData.user_id.full_name}</p>
                        <p className="text-sm text-gray-600"><strong>Email:</strong> {bloodTestData.user_id.email}</p>
                        <p className="text-sm text-gray-600">
                          <strong>CCCD:</strong>{" "}
                          {
                            bloodTestData?.userprofile_id?.cccd ??
                            bloodTestData?.user_profile_id?.cccd ??
                            bloodTestData?.checkin?.userprofile_id?.cccd ??
                            bloodTestData?.checkIn?.userprofile_id?.cccd ??
                            bloodTestData?.userProfile?.cccd ??
                            bloodTestData?.user_profile?.cccd ??
                            "Không có"
                          }
                        </p>
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

                    {/* Thông tin Xét nghiệm & Lịch hiến */}
                    <div className="mt-4 space-y-2">

                      {/* Ngày hiến thực tế từ đơn vị máu (nếu có) */}
                      {(() => {
                        const uid = bloodTestData?.user_id?._id ?? bloodTestData?.user_id;
                        const hid = bloodTestData?.hospital_id?._id ?? bloodTestData?.hospital_id;
                        const latest = getLatestDonationDate(uid, hid);
                        return (
                          <div className="text-sm">
                            <strong>Ngày hiến:</strong> {latest ? formatDate(latest.toString()) : "Chưa có"}
                          </div>
                        );
                      })()}
                      {bloodTestData.is_seperated ? <div className="text-sm">
                        <strong>Thành phần máu:</strong> {bloodTestData.separated_component.map(translateBloodComponent).join(", ")}
                      </div> : ""}
                      <div className="text-sm">
                        <strong>Trạng thái sức khỏe:</strong> {translateStatus(bloodTestData.status)}
                      </div>
                      <div className="text-sm">
                        <strong>Test HBsAg:</strong> {bloodTestData.HBsAg ? "Dương tính" : "Âm tính"}
                      </div>
                      <div className="text-sm">
                        <strong>Huyết sắc tố (g/l):</strong> {bloodTestData.hemoglobin}
                      </div>
                      <div className="text-sm">
                        <strong>Ngày xét nghiệm:</strong> {bloodTestData?.createdAt ? formatDate(bloodTestData.createdAt) : "Chưa có"}
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
                <Select value={bloodSeperated} onValueChange={setBloodSeperated}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whole">Máu Toàn Phần</SelectItem>
                    <SelectItem value="RBC">Hồng Cầu</SelectItem>
                    <SelectItem value="plasma">Huyết Tương</SelectItem>
                    <SelectItem value="platelet">Tiểu cầu</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {bloodSeperated === "whole" && orderedWholeUnits.map((blood: any) => (
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

                  {bloodSeperated === "RBC" && orderedRbcUnits.map((blood: any) => (
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
                            <span className="font-semibold text-orange-600">{Number(blood.volumeOrWeight).toFixed(2)} ml</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Ghi chú:</span>
                            <span className="font-semibold">{blood.notes ? blood.notes : ""}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {bloodSeperated === "plasma" && orderedPlasmaUnits.map((blood: any) => (
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
                            <span className="font-semibold text-orange-600">{Number(blood.volumeOrWeight).toFixed(2)} ml</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Ghi chú:</span>
                            <span className="font-semibold">{blood.notes ? blood.notes : ""}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {bloodSeperated === "platelet" && orderedPlateletUnits.map((blood: any) => (
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
                            <span className="font-semibold text-orange-600">{Number(blood.volumeOrWeight).toFixed(2)} ml</span>
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
