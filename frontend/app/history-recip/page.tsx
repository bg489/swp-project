"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Clock, Droplets, MapPin, Phone, User, AlertTriangle, FileText, Calendar, Activity, X } from "lucide-react"
import api from "@/lib/axios"
import { useAuth } from "@/contexts/auth-context"

export default function RequestHistoryPage() {
  const [bloodRequests, setBloodRequests] = useState<any[]>([])
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
              // Kiểm tra xem req.hospital có tồn tại không
              if (!req.hospital) {
                return [req._id, "Không xác định"];
              }
              const hospitalRes = await api.get(`/hospital/${req.hospital}`);
              return [req._id, hospitalRes.data?.hospital?.name || "Không xác định"];
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
        // Nếu API không tồn tại hoặc có lỗi, set empty array để tránh crash
        setBloodRequests([]);
        setHospitalNames({});
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

  function translateBloodComponent(component: string) {
    const componentMap: Record<string, string> = {
      "Whole": "Máu toàn phần",
      "RBC": "Hồng cầu", 
      "plasma": "Huyết tương",
      "platelet": "Tiểu cầu",
      "whole": "Máu toàn phần",
    }

    return componentMap[component] || component
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

  const handleCancelRequest = async (requestId: string) => {
    try {
      const confirmed = window.confirm("Bạn có chắc chắn muốn hủy yêu cầu này?");
      if (!confirmed) return;

      // Use the correct endpoint from backend: /api/staff/blood-requests/:requestId/status
      await api.put(`/staff/blood-requests/${requestId}/status`, { 
        status: 'cancelled' 
      });
      
      // Update local state
      setBloodRequests(prev => 
        prev.map(req => 
          req._id === requestId 
            ? { ...req, status: 'cancelled' }
            : req
        )
      );
      
      alert("Yêu cầu đã được hủy thành công!");
    } catch (error: any) {
      console.error("Lỗi khi hủy yêu cầu:", error);
      
      if (error.response?.status === 404) {
        alert("Không tìm thấy yêu cầu hoặc endpoint. Vui lòng liên hệ quản trị viên.");
      } else if (error.response?.status === 403) {
        alert("Bạn không có quyền hủy yêu cầu này.");
      } else if (error.response?.status === 400) {
        alert("Yêu cầu này không thể hủy được hoặc dữ liệu không hợp lệ.");
      } else {
        alert("Có lỗi xảy ra khi hủy yêu cầu. Vui lòng thử lại.");
      }
    }
  }

  const canCancelRequest = (status: string) => {
    return status === 'pending' || status === 'approved';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-black mb-3">
              Lịch sử yêu cầu máu
            </h1>
            <p className="text-gray-600 text-lg">Theo dõi và quản lý các yêu cầu hiến máu của bạn</p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Stats Section */}
          {bloodRequests.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Tổng yêu cầu</p>
                      <p className="text-2xl font-bold text-blue-800">{bloodRequests.length}</p>
                    </div>
                    <Activity className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Đã hoàn thành</p>
                      <p className="text-2xl font-bold text-green-800">
                        {bloodRequests.filter(req => req.status === 'completed').length}
                      </p>
                    </div>
                    <Droplets className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-600 text-sm font-medium">Khẩn cấp</p>
                      <p className="text-2xl font-bold text-amber-800">
                        {bloodRequests.filter(req => req.is_emergency).length}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 text-sm font-medium">Đã hủy</p>
                      <p className="text-2xl font-bold text-red-800">
                        {bloodRequests.filter(req => req.status === 'cancelled').length}
                      </p>
                    </div>
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {bloodRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {bloodRequests.map((request, index) => (
                <Card 
                  key={request._id} 
                  className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" style={{ padding: '2px' }}>
                    <div className="bg-white rounded-lg h-full w-full"></div>
                  </div>
                  
                  <CardHeader className="relative z-10 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{request?.recipient_id?.fullName || `Yêu cầu nhận máu #${bloodRequests.length - index}`}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className="text-red-600 border-red-300 bg-red-50 font-semibold"
                            >
                              {request.blood_type_needed}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(request.status)} shadow-sm`}>
                          {translateStatus(request.status)}
                        </Badge>
                        {/* Cancel Button - Small text in top right */}
                        {canCancelRequest(request.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelRequest(request._id)}
                            className="h-8 px-3 py-1 text-red-500 border-red-200 hover:text-red-700 hover:bg-red-50 hover:border-red-300 rounded-md text-xs font-medium"
                            title="Hủy yêu cầu"
                          >
                            Hủy yêu cầu
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10 pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                        <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                        <span className="text-sm font-medium">
                          {new Date(request.createdAt).toLocaleDateString("vi-VN", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                        <MapPin className="w-4 h-4 mr-3 text-green-500" />
                        <span className="text-sm font-medium">{hospitalNames[request._id] || "Đang tải..."}</span>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center text-gray-700">
                          <Droplets className="w-4 h-4 mr-3 text-red-500" />
                          <span className="text-sm">
                            <strong>Thành phần:</strong> {request.components_needed.map((comp: string) => translateBloodComponent(comp)).join(", ")}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-700">
                          <div className="w-4 h-4 mr-3 flex items-center justify-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          </div>
                          <span className="text-sm">
                            <strong>Số lượng:</strong> {request.amount_needed} đơn vị
                          </span>
                        </div>
                        
                        {request.distance && (
                          <div className="flex items-center text-gray-700">
                            <div className="w-4 h-4 mr-3 flex items-center justify-center">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            </div>
                            <span className="text-sm">
                              <strong>Khoảng cách:</strong> {request.distance} km
                            </span>
                          </div>
                        )}
                      </div>

                      {request.comment && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                          <div className="flex items-start">
                            <span className="text-blue-600 mr-2">💬</span>
                            <div>
                              <p className="text-blue-800 font-medium text-sm mb-1">Ghi chú:</p>
                              <p className="text-blue-700 text-sm whitespace-pre-line">{request.comment}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {request.is_emergency && (
                        <div className="mt-4">
                          <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full animate-pulse inline-flex items-center shadow-lg">
                            <AlertTriangle className="w-4 h-4 mr-2" />
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
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/50 rounded-2xl backdrop-blur-sm border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Chưa có yêu cầu nào</h3>
              <p className="text-gray-500 text-center max-w-md">
                Bạn chưa thực hiện yêu cầu hiến máu nào. Hãy bắt đầu bằng cách tạo yêu cầu mới.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
