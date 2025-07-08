"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, Clock, Droplets, Search, Filter, User, Star } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"

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

  const [selectedComponent, setSelectedComponent] = useState("")
  const [selectedBloodTypeForComponent, setSelectedBloodTypeForComponent] = useState("")
  const [compatibilityResult, setCompatibilityResult] = useState<{
    canGiveTo: string[]
    canReceiveFrom: string[]
  } | null>(null)

  const getAvailabilityColor = (availability: string) => {
    return availability === "Sẵn sàng" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  const getCompatibleDonors = (bloodType: string) => {
    if (!bloodType) return []
    const compatible = bloodCompatibility[bloodType as keyof typeof bloodCompatibility] || []
    return availableDonors.filter((donor) => compatible.includes(donor.bloodType))
  }

  const checkCompatibility = () => {
    if (!selectedComponent || !selectedBloodTypeForComponent) return

    let canGiveTo: string[] = []
    let canReceiveFrom: string[] = []

    if (selectedComponent === "Máu toàn phần" || selectedComponent === "Hồng cầu" || selectedComponent === "Tiểu cầu") {
      // Same logic as red blood cells
      canGiveTo = bloodCompatibility[selectedBloodTypeForComponent as keyof typeof bloodCompatibility] || []
      // Find who can donate to this blood type
      Object.entries(bloodCompatibility).forEach(([donorType, recipients]) => {
        if (recipients.includes(selectedBloodTypeForComponent)) {
          canReceiveFrom.push(donorType)
        }
      })
    } else if (selectedComponent === "Huyết tương") {
      // Plasma compatibility is reversed
      const plasmaCompatibility = {
        "O-": ["O-"],
        "O+": ["O-", "O+"],
        "A-": ["A-", "O-"],
        "A+": ["A-", "A+", "O-", "O+"],
        "B-": ["B-", "O-"],
        "B+": ["B-", "B+", "O-", "O+"],
        "AB-": ["AB-", "A-", "B-", "O-"],
        "AB+": ["AB-", "AB+", "A-", "A+", "B-", "B+", "O-", "O+"],
      }

      canReceiveFrom = plasmaCompatibility[selectedBloodTypeForComponent as keyof typeof plasmaCompatibility] || []
      // Find who can receive plasma from this blood type
      Object.entries(plasmaCompatibility).forEach(([recipientType, donors]) => {
        if (donors.includes(selectedBloodTypeForComponent)) {
          canGiveTo.push(recipientType)
        }
      })
    }

    setCompatibilityResult({ canGiveTo, canReceiveFrom })

    // Scroll to compatibility results after a short delay to ensure the component has rendered
    setTimeout(() => {
      const resultsElement = document.getElementById("compatibility-results")
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
        <Header />
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white" />
              </div>
              <Badge className="mb-4 bg-red-100 text-red-800">🔍 Tìm kiếm người hiến máu phù hợp</Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Tìm người hiến máu</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tìm kiếm người hiến máu phù hợp theo nhóm máu, vị trí và thành phần máu cần thiết
              </p>
            </div>

            <Tabs defaultValue="search" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 h-14">
                <TabsTrigger value="search">Tìm kiếm</TabsTrigger>
                <TabsTrigger value="compatibility">Tương thích</TabsTrigger>
                <TabsTrigger value="components">Thành phần máu</TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="space-y-6">
                {/* Search Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Search className="w-5 h-5 mr-2 text-red-600" />
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
                      <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Tìm kiếm
                      </Button>
                      <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
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
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                              >
                                <Phone className="w-4 h-4 mr-1" />
                                Liên hệ
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                              >
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
                              onClick={() => {
                                setSelectedBloodType(type)
                                // Scroll down to show the compatibility results after a short delay
                                setTimeout(() => {
                                  const compatibilitySection = document.querySelector("[data-compatibility-section]")
                                  if (compatibilitySection) {
                                    compatibilitySection.scrollIntoView({ behavior: "smooth", block: "start" })
                                  }
                                }, 100)
                              }}
                              className="h-12"
                            >
                              <Droplets className="w-4 h-4 mr-2" />
                              {type}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {selectedBloodType && (
                        <div data-compatibility-section>
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
                    <CardTitle>Chọn thành phần máu</CardTitle>
                    <CardDescription>Chọn loại thành phần máu và nhóm máu để kiểm tra tương thích</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Component Selection */}
                      <div>
                        <Label className="text-base font-semibold">Chọn thành phần máu</Label>
                        <div className="grid gap-4 mt-4">
                          {Object.entries({
                            "Máu toàn phần":
                              "Máu toàn phần bao gồm hồng cầu, huyết tương và tiểu cầu. Tuân theo quy tắc tương thích nhóm máu ABO và Rh.",
                            "Hồng cầu":
                              "Hồng cầu chứa hemoglobin, vận chuyển oxy. Người nhận phải tương thích với kháng nguyên trên hồng cầu của người hiến.",
                            "Huyết tương":
                              "Huyết tương chứa kháng thể. Quy tắc tương thích ngược với hồng cầu - nhóm AB có thể hiến cho tất cả.",
                            "Tiểu cầu":
                              "Tiểu cầu giúp đông máu. Tương thích tương tự như hồng cầu nhưng ưu tiên cùng nhóm máu.",
                          }).map(([component, description]) => (
                            <Card
                              key={component}
                              className={`cursor-pointer transition-all ${
                                selectedComponent === component
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => {
                                setSelectedComponent(component)
                                setCompatibilityResult(null)
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                  <div
                                    className={`w-4 h-4 rounded-full border-2 mt-1 ${
                                      selectedComponent === component ? "border-red-500 bg-red-500" : "border-gray-300"
                                    }`}
                                  >
                                    {selectedComponent === component && (
                                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{component}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Blood Type Selection */}
                      {selectedComponent && (
                        <div>
                          <Label className="text-base font-semibold">Chọn nhóm máu</Label>
                          <div className="grid grid-cols-4 gap-3 mt-4">
                            {bloodTypes.map((type) => (
                              <Button
                                key={type}
                                variant={selectedBloodTypeForComponent === type ? "default" : "outline"}
                                onClick={() => {
                                  setSelectedBloodTypeForComponent(type)
                                  setCompatibilityResult(null)
                                }}
                                className="h-16 text-lg font-bold"
                              >
                                {type}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Check Compatibility Button */}
                      {selectedComponent && selectedBloodTypeForComponent && (
                        <div className="flex justify-center">
                          <Button
                            onClick={checkCompatibility}
                            className="bg-red-600 hover:bg-red-700 px-8 py-3 text-lg"
                          >
                            Kiểm tra tương thích
                          </Button>
                        </div>
                      )}

                      {/* Compatibility Results */}
                      {compatibilityResult && (
                        <Card className="border-red-200 bg-red-50" id="compatibility-results">
                          <CardHeader>
                            <CardTitle className="text-red-800">Kết quả tương thích</CardTitle>
                            <CardDescription className="text-red-600">
                              Đang tra cứu {selectedComponent} với nhóm máu {selectedBloodTypeForComponent}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Can Give To */}
                              <div>
                                <h3 className="font-semibold text-lg mb-4 text-green-800">
                                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                  Có thể cho
                                </h3>
                                <div className="space-y-2">
                                  {compatibilityResult.canGiveTo.map((bloodType) => (
                                    <div key={bloodType} className="flex items-center p-3 bg-green-100 rounded-lg">
                                      <Droplets className="w-5 h-5 text-green-600 mr-3" />
                                      <span className="font-medium">Nhóm máu: {bloodType}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Can Receive From */}
                              <div>
                                <h3 className="font-semibold text-lg mb-4 text-blue-800">
                                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                                  Có thể nhận từ
                                </h3>
                                <div className="space-y-2">
                                  {compatibilityResult.canReceiveFrom.map((bloodType) => (
                                    <div key={bloodType} className="flex items-center p-3 bg-blue-100 rounded-lg">
                                      <Droplets className="w-5 h-5 text-blue-600 mr-3" />
                                      <span className="font-medium">Nhóm máu: {bloodType}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
