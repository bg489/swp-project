"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Droplets, Send } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { GuestAccessWarning } from "@/components/auth/guest-access-warning"
import { ProtectedRoute } from "@/components/auth/protected-route"
import api from "../../lib/axios"
import toast, { Toaster } from "react-hot-toast"

export default function BloodRequestPage() {
  const { user, isLoading } = useAuth()
  
  // Form state for blood request
  const initialFilters = {
    bloodType: "",
    comment: "",
    distance: 5,
    availability: "all",
    amount: 1, // Default to 1 instead of 0 to prevent validation errors
    components_needed: [] as string[],
    hospital: "",
    is_emergency: false,
  }
  const [requestForm, setRequestForm] = useState(initialFilters)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hospital search state
  const [hospitalInput, setHospitalInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [nearbyHospitals, setNearbyHospitals] = useState<{ _id: string; name: string, address: string, phone: string }[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Blood compatibility state
  const [selectedBloodType, setSelectedBloodType] = useState("")
  const [selectedComponent, setSelectedComponent] = useState("")
  const [selectedBloodTypeForComponent, setSelectedBloodTypeForComponent] = useState("")
  const [compatibilityResult, setCompatibilityResult] = useState<{
    canGiveTo: string[]
    canReceiveFrom: string[]
  } | null>(null)

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

  // Load hospitals
  useEffect(() => {
    async function loadHospitals() {
      try {
        const response = await api.get("/hospital/")
        const hospitals = response.data.hospitals
        const filtered = hospitals.map((h: any) => ({
          _id: h._id,
          name: h.name,
          address: h.address,
          phone: h.phone,
        }))
        setNearbyHospitals(filtered)
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bệnh viện:", error)
      }
    }
    loadHospitals()
  }, [])

  // Handle click outside for hospital suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false)
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Hospital search functions
  const handleHospitalSelect = (hospital: { _id: string; name: any; address?: string; phone?: string }) => {
    setRequestForm((prev) => ({ ...prev, hospital: hospital._id }))
    setHospitalInput(hospital.name)
    setSearchTerm(hospital.name)
    setShowSuggestions(false)
    setHighlightIndex(-1)
  }

  const normalizeVietnamese = (str: string) => str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")

  const filteredHospitals = searchTerm.trim() === ""
    ? nearbyHospitals
    : nearbyHospitals.filter((h) =>
        normalizeVietnamese(h.name.toLowerCase()).includes(normalizeVietnamese(searchTerm.toLowerCase()))
      )

  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (!showSuggestions) return
    if (e.key === "ArrowDown") {
      const newIndex = (highlightIndex + 1) % filteredHospitals.length
      setHighlightIndex(newIndex)
      setHospitalInput(filteredHospitals[newIndex].name)
      e.preventDefault()
    } else if (e.key === "ArrowUp") {
      const newIndex = (highlightIndex - 1 + filteredHospitals.length) % filteredHospitals.length
      setHighlightIndex(newIndex)
      setHospitalInput(filteredHospitals[newIndex].name)
      e.preventDefault()
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      handleHospitalSelect(filteredHospitals[highlightIndex])
      e.preventDefault()
    }
  }

  const handleHospitalChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setSearchTerm(e.target.value)
    setHospitalInput(e.target.value)
    setShowSuggestions(true)
    setHighlightIndex(-1)
  }

  // Blood request submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!requestForm.bloodType) {
        toast.error("Vui lòng chọn nhóm máu cần")
        setIsSubmitting(false)
        return
      }

      if (!requestForm.hospital) {
        toast.error("Vui lòng chọn bệnh viện")
        setIsSubmitting(false)
        return
      }

      if (requestForm.components_needed.length === 0) {
        toast.error("Vui lòng chọn ít nhất một thành phần máu")
        setIsSubmitting(false)
        return
      }

      if (!requestForm.amount || requestForm.amount <= 0) {
        toast.error("Vui lòng nhập số lượng máu cần thiết (phải lớn hơn 0)")
        setIsSubmitting(false)
        return
      }

      if (!user?._id) {
        toast.error("Vui lòng đăng nhập để gửi yêu cầu")
        setIsSubmitting(false)
        return
      }

      // Debug user information
      console.log("Current user:", user)
      console.log("User role:", user.role)
      console.log("User ID:", user._id)

      console.log("Submitting blood request with data:", {
        recipient_id: user._id,
        blood_type_needed: requestForm.bloodType,
        components_needed: requestForm.components_needed,
        amount_needed: requestForm.amount,
        hospital: requestForm.hospital,
        distance: requestForm.distance,
        comment: requestForm.comment,
        is_emergency: requestForm.is_emergency
      })

      const response = await api.post("/recipient/request", {
        recipient_id: user._id,
        blood_type_needed: requestForm.bloodType,
        components_needed: requestForm.components_needed,
        amount_needed: requestForm.amount,
        hospital: requestForm.hospital,
        distance: requestForm.distance,
        comment: requestForm.comment,
        is_emergency: requestForm.is_emergency
      })

      if (response.data.message) {
        toast.success("Gửi yêu cầu thành công")
        setRequestForm(initialFilters)
        setHospitalInput("")
        setSearchTerm("")
      } else {
        toast.error("Gửi yêu cầu thất bại")
      }
    } catch (err: any) {
      console.error("Error submitting blood request:", err)
      console.error("Error response:", err.response?.data)
      console.error("Error status:", err.response?.status)
      
      // Handle specific error cases
      if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message || "Dữ liệu không hợp lệ"
        toast.error(`Lỗi: ${errorMessage}`)
        console.error("400 Error details:", {
          message: err.response?.data?.message,
          errors: err.response?.data?.errors,
          data: err.response?.data
        })
      } else if (err.response?.status === 404) {
        toast.error("Không tìm thấy người dùng hoặc bệnh viện")
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const checkCompatibility = () => {
    if (!selectedComponent || !selectedBloodTypeForComponent) return

    let canGiveTo: string[] = []
    let canReceiveFrom: string[] = []

    if (selectedComponent === "Máu toàn phần" || selectedComponent === "Hồng cầu" || selectedComponent === "Tiểu cầu") {
      canGiveTo = bloodCompatibility[selectedBloodTypeForComponent as keyof typeof bloodCompatibility] || []
      Object.entries(bloodCompatibility).forEach(([donorType, recipients]) => {
        if (recipients.includes(selectedBloodTypeForComponent)) {
          canReceiveFrom.push(donorType)
        }
      })
    } else if (selectedComponent === "Huyết tương") {
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
      Object.entries(plasmaCompatibility).forEach(([recipientType, donors]) => {
        if (donors.includes(selectedBloodTypeForComponent)) {
          canGiveTo.push(recipientType)
        }
      })
    }

    setCompatibilityResult({ canGiveTo, canReceiveFrom })
    setTimeout(() => {
      const resultsElement = document.getElementById("compatibility-results")
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  // Show guest access warning if not logged in
  if (!user) {
    return (
      <>
        <Header />
        <GuestAccessWarning
          title="Yêu cầu máu và tìm người hiến"
          description="Để gửi yêu cầu máu và kiểm tra tương thích máu, bạn cần đăng nhập hoặc tạo tài khoản mới"
          page="blood-request"
        />
        <Footer />
      </>
    )
  }

  return (
    <ProtectedRoute requiredRole="recipient">
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <Badge className="mb-4 bg-red-100 text-red-800">🩸 Dịch vụ máu tổng hợp</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Yêu cầu máu & Tìm người hiến</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gửi yêu cầu máu cho staff hoặc tự tìm kiếm người hiến máu phù hợp theo nhóm máu và vị trí
            </p>
          </div>

          <Tabs defaultValue="request" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">Gửi yêu cầu máu</TabsTrigger>
              <TabsTrigger value="compatibility">Kiểm tra tương thích</TabsTrigger>
            </TabsList>

            {/* Blood Request Tab */}
            <TabsContent value="request" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="w-5 h-5 mr-2 text-red-600" />
                    Gửi yêu cầu máu cho staff
                  </CardTitle>
                  <CardDescription>
                    Điền thông tin bên dưới, staff sẽ tìm kiếm trong kho máu hoặc liên hệ người hiến phù hợp
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label htmlFor="bloodType">Nhóm máu cần *</Label>
                        <Select
                          value={requestForm.bloodType}
                          onValueChange={(value) => setRequestForm((prev) => ({ ...prev, bloodType: value }))}
                          required
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
                            placeholder="Ví dụ: Bệnh viện Hùng Vương"
                            value={hospitalInput}
                            onChange={handleHospitalChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                              setIsFocused(true)
                              setShowSuggestions(true)
                            }}
                            className="pl-10"
                            required
                          />
                          {showSuggestions && isFocused && filteredHospitals.length > 0 && (
                            <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-60 overflow-y-auto shadow-lg rounded">
                              {filteredHospitals.map((h, idx) => (
                                <li
                                  key={idx}
                                  ref={highlightIndex === idx ? (el) => el?.scrollIntoView({ block: "nearest" }) : null}
                                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${highlightIndex === idx ? "bg-gray-200" : ""}`}
                                  onClick={() => handleHospitalSelect(h)}
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
                        <Label htmlFor="distance">Bán kính tìm kiếm</Label>
                        <Select
                          value={requestForm.distance.toString()}
                          onValueChange={(value) => setRequestForm((prev) => ({ ...prev, distance: Number(value) }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn bán kính" />
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
                        <Label htmlFor="amount">Số lượng (ml)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={requestForm.amount || ""}
                          onChange={(e) => setRequestForm((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                          placeholder="Ví dụ: 450"
                          min={1}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="mb-2 block">Thành phần máu cần</Label>
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
                                ${requestForm.components_needed.includes(item.value)
                                  ? "bg-red-100 border-red-400 text-red-700"
                                  : "bg-white border-gray-300 hover:bg-red-50"}`}
                            >
                              <input
                                type="checkbox"
                                className="mr-2 accent-red-600"
                                checked={requestForm.components_needed.includes(item.value)}
                                onChange={(e) => {
                                  const selected = requestForm.components_needed
                                  const newValue = e.target.checked
                                    ? [...selected, item.value]
                                    : selected.filter((v) => v !== item.value)
                                  setRequestForm((prev) => ({ ...prev, components_needed: newValue }))
                                }}
                              />
                              {item.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col justify-end">
                        <Label className="mb-2">Mức độ khẩn cấp</Label>
                        <button
                          type="button"
                          onClick={() => setRequestForm((prev) => ({ ...prev, is_emergency: !prev.is_emergency }))}
                          className={`flex items-center justify-center px-3 py-2 text-sm font-semibold rounded-lg border transition-all duration-300
                            ${requestForm.is_emergency
                              ? "bg-red-600 text-white border-red-700 shadow-lg animate-pulse"
                              : "bg-white text-red-600 border-red-300 hover:bg-red-50"}
                          `}
                        >
                          <span className="mr-2">{requestForm.is_emergency ? "🚨" : "⏰"}</span>
                          {requestForm.is_emergency ? "Khẩn cấp" : "Bình thường"}
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <Label htmlFor="comment">Ghi chú cho staff</Label>
                      <textarea
                        id="comment"
                        value={requestForm.comment}
                        onChange={(e) => setRequestForm((prev) => ({ ...prev, comment: e.target.value }))}
                        placeholder="Ví dụ: Bệnh nhân đang nằm tại khoa cấp cứu, cần máu gấp trong 2 giờ..."
                        rows={3}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="bg-red-600 hover:bg-red-700" 
                      disabled={isSubmitting}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu máu"}
                    </Button>
                  </CardContent>
                </form>
              </Card>
            </TabsContent>



            {/* Compatibility Check Tab */}
            <TabsContent value="compatibility" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kiểm tra tương thích thành phần máu</CardTitle>
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
                            className={`cursor-pointer transition-all ${selectedComponent === component
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
                                  className={`w-4 h-4 rounded-full border-2 mt-1 ${selectedComponent === component ? "border-red-500 bg-red-500" : "border-gray-300"
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
                        <Button onClick={checkCompatibility} className="bg-red-600 hover:bg-red-700 px-8 py-3 text-lg">
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

      <Toaster position="top-center" containerStyle={{ top: 80 }} />
      <Footer />
      </div>
    </ProtectedRoute>
  )
}
