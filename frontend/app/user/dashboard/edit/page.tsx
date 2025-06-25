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
import api from "../../../../lib/axios";
import ReCAPTCHA from "react-google-recaptcha"
import { useAuth } from "@/contexts/auth-context"
import toast from "react-hot-toast"
import UploadCertificate from "@/components/ui/UploadCertificate"
import AddressAutocomplete from "@/components/ui/AddressAutocomplete"


export default function RegisterPage() {
  const { user, setUser, logout } = useAuth()
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const [formData, setFormData] = useState({
    name: user?.full_name,
    email: user?.email,
    password: "",
    confirmPassword: "",
    phone: user?.phone,
    address: user?.address,
    bloodType: "",
    gender: user?.gender,
    date_of_birth: user?.date_of_birth ? formatDate(user.date_of_birth) : "",
    role: user?.role,
    certificateDonor: "",
    certificateRecipient: "",
    hospital_name: "",
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
  const [capVal, setCapVal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]

  useEffect(() => {
    async function fetchProfile() {
      console.log(user._id);

      // ✅ Donor profile
      try {
        const response1 = await api.get(`/users/donor-profile/active/${user._id}`);
        const profile1 = response1.data.profile;
        setDonor(profile1);

        setFormData((prev) => ({
          ...prev,
          bloodType: profile1.blood_type || "",
          availability_date: profile1.availability_date ? formatDate(profile1.availability_date) : "",
          certificateDonor: profile1.health_cert_url || "",
          name: user.full_name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          gender: user.gender as "male" | "female" | "other" | undefined,
          date_of_birth: user.date_of_birth ? formatDate(user.date_of_birth) : "",
          role: user.role || "",
        }));
      } catch (error) {
        console.warn("Không tìm thấy donor profile:", error);
      }

      // ✅ Recipient profile
      try {
        const response2 = await api.get(`/users/recipient-profile/active/${user._id}`);
        const profile2 = response2.data.profile;
        setRecipient(profile2);

        setFormData((prev) => ({
          ...prev,
          hospital_name: profile2.hospital_name || "",
          certificateRecipient: profile2.medical_doc_url || "",
          name: user.full_name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          gender: user.gender as "male" | "female" | "other" | undefined,
          date_of_birth: user.date_of_birth ? formatDate(user.date_of_birth) : "",
          role: user.role || "",
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

    if (!formData.agreeTerms) {
      setError("Vui lòng đồng ý với điều khoản sử dụng");
      setIsLoading(false);
      return;
    }

    try {
      // Update user base info
      const response = await api.put(`/users/edit/${user._id}`, {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
      });

      const result = response.data;

      if (result.message) {
        // Update donor/recipient profile
        if (formData.role === "donor") {
          await api.put(`/users/${user._id}/role`, {
            newRole: "donor"
          })
          await api.post(`/users/donor-profile`, {
            user_id: user._id,
            blood_type: formData.bloodType,
            availability_date: formData.availability_date,
            health_cert_url: formData.certificateDonor,
          });
        } else if (formData.role === "recipient") {
          await api.put(`/users/${user._id}/role`, {
            newRole: "recipient"
          })
          await api.post(`/users/recipient-profile`, {
            user_id: user._id,
            medical_doc_url: formData.certificateRecipient,
            hospital_name: formData.hospital_name,
          });
        }

        setUser({
          ...user!,
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          date_of_birth: formData.date_of_birth,
          address: formData.address,
          role: formData.role
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
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl">
          <Card className="w-full shadow-lg">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">Chỉnh sửa thông tin</CardTitle>
              <CardDescription>Vui lòng điền thông tin</CardDescription>
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
                        disabled
                      />
                    </div>
                  </div>

                  {((formData.role === "donor") || (formData.role === "recipient")) && (
                    <>
                    {(formData.role === "donor") && (
                    <div className="space-y-2">
                      <Label htmlFor="dbd">Ngày bắt đầu hiến máu *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="dbd"
                          type="date"
                          value={formData.availability_date}
                          onChange={(e) => setFormData((prev) => ({ ...prev, availability_date: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    )}
                    {(formData.role === "recipient") && (
                    <div className="space-y-2">
                      <Label htmlFor="hospital_name">Tên bệnh viện *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="hospital_name"
                          placeholder="ex: Bệnh viện Hùng Vương"
                          value={formData.hospital_name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, hospital_name: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    )}
                  </>
                )}
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
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {((formData.role === "donor") || (formData.role === "recipient")) && (

                  
                  <>
                    {(formData.role === "donor") && (
                      <div className="space-y-2">
                        <Label htmlFor="certificateDonor">Ảnh giấy chứng nhận sức khỏe *</Label>
                        <UploadCertificate
                          id="certificateDonor"
                          value={formData.certificateDonor}
                          onChange={(url) => setFormData((prev) => ({ ...prev, certificateDonor: url }))}
                        />
                      </div>
                    )}

                    {(formData.role === "recipient") && (
                      <div className="space-y-2">
                        <Label htmlFor="certificateRecipient">Ảnh giấy chứng nhận y tế *</Label>
                        <UploadCertificate
                          id="certificateRecipient"
                          value={formData.certificateRecipient}
                          onChange={(url) => setFormData((prev) => ({ ...prev, certificateRecipient: url }))}
                        />
                      </div>
                    )}

                  </>
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

                  
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Ngày sinh *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="dob"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                        className="pl-10"
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

                <div className="grid md:grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    
                  </div>

                  
                </div>


                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <AddressAutocomplete
                      value={formData.address}
                      onChange={(val) => setFormData((prev) => ({ ...prev, address: val }))}
                    />
                  </div>
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
                      Đang chỉnh sửa...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Chỉnh sửa thông tin
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

      <Footer />
    </div>
  )
}
