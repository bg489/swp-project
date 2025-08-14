"use client"

import type React from "react"
import "./edit-styles.css"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Phone, MapPin, Droplets, AlertCircle, CheckCircle, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import api from "@/lib/axios";
// import ReCAPTCHA from "react-google-recaptcha"
import { useAuth } from "@/contexts/auth-context"
import toast, { Toaster } from "react-hot-toast"
import UploadCertificate from "@/components/ui/UploadCertificate"
import AddressAutocomplete from "@/components/ui/AddressAutocomplete"


export default function EditProfilePage() {
  const { user, setUser, logout } = useAuth()
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const [formData, setFormData] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    phone: user?.phone || "",
    address: user?.address || "",
    bloodType: "",
    gender: user?.gender || "",
    date_of_birth: user?.date_of_birth ? formatDate(user.date_of_birth) : "",
    role: user?.role || "",
    certificateDonor: "",
    certificateRecipient: "",
    hospital_name: "",
    hospitalId: "",
    availability_date: "",
    agreeTerms: false,
  })
  type DonorProfile = {
    blood_type: string;
    availability_date: string;
    health_cert_url?: string;
    cooldown_until?: string;
    createdAt?: string;
    updatedAt?: string;
    // Add other fields if needed
  };

  const [donor, setDonor] = useState<DonorProfile | null>(null);
  type RecipientProfile = {
    medical_doc_url: string;
    hospital_name: string;
    createdAt?: string;
    updatedAt?: string;
  };
  const [recipient, setRecipient] = useState<RecipientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<{ _id: string; name: string, address: string, phone: string }[]>([]);
  const [radiusKm, setRadiusKm] = useState<number>(10); // mặc định 10km
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");  // Giá trị thực người gõ -> để filter
  const [hospitalInput, setHospitalInput] = useState(""); // Giá trị hiện đang hiển thị trong input -> để hiển thị highlight
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd










  const normalizeVietnamese = (str: string) => str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  const filteredHospitals = nearbyHospitals.filter((h) =>
    normalizeVietnamese(h.name.toLowerCase()).includes(normalizeVietnamese(searchTerm.toLowerCase()))
  );



  // null: chưa check, true: cho phép, false: từ chối






  const router = useRouter()

  const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]


  useEffect(() => {
    async function fetchProfile() {
      if (!user?._id) return; // Only check for user._id since it's required

      try {
        setFormData((prev) => ({
          ...prev,
          name: user?.full_name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          address: user?.address || "",
          gender: (user?.gender as "male" | "female" | "other") || "male",
          date_of_birth: user?.date_of_birth ? formatDate(user.date_of_birth) : "",
        }));

      } catch (error) {
        console.warn("Không tìm thấy recipient profile:", error);
      }

      setIsLoading(false);
    }

    if (user?._id) {
      fetchProfile();
    }
  }, [user]);





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!user?._id) {
      setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      setIsLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError("Vui lòng đồng ý với điều khoản sử dụng");
      setIsLoading(false);
      return;
    }

    if (formData.phone.length < 10) {
      setError("Vui lòng nhập đúng số điện thoại");
      setIsLoading(false);
    }

    try {
      // Update user base info
      const response = await api.put(`/users/edit/${user._id}`, {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender as "male" | "female" | "other",
        date_of_birth: formData.date_of_birth,
        address: formData.address,
      });

      const result = response.data;

      if (result.message) {
        setUser({
          ...user!,
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender as "male" | "female" | "other",
          date_of_birth: formData.date_of_birth,
          address: formData.address,
          role: "user"
        });

        toast.success("Cập nhật thông tin thành công!")

        router.push("/user/dashboard");
      } else {
        setError(result.message || "Không thể cập nhật thông tin.");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-100 opacity-30"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-red-200/20 to-pink-200/20 rounded-full -translate-x-32 -translate-y-32 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-200/20 to-red-200/20 rounded-full translate-x-32 translate-y-32 blur-3xl"></div>

      <Header />

      <div className="flex-1 flex items-center justify-center p-4 py-12 relative z-10">
        <div className="w-full max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3">
              Chỉnh sửa thông tin
            </h1>
            <p className="text-gray-600 text-lg">Cập nhật thông tin cá nhân của bạn</p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <Card className="w-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
            {locationAllowed === false && (
              <Alert variant="destructive" className="mx-6 mt-6 border-red-200 bg-red-50/80 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  Bạn đã từ chối chia sẻ vị trí. Không thể sử dụng chức năng tìm kiếm bệnh viện gần bạn.
                </AlertDescription>
              </Alert>
            )}
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <CardTitle className="text-2xl font-semibold text-gray-800">Thông tin cá nhân</CardTitle>
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              </div>
              <CardDescription className="text-gray-600">
                Vui lòng cập nhật thông tin chính xác để đảm bảo an toàn
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm animate-shake">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Section 1: Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Thông tin cá nhân</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent"></div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-3 group">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                        Họ và tên <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                        <Input
                          id="name"
                          placeholder="Nguyễn Văn A"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          className="pl-10 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all duration-300 hover:border-gray-300"
                          required
                        />
                      </div>
                    </div>

                    {(formData.role === "donor") && (
                      <div className="space-y-3 group">
                        <Label htmlFor="bloodType" className="text-sm font-medium text-gray-700 flex items-center">
                          Nhóm máu <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Select
                          value={formData.bloodType}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, bloodType: value }))}
                        >
                          <SelectTrigger className="h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all duration-300 hover:border-gray-300">
                            <SelectValue placeholder="Chọn nhóm máu" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 backdrop-blur-sm">
                            <SelectItem key="unknown" value="unknown">
                              <div className="flex items-center">
                                <Droplets className="w-4 h-4 mr-2 text-gray-500" />
                                Chưa biết
                              </div>
                            </SelectItem>
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
                    )}
                  </div>
                </div>

                {/* Section 2: Contact Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Thông tin liên lạc</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-3 group">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                        Email <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          className="pl-10 h-12 border-gray-200 bg-gray-50 transition-all duration-300"
                          disabled
                        />
                      </div>
                    </div>

                    {((formData.role === "donor") || (formData.role === "recipient")) && (
                      <>
                        {(formData.role === "donor") && (
                          <div className="space-y-3 group">
                            <Label htmlFor="dbd" className="text-sm font-medium text-gray-700 flex items-center">
                              Ngày bắt đầu hiến máu <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                              <Input
                                id="dbd"
                                type="date"
                                min={today}
                                value={formData.availability_date}
                                onChange={(e) => setFormData((prev) => ({ ...prev, availability_date: e.target.value }))}
                                className="pl-10 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all duration-300 hover:border-gray-300"
                                required
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Section 3: Personal Details */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Chi tiết cá nhân</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-3 group">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                        Số điện thoại <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="0901234567"
                          value={formData.phone || ""}
                          onChange={(e) => {
                            const input = e.target.value;
                            if (/^\d*$/.test(input)) {
                              if (input.length <= 10 && (input === "" || input.startsWith("0"))) {
                                setFormData((prev) => ({ ...prev, phone: input }));
                              }
                            }
                          }}
                          minLength={10}
                          maxLength={10}
                          className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-300 hover:border-gray-300"
                          required
                        />
                      </div>
                    </div>

                    {((formData.role === "donor") || (formData.role === "recipient")) && (
                      <>
                        {(formData.role === "donor") && (
                          <div className="space-y-3 group">
                            <Label htmlFor="certificateDonor" className="text-sm font-medium text-gray-700 flex items-center">
                              Ảnh giấy chứng nhận sức khỏe <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-green-400 transition-all duration-300 group-focus-within:border-green-500">
                              <UploadCertificate
                                id="certificateDonor"
                                value={formData.certificateDonor}
                                onChange={(url) => setFormData((prev) => ({ ...prev, certificateDonor: url }))}
                              />
                            </div>
                          </div>
                        )}

                        {(formData.role === "recipient") && (
                          <div className="space-y-3 group">
                            <Label htmlFor="certificateRecipient" className="text-sm font-medium text-gray-700 flex items-center">
                              Ảnh giấy chứng nhận y tế <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-green-400 transition-all duration-300 group-focus-within:border-green-500">
                              <UploadCertificate
                                id="certificateRecipient"
                                value={formData.certificateRecipient}
                                onChange={(url) => setFormData((prev) => ({ ...prev, certificateRecipient: url }))}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Section 5: Birth and Gender */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Thông tin sinh học</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-3 group">
                      <Label htmlFor="dob" className="text-sm font-medium text-gray-700 flex items-center">
                        Ngày sinh <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <Input
                          id="dob"
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => setFormData((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                          className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 hover:border-gray-300"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="gender" className="text-sm font-medium text-gray-700 flex items-center">
                        Giới tính <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Select
                        key={formData.gender}
                        value={formData.gender}
                        onValueChange={(value: "male" | "female" | "other") => setFormData((prev) => ({ ...prev, gender: value }))}
                      >
                        <SelectTrigger className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 hover:border-gray-300">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm">
                          {(["male", "female", "other"] as const).map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              <div className="flex items-center capitalize">
                                <User className="w-4 h-4 mr-2 text-orange-500" />
                                {gender === "male" ? "Nam" : gender === "female" ? "Nữ" : "Khác"}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Section 6: Location and Hospital Search */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Vị trí và Tìm kiếm</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-teal-200 to-transparent"></div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-3 group">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center">
                        Địa chỉ <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                        <div className="pl-10">
                          <AddressAutocomplete
                            value={formData.address || ""}
                            onChange={(val) => setFormData((prev) => ({ ...prev, address: val }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Terms and Submit Section */}
                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border border-red-100">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))}
                        required
                        className="mt-1 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                      />
                      <Label htmlFor="agreeTerms" className="text-sm leading-6 text-gray-700 cursor-pointer">
                        Tôi đồng ý với{" "}
                        <Link href="/terms" className="text-red-600 hover:text-red-700 underline font-medium transition-colors">
                          điều khoản sử dụng
                        </Link>{" "}
                        và{" "}
                        <Link href="/privacy" className="text-red-600 hover:text-red-700 underline font-medium transition-colors">
                          chính sách bảo mật
                        </Link>
                        . Tôi cam kết thông tin cung cấp là chính xác và đồng ý tham gia hiến máu tình nguyện.
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Đang cập nhật thông tin...
                        </div>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-3" />
                          Cập nhật thông tin
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>

              <div className="text-center mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <Link href="/login" className="text-red-600 hover:text-red-700 underline font-medium transition-colors">
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
  )
}