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
import { Html5QrcodeScanner } from 'html5-qrcode'

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
    cccd: "",
    agreeTerms: false,
  })
  const [scanResult, setScanResult] = useState("");
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
  const [scannerInstance, setScannerInstance] = useState<any>(null);

  const router = useRouter()

  const checkDuplicateCCCD = async (cccd: string) => {
    try {
      const response = await api.get(`/users/check-cccd?cccd=${encodeURIComponent(cccd)}`);
      return response.data;
    } catch (err) {
      console.error("Error checking CCCD:", err);
      return false;
    }
  };


  useEffect(() => {
    try {
      const informations = scanResult.split('|');
      setFormData((prev) => ({ ...prev, name: informations[2] || "" }))
      if(informations[4] === "Nam"){
        setFormData((prev) => ({ ...prev, gender: "male" }))
      } else if(informations[4] === "Nữ"){
        setFormData((prev) => ({ ...prev, gender: "female" }))
      }
      if(informations[3]){
        const raw = informations[3];
        const formattedDateBirth = `${raw.slice(4)}-${raw.slice(2, 4)}-${raw.slice(0, 2)}`;
        setFormData((prev) => ({ ...prev, date_of_birth: formattedDateBirth }));
        toast.success("Render thông tin thành công");
      }
      setFormData((prev) => ({ ...prev, cccd: informations[0] || "" }))
      setFormData((prev) => ({ ...prev, address: informations[5] || "" }))
    } catch (error) {
      toast.error("Có lỗi khi render thông tin, vui lòng thử lại!");
    }
    
    
  }, [scanResult])

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    }, false); // set verbose false

    scanner.render(onScanSuccess, onScanFailure);
    setScannerInstance(scanner);

    function onScanSuccess(result: string) {
      setScanResult(result);
      scanner.clear(); // chỉ dừng nếu muốn dừng sau 1 lần
    }

    function onScanFailure(error: any) {
      console.warn(error);
    }

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);



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
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
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

    const birthYear = new Date(formData.date_of_birth).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    if (age < 18 || age > 60) {
      toast.error("Bạn phải từ 18 đến 60 tuổi để đăng ký hiến máu.");
      setIsLoading(false)
      return; // stop submission
    }
    

    try {
      // Call API

      const isCCCDDuplicate = await checkDuplicateCCCD(formData.cccd);
      if (isCCCDDuplicate.exists) {
        toast.error("CCCD đã được sử dụng trên email " + isCCCDDuplicate.email);
        setIsLoading(false);
        return;
      }


      const checkingEmail = await api.get("users/get-all-emails");

      const emailToCheck = formData.email.toLowerCase();
      const emailList = checkingEmail.data?.emails.map((e: string) => e.toLowerCase());

      if (emailList.includes(emailToCheck)) {
        toast.error("Email đã tồn tại.");
        return;
      }



      const response = await api.post("/users/register", {
        full_name: formData.name,
        email: formData.email,
        password: formData.password, // raw password (to be hashed)
        role: "user",
        phone: formData.phone,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
      })

      const result = await response.data;



      if (result.message) {
        // Redirect to login page with success message
        try {
          await api.post("/users/user-profile", {
            user_id: result.user.id,
            cccd: formData.cccd,
          })
        } catch (err: any) {
          if (err.response?.status === 409) {
            toast.error("Mã số CCCD đã tồn tại.")
            return
          } else {
            toast.error("Đã xảy ra lỗi khi tạo hồ sơ người dùng.")
            return
          }
        }

        await api.post("/otp/send", {
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
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0901234567"
                        value={formData.phone || ""}
                        onChange={(e) => {
                          const input = e.target.value;
                          // Chỉ cho phép ký tự số
                          if (/^\d*$/.test(input)) {
                            // Giới hạn 10 số và bắt đầu bằng 0 (nếu có ký tự nào)
                            if (input.length <= 10 && (input === "" || input.startsWith("0"))) {
                              setFormData((prev) => ({ ...prev, phone: input }));
                            }
                          }
                        }}
                        minLength={10}
                        maxLength={10}
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
                        value={formData.password || ""}
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
                        value={formData.confirmPassword || ""}
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

                <div className="space-y-2">
                    <Label htmlFor="dob">Vui lòng quét mã QR trên CCCD để đăng ký *</Label>
                    <div className="relative">
                      {scanResult ? (
                        <div className="flex flex-col gap-2">
                          <div className="text-green-600">✅ Đã quét CCCD thành công!</div>
                        </div>
                      ) : (
                        <div id="reader" className="mx-auto" />
                      )}

                    
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        placeholder="Nguyễn Văn A"
                        value={formData.name || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className="pl-10"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* <ReCAPTCHA
                      sitekey="6Le19mkrAAAAAKWFaDg-rfWGbuBAGxpt5m5yoXDd"
                      onChange={(val: boolean | ((prevState: boolean) => boolean)) => setCapVal(val)}
                    /> */}
                    <Label htmlFor="gender">Số CCCD *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="cccd"
                        placeholder="080*********"
                        value={formData.cccd || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, cccd: e.target.value }))}
                        className="pl-10"
                        disabled
                      />
                    </div>
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
                        value={formData.date_of_birth || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                        className="pl-10"
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 60)).toISOString().split('T')[0]}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* <ReCAPTCHA
                      sitekey="6Le19mkrAAAAAKWFaDg-rfWGbuBAGxpt5m5yoXDd"
                      onChange={(val: boolean | ((prevState: boolean) => boolean)) => setCapVal(val)}
                    /> */}
                    <Label htmlFor="gender">Giới tính *</Label>
                    <Select
                      value={formData.gender || ""}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                      disabled
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

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      placeholder="123 Đường ABC, Quận 1, TP.HCM"
                      value={formData.address || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                      className="pl-10"
                      disabled
                    />
                  </div>
                </div>

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
      }} />
      <Footer />
    </div>
  )
}
