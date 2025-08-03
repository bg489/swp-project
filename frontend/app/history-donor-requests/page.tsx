"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Clock, Droplets, MapPin, Calendar, FileText, User, Activity, X, ArrowUpDown } from "lucide-react"
import api from "@/lib/axios"
import { useAuth } from "@/contexts/auth-context"
import { GuestAccessWarning } from "@/components/auth/guest-access-warning"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import toast, { Toaster } from "react-hot-toast"

function translateDonationType(type: "whole" | "separated"): string {
  switch (type) {
    case "whole":
      return "Toàn phần"
    case "separated":
      return "Gạn tách"
    default:
      return "Không xác định"
  }
}


function translateStatus(status: "pending" | "approved" | "rejected"): string {
  switch (status) {
    case "pending":
      return "Chờ duyệt"
    case "approved":
      return "Đã chấp nhận"
    case "rejected":
      return "Đã từ chối"
    default:
      return "Không xác định"
  }
}


interface DonorRequest {
  _id: string
  donor_id: {
    _id: string
    full_name: string
    email: string
    phone: string
  }
  blood_type_offered: string
  components_offered: string[]
  amount_offered: number
  available_date: string
  available_time_range: {
    from: string
    to: string
  }
  hospital: {
    _id: string
    name: string
    address: string
  }
  status: string
  comment: string
  createdAt: string
  updatedAt: string
}

interface DonorDonationRequest {
  _id: string
  user_id: string
  hospital: {
    _id: string
    name: string
    address: string
  }
  donation_date: string // ISO string
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


export default function DonorRequestHistoryPage() {
  const { user, isLoading } = useAuth()
  const [bloodRequests, setBloodRequests] = useState<DonorRequest[]>([])
  const [donationRequests, setDonationRequests] = useState<DonorDonationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "status">("newest")
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBloodRequests() {
      if (!user?._id) {
        console.log("User or user._id is missing:", user)
        setLoading(false)
        return
      }
      
      // Debug user object
      console.log("Current user object:", {
        id: user._id,
        role: user.role,
        email: user.email,
        full_name: user.full_name
      })
      
      try {
        console.log("Fetching donor requests for user ID:", user._id)
        setLoading(true)
        const response2 = await api.get(`/donation-requests/donor-donation-request/user/${user._id}`)
        console.log("Fetched donor requests:", response2.data)
        setTotal(response2.data.total || 0)
        setPending(response2.data.status_summary.pending || 0)
        setApproved(response2.data.status_summary.approved || 0)
        setRejected(response2.data.status_summary.rejected || 0)
        setDonationRequests(response2.data.requests || [])
        const response = await api.get(`/users/donor/get-requests-by-id/${user._id}`)
        console.log("API Response:", response.data)
        setBloodRequests(response.data.requests || [])
      } catch (error: any) {
        console.error("Error fetching donor requests:", error)
        console.error("Error details:", error.response?.data)
        
        // Show user-friendly error message
        if (error.response?.status === 404) {
          console.error("User not found or not a valid donor")
        } else if (error.response?.status === 500) {
          console.error("Server error occurred")
        }
        
        setBloodRequests([])
      } finally {
        setLoading(false)
      }
    }

    fetchBloodRequests()
  }, [user])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Check if user is authorized
  if (!user) {
    return <GuestAccessWarning />
  }

  if (user.role !== "user") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-red-600">Không có quyền truy cập</CardTitle>
              <CardDescription>
                Trang này chỉ dành cho người hiến máu. Bạn cần đăng ký là người hiến máu để xem lịch sử yêu cầu.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  // Hàm hủy yêu cầu
  const handleCancelRequest = async (requestId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy yêu cầu hiến máu này?")) {
      return
    }

    try {
      setCancellingId(requestId)
      await api.put(`/donation-requests/donor-donation-request/reject/${requestId}`)
      
      // Cập nhật state local
      setDonationRequests(prev => 
        prev.map(req => 
          req._id === requestId 
            ? { ...req, status: "cancelled" }
            : req
        )
      )

      setRejected(prev => prev + 1)
      setPending(prev => prev - 1)
      
      toast.success("Đã hủy yêu cầu hiến máu thành công!")
    } catch (error: any) {
      console.error("Error cancelling request:", error)
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi hủy yêu cầu."
      toast.error(errorMessage)
    } finally {
      setCancellingId(null)
    }
  }

  // Hàm sắp xếp
  const sortedRequests = [...bloodRequests].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "status":
        const statusOrder = ["pending", "in_progress", "approved", "matched", "completed", "cancelled", "rejected"]
        const statusA = statusOrder.indexOf(a.status)
        const statusB = statusOrder.indexOf(b.status)
        // Nếu không tìm thấy status, đặt ở cuối
        const indexA = statusA === -1 ? statusOrder.length : statusA
        const indexB = statusB === -1 ? statusOrder.length : statusB
        return indexA - indexB
      default:
        // Mặc định sắp xếp theo ngày mới nhất
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  function translateStatus(status: string) {
    const map: Record<string, string> = {
      pending: "Đang xử lý",
      approved: "Đã duyệt", 
      matched: "Đã ghép",
      in_progress: "Đang xử lý",
      completed: "Hoàn tất",
      cancelled: "Đã hủy",
      rejected: "Từ chối",
    }
    return map[status] || status
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-800"
      case "approved":
      case "matched":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long", 
        day: "numeric",
        weekday: "long"
      })
    } catch (error) {
      return "Ngày không hợp lệ"
    }
  }

  const formatTime = (timeString: string) => {
    return timeString || "Không xác định"
  }

  const formatCreatedDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        return "Hôm qua hoặc hôm nay"
      } else if (diffDays <= 7) {
        return `${diffDays} ngày trước`
      } else {
        return date.toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })
      }
    } catch (error) {
      return "Ngày không hợp lệ"
    }
  }

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Header />

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Lịch sử yêu cầu hiến máu</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Theo dõi tất cả các yêu cầu hiến máu bạn đã gửi
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex justify-end items-center mb-8">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <Select value={sortOrder} onValueChange={(value: "newest" | "oldest" | "status") => setSortOrder(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="status">Theo trạng thái</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {total}
                </div>
                <p className="text-sm text-gray-600">Tổng yêu cầu</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {approved}
                </div>
                <p className="text-sm text-gray-600">Hoàn tất</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {pending}
                </div>
                <p className="text-sm text-gray-600">Đang xử lý</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {rejected}
                </div>
                <p className="text-sm text-gray-600">Đã hủy/Từ chối</p>
              </CardContent>
            </Card>
          </div>

          




          {/* Request List */}
          {total === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Chưa có yêu cầu hiến máu
                </h3>
                <p className="text-gray-500">
                  Bạn chưa gửi yêu cầu hiến máu nào. Hãy đăng ký hiến máu để cứu sống những người cần giúp đỡ.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {donationRequests.map((request, index) => (
                <Card key={request._id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Yêu cầu hiến máu
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          Đăng ký: {formatCreatedDate(request.createdAt)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {translateStatus(request.status)}
                        </Badge>
                        {/* Nút hủy yêu cầu */}
                        {(request.status === "pending") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelRequest(request._id)}
                            disabled={cancellingId === request._id}
                            className="text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50"
                          >
                            {cancellingId === request._id ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                                Đang hủy...
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-1" />
                                Hủy yêu cầu
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Thông tin hiến máu */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <Droplets className="w-4 h-4 mr-2 text-red-500" />
                          Thông tin hiến máu
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Loại hiến máu:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {translateDonationType(request.donation_type)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Thời gian */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          Thời gian
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Ngày hiến:</span>
                            <span className="ml-2 font-medium">{formatDate(request.donation_date)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Giờ:</span>
                            <span className="ml-2 font-medium">
                              {formatTime(request.donation_time_range.from)} - {formatTime(request.donation_time_range.to)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bệnh viện */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-green-500" />
                          Bệnh viện
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Tên:</span>
                            <span className="ml-2 font-medium">{request.hospital?.name || "Đang cập nhật"}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Địa chỉ:</span>
                            <span className="ml-2 text-gray-700">{request.hospital?.address || "Đang cập nhật"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ghi chú */}
                    {request.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Ghi chú:</h4>
                        <p className="text-sm text-gray-700">{request.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      <Toaster
        position="top-center"
        containerStyle={{
          top: 80,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
          },
        }}
      />

      <Footer />
      </div>
    </ProtectedRoute>
  )
}
