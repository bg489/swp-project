"use client"

import { useEffect, useRef, useState } from "react"
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
import { useAuth } from "@/contexts/auth-context"
import api from "../../lib/axios";
import toast, {Toaster} from "react-hot-toast"

export default function RequestPage() {
  const initialFilters = {
    bloodType: "",
    comment: "",
    distance: 10,
    availability: "all",
    amount: 0,
    components_needed: [] as string[],
    hospital: "",
    is_emergency: false,
  }
  const [searchFilters, setSearchFilters] = useState(initialFilters)
  

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()

  const [selectedBloodType, setSelectedBloodType] = useState("")
  const [hospitalInput, setHospitalInput] = useState(""); // Giá trị hiện đang hiển thị trong input -> để hiển thị highlight
  const [searchTerm, setSearchTerm] = useState("");  // Giá trị thực người gõ -> để filter
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [nearbyHospitals, setNearbyHospitals] = useState<{ _id: string; name: string, address: string, phone: string }[]>([]);
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null); 
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);


  // Đặt listener khi component mount
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Lấy vị trí người dùng

    async function use() {
      try {
          const response = await api.get("/hospital/");
          const hospitals = response.data.hospitals;

          const filtered = hospitals.map((h: any) => ({
            _id: h._id,
            name: h.name,
            address: h.address,
            phone: h.phone,
          }));

          setNearbyHospitals(filtered);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách bệnh viện:", error);
        }
      }
      use();
    }
  , []);
    

  const handleSelect = (hospital: { _id: string; name: any; address?: string; phone?: string }) => {
    setSearchFilters((prev) => ({ ...prev, hospital: hospital._id }));
    setHospitalInput(hospital.name);
    setSearchTerm(hospital.name);
    setShowSuggestions(false);
    setHighlightIndex(-1);
  };

  const normalizeVietnamese = (str: string) => str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  const filteredHospitals = searchTerm.trim() === ""
  ? nearbyHospitals // khi rỗng mà focus thì show tất cả
  : nearbyHospitals.filter((h) =>
      normalizeVietnamese(h.name.toLowerCase()).includes(normalizeVietnamese(searchTerm.toLowerCase()))
    );


  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      const newIndex = (highlightIndex + 1) % filteredHospitals.length;
      setHighlightIndex(newIndex);
      setHospitalInput(filteredHospitals[newIndex].name); // chỉ thay đổi hiển thị, searchTerm vẫn giữ nguyên
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      const newIndex =
        (highlightIndex - 1 + filteredHospitals.length) % filteredHospitals.length;
      setHighlightIndex(newIndex);
      setHospitalInput(filteredHospitals[newIndex].name);
      e.preventDefault();
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      handleSelect(filteredHospitals[highlightIndex]);
      e.preventDefault();
    }
  };


  const handleChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setSearchTerm(e.target.value);    // update giá trị gõ thực tế
    setHospitalInput(e.target.value); // input hiển thị đồng bộ giá trị gõ
    setShowSuggestions(true);
    setHighlightIndex(-1);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Call API instead of direct function
      const response = await api.post("/recipient/request", {
          recipient_id: user?._id,
          blood_type_needed: searchFilters.bloodType,
          components_needed: searchFilters.components_needed,
          amount_needed: searchFilters.amount,
          hospital: searchFilters.hospital,
          distance: searchFilters.distance,
          comment: searchFilters.comment,
          is_emergency: searchFilters.is_emergency
        });

      const result = await response.data


      if (result.message) {
        toast.success("Gửi yêu cầu thành công")
        setSearchFilters(initialFilters)
      } else {
        toast.error("Gửi yêu cầu thất bại")
      }
    } catch (err) {
      console.error(err)
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại. Vui lòng nhập đúng mật khẩu, tài khoản.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <Badge className="mb-4 bg-blue-100 text-blue-800">🔍 Điền thông tin cần máu phù hợp</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Gửi yêu cầu máu</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Staff sẽ tìm kiếm trong kho máu hoặc người hiến máu phù hợp theo nhóm máu, vị trí và thành phần máu cần thiết
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
                    Điền thông tin
                  </CardTitle>
                  <CardDescription>Nhập thông tin để tìm máu phù hợp</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
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
                        <Label htmlFor="hospital_name">Tên bệnh viện *</Label>
                          <div className="relative" ref={containerRef}>
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="hospital_name"
                              placeholder="ex: Bệnh viện Hùng Vương"
                              value={hospitalInput}
                              onChange={handleChange}
                              onKeyDown={handleKeyDown}
                              onFocus={() => {
                                setIsFocused(true);
                                setShowSuggestions(true); // hiện suggestions khi nhấp
                              }}
                              className="pl-10"
                              required
                              disabled={locationAllowed === false}
                            />
                            {showSuggestions && isFocused && filteredHospitals.length > 0 && (
                              <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-60 overflow-y-auto shadow-lg rounded">
                                {filteredHospitals.map((h, idx) => (
                                  <li
                                    key={idx}
                                    ref={highlightIndex === idx ? (el) => el?.scrollIntoView({ block: "nearest" }) : null}
                                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${highlightIndex === idx ? "bg-gray-200" : ""}`}
                                    onClick={() => handleSelect(h)}
                                  >
                                    <strong>{h.name}</strong>
                                    {h.address && <div className="text-sm text-gray-500">{h.address}</div>}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                      </div>
                      <div>
                        <Label htmlFor="distance">Bán kính (km)</Label>
                        <Select
                          value={searchFilters.distance}
                          onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, distance: Number(value) }))}
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
                        <Label htmlFor="amount">Số lượng</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={searchFilters.amount}
                            onChange={(e) => setSearchFilters((prev) => ({ ...prev, amount: e.target.value }))}
                            placeholder="Nhập số lượng"
                            min={1}
                          />
                      </div>
                    </div>  
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-1 block">Thành phần máu</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: "Máu toàn phần", value: "whole" },
                            { label: "Hồng cầu", value: "RBC" },
                            { label: "Huyết tương", value: "plasma" },
                            { label: "Tiểu cầu", value: "platelet" },
                          ].map((item) => (
                            <label
                              key={item.value}
                              className={`flex items-center px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm font-medium
                                ${searchFilters.components_needed.includes(item.value)
                                  ? "bg-red-100 border-red-400 text-red-700"
                                  : "bg-white border-gray-300 hover:bg-red-50"}`}
                            >
                              <input
                                type="checkbox"
                                className="mr-2 accent-red-600"
                                checked={searchFilters.components_needed.includes(item.value)}
                                onChange={(e) => {
                                  const selected = searchFilters.components_needed
                                  const newValue = e.target.checked
                                    ? [...selected, item.value]
                                    : selected.filter((v) => v !== item.value)
                                  setSearchFilters((prev) => ({ ...prev, components_needed: newValue }))
                                }}
                              />
                              {item.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col justify-end">
                        <Label htmlFor="is_emergency" className="mb-1">Khẩn cấp</Label>
                        <button
                          type="button"
                          onClick={() => setSearchFilters((prev) => ({ ...prev, is_emergency: !prev.is_emergency }))}
                          className={`flex items-center justify-center px-3 py-2 text-sm font-semibold rounded-lg border transition-all duration-300
                            ${searchFilters.is_emergency
                              ? "bg-red-600 text-white border-red-700 shadow-lg animate-pulse"
                              : "bg-white text-red-600 border-red-300 hover:bg-red-50"}
                          `}
                        >
                          <span className="mr-2">{searchFilters.is_emergency ? "✅" : "⬜"}</span>
                          {searchFilters.is_emergency ? "Đã đánh dấu" : "Đánh dấu"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor="comment">Ghi chú cho nhân viên</Label>
                      <textarea
                        id="comment"
                        value={searchFilters.comment}
                        onChange={(e) => setSearchFilters((prev) => ({ ...prev, comment: e.target.value }))}
                        placeholder="Ví dụ: Người nhận đang nằm tại khoa cấp cứu, cần máu gấp..."
                        rows={3}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    

                    <div className="flex gap-4 mt-4">
                      <Button className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                        <Search className="w-4 h-4 mr-2" />
                        Gửi yêu cầu
                      </Button>
                    </div>
                  </CardContent>
                </form>
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
      <Toaster position="top-center" containerStyle={{
              top: 80,
            }}/>
      <Footer />
    </div>
  )
}
