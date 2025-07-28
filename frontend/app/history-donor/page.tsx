"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Clock, Droplets, MapPin, Phone, User, AlertTriangle, FileText, Calendar, Activity, Heart } from "lucide-react"
import api from "@/lib/axios"
import { useAuth } from "@/contexts/auth-context"

export default function DonorHistoryPage() {
  const [donationRecords, setDonationRecords] = useState<any[]>([])
  const [hospitalNames, setHospitalNames] = useState<Record<string, string>>({})
  const { user } = useAuth()

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user?._id) return;

      try {
        const res = await api.get(`/donor/donation-records/${user._id}`);
        const recordArray = res.data?.donations || [];
        if (Array.isArray(recordArray)) {
          setDonationRecords(recordArray);

          // Load tên bệnh viện cho từng record
          const namePromises = recordArray.map(async (record) => {
            try {
              if (!record.hospital) {
                return [record._id, "Không xác định"];
              }
              const hospitalRes = await api.get(`/hospital/${record.hospital}`);
              return [record._id, hospitalRes.data?.hospital?.name || "Không xác định"];
            } catch (error) {
              console.error("Lỗi khi lấy tên bệnh viện:", error);
              return [record._id, "Không xác định"];
            }
          });

          const resolved = await Promise.all(namePromises);
          const namesObject = Object.fromEntries(resolved);
          setHospitalNames(namesObject);
        } else {
          console.error("Data is not array:", recordArray);
          setDonationRecords([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử hiến máu:", error);
        // Nếu API không tồn tại hoặc có lỗi, set empty array để tránh crash
        setDonationRecords([]);
        setHospitalNames({});
      }
    };

    fetchDonations();
  }, [user]);

  function translateStatus(status: string) {
    const map: Record<string, string> = {
      pending: "Chờ xử lý",
      scheduled: "Đã lên lịch",
      completed: "Hoàn tất",
      cancelled: "Đã hủy",
      rejected: "Từ chối",
      in_progress: "Đang thực hiện",
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
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-800"
      case "in_progress":
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-black mb-3">
              Lịch sử hiến máu
            </h1>
            <p className="text-gray-600 text-lg">Theo dõi và quản lý các lần hiến máu của bạn</p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Stats Section */}
          {donationRecords.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Tổng lần hiến</p>
                      <p className="text-2xl font-bold text-blue-800">{donationRecords.length}</p>
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
                        {donationRecords.filter(record => record.status === 'completed').length}
                      </p>
                    </div>
                    <Droplets className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 text-sm font-medium">Tổng lượng máu</p>
                      <p className="text-2xl font-bold text-red-800">
                        {donationRecords.filter(record => record.status === 'completed')
                          .reduce((total, record) => total + (record.amount || 450), 0)} ml
                      </p>
                    </div>
                    <Heart className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {donationRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {donationRecords.map((record, index) => (
                <Card 
                  key={record._id} 
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
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Hiến máu #{index + 1}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className="text-red-600 border-red-300 bg-red-50 font-semibold"
                            >
                              {record.blood_type || "O+"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(record.status)} shadow-sm`}>
                        {translateStatus(record.status)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10 pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                        <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                        <span className="text-sm font-medium">
                          {new Date(record.donation_date || record.createdAt).toLocaleDateString("vi-VN", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                        <MapPin className="w-4 h-4 mr-3 text-green-500" />
                        <span className="text-sm font-medium">{hospitalNames[record._id] || "Đang tải..."}</span>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        {record.components && record.components.length > 0 && (
                          <div className="flex items-center text-gray-700">
                            <Droplets className="w-4 h-4 mr-3 text-red-500" />
                            <span className="text-sm">
                              <strong>Thành phần:</strong> {record.components.map((comp: string) => translateBloodComponent(comp)).join(", ")}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-gray-700">
                          <div className="w-4 h-4 mr-3 flex items-center justify-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          </div>
                          <span className="text-sm">
                            <strong>Số lượng:</strong> {record.amount || 450} ml
                          </span>
                        </div>

                        {record.next_eligible_date && (
                          <div className="flex items-center text-gray-700">
                            <Clock className="w-4 h-4 mr-3 text-orange-500" />
                            <span className="text-sm">
                              <strong>Có thể hiến tiếp:</strong> {new Date(record.next_eligible_date).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        )}
                      </div>

                      {record.notes && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                          <div className="flex items-start">
                            <span className="text-blue-600 mr-2">💬</span>
                            <div>
                              <p className="text-blue-800 font-medium text-sm mb-1">Ghi chú:</p>
                              <p className="text-blue-700 text-sm whitespace-pre-line">{record.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {record.status === 'completed' && (
                        <div className="mt-4">
                          <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-full inline-flex items-center shadow-lg">
                            <Heart className="w-4 h-4 mr-2" />
                            Cảm ơn bạn đã hiến máu
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
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Chưa có lịch sử hiến máu</h3>
              <p className="text-gray-500 text-center max-w-md">
                Bạn chưa có lần hiến máu nào. Hãy bắt đầu hành trình cứu người bằng cách hiến máu lần đầu tiên.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
