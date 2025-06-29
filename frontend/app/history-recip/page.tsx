"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Clock, Droplets, MapPin, Phone, User } from "lucide-react"
import api from "@/lib/axios"
import { useAuth } from "@/contexts/auth-context"

export default function RequestHistoryPage() {
  const [bloodRequests, setBloodRequests] = useState([])
  const [hospitalNames, setHospitalNames] = useState<Record<string, string>>({})
  const { user } = useAuth()

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?._id) return;

      try {
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
        } else {
          console.error("Data is not array:", requestArray);
          setBloodRequests([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy yêu cầu máu:", error);
      }
    };

    fetchRequests();
  }, [user]);


  async function handleHospitalName(hospitalId: any) {
    const hospitalRes = await api.get(`/hospital/${hospitalId}`);
    const hospitalName = hospitalRes.data.hospital.name;
    return hospitalName;
  }

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


  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-800"
      case "in_progress":
      case "approved":
      case "matched":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử yêu cầu máu</h1>
            <p className="text-gray-600">Xem lại các yêu cầu đã thực hiện</p>
          </div>

          {bloodRequests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4">
              {bloodRequests.map((request) => (
                <Card key={request._id} className="hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{request?.recipient_id?.fullName || "Bạn"}</p>
                          <div className="flex items-center space-x-2 text-sm">
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              {request.blood_type_needed}
                            </Badge>
                            <Badge className={getStatusColor(request.status)}>
                              {translateStatus(request.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <Clock className="inline w-4 h-4 mr-1" />
                        {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>

                    <div className="text-sm text-gray-700 space-y-1">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{hospitalNames[request._id] || "Đang tải..."}</span>
                      </div>
                      <div className="flex items-center">
                        <Droplets className="w-4 h-4 mr-2" />
                        Thành phần: {request.components_needed.join(", ")}
                      </div>
                      <div className="flex items-center">
                        <Droplets className="w-4 h-4 mr-2" />
                        Số lượng: {request.amount_needed} đơn vị
                      </div>
                      {request.distance && (
                        <div className="flex items-center">
                          <Droplets className="w-4 h-4 mr-2" />
                          Khoảng cách: {request.distance} km
                        </div>
                      )}
                      {request.comment && (
                        <div className="flex items-start text-gray-600">
                          <span className="font-medium mr-2">💬 Ghi chú:</span>
                          <span className="whitespace-pre-line">{request.comment}</span>
                        </div>
                      )}
                      {request.is_emergency && (
                        <div className="mt-3">
                          <Badge className="bg-red-600 text-white text-sm px-3 py-1 rounded-full animate-pulse inline-flex items-center">
                            <svg className="w-4 h-4 mr-1 fill-white" viewBox="0 0 24 24">
                              <path d="M1 21h22L12 2 1 21zm13-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                            </svg>
                            Yêu cầu khẩn cấp
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[300px]">
              <p className="text-4xl font-bold text-center text-rose-400/70 tracking-wide">
                KHÔNG CÓ DỮ LIỆU
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
