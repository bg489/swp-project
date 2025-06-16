"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MapPin, Phone, Clock, Droplets, Search, Filter, User, Star } from "lucide-react"
import Link from "next/link"

export default function RequestPage() {
  const [searchFilters, setSearchFilters] = useState({
    bloodType: "",
    location: "",
    distance: "10",
    availability: "all",
  })

  const [selectedBloodType, setSelectedBloodType] = useState("")

  const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]

  const bloodCompatibility = {
    "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    "O+": ["O+", "A+", "B+", "AB+"],
    "A-": ["A-", "A+", "AB-", "AB+"],
    "A+": ["A+", "AB+"],
    "B-": ["B-", "B+", "AB-", "AB+"],
    "B+": ["B+", "AB+"],
    "AB-": ["AB-", "AB+"],
    "AB+": ["AB+"],
  }

  const componentCompatibility = {
    "Hồng cầu": {
      "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
      "O+": ["O+", "A+", "B+", "AB+"],
      "A-": ["A-", "A+", "AB-", "AB+"],
      "A+": ["A+", "AB+"],
      "B-": ["B-", "B+", "AB-", "AB+"],
      "B+": ["B+", "AB+"],
      "AB-": ["AB-", "AB+"],
      "AB+": ["AB+"],
    },
    "Huyết tương": {
      "O-": ["O-"],
      "O+": ["O-", "O+"],
      "A-": ["A-", "O-"],
      "A+": ["A-", "A+", "O-", "O+"],
      "B-": ["B-", "O-"],
      "B+": ["B-", "B+", "O-", "O+"],
      "AB-": ["AB-", "A-", "B-", "O-"],
      "AB+": ["AB-", "AB+", "A-", "A+", "B-", "B+", "O-", "O+"],
    },
    "Tiểu cầu": {
      "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
      "O+": ["O+", "A+", "B+", "AB+"],
      "A-": ["A-", "A+", "AB-", "AB+"],
      "A+": ["A+", "AB+"],
      "B-": ["B-", "B+", "AB-", "AB+"],
      "B+": ["B+", "AB+"],
      "AB-": ["AB-", "AB+"],
      "AB+": ["AB+"],
    },
  }

  const availableDonors = [
    {
      id: "D001",
      name: "Nguyễn Văn A",
      bloodType: "O-",
      location: "Quận 1, TP.HCM",
      distance: "2.5 km",
      lastDonation: "3 tháng trước",
      availability: "Sẵn sàng",
      rating: 4.9,
      totalDonations: 12,
      phone: "0901234567",
    },
    {
      id: "D002",
      name: "Trần Thị B",
      bloodType: "A+",
      location: "Quận 3, TP.HCM",
      distance: "4.2 km",
      lastDonation: "2 tháng trước",
      availability: "Sẵn sàng",
      rating: 4.8,
      totalDonations: 8,
      phone: "0907654321",
    },
    {
      id: "D003",
      name: "Lê Văn C",
      bloodType: "B+",
      location: "Quận 5, TP.HCM",
      distance: "6.1 km",
      lastDonation: "1 tháng trước",
      availability: "Bận",
      rating: 4.7,
      totalDonations: 15,
      phone: "0912345678",
    },
    {
      id: "D004",
      name: "Phạm Thị D",
      bloodType: "O+",
      location: "Quận 7, TP.HCM",
      distance: "8.3 km",
      lastDonation: "4 tháng trước",
      availability: "Sẵn sàng",
      rating: 5.0,
      totalDonations: 20,
      phone: "0909876543",
    },
  ]

  const getAvailabilityColor = (availability: string) => {
    return availability === "Sẵn sàng" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  const getCompatibleDonors = (bloodType: string) => {
    if (!bloodType) return []
    const compatible = bloodCompatibility[bloodType as keyof typeof bloodCompatibility] || []
    return availableDonors.filter((donor) => compatible.includes(donor.bloodType))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BloodConnect</h1>
                <p className="text-sm text-gray-600">Tìm người hiến máu</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/emergency">Yêu cầu khẩn cấp</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">← Về trang chủ</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-blue-100 text-blue-800">🔍 Tìm kiếm người hiến máu phù hợp</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tìm người hiến máu</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tìm kiếm người hiến máu phù hợp theo nhóm máu, vị trí và thành phần máu cần thiết
            </p>
          </div>

          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">Tìm kiếm</TabsTrigger>
              <TabsTrigger value="compatibility">Tương thích</TabsTrigger>
              <TabsTrigger value="components">Thành phần máu</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-6">
              {/* Search Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="w-5 h-5 mr-2 text-blue-600" />
                    Bộ lọc tìm kiếm
                  </CardTitle>
                  <CardDescription>Nhập thông tin để tìm người hiến máu phù hợp</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="bloodType">Nhóm máu cần</Label>
                      <Select
                        value={searchFilters.bloodType}
                        onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, bloodType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhóm máu" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center">
                                <Droplets className="w-4 h-4 mr-2 text-red-500" />
                                {type}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Khu vực</Label>
                      <Input
                        id="location"
                        value={searchFilters.location}
                        onChange={(e) => setSearchFilters((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="Quận 1, TP.HCM"
                      />
                    </div>
                    <div>
                      <Label htmlFor="distance">Bán kính (km)</Label>
                      <Select
                        value={searchFilters.distance}
                        onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, distance: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 km</SelectItem>
                          <SelectItem value="10">10 km</SelectItem>
                          <SelectItem value="20">20 km</SelectItem>
                          <SelectItem value="50">50 km</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="availability">Tình trạng</Label>
                      <Select
                        value={searchFilters.availability}
                        onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, availability: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="available">Sẵn sàng</SelectItem>
                          <SelectItem value="busy">Bận</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Search className="w-4 h-4 mr-2" />
                      Tìm kiếm
                    </Button>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Lọc nâng cao
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Search Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Kết quả tìm kiếm</CardTitle>
                  <CardDescription>Tìm thấy {availableDonors.length} người hiến máu phù hợp</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {availableDonors.map((donor) => (
                      <Card key={donor.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-red-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{donor.name}</h3>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-red-600 border-red-200">
                                    {donor.bloodType}
                                  </Badge>
                                  <Badge className={getAvailabilityColor(donor.availability)}>
                                    {donor.availability}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{donor.rating}</span>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>
                                {donor.location} • {donor.distance}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>Lần hiến cuối: {donor.lastDonation}</span>
                            </div>
                            <div className="flex items-center">
                              <Droplets className="w-4 h-4 mr-2" />
                              <span>Đã hiến: {donor.totalDonations} lần</span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button size="sm" className="flex-1">
                              <Phone className="w-4 h-4 mr-1" />
                              Liên hệ
                            </Button>
                            <Button size="sm" variant="outline">
                              Chi tiết
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compatibility" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tra cứu tương thích nhóm máu</CardTitle>
                  <CardDescription>Chọn nhóm máu để xem các nhóm máu có thể hiến tương thích</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label>Chọn nhóm máu cần truyền</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {bloodTypes.map((type) => (
                          <Button
                            key={type}
                            variant={selectedBloodType === type ? "default" : "outline"}
                            onClick={() => setSelectedBloodType(type)}
                            className="h-12"
                          >
                            <Droplets className="w-4 h-4 mr-2" />
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {selectedBloodType && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Nhóm máu {selectedBloodType} có thể nhận từ:</h3>
                        <div className="grid grid-cols-4 gap-4">
                          {bloodTypes.map((type) => {
                            const isCompatible =
                              bloodCompatibility[selectedBloodType as keyof typeof bloodCompatibility]?.includes(type)
                            const compatibleDonors = availableDonors.filter((d) => d.bloodType === type)

                            return (
                              <Card
                                key={type}
                                className={`${isCompatible ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}
                              >
                                <CardContent className="p-4 text-center">
                                  <div
                                    className={`w-12 h-12 ${isCompatible ? "bg-green-500" : "bg-gray-400"} rounded-full flex items-center justify-center mx-auto mb-2`}
                                  >
                                    <span className="text-xl font-bold text-white">{type}</span>
                                  </div>
                                  <p
                                    className={`text-sm font-medium ${isCompatible ? "text-green-800" : "text-gray-600"}`}
                                  >
                                    {isCompatible ? "Tương thích" : "Không tương thích"}
                                  </p>
                                  {isCompatible && (
                                    <p className="text-xs text-green-600 mt-1">
                                      {compatibleDonors.length} người có sẵn
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>

                        {selectedBloodType && (
                          <div className="mt-6">
                            <h4 className="font-semibold mb-3">Người hiến tương thích:</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              {getCompatibleDonors(selectedBloodType).map((donor) => (
                                <Card key={donor.id} className="border-green-200">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                          <User className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                          <p className="font-medium">{donor.name}</p>
                                          <p className="text-sm text-gray-600">
                                            {donor.bloodType} • {donor.distance}
                                          </p>
                                        </div>
                                      </div>
                                      <Badge className={getAvailabilityColor(donor.availability)}>
                                        {donor.availability}
                                      </Badge>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="components" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tương thích thành phần máu</CardTitle>
                  <CardDescription>Tra cứu tương thích cho từng thành phần máu cụ thể</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(componentCompatibility).map(([component, compatibility]) => (
                      <div key={component}>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Droplets className="w-5 h-5 mr-2 text-red-600" />
                          {component}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {bloodTypes.map((bloodType) => (
                            <Card key={bloodType} className="border-blue-200">
                              <CardContent className="p-4">
                                <div className="text-center mb-3">
                                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <span className="text-lg font-bold text-white">{bloodType}</span>
                                  </div>
                                  <p className="font-medium">Nhóm máu {bloodType}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 mb-2">Có thể nhận từ:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {compatibility[bloodType as keyof typeof compatibility]?.map((compatibleType) => (
                                      <Badge key={compatibleType} variant="outline" className="text-xs">
                                        {compatibleType}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
