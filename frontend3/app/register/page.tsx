"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Lock, Phone, MapPin, Droplets, AlertCircle, Eye, EyeOff, CheckCircle, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import api from "../../lib/axios";
// import ReCAPTCHA from "react-google-recaptcha"
import UploadCertificate from "@/components/ui/UploadCertificate"
import toast, { Toaster } from "react-hot-toast"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    bloodType: "",
    gender: "",
    date_of_birth: "",
    role: "",
    date_begin_donate: "",
    certificate: "",
    hospital_name: "",
    hospitalId: "",
    agreeTerms: false,
  })
  const [capVal, setCapVal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [hospitalInput, setHospitalInput] = useState(""); // Giá trị hiện đang hiển thị trong input -> để hiển thị highlight
  const [searchTerm, setSearchTerm] = useState("");  // Giá trị thực người gõ -> để filter
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [nearbyHospitals, setNearbyHospitals] = useState<{ _id: string; name: string, address: string, phone: string }[]>([]);
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null); 
  const [radiusKm, setRadiusKm] = useState<number>(10); // mặc định 10km
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const router = useRouter()

  

  const checkLocationPermissionAndUpdateState = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt không hỗ trợ định vị!");
      setLocationAllowed(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationAllowed(true);
        toast.success("✅ Đã cho phép định vị!");
      },
      (error) => {
        console.error("Từ chối định vị:", error);
        setLocationAllowed(false);
        toast.error("❌ Bạn đã từ chối quyền định vị, tính năng tìm kiếm sẽ bị khoá.");
      }
    );
  };

  useEffect(() => {
      // Lấy vị trí người dùng
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
  
          try {
            const response = await api.get("/hospital/");
            const hospitals = response.data.hospitals;
  
            const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
              const R = 6371;
              const dLat = ((lat2 - lat1) * Math.PI) / 180;
              const dLon = ((lon2 - lon1) * Math.PI) / 180;
              const a = Math.sin(dLat / 2) ** 2 +
                        Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
                        Math.sin(dLon / 2) ** 2;
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              return R * c;
            };
  
            const filtered = hospitals.filter((h: any) => {
              const dist = getDistanceKm(latitude, longitude, h.latitude, h.longitude);
              return dist <= 30; // chỉ bệnh viện trong bán kính 30km
            }).map((h: any) => ({
              _id: h._id,
              name: h.name,
              address: h.address,
              phone: h.phone,
            }));
  
            setNearbyHospitals(filtered);
          } catch (error) {
            console.error("Lỗi khi lấy danh sách bệnh viện:", error);
          }
        },
        (error) => {
          console.error("Lỗi lấy vị trí:", error);
          alert("Không thể lấy vị trí của bạn. Vui lòng bật định vị.");
        }
      );
    }, []);
  
    useEffect(() => {
      checkLocationPermissionAndUpdateState();
    }, []);

  const handleFindHospitalsNearby = () => {
      if (!navigator.geolocation) {
        toast.error("Trình duyệt không hỗ trợ định vị!");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          try {
            const response = await api.get("/hospital/");
            const hospitals = response.data.hospitals;
  
            const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
              const R = 6371;
              const dLat = ((lat2 - lat1) * Math.PI) / 180;
              const dLon = ((lon2 - lon1) * Math.PI) / 180;
              const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
                Math.sin(dLon / 2) ** 2;
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              return R * c;
            };
  
            const filtered = hospitals.filter((h: any) => {
              const dist = getDistanceKm(latitude, longitude, h.latitude, h.longitude);
              return dist <= radiusKm; // dùng bán kính người nhập
            }).map((h: any) => ({
              _id: h._id,
              name: h.name,
              address: h.address,
              phone: h.phone,
            }));
  
            setNearbyHospitals(filtered);
  
            if (filtered.length > 0) {
              toast.success(`✅ Tìm thấy ${filtered.length} bệnh viện trong ${radiusKm} km!`);
            } else {
              toast.error(`❌ Không tìm thấy bệnh viện nào trong ${radiusKm} km.`);
            }
          } catch (error) {
            console.error("Lỗi lấy danh sách bệnh viện:", error);
            toast.error("Đã xảy ra lỗi khi tìm bệnh viện!");
          }
        },
        (error) => {
          console.error("Người dùng từ chối chia sẻ vị trí:", error);
          toast.error("❌ Bạn đã từ chối chia sẻ vị trí, không thể tìm kiếm bệnh viện gần bạn.");
        }
      );
    };



  const handleSelect = (hospital: { _id: string; name: any; address?: string; phone?: string }) => {
    setFormData((prev) => ({ ...prev, hospitalId: hospital._id }));
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

const filteredHospitals = nearbyHospitals.filter((h) =>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      setIsLoading(false)
      return
    }

    if (!formData.agreeTerms) {
      setError("Vui lòng đồng ý với điều khoản sử dụng")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      setIsLoading(false)
      return
    }

    // Validate phone number
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Số điện thoại phải có đúng 10 số và bắt đầu bằng số 0")
      setIsLoading(false)
      return
    }

    try {
      // Call API

      const checkingEmail = await api.get("users/get-all-emails");

      const emailToCheck = formData.email.toLowerCase();
      const emailList = checkingEmail.data?.emails.map((e: string) => e.toLowerCase());

      if (emailList.includes(emailToCheck)) {
        setError("Email đã tồn tại.");
        return;
      }



      const response = await api.post("/users/register", {
        full_name: formData.name,
        email: formData.email,
        password: formData.password, // raw password (to be hashed)
        role: formData.role,
        phone: formData.phone,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
      })

      const result = await response.data;

      

      if (result.message) {
        // Redirect to login page with success message
        if(formData.role === "donor"){
          await api.put(`/users/${result.user.id}/role`, {
            newRole: "donor"
          })
          await api.post("/users/donor-profile", {
            user_id: result.user.id,
            blood_type: formData.bloodType,
            availability_date: formData.date_begin_donate,
            health_cert_url: formData.certificate,
            cooldown_until: "",
            hospital: formData.hospitalId
          })
        } else {
          await api.put(`/users/${result.user.id}/role`, {
            newRole: "recipient"
          })
          await api.post("/users/recipient-profile", {
            user_id: result.user.id,
            medical_doc_url: formData.certificate,
            hospital: formData.hospitalId
          })
        }
        api.post("/otp/send", {
          email: formData.email
        })
        router.push(`/register/otp?email=${formData.email}`)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl">
          <Card className="w-full shadow-lg">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">Đăng ký tài khoản</CardTitle>
              <CardDescription>Tạo tài khoản để tham gia cộng đồng hiến máu</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0901234567"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Chỉ cho phép số từ 0-9
                          if (/^\d*$/.test(value)) {
                            // Giới hạn tối đa 10 số và phải bắt đầu bằng 0
                            if (value.length <= 10 && (value === '' || value.startsWith('0'))) {
                              setFormData((prev) => ({ ...prev, phone: value }));
                            }
                          }
                        }}
                        className="pl-10"
                        pattern="^0\d{9}$"
                        title="Số điện thoại phải có 10 số và bắt đầu bằng số 0"
                        minLength={10}
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  {(formData.role === "donor") && (
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Nhóm máu *</Label>
                    <Select
                      value={formData.bloodType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, bloodType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhóm máu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key="unknown" value="unknown">
                            <div className="flex items-center">
                              <Droplets className="w-4 h-4 mr-2 text-red-500" />
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Vai trò *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="donor">Người hiến máu (Donor)</SelectItem>
                        <SelectItem value="recipient">Người nhận máu (Recipient)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Giới tính *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        {["male", "female", "other"].map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            <div className="flex items-center capitalize">
                              {gender === "male" ? "Nam" : gender === "female" ? "Nữ" : "Khác"}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Ngày sinh (18-60 tuổi) *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="dob"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                        className="pl-10"
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 60)).toISOString().split('T')[0]}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* <ReCAPTCHA
                      sitekey="6Le19mkrAAAAAKWFaDg-rfWGbuBAGxpt5m5yoXDd"
                      onChange={(val: boolean | ((prevState: boolean) => boolean)) => setCapVal(val)}
                    /> */}
                  </div>

                  
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      placeholder="123 Đường ABC, Quận 1, TP.HCM"
                      value={formData.address}
                      onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>


                {((formData.role === "donor") || (formData.role === "recipient")) && (
                  <>
                <div className="grid md:grid-cols-2 gap-4">
                  {(formData.role === "donor") && (
                  <div className="space-y-2">
                    <Label htmlFor="dbd">Ngày bắt đầu hiến máu *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="dbd"
                        type="date"
                        value={formData.date_begin_donate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, date_begin_donate: e.target.value }))}
                        className="pl-10"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="hospital_name">Tên bệnh viện *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="hospital_name"
                        placeholder="ex: Bệnh viện Hùng Vương"
                        value={hospitalInput}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="pl-10"
                        required
                        disabled={locationAllowed === false}
                      />
                      {showSuggestions && filteredHospitals.length > 0 && (
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

                  <div className="space-y-2">
                    <Label htmlFor="certificateDonor">Ảnh giấy chứng nhận sức khỏe *</Label>
                    <UploadCertificate
                      id="certificateDonor"
                      value={formData.certificate}
                      onChange={(url) => setFormData((prev) => ({ ...prev, certificate: url }))}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="radiusKm">Khoảng cách tìm bệnh viện (km) *</Label>
                    <Input
                      id="radiusKm"
                      type="number"
                      placeholder="VD: 30"
                      value={radiusKm}
                      onChange={(e) => setRadiusKm(Number(e.target.value))}
                      required
                      disabled={locationAllowed === false}
                    />
                    <Button
                      type="button"
                      onClick={handleFindHospitalsNearby}
                      className="w-full"
                      disabled={locationAllowed === false}
                    >
                      Tìm bệnh viện gần bạn
                    </Button>
                  </div>
                </div>
                </>
                
                )}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))}
                    required
                  />
                  <Label htmlFor="agreeTerms" className="text-sm leading-5">
                    Tôi đồng ý với{" "}
                    <Link href="/terms" className="text-red-600 hover:underline">
                      điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link href="/privacy" className="text-red-600 hover:underline">
                      chính sách bảo mật
                    </Link>
                    . Tôi cam kết thông tin cung cấp là chính xác và đồng ý tham gia hiến máu tình nguyện.
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang đăng ký...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Đăng ký tài khoản
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <Link href="/login" className="text-red-600 hover:underline font-medium">
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster position="top-center" containerStyle={{
              top: 80,
            }}/>
      <Footer />
    </div>
  )
}
