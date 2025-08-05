"use client"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Droplets,
  AlertTriangle,
  Users,
  LogOut,
  Home,
  ClipboardList,
  Package,
  Hospital,
  Clock,
  CheckCircle,
  Droplet,
  FileText,
  TestTube,
  User,
  X,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"
import api from "@/lib/axios"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation";

// Function to translate status from English to Vietnamese
function translateStatus(status: string) {
  const map: Record<string, string> = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    matched: "Đã ghép",
    in_progress: "Đang xử lý",
    completed: "Hoàn tất",
    cancelled: "Đã hủy",
    rejected: "Từ chối",
    scheduled: "Đã lên lịch",
    fulfilled: "Đã thực hiện",
  }

  return map[status] || status
}

// Function to translate blood components from English to Vietnamese
function translateComponent(component: string) {
  const map: Record<string, string> = {
    whole: "Máu toàn phần",
    plasma: "Huyết tương",
    rbc: "Hồng cầu",
    RBC: "Hồng cầu",
    platelet: "Tiểu cầu",
  }

  return map[component?.toLowerCase()] || map[component] || component
}

export default function StaffDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter();
  const [staff, setStaff] = useState<any>({});
  const [donorList, setDonorList] = useState<any>([]);
  const [bloodReqList, setBloodReqList] = useState<any>([]);
  const [donationList, setDonationList] = useState<any>([]);
  const [bloodInven, setBloodInven] = useState<any>([])
  const [selectedDonationStatus, setSelectedDonationStatus] = useState<{ [key: string]: string }>({});
  const [bloodManageFilter, setBloodManageFilter] = useState("donor");
  const [warehouseDonationsList2, setWarehouseDonationsList2] = useState<any>([]);
  const [selectedWarehouseStatus, setSelectedWarehouseStatus] = useState<{ [key: string]: string }>({});
  const [selectedDonorRequestStatus, setSelectedDonorRequestStatus] = useState<{ [key: string]: string }>({});
  const [mockDonorRequests, setMockDonorRequests] = useState<any>([]);
  const [donorDonationCounts, setDonorDonationCounts] = useState<{ [key: string]: number }>({});

  const handleStatusUpdate = async (newStatus: string, donationId: string) => {
    try {
      await api.put(`/staff/donations/${donationId}/update-status`, {
        status: newStatus,
      });

      setDonationList((prev: any) =>
        prev.map((donation: any) =>
          donation._id === donationId ? { ...donation, status: newStatus } : donation
        )
      );

      toast.success(`Đã thay đổi status thành ${newStatus}`)

      if (newStatus === "completed") {
        const donation = await api.get(`/staff/donations/id/${donationId}`);
        const donorId = donation.data.donation.donor_id._id;
        const donationDateStr = donation.data.donation.donation_date; // e.g. "2025-07-01T00:00:00.000Z"

        const donationDate = new Date(donationDateStr);

        // Tăng 7 ngày (7 * 24 * 60 * 60 * 1000 milliseconds)
        const cooldownUntilDate = new Date(donationDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Convert về ISO string nếu cần lưu vào DB hoặc gửi API
        const cooldownUntilStr = cooldownUntilDate.toISOString();

        await api.put(`/users/donor/update-cooldown`, {
          user_id: donorId,
          cooldown_until: cooldownUntilStr
        });

      }

      // Không cần xử lý thêm gì khi status là "completed"
      // Chỉ cập nhật trạng thái là đủ
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái. Vui lòng thử lại!");
      console.error(error);
    }
  };

  const handleWarehouseStatusUpdate = async (newStatus: string, donationId: string) => {
    try {
      await api.put(`/staff/donations-blood-inventory/${donationId}/update-status`, {
        status: newStatus,
      });

      setWarehouseDonationsList2((prev: any) =>
        prev.map((donation: any) => {
          if (donation._id !== donationId) return donation;

          const isCancelling = newStatus === "cancelled" && donation.status !== "cancelled";
          const isRestoring = donation.status === "cancelled" && (newStatus === "in_progress" || newStatus === "fulfilled");

          if (isRestoring && donation.inventory_item?.quantity && donation.inventory_item.quantity < donation.volume) {
            toast.error("Không đủ máu trong kho để phục hồi lại trạng thái!");
            return donation; // Return the original donation instead of undefined
          }

          let updatedQuantity = donation.inventory_item?.quantity || 0;

          if (isCancelling) {
            updatedQuantity += donation.volume;
          } else if (isRestoring) {
            updatedQuantity -= donation.volume;
          }

          return {
            ...donation,
            status: newStatus,
            inventory_item: {
              ...donation.inventory_item,
              quantity: updatedQuantity,
            },
          };
        })
      );

      toast.success(`Đã thay đổi status thành ${newStatus}`)

    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái. Vui lòng thử lại!");
      console.error(error);
    }
  };

  const handleDonorRequestStatusUpdate = async (newStatus: string, requestId: string, donorId: string) => {
    try {
      console.log("Updating donor request:", { newStatus, requestId });

      if (!user?._id) {
        toast.error("Không tìm thấy thông tin người dùng!");
        return;
      }

      if (!staff?.hospital?._id) {
        toast.error("Không tìm thấy thông tin bệnh viện!");
        return;
      }

      // Tìm request hiện tại để lấy thông tin
      const currentRequest = mockDonorRequests.find((req: any) => req._id === requestId);
      if (!currentRequest) {
        toast.error("Không tìm thấy thông tin yêu cầu hiến máu!");
        return;
      }

      const isCompleting = newStatus === "completed" && currentRequest.status !== "completed";
      const isCancelling = newStatus === "cancelled" && currentRequest.status === "completed";

      // Xử lý cập nhật kho máu TRƯỚC khi cập nhật status
      if (isCompleting || isCancelling) {
        const targetComponent = currentRequest.components_offered?.[0] || 'whole';

        console.log("🔍 Debug inventory operation:");
        console.log("Target blood_type:", currentRequest.blood_type_offered);
        console.log("Target component:", targetComponent);
        console.log("Request components_offered:", currentRequest.components_offered);
        console.log("Amount:", currentRequest.amount_offered);
        console.log("Operation:", isCompleting ? 'ADD' : 'SUBTRACT');

        try {
          if (isCompleting) {
            // Khi hoàn tất: tìm inventory để cập nhật hoặc tạo mới
            if (newStatus === "completed") {

              // Tăng 7 ngày (7 * 24 * 60 * 60 * 1000 milliseconds)
              const cooldownUntilDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

              // Convert về ISO string nếu cần lưu vào DB hoặc gửi API
              const cooldownUntilStr = cooldownUntilDate.toISOString();

              await api.put(`/users/donor/update-cooldown`, {
                user_id: donorId,
                cooldown_until: cooldownUntilStr
              });

            }
            const { inventory: targetInventory, action } = findOrCreateInventory(
              currentRequest.blood_type_offered,
              targetComponent,
              currentRequest.amount_offered
            );

            if (action === 'update' && targetInventory) {
              // Cập nhật inventory có sẵn
              const newQuantity = targetInventory.quantity + currentRequest.amount_offered;

              await api.put(`/blood-in/blood-inventory/update/${targetInventory._id}`, {
                quantity: newQuantity
              });

              console.log(`✅ Updated inventory: ${targetInventory.blood_type} (${targetInventory.component}) from ${targetInventory.quantity}ml to ${newQuantity}ml`);
            } else if (action === 'create') {
              // Tạo mới inventory
              const newInventoryData = {
                hospital: staff.hospital._id,
                blood_type: currentRequest.blood_type_offered,
                component: targetComponent,
                quantity: currentRequest.amount_offered,
                expiring_quantity: 0,
                low_stock_alert: false
              };

              await api.post('/blood-in/blood-inventory/create', newInventoryData);
              console.log(`✅ Created new inventory: ${currentRequest.blood_type_offered} (${targetComponent}) with ${currentRequest.amount_offered}ml`);
            }
          } else if (isCancelling) {
            // Khi hủy: chỉ cập nhật inventory có sẵn
            const { inventory: targetInventory } = findOrCreateInventory(
              currentRequest.blood_type_offered,
              targetComponent,
              currentRequest.amount_offered
            );

            if (targetInventory) {
              const newQuantity = targetInventory.quantity - currentRequest.amount_offered;

              if (newQuantity < 0) {
                toast.error("Không thể hủy: không đủ máu trong kho để trừ!");
                return;
              }

              await api.put(`/blood-in/blood-inventory/update/${targetInventory._id}`, {
                quantity: newQuantity
              });

              console.log(`✅ Updated inventory for cancellation: ${targetInventory.blood_type} (${targetInventory.component}) from ${targetInventory.quantity}ml to ${newQuantity}ml`);
            } else {
              toast.error("Không tìm thấy kho máu để trừ khi hủy!");
              return;
            }
          }
        } catch (inventoryError: any) {
          console.error("Error handling inventory:", inventoryError);
          toast.error(`Lỗi xử lý kho máu: ${inventoryError.response?.data?.message || inventoryError.message}`);
          return;
        }
      }

      // Cập nhật status của donor request
      await api.put(`/users/donor-requests/staff/${requestId}/status`, {
        status: newStatus,
        staff_id: user._id,
      });

      // Refresh dữ liệu kho máu để đảm bảo đồng bộ
      if (isCompleting || isCancelling) {
        try {
          await refreshBloodInventoryData();

          toast.success(
            isCompleting
              ? `✅ Đã hoàn tất hiến máu và thêm ${currentRequest.amount_offered}ml máu ${currentRequest.blood_type_offered} (${translateComponent(currentRequest.components_offered?.[0])}) vào kho`
              : `❌ Đã hủy và trừ ${currentRequest.amount_offered}ml máu ${currentRequest.blood_type_offered} khỏi kho`
          );
        } catch (refreshError) {
          console.error("Error refreshing inventory:", refreshError);
          toast.error("Cập nhật thành công nhưng không thể làm mới dữ liệu kho. Vui lòng tải lại trang.");
        }
      }

      // Cập nhật state donor requests (sẽ được refresh lại trong refreshBloodInventoryData nếu cần)
      setMockDonorRequests((prev: any) =>
        prev.map((request: any) =>
          request._id === requestId ? { ...request, status: newStatus } : request
        )
      );

      if (!isCompleting && !isCancelling) {
        toast.success(`Đã thay đổi trạng thái thành ${translateStatus(newStatus)}`);
      }

    } catch (error: any) {
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái. Vui lòng thử lại!");
      console.error("Error updating donor request status:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
    }
  };

  const isActive = (availabilityDate: string) => {
    const now = new Date();
    const availDate = new Date(availabilityDate);
    return availDate <= now;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng tính từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleLogout = () => {
    logout()
  }

  // Function để refresh tất cả dữ liệu liên quan đến kho máu
  const refreshBloodInventoryData = async () => {
    try {
      if (!staff?.hospital?._id) return;

      // Refresh inventory data
      const bloodInvent = await api.get(`/blood-in/blood-inventory/hospital/${staff.hospital._id}`);
      setBloodInven(bloodInvent.data.inventories);

      // Refresh donor requests
      const mockDonor = await api.get(`/users/donor/staff/get-requests-by-hospital/${staff.hospital._id}`);
      setMockDonorRequests(mockDonor.data.requests);

      console.log("✅ Refreshed blood inventory and donor requests data");
    } catch (error) {
      console.error("❌ Failed to refresh blood inventory data:", error);
    }
  }

  // Helper function để tìm hoặc tạo inventory một cách thông minh
  const findOrCreateInventory = (bloodType: string, component: string, amount: number) => {
    // 1. Tìm exact match
    let targetInventory = bloodInven.find((inv: any) =>
      inv.blood_type === bloodType &&
      inv.component?.toLowerCase() === component?.toLowerCase()
    );

    if (targetInventory) {
      console.log("✅ Found exact match:", targetInventory);
      return { inventory: targetInventory, action: 'update' };
    }

    // 2. Tìm với component 'whole' làm fallback
    if (component !== 'whole') {
      targetInventory = bloodInven.find((inv: any) =>
        inv.blood_type === bloodType &&
        inv.component?.toLowerCase() === 'whole'
      );

      if (targetInventory) {
        console.log("✅ Found fallback with 'whole' component:", targetInventory);
        return { inventory: targetInventory, action: 'update' };
      }
    }

    // 3. Tìm bất kỳ inventory nào có cùng blood type
    targetInventory = bloodInven.find((inv: any) => inv.blood_type === bloodType);

    if (targetInventory) {
      console.log("✅ Found inventory with same blood type but different component:", targetInventory);
      return { inventory: targetInventory, action: 'update' };
    }

    // 4. Tạo mới nếu không tìm thấy gì
    console.log("❗ No existing inventory found, will create new");
    return { inventory: null, action: 'create' };
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!user?._id) return;

        const profileRes = await api.get(`/users/staff-profiles/active/${user._id}`);
        const staffData = profileRes.data.staffProfile;
        setStaff(staffData);

        // Chỉ fetch donor list sau khi staffData có hospital
        if (staffData?.hospital?._id) {
          console.log("🏥 Hospital ID:", staffData.hospital._id);
          console.log("🔗 API URL:", `/users/donor-profiles-by-hospital/${staffData.hospital._id}`);

          const profileDonList = await api.get(`/users/donor-profiles-by-hospital/${staffData.hospital._id}`);
          console.log("📊 Raw donor list response:", profileDonList.data);
          console.log("📊 Donor count:", profileDonList.data?.count);
          console.log("📊 Donors array:", profileDonList.data?.donors);
          console.log("📊 Donors array length:", profileDonList.data?.donors?.length);
          setDonorList(profileDonList.data);

          // Fetch donation counts for each donor
          const donationCounts: { [key: string]: number } = {};
          if (profileDonList.data?.donors) {
            console.log("🔄 Starting to fetch donation counts for", profileDonList.data.donors.length, "donors");
            await Promise.all(
              profileDonList.data.donors.map(async (donor: any) => {
                try {
                  if (!donor.user_id?._id) {
                    console.warn("⚠️ Donor missing user_id or _id:", donor);
                    return;
                  }

                  const donationsRes = await api.get(`/donations/donor/${donor.user_id._id}`);
                  const completedDonations = donationsRes.data.data?.filter((d: any) => d.status === "completed") || [];
                  donationCounts[donor.user_id._id] = completedDonations.length;
                  console.log(`💉 Donor ${donor.user_id?.full_name || "Không rõ tên"}: ${completedDonations.length} completed donations`);
                } catch (error) {
                  console.error(`❌ Failed to fetch donations for donor ${donor.user_id?._id}:`, error);
                  if (donor.user_id?._id) {
                    donationCounts[donor.user_id._id] = 0;
                  }
                }
              })
            );
          }
          console.log("📊 Final donation counts:", donationCounts);
          setDonorDonationCounts(donationCounts);

          const profileBRList = await api.get(`/staff/blood-requests/get-list/${staffData.hospital._id}`);
          setBloodReqList(profileBRList.data);

          const profileDList = await api.get(`/staff/donations/by-staff/${user._id}`);
          setDonationList(profileDList.data.data); // Lấy đúng mảng donations

          const bloodInvent = await api.get(`/blood-in/blood-inventory/hospital/${staffData.hospital._id}`);
          setBloodInven(bloodInvent.data.inventories);

          const wareHouseDonations = await api.get(`/staff/donations-warehouse/by-staff/${user._id}`);
          setWarehouseDonationsList2(wareHouseDonations.data.data);

          const mockDonor = await api.get(`/users/donor/staff/get-requests-by-hospital/${staffData.hospital._id}`);
          setMockDonorRequests(mockDonor.data.requests);

        }
      } catch (error) {
        console.error("Failed to fetch staff profile or hospital:", error);
      }
    }

    if (user?._id) {
      fetchProfile();
    }
  }, [user]);


  // Calculate real stats from API data
  const staffStats = {
    totalDonors: donorList?.count || 0,
    activeDonors: donorList?.donors?.filter((donor: any) => isActive(donor.availability_date)).length || 0,
    totalBloodUnits: bloodInven?.reduce((total: number, blood: any) => total + blood.quantity, 0) || 0,
    lowStockTypes: bloodInven?.filter((blood: any) => blood.quantity < 50).length || 0,
    pendingRequests: bloodReqList?.count || 0,
    completedToday: donationList?.filter((donation: any) => {
      const today = new Date().toDateString();
      const donationDate = new Date(donation.donation_date).toDateString();
      return donationDate === today && donation.status === "completed";
    }).length || 0,
    totalDonationsStat: Object.values(donorDonationCounts).reduce((total: number, count: number) => total + (count || 0), 0),
    // Thống kê hiến máu vào kho
    pendingDonorRequests: mockDonorRequests?.filter((req: any) => req.status === "in_progress").length || 0,
    completedDonorRequests: mockDonorRequests?.filter((req: any) => req.status === "completed").length || 0,
    totalVolumeFromDonorRequests: mockDonorRequests?.filter((req: any) => req.status === "completed")
      .reduce((total: number, req: any) => total + (req.amount_offered || 0), 0) || 0,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "completed":
      case "passed":
        return "bg-green-100 text-green-800"
      case "verified":
      case "donated":
        return "bg-green-500 text-white";
      case "unverified":
      case "failed":
      case "rejected":
      case "expired":
        return "bg-red-500 text-white";
      case "in_progress":
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  async function handleUnverifiedStatus(_id: any, arg1: string): Promise<void> {
    if (!window.confirm("Bạn có chắc chắn muốn hủy xác minh thông tin này?")) {
      return
    }

    try {
      await api.put(`/checkin/unverify/${_id}`)

      toast.success("Đã hủy xác minh thành công!")
    } catch (error: any) {
      console.error("Error cancelling request:", error)
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi hủy yêu cầu."
      toast.error(errorMessage)
    }
  }

  async function handleVerifiedStatus(_id: any, arg1: string): Promise<void> {
    if (!window.confirm("Xác nhận xác minh thông tin này?")) {
      return
    }

    try {
      const response = await api.put(`/checkin/checkins/${_id}/verify`)

      await api.post("/health-check/create", {
        checkin_id: response.data.checkIn._id,
        hospital_id: staff.hospital._id
      })

      toast.success("Đã xác minh thành công!")
    } catch (error: any) {
      console.error("Error cancelling request:", error)
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi hủy yêu cầu."
      toast.error(errorMessage)
    }
  }

  return (
    <ProtectedRoute requiredRole="staff">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Staff Header */}
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
                    <h1 className="text-xl font-bold text-gray-900">ScαrletBlood Staff</h1>
                    <p className="text-sm text-gray-600">Bảng điều khiển nhân viên</p>
                  </div>
                </Link>
                <Badge className="bg-blue-100 text-blue-800">
                  <ClipboardList className="w-3 h-3 mr-1" />
                  Nhân viên
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Xin chào, <strong>Staff</strong>
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
          {/* Staff Information Overview */}
          <div className="mb-8">
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Cơ sở làm việc</CardTitle>
                <CheckCircle className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600 mb-2">{staff?.hospital?.name || "Không có thông tin"}</div>
                    <p className="text-sm text-muted-foreground">{staff?.hospital?.address || "Không có thông tin"}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Badge className="bg-green-100 text-green-800 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Đang hoạt động
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blood Management Dashboard Card */}
          <Card className="mb-8 cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => router.push('/staff/dashboard/blood-management')}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Droplets className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">Hệ thống quản lý yêu cầu truyền máu</CardTitle>
                    <CardDescription className="text-gray-600">
                      Hệ thống quản lý tồn kho máu, yêu cầu, xét nghiệm và bệnh nhân
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center text-red-600">
                  <span className="text-sm font-medium mr-2">Truy cập</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-lg font-bold text-blue-600">{staffStats.totalBloodUnits}</div>
                  <div className="text-xs text-blue-600">Tồn kho máu</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-lg font-bold text-yellow-600">-</div>
                  <div className="text-xs text-yellow-600">Yêu cầu chờ xử lý</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <TestTube className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-lg font-bold text-green-600">-</div>
                  <div className="text-xs text-green-600">Xét nghiệm máu</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-lg font-bold text-purple-600">-</div>
                  <div className="text-xs text-purple-600">Bệnh nhân</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tính năng bao gồm:</span>
                  <span className="text-gray-500">kho máu • Yêu cầu • Xét nghiệm • Bệnh nhân</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donation Request Management Dashboard Card */}
          <Card className="mb-8 cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => router.push('/staff/dashboard/donation-requests')}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Heart className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">Hệ thống quản lý yêu cầu hiến máu</CardTitle>
                    <CardDescription className="text-gray-600">
                      Quản lý và xử lý các yêu cầu hiến máu từ người dùng
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center text-orange-600">
                  <span className="text-sm font-medium mr-2">Quản lý</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-lg font-bold text-yellow-600">-</div>
                  <div className="text-xs text-yellow-600">Chờ xử lý</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-lg font-bold text-green-600">-</div>
                  <div className="text-xs text-green-600">Đã chấp nhận</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <X className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="text-lg font-bold text-red-600">-</div>
                  <div className="text-xs text-red-600">Đã từ chối</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-lg font-bold text-blue-600">-</div>
                  <div className="text-xs text-blue-600">Tổng yêu cầu</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Chức năng:</span>
                  <span className="text-gray-500">Duyệt • Từ chối • Theo dõi • Thống kê</span>
                </div>
              </div>
            </CardContent>
          </Card>


        </div>
        <Toaster position="top-center" containerStyle={{
          top: 80,
        }} />
        <Footer />
      </div >
    </ProtectedRoute >
  )
}
