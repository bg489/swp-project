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
  const [bloodInven, setBloodInven] = useState<{ blood_type: string; quantity: number; expiring_quantity: number }[]>([]);
  const [bloodInventoryQuantity, setBloodInventoryQuantity] = useState(0);
  const [bloodInventoryExpiringQuantity, setBloodInventoryExpiringQuantity] = useState(0);
  const [selectedRole, setSelectedRole] = useState("staff")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [pendingUsers, setPendingUsers] = useState<UserType[]>([])
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'delete' | 'verify' | null>(null);
  const [userToAction, setUserToAction] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityType[]>([]);

  useEffect(() => {
    // Lấy vị trí người dùng

    async function use() {
      try {
        // Check if user exists and has valid _id before making API call
        if (!user || !user._id) {
          console.log("User not loaded yet or missing _id:", user);
          return;
        }

        const allUsers = await api.get(`/users/admin/get-all/${user._id}`);
        setPendingUsers(allUsers.data.users);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
    }
    
    // Only call the function if user is loaded
    if (user) {
      use();
    }
  }, [user]); // Add user as dependency

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

  type ActivityType = {
    id: string;
    type: 'user_created' | 'user_verified' | 'user_deleted' | 'user_edited' | 'blood_updated' | 'system' | 'login' | 'logout';
    message: string;
    user_name?: string;
    user_role?: string;
    timestamp: string;
    icon: any;
    color: string;
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

      // Find user name for activity
      const user = pendingUsers.find(u => u._id === user_Id);
      if (user) {
        addActivity('user_verified', `${user.full_name} (${user.role}) đã được xác minh bởi quản trị viên`, user.full_name, user.role);
      }

      toast.success("Duyệt thành công");
    } catch (error) {
      toast.error("Không thể duyệt user");
      console.error(error);
    }
  };


  const handleEditUser = async (user_Id: any) => {
    console.log(selectedUser);
    try {
      const originalUser = pendingUsers.find(u => u._id === selectedUser?._id);
      
      const response = await api.put(`/users/edit/${selectedUser?._id}`, {
        full_name: selectedUser?.full_name,
        email: selectedUser?.email,
        phone: selectedUser?.phone,
        gender: selectedUser?.gender,
        date_of_birth: selectedUser?.date_of_birth,
        address: selectedUser?.address,
        role: selectedUser?.role,
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
        full_name: selectedUser?.full_name || user!.full_name,
      });

      // Add activity for user edit
      if (selectedUser) {
        const changes = [];
        if (originalUser?.full_name !== selectedUser.full_name) changes.push('tên');
        if (originalUser?.email !== selectedUser.email) changes.push('email');
        if (originalUser?.role !== selectedUser.role) changes.push('vai trò');
        if (originalUser?.phone !== selectedUser.phone) changes.push('số điện thoại');
        
        const changeText = changes.length > 0 ? ` (${changes.join(', ')})` : '';
        addActivity('user_edited', `Thông tin ${selectedUser.full_name} đã được cập nhật${changeText}`, selectedUser.full_name, selectedUser.role);
      }

      setOpenEditDialog(false);
      toast.success("Chỉnh sửa thông tin tài khoản thành công");
    } catch (error) {
      toast.error("Không thể chỉnh sửa user");
      console.error(error);
    }
  };


  const handleDeleteUser = async (user_Id: any) => {
    try {
      const userToDelete = pendingUsers.find(u => u._id === user_Id);
      
      await api.delete(`/users/admin/users/delete/${user?._id}/${user_Id}`)
      setPendingUsers(prev => prev.filter(user => user._id !== user_Id));
      
      // Add activity for user deletion
      if (userToDelete) {
        addActivity('user_deleted', `Tài khoản ${userToDelete.full_name} (${userToDelete.role}) đã bị xóa`, userToDelete.full_name, userToDelete.role);
      }
      
      toast.success("Xóa tài khoản thành công")
    } catch (error) {
      toast.error("Không thể xóa user");
      console.error(error);
    }
  }

  const handleConfirmAction = async () => {
    if (!userToAction || !confirmAction) return;

    if (confirmAction === 'delete') {
      await handleDeleteUser(userToAction);
    } else if (confirmAction === 'verify') {
      await handleVerifyUser(userToAction);
    }

    setOpenConfirmDialog(false);
    setConfirmAction(null);
    setUserToAction(null);
  }

  const openConfirmModal = (action: 'delete' | 'verify', userId: string) => {
    setConfirmAction(action);
    setUserToAction(userId);
    setOpenConfirmDialog(true);
  }



  const handleCreateUser = async () => {
    try {
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

      // Add activity for user creation
      addActivity('user_created', `Tài khoản ${selectedRole} mới "${name}" đã được tạo và xác minh`, name, selectedRole);

      // Refresh user list - only if user exists and has valid _id
      if (user && user._id) {
        const allUsers = await api.get(`/users/admin/get-all/${user._id}`);
        setPendingUsers(allUsers.data.users);
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
      
      // Add activity for hospital selection
      addActivity('blood_updated', `Đã chọn bệnh viện ${hospital.name} - ${bloodInvent.data.inventories.length} loại máu có sẵn`);
    } catch (error) {
      setBloodInven([]);
      addActivity('system', `Không thể tải thông tin kho máu cho ${hospital.name}`);
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

  const bloodTypeColors = [
    "bg-red-500", "bg-red-400", "bg-blue-500", "bg-blue-400", 
    "bg-green-500", "bg-green-400", "bg-purple-500", "bg-purple-400"
  ]

  // Function to add new activity
  const addActivity = (type: ActivityType['type'], message: string, user_name?: string, user_role?: string) => {
    const icons = {
      user_created: Users,
      user_verified: UserCheck,
      user_deleted: UserX,
      user_edited: Edit,
      blood_updated: Droplets,
      system: Settings,
      login: Shield,
      logout: LogOut
    };

    const colors = {
      user_created: "text-blue-600",
      user_verified: "text-green-600", 
      user_deleted: "text-red-600",
      user_edited: "text-orange-600",
      blood_updated: "text-red-500",
      system: "text-gray-600",
      login: "text-purple-600",
      logout: "text-yellow-600"
    };

    const newActivity: ActivityType = {
      id: Date.now().toString() + Math.random(),
      type,
      message,
      user_name,
      user_role,
      timestamp: new Date().toISOString(),
      icon: icons[type],
      color: colors[type]
    };

    setRecentActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 most recent
  };

  // Initialize activities from existing users
  useEffect(() => {
    if (pendingUsers.length > 0) {
      const initialActivities: ActivityType[] = [];

      // Add system startup activity
      initialActivities.push({
        id: 'system-start',
        type: 'system',
        message: 'Hệ thống khởi động thành công',
        timestamp: new Date().toISOString(),
        icon: Settings,
        color: "text-gray-600"
      });

      // Add admin login activity
      if (user?.full_name) {
        initialActivities.push({
          id: 'admin-login',
          type: 'login',
          message: `Quản trị viên ${user.full_name} đăng nhập hệ thống`,
          user_name: user.full_name,
          user_role: 'admin',
          timestamp: new Date().toISOString(),
          icon: Shield,
          color: "text-purple-600"
        });
      }

      // Add activities for recent users
      pendingUsers.slice(0, 5).forEach((user, index) => {
        if (user.is_verified) {
          initialActivities.push({
            id: `verify-${user._id}`,
            type: 'user_verified',
            message: `${user.full_name} (${user.role}) đã được xác minh`,
            user_name: user.full_name,
            user_role: user.role,
            timestamp: new Date(Date.now() - index * 3600000).toISOString(), // Stagger times
            icon: UserCheck,
            color: "text-green-600"
          });
        } else {
          initialActivities.push({
            id: `create-${user._id}`,
            type: 'user_created',
            message: `${user.full_name} đăng ký tài khoản ${user.role}`,
            user_name: user.full_name,
            user_role: user.role,
            timestamp: user.createdAt,
            icon: Users,
            color: "text-blue-600"
          });
        }
      });

      // Add blood inventory activity if available
      if (bloodInventoryQuantity > 0) {
        initialActivities.push({
          id: 'blood-update',
          type: 'blood_updated',
          message: `Cập nhật kho máu - Tổng ${bloodInventoryQuantity} ml, ${bloodInventoryExpiringQuantity} sắp hết hạn`,
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          icon: Droplets,
          color: "text-red-500"
        });
      }

      setRecentActivities(initialActivities.slice(0, 10));
    }
  }, [pendingUsers, bloodInventoryQuantity, bloodInventoryExpiringQuantity, user]);

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
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="users">Người dùng</TabsTrigger>
              <TabsTrigger value="inventory">Kho máu</TabsTrigger>
              <TabsTrigger value="create-users">Tạo tài khoản</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                        <p className="text-2xl font-bold text-gray-900">{pendingUsers.length}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Đã xác minh</p>
                        <p className="text-2xl font-bold text-gray-900">{pendingUsers.filter(user => user.is_verified).length}</p>
                      </div>
                      <UserCheck className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tổng kho máu</p>
                        <p className="text-2xl font-bold text-gray-900">{bloodInventoryQuantity.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">ml</p>
                      </div>
                      <Droplets className="w-8 h-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Sắp hết hạn</p>
                        <p className="text-2xl font-bold text-gray-900">{bloodInventoryExpiringQuantity.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">ml</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* System Health */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-green-600" />
                      Thống kê hệ thống
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Tổng người dùng</span>
                          <span className="text-sm font-semibold text-gray-900">{pendingUsers.length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min((pendingUsers.length / 5000) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Người dùng đã xác minh</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {pendingUsers.filter(user => user.is_verified).length} / {pendingUsers.length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${pendingUsers.length > 0 ? (pendingUsers.filter(user => user.is_verified).length / pendingUsers.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Tổng kho máu</span>
                          <span className="text-sm font-semibold text-red-600">{bloodInventoryQuantity.toLocaleString()} ml</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min((bloodInventoryQuantity / 400000) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Máu sắp hết hạn</span>
                          <span className="text-sm font-semibold text-orange-600">{bloodInventoryExpiringQuantity.toLocaleString()} ml</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-400 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${bloodInventoryQuantity > 0 ? (bloodInventoryExpiringQuantity / bloodInventoryQuantity) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* User Role Statistics */}
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Thống kê theo vai trò</h4>
                        {['donor', 'recipient', 'staff', 'admin'].map((role) => {
                          const count = pendingUsers.filter(user => user.role === role).length;
                          const percentage = pendingUsers.length > 0 ? (count / pendingUsers.length) * 100 : 0;
                          return (
                            <div key={role} className="mb-2">
                              <div className="flex justify-between mb-1">
                                <span className="text-xs text-gray-600 capitalize">
                                  {role === 'donor' ? 'Người hiến máu' : 
                                   role === 'recipient' ? 'Người nhận máu' :
                                   role === 'staff' ? 'Nhân viên' : 'Quản trị viên'}
                                </span>
                                <span className="text-xs font-medium text-gray-900">{count}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    role === 'donor' ? 'bg-red-400' :
                                    role === 'recipient' ? 'bg-blue-400' :
                                    role === 'staff' ? 'bg-green-400' : 'bg-purple-400'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Hoạt động gần đây</span>
                      <Badge variant="outline">{recentActivities.length} hoạt động</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {recentActivities.length > 0 ? (
                        recentActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <activity.icon className={`w-4 h-4 ${activity.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                              {activity.user_name && (
                                <p className="text-xs text-gray-600">
                                  Người dùng: {activity.user_name} 
                                  {activity.user_role && <span className="ml-1 text-gray-500">({activity.user_role})</span>}
                                </p>
                              )}
                              <p className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleString("vi-VN", {
                                  year: 'numeric',
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  activity.type === 'user_verified' ? 'border-green-200 text-green-700' :
                                  activity.type === 'user_created' ? 'border-blue-200 text-blue-700' :
                                  activity.type === 'user_deleted' ? 'border-red-200 text-red-700' :
                                  activity.type === 'user_edited' ? 'border-orange-200 text-orange-700' :
                                  activity.type === 'blood_updated' ? 'border-red-200 text-red-700' :
                                  activity.type === 'login' ? 'border-purple-200 text-purple-700' :
                                  'border-gray-200 text-gray-700'
                                }`}
                              >
                                {activity.type === 'user_verified' ? 'Xác minh' :
                                 activity.type === 'user_created' ? 'Tạo mới' :
                                 activity.type === 'user_deleted' ? 'Xóa' :
                                 activity.type === 'user_edited' ? 'Chỉnh sửa' :
                                 activity.type === 'blood_updated' ? 'Cập nhật máu' :
                                 activity.type === 'login' ? 'Đăng nhập' :
                                 activity.type === 'logout' ? 'Đăng xuất' :
                                 'Hệ thống'}
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm font-medium">Chưa có hoạt động nào</p>
                          <p className="text-xs mt-1">Các hoạt động sẽ hiển thị tại đây</p>
                        </div>
                      )}
                    </div>
                    
                    {recentActivities.length > 0 && (
                      <div className="mt-4 pt-3 border-t">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Hiển thị {Math.min(recentActivities.length, 10)} hoạt động gần nhất</span>
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                              Xác minh
                            </span>
                            <span className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                              Tạo mới
                            </span>
                            <span className="flex items-center">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                              Xóa/Cập nhật
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
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
                              openConfirmModal('verify', user._id);
                            }}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Duyệt
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => {
                            openConfirmModal('delete', user._id);
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

                      <div className="grid gap-2">
                        <Label>Vai trò</Label>
                        <Select
                          value={selectedUser.role}
                          onValueChange={(value) =>
                            setSelectedUser((prev) =>
                              prev ? { ...prev, role: value } : prev
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="staff">Nhân viên</SelectItem>
                            <SelectItem value="user">Người dùng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <DialogFooter>
                        <Button type="submit" onClick={handleEditUser}>Lưu thay đổi</Button>
                      </DialogFooter>
                    </form>
                  )}
                </DialogContent>
              </Dialog>

              {/* Confirm Dialog */}
              <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {confirmAction === 'delete' ? 'Xác nhận xóa người dùng' : 'Xác nhận duyệt người dùng'}
                    </DialogTitle>
                    <DialogDescription>
                      {confirmAction === 'delete' 
                        ? 'Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.'
                        : 'Bạn có chắc chắn muốn duyệt người dùng này?'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenConfirmDialog(false)}>
                      Hủy
                    </Button>
                    <Button 
                      variant={confirmAction === 'delete' ? 'destructive' : 'default'}
                      onClick={handleConfirmAction}
                    >
                      {confirmAction === 'delete' ? 'Xóa' : 'Duyệt'}
                    </Button>
                  </DialogFooter>
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
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {bloodInven.map((blood, index) => (
                  <Card key={blood.blood_type}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 ${bloodTypeColors[index % bloodTypeColors.length]} rounded-full flex items-center justify-center`}>
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
                          <span className="text-sm text-gray-500">/ 50000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500"></span>
                          <span className="text-2xl font-bold text-orange-600">sắp hết hạn: {blood.expiring_quantity}</span>
                        </div>
                        <Progress value={Math.min((blood.quantity / 50000) * 100, 100)} className="h-2" />
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
