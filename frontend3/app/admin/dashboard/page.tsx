"use client"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Users,
  Droplets,
  AlertTriangle,
  Plus,
  Settings,
  UserCheck,
  UserX,
  Shield,
  Activity,
  TrendingUp,
  Eye,
  Edit,
  LogOut,
  Home,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import api from "../../../lib/axios";
import { useEffect, useRef, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast, { Toaster } from "react-hot-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminDashboard() {
  const { user, logout, setUser } = useAuth()
  const router = useRouter()
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [hospitalInput, setHospitalInput] = useState(""); // Giá trị hiện đang hiển thị trong input -> để hiển thị highlight
  const [searchTerm, setSearchTerm] = useState("");  // Giá trị thực người gõ -> để filter
  const [hospitalId, setHospitalId] = useState("");
  const [nearbyHospitals, setNearbyHospitals] = useState<{ _id: string; name: string, address: string, phone: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [bloodInven, setBloodInven] = useState([]);
  const [bloodInventoryQuantity, setBloodInventoryQuantity] = useState(0);
  const [bloodInventoryExpiringQuantity, setBloodInventoryExpiringQuantity] = useState(0);
  const [selectedRole, setSelectedRole] = useState("staff")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [pendingUsers, setPendingUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    // Lấy vị trí người dùng

    async function use() {
      try {
        const allUsers = await api.get(`/users/admin/get-all/${user?._id}`);
        setPendingUsers(allUsers.data.users);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bệnh viện:", error);
      }
    }
    use();
  }
    , [user]);

  type UserType = {
    _id: string;
    full_name: string;
    email: string;
    phone?: string;
    gender?: string;
    date_of_birth?: string;
    address?: string;
    role: string;
    is_active: boolean;
    is_verified: boolean;
    createdAt: string;
  };

  const handleVerifyUser = async (user_Id: any) => {
    try {
      const res = await api.put(`/users/verify/${user_Id}`); // nên lấy response nếu có
      const updatedUser = res.data; // ví dụ nếu response là { userId, is_verified }

      // ✅ Cập nhật trường is_verified trong danh sách
      setPendingUsers((prev) =>
        prev.map((user) =>
          user._id === user_Id
            ? { ...user, is_verified: updatedUser.is_verified }
            : user
        )
      );

      toast.success("Duyệt thành công");
    } catch (error) {
      toast.error("Không thể duyệt user");
      console.error(error);
    }
  };


  const handleEditUser = async (user_Id: any) => {
    console.log(selectedUser);
    try {
      const response = await api.put(`/users/edit/${selectedUser?._id}`, {
        full_name: selectedUser?.full_name,
        email: selectedUser?.email,
        phone: selectedUser?.phone,
        gender: selectedUser?.gender,
        date_of_birth: selectedUser?.date_of_birth,
        address: selectedUser?.address,
      });

      const updatedUser = response.data.user; // đảm bảo API trả về user đã cập nhật

      // ✅ Cập nhật trong danh sách pendingUsers
      setPendingUsers((prev) =>
        prev.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );

      setUser({
        ...user!,
        full_name: selectedUser?.full_name,
      });

      toast.success("Chỉnh sửa thông tin tài khoản thành công");
    } catch (error) {
      toast.error("Không thể chỉnh sửa user");
      console.error(error);
    }
  };


  const handleDeleteUser = async (user_Id: any) => {
    try {
      await api.delete(`/users/admin/users/delete/${user?._id}/${user_Id}`)
      setPendingUsers(prev => prev.filter(user => user._id !== user_Id));
      toast.success("Xóa tài khoản thành công")
    } catch (error) {
      toast.error("Không thể xóa user");
      console.error(error);
    }
  }



  const handleCreateUser = async () => {
    try {
      if (selectedRole === "staff") {
        const response = await api.post("/users/register", {
          full_name: name,
          email: email,
          password: password, // raw password (to be hashed)
          role: selectedRole,
          phone: "0",
          gender: "other",
          date_of_birth: "",
          address: "",
        })

        await api.put(`/users/verify/${response.data.user.id}`)

        await api.post("/users/staff-profiles", {
          user_id: response.data.user.id,
          department: "0",
          assigned_area: "0",
          shift_time: "0",
          hospital: hospitalId
        })

      } else if (selectedRole === "donor") {
        const response = await api.post("/users/register", {
          full_name: name,
          email: email,
          password: password, // raw password (to be hashed)
          role: selectedRole,
          phone: "0",
          gender: "other",
          date_of_birth: "",
          address: "",
        })

        await api.put(`/users/verify/${response.data.user.id}`)

        await api.post("/users/donor-profile", {
          user_id: response.data.user.id,
          blood_type: "unknown",
          availability_date: new Date().toISOString(),
          health_cert_url: "",
          cooldown_until: "",
          hospital: hospitalId
        })

      } else if (selectedRole === "recipient") {
        const response = await api.post("/users/register", {
          full_name: name,
          email: email,
          password: password, // raw password (to be hashed)
          role: selectedRole,
          phone: "0",
          gender: "other",
          date_of_birth: "",
          address: "",
        })

        await api.put(`/users/verify/${response.data.user.id}`)

        await api.post("/users/recipient-profile", {
          user_id: response.data.user.id,
          medical_doc_url: "unknown",
          hospital: hospitalId
        })

      }
      toast.success("Tạo tài khoản thành công!");
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setBloodType("");
    } catch (error) {
      toast.error("Lỗi khi tạo tài khoản.");
      console.error(error);
    }
  };


  let eight = 0;

  function getTotalQuantity(inventories: any[]) {
    return inventories.reduce((total, item) => total + item.quantity, 0);
  }

  function getTotalExpiringQuantity(inventories: any[]) {
    return inventories.reduce((total, item) => total + item.expiring_quantity, 0);
  }

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

        const bloo_quantity = await api.get("/blood-in/blood-inventory/getAll");
        setBloodInventoryQuantity(getTotalQuantity(bloo_quantity.data.inventories));
        setBloodInventoryExpiringQuantity(getTotalExpiringQuantity(bloo_quantity.data.inventories));


      } catch (error) {
        console.error("Lỗi khi lấy danh sách bệnh viện:", error);
      }
    }
    use();
  }
    , []);


  const handleSelect = async (hospital: { _id: string; name: any; address?: string; phone?: string }) => {
    setHospitalId(hospital._id);
    setHospitalInput(hospital.name);
    setSearchTerm(hospital.name);
    setShowSuggestions(false);
    setHighlightIndex(-1);
    try {
      const bloodInvent = await api.get(`/blood-in/blood-inventory/hospital/${hospital._id}`);
      setBloodInven(bloodInvent.data.inventories);
    } catch (error) {
      setBloodInven([]);
    }

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

  const handleLogout = () => {
    logout()
  }

  // Mock admin data
  const adminStats = {
    totalUsers: 2547,
    activeUsers: 1823,
    pendingApprovals: 45,
    totalDonations: 15420,
    emergencyRequests: 23,
    bloodUnitsAvailable: 1250,
    monthlyGrowth: 12.5,
    systemHealth: 98.2,
  }

  const bloodInventory = [
    { type: "O-", units: 45, status: "low", target: 100, color: "bg-red-500" },
    { type: "O+", units: 120, status: "good", target: 150, color: "bg-red-400" },
    { type: "A-", units: 78, status: "medium", target: 100, color: "bg-blue-500" },
    { type: "A+", units: 156, status: "good", target: 150, color: "bg-blue-400" },
    { type: "B-", units: 34, status: "critical", target: 80, color: "bg-green-500" },
    { type: "B+", units: 89, status: "medium", target: 120, color: "bg-green-400" },
    { type: "AB-", units: 23, status: "critical", target: 60, color: "bg-purple-500" },
    { type: "AB+", units: 67, status: "medium", target: 80, color: "bg-purple-400" },
  ]



  const recentActivities = [
    {
      id: 1,
      type: "donation",
      message: "Nguyễn Văn A đã hoàn thành hiến máu",
      time: "10 phút trước",
      icon: Heart,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "emergency",
      message: "Yêu cầu khẩn cấp từ BV Chợ Rẫy - O- 2 đơn vị",
      time: "25 phút trước",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      id: 3,
      type: "registration",
      message: "3 người dùng mới đăng ký hiến máu",
      time: "1 giờ trước",
      icon: UserCheck,
      color: "text-blue-600",
    },
    {
      id: 4,
      type: "system",
      message: "Cập nhật hệ thống thành công",
      time: "2 giờ trước",
      icon: Settings,
      color: "text-gray-600",
    },
  ]

  const getStatusColor = (quantity: number) => {
    if (quantity < 30) {
      return "bg-red-100 text-red-800 border-red-200"
    } else if (quantity < 100) {
      return "bg-orange-100 text-orange-800 border-orange-200"
    } else if (quantity < 150) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    } else {
      return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const handleNavigateToInventory = () => {
    router.push(`/admin/blood-inventory?hospitalId=${hospitalId}`)
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Admin Header */}
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src="/images/logo.webp"
                      alt="ScαrletBlood Logo"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">ScαrletBlood Admin</h1>
                    <p className="text-sm text-gray-600">Bảng điều khiển quản trị</p>
                  </div>
                </Link>
                <Badge className="bg-red-100 text-red-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Quản trị viên
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Xin chào, <strong>{user?.full_name}</strong>
                </span>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Về trang chủ
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 flex-grow">
          {/* Admin Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />+{adminStats.monthlyGrowth}%
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã hết hạn</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{bloodInventoryExpiringQuantity}</div>
                <p className="text-xs text-muted-foreground">Cần xem xét</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kho máu</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bloodInventoryQuantity}</div>
                <p className="text-xs text-muted-foreground">Đơn vị có sẵn</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Khẩn cấp</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{adminStats.emergencyRequests}</div>
                <p className="text-xs text-muted-foreground">Đang xử lý</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="users">Người dùng</TabsTrigger>
              <TabsTrigger value="inventory">Kho máu</TabsTrigger>
              <TabsTrigger value="requests">Yêu cầu</TabsTrigger>
              <TabsTrigger value="create-users">Tạo tài khoản</TabsTrigger>
              <TabsTrigger value="settings">Cài đặt</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* System Health */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-green-600" />
                      Tình trạng hệ thống
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Hiệu suất hệ thống</span>
                          <span className="text-sm font-medium">{adminStats.systemHealth}%</span>
                        </div>
                        <Progress value={adminStats.systemHealth} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Người dùng hoạt động</span>
                          <span className="text-sm font-medium">
                            {((adminStats.activeUsers / adminStats.totalUsers) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={(adminStats.activeUsers / adminStats.totalUsers) * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hoạt động gần đây</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                            <activity.icon className={`w-4 h-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Tất cả người dùng</span>
                    <Badge variant="outline">{pendingUsers.length} người dùng</Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {pendingUsers.map((user) => (
                      <div
                        key={user._id}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-xl shadow-sm bg-white"
                      >
                        {/* Left: User info */}
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-base">{user.full_name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Badge variant="outline" className="capitalize">
                                {user.role}
                              </Badge>
                              <span>
                                Ngày tạo:{" "}
                                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                              <p>SĐT: {user.phone || "Không có"}</p>
                              <p>Giới tính: {user.gender || "Không rõ"}</p>
                              <p>
                                Ngày sinh:{" "}
                                {user.date_of_birth
                                  ? new Date(user.date_of_birth).toLocaleDateString("vi-VN")
                                  : "Không rõ"}
                              </p>
                              <p>Địa chỉ: {user.address || "Không có"}</p>
                              <p>
                                Trạng thái:{" "}
                                <span className={user.is_active ? "text-green-600" : "text-red-500"}>
                                  {user.is_active ? "Đang hoạt động" : "Bị khóa"}
                                </span>
                              </p>
                              <p>
                                Xác minh:{" "}
                                <span className={user.is_verified ? "text-green-600" : "text-yellow-600"}>
                                  {user.is_verified ? "Đã xác minh" : "Chưa xác minh"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex md:justify-end items-center md:items-start gap-2 mt-4 md:mt-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenEditDialog(true);
                            }}
                          >
                            <Pencil className="w-4 h-4 mr-1" />
                            Chỉnh sửa
                          </Button>

                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={user.is_verified}
                            onClick={() => {
                              handleVerifyUser(user._id);
                            }}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Duyệt
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => {
                            handleDeleteUser(user._id);
                          }}>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Xóa
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                    <DialogDescription>
                      Cập nhật thông tin người dùng bên dưới.
                    </DialogDescription>
                  </DialogHeader>

                  {selectedUser && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        // Gửi dữ liệu chỉnh sửa lên server tại đây...
                        setOpenEditDialog(false);
                      }}
                      className="space-y-4"
                    >
                      <div className="grid gap-2">
                        <Label>Họ tên</Label>
                        <Input
                          value={selectedUser.full_name}
                          onChange={(e) =>
                            setSelectedUser((prev) =>
                              prev ? { ...prev, full_name: e.target.value } : prev
                            )
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={selectedUser.email}
                          onChange={(e) =>
                            setSelectedUser((prev) =>
                              prev ? { ...prev, email: e.target.value } : prev
                            )
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>SĐT</Label>
                        <Input
                          value={selectedUser.phone || ""}
                          onChange={(e) =>
                            setSelectedUser((prev) =>
                              prev ? { ...prev, phone: e.target.value } : prev
                            )
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Địa chỉ</Label>
                        <Input
                          value={selectedUser.address || ""}
                          onChange={(e) =>
                            setSelectedUser((prev) =>
                              prev ? { ...prev, address: e.target.value } : prev
                            )
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Giới tính</Label>
                        <Select
                          value={selectedUser.gender || "other"}
                          onValueChange={(value) =>
                            setSelectedUser((prev) =>
                              prev ? { ...prev, gender: value } : prev
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Nam</SelectItem>
                            <SelectItem value="female">Nữ</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label>Ngày sinh</Label>
                        <Input
                          type="date"
                          value={
                            selectedUser.date_of_birth
                              ? new Date(selectedUser.date_of_birth).toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setSelectedUser((prev) =>
                              prev
                                ? { ...prev, date_of_birth: new Date(e.target.value).toISOString() }
                                : prev
                            )
                          }
                        />
                      </div>

                      <DialogFooter>
                        <Button type="submit" onClick={handleEditUser}>Lưu thay đổi</Button>
                      </DialogFooter>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>


            <TabsContent value="inventory" className="space-y-6">
              {/* Blood Inventory Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Lựa chọn Bệnh Viện</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
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
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <UserCheck className="w-4 h-4 mr-1" />
                      Duyệt
                    </Button>
                    <Button size="sm" variant="destructive">
                      <UserX className="w-4 h-4 mr-1" />
                      Từ chối
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {bloodInven.map((blood) => (
                  <Card key={blood.blood_type}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 ${bloodInventory[eight++].color || "bg-red-500"} rounded-full flex items-center justify-center`}>
                          <span className="text-xl font-bold text-white">{blood.blood_type}</span>
                        </div>
                        <Badge className={getStatusColor(blood.quantity)}>
                          {blood.quantity < 30
                            ? "Rất thấp"
                            : blood.quantity < 100
                              ? "Thấp"
                              : blood.quantity < 150
                                ? "Trung bình" :
                                "Tốt"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-2xl font-bold">{blood.quantity}</span>
                          <span className="text-sm text-gray-500">/ 500</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500"></span>
                          <span className="text-2xl font-bold text-orange-600">Đã hết hạn: {blood.expiring_quantity}</span>
                        </div>
                        <Progress value={Math.min((blood.quantity / 500) * 100, 100)} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Hiện có</span>
                          <span>Mục tiêu</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1" onClick={handleNavigateToInventory}>
                          <Edit className="w-3 h-3 mr-1" />
                          Sửa
                        </Button>
                        <Button size="sm" className="flex-1" onClick={handleNavigateToInventory}>
                          <Plus className="w-3 h-3 mr-1" />
                          Thêm
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quản lý yêu cầu máu</CardTitle>
                  <CardDescription>Tất cả yêu cầu máu trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                    <p>Chức năng quản lý yêu cầu đang được phát triển</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create-users" className="space-y-6">
              {/* Form tạo tài khoản */}
              <Card>
                <CardHeader>
                  <CardTitle>Tạo tài khoản mới</CardTitle>
                  <CardDescription>Chọn loại người dùng và điền thông tin bên dưới</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      onValueChange={(value) => setSelectedRole(value)}
                      defaultValue="staff"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại tài khoản" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">Nhân viên</SelectItem>
                        <SelectItem value="donor">Người hiến máu</SelectItem>
                        <SelectItem value="recipient">Người nhận máu</SelectItem>
                      </SelectContent>
                    </Select>



                    <Input placeholder="Họ tên" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input placeholder="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    {(<div className="relative" ref={containerRef}>
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
                    </div>)}

                  </div>

                  <Button onClick={handleCreateUser}>Tạo tài khoản</Button>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Cài đặt hệ thống
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Cài đặt chung</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Tự động duyệt người dùng</p>
                            <p className="text-sm text-gray-600">Tự động duyệt đăng ký người hiến máu mới</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Bật
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Thông báo khẩn cấp</p>
                            <p className="text-sm text-gray-600">Gửi thông báo khi có yêu cầu khẩn cấp</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Cấu hình
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Sao lưu dữ liệu</p>
                            <p className="text-sm text-gray-600">Tự động sao lưu dữ liệu hàng ngày</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Cài đặt
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Toaster position="top-center" containerStyle={{
          top: 80,
        }} />
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
