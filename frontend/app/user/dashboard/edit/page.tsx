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



  

const handleChange = (e: { target: { value: React.SetStateAction<string> } }) => {
  setSearchTerm(e.target.value);    // update giá trị gõ thực tế
  setHospitalInput(e.target.value); // input hiển thị đồng bộ giá trị gõ
  setShowSuggestions(true);
  setHighlightIndex(-1);
};


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



// null: chưa check, true: cho phép, false: từ chối



  const checkLocationPermissionAndUpdateState = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt không hỗ trợ định vị!");
      setLocationAllowed(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationAllowed(true);
        toast.success("Đã cho phép định vị!");
      },
      (error) => {
        console.error("Từ chối định vị:", error);
        setLocationAllowed(false);
        toast.error("Bạn đã từ chối quyền định vị, tính năng tìm kiếm sẽ bị khoá.");
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
            toast.success(`Tìm thấy ${filtered.length} bệnh viện trong ${radiusKm} km!`);
          } else {
            toast.error(`Không tìm thấy bệnh viện nào trong ${radiusKm} km.`);
          }
        } catch (error) {
          console.error("Lỗi lấy danh sách bệnh viện:", error);
          toast.error("Đã xảy ra lỗi khi tìm bệnh viện!");
        }
      },
      (error) => {
        console.error("Người dùng từ chối chia sẻ vị trí:", error);
        toast.error("Bạn đã từ chối chia sẻ vị trí, không thể tìm kiếm bệnh viện gần bạn.");
      }
    );
  };


  const router = useRouter()

  const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]

  useEffect(() => {
    async function fetchProfile() {
      if (!user?._id || !formData.role) return; // đợi user sẵn sàng và role đã chọn

      try {
        if (formData.role === "donor") {
          const response = await api.get(`/users/donor-profile/active/${user._id}`);
          const profile = response.data.profile;
          setDonor(profile);

          if (profile?.hospital) {
            const hospitalRes = await api.get(`/hospital/${profile.hospital}`);
            const hospitalName = hospitalRes.data.hospital.name;
            setFormData((prev) => ({ ...prev, hospitalId: profile.hospital }));
            setHospitalInput(hospitalName);
            setSearchTerm(hospitalName);
            setShowSuggestions(false);
            setHighlightIndex(-1);
          }

          setFormData((prev) => ({
            ...prev,
            bloodType: profile.blood_type || "",
            availability_date: profile.availability_date ? formatDate(profile.availability_date) : "",
            certificateDonor: profile.health_cert_url || "",
          }));
        } else if (formData.role === "recipient") {
          const response = await api.get(`/users/recipient-profile/active/${user._id}`);
          const profile = response.data.profile;
          setRecipient(profile);

          if (profile?.hospital) {
            const hospitalRes = await api.get(`/hospital/${profile.hospital}`);
            const hospitalName = hospitalRes.data.hospital.name;
            setFormData((prev) => ({ ...prev, hospitalId: profile.hospital }));
            setHospitalInput(hospitalName);
            setSearchTerm(hospitalName);
            setShowSuggestions(false);
            setHighlightIndex(-1);
          }

          setFormData((prev) => ({
            ...prev,
            hospital_name: profile.hospital_name || "",
            certificateRecipient: profile.medical_doc_url || "",
          }));
        }
      } catch (error) {
        console.warn("Không tìm thấy profile:", error);
      }
    }

    fetchProfile();
  }, [formData.role]); // thay user?.role bằng formData.role


  useEffect(() => {
    async function fetchProfile() {
      if (!user?._id) return; // Only check for user._id since it's required

      console.log(user._id);

      // ✅ Donor profile
      try {
        const response1 = await api.get(`/users/donor-profile/active/${user._id}`);
        const profile1 = response1.data.profile;
        setDonor(profile1);

        const hospitalId = response1.data.profile?.hospital; // lưu ý: hospital_name phải là ID
        if (hospitalId && user?.role === "donor") {
          const hospitalRes = await api.get(`/hospital/${hospitalId}`);
          setFormData((prev) => ({ ...prev, hospitalId: profile1.hospital }));
          setHospitalInput(hospitalRes.data.hospital.name);
          setSearchTerm(hospitalRes.data.hospital.name);
          setShowSuggestions(false);
          setHighlightIndex(-1);
        }

        setFormData((prev) => ({
          ...prev,
          bloodType: profile1.blood_type || "",
          availability_date: profile1.availability_date ? formatDate(profile1.availability_date) : "",
          certificateDonor: profile1.health_cert_url || "",
          name: user?.full_name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          address: user?.address || "",
          gender: (user?.gender as "male" | "female" | "other") || "male",
          date_of_birth: user?.date_of_birth ? formatDate(user.date_of_birth) : "",
          role: (user?.role as "donor" | "recipient" | "staff" | "admin") || "donor",
        }));
      } catch (error) {
        console.warn("Không tìm thấy donor profile:", error);
      }

      // ✅ Recipient profile
      try {
        const response2 = await api.get(`/users/recipient-profile/active/${user._id}`);
        const profile2 = response2.data.profile;
        setRecipient(profile2);


        const hospitalId = response2.data.profile?.hospital; // lưu ý: hospital_name phải là ID
        if (hospitalId && user?.role === "recipient") {
          const hospitalRes = await api.get(`/hospital/${hospitalId}`);
          setFormData((prev) => ({ ...prev, hospitalId: profile2.hospital }));
          setHospitalInput(hospitalRes.data.hospital.name);
          setSearchTerm(hospitalRes.data.hospital.name);
          setShowSuggestions(false);
          setHighlightIndex(-1);
        }

        setFormData((prev) => ({
          ...prev,
          hospital_name: profile2.hospital_name || "",
          certificateRecipient: profile2.medical_doc_url || "",
          name: user?.full_name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          address: user?.address || "",
          gender: (user?.gender as "male" | "female" | "other") || "male",
          date_of_birth: user?.date_of_birth ? formatDate(user.date_of_birth) : "",
          role: (user?.role as "donor" | "recipient" | "staff" | "admin") || "recipient",
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
            hospital: formData.hospitalId
          });
        } else if (formData.role === "recipient") {
          await api.put(`/users/${user._id}/role`, {
            newRole: "recipient"
          })
          await api.post(`/users/recipient-profile`, {
            user_id: user._id,
            medical_doc_url: formData.certificateRecipient,
            hospital: formData.hospitalId,
          });
        }

        setUser({
          ...user!,
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender as "male" | "female" | "other",
          date_of_birth: formData.date_of_birth,
          address: formData.address,
          role: formData.role as "donor" | "recipient" | "staff" | "admin"
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
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
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

                {/* Section 4: Role and Hospital */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Vai trò và Bệnh viện</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-3 group">
                      <Label htmlFor="role" className="text-sm font-medium text-gray-700 flex items-center">
                        Vai trò <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: "donor" | "recipient") => setFormData((prev) => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 hover:border-gray-300">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm">
                          <SelectItem value="donor">
                            <div className="flex items-center">
                              <Droplets className="w-4 h-4 mr-2 text-red-500" />
                              Người hiến máu (Donor)
                            </div>
                          </SelectItem>
                          <SelectItem value="recipient">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2 text-blue-500" />
                              Người nhận máu (Recipient)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 relative group">
                      <Label htmlFor="hospital_name" className="text-sm font-medium text-gray-700 flex items-center">
                        Tên bệnh viện <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                        <Input
                          id="hospital_name"
                          placeholder="ex: Bệnh viện Hùng Vương"
                          value={hospitalInput}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 hover:border-gray-300"
                          required
                          disabled={locationAllowed === false}
                        />
                      </div>
                      {showSuggestions && filteredHospitals.length > 0 && (
                        <ul className="absolute z-20 bg-white/95 backdrop-blur-sm border border-gray-200 w-full max-h-60 overflow-y-auto shadow-xl rounded-lg mt-1 custom-scrollbar">
                          {filteredHospitals.map((h, idx) => (
                            <li
                              key={idx}
                              ref={highlightIndex === idx ? (el) => el?.scrollIntoView({ block: "nearest" }) : null}
                              className={`px-4 py-3 hover:bg-purple-50 cursor-pointer transition-all duration-200 border-l-4 ${
                                highlightIndex === idx 
                                  ? "bg-purple-100 border-purple-500 shadow-md transform translate-x-1" 
                                  : "border-transparent hover:border-purple-300"
                              }`}
                              onClick={() => handleSelect(h)}
                            >
                              <div className="flex items-start space-x-3">
                                <MapPin className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <strong className="text-gray-800 block truncate">{h.name}</strong>
                                  {h.address && (
                                    <div className="text-sm text-gray-500 mt-1 line-clamp-2">{h.address}</div>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
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

                    <div className="space-y-3">
                      <Label htmlFor="radiusKm" className="text-sm font-medium text-gray-700 flex items-center">
                        Khoảng cách tìm bệnh viện (km) <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="radiusKm"
                        type="number"
                        placeholder="VD: 30"
                        value={radiusKm}
                        onChange={(e) => setRadiusKm(Number(e.target.value))}
                        className="h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300 hover:border-gray-300"
                        required
                        disabled={locationAllowed === false}
                      />
                      <Button
                        type="button"
                        onClick={handleFindHospitalsNearby}
                        className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={locationAllowed === false}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Tìm bệnh viện gần bạn
                      </Button>
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