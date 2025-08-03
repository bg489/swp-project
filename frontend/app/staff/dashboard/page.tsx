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
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"
import api from "@/lib/axios"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

interface DonorDonationRequest {
  _id: string
  user_id: string
  hospital: {
    _id: string
    name: string
    address: string
  }
  donation_date: string // ISO string
  donation_type: "whole" | "separated"
  donation_time_range: {
    from: string
    to: string
  }
  separated_component?: "RBC" | "plasma" | "platelet"
  notes: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

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
  const [bloodRequestFilter, setBloodRequestFilter] = useState("newest");
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [donationRequests, setDonationRequests] = useState<DonorDonationRequest[]>([])
  const [checkIns, setCheckIns] = useState<any>([])
  

  



  const checkInsMock = [
  {
    _id: "688f99816269d09759193953",
    user_id: {
      _id: "688ef4f5eadc867beb1aa04e",
      full_name: "Nguyễn Văn A",
      email: "giabao123963@gmail.com",
      phone: "0352573142",
      gender: "male",
      date_of_birth: "2004-07-20T00:00:00.000Z",
    },
    userprofile_id: {
      _id: "688ef4f5eadc867beb1aa053",
      cccd: "111111111111",
    },
    hospital_id: {
      _id: "685e2769156fe3d352db3552",
      name: "Bệnh viện Quân Dân Y Miền Đông",
      address: "50 Lê Văn Việt, Hiệp Phú, TP. Thủ Đức, TP.HCM",
      phone: "028 3897 0321",
    },
    donorDonationRequest_id: {
      _id: "688f6dae5f82851d117eca19",
      donation_time_range: {
        from: "12:00",
        to: "14:00",
      },
      donation_date: "2025-08-03T00:00:00.000Z",
      donation_type: "whole",
      notes: "dfff",
      status: "approved",
    },
    status: "in_progress",
    comment: "",
    createdAt: "2025-08-03T17:16:49.712Z",
    updatedAt: "2025-08-03T17:16:49.712Z",
  },
  {
    _id: "688f7749267544a714d81664",
    user_id: {
      _id: "688ef4f5eadc867beb1aa04e",
      full_name: "Nguyễn Văn A",
      email: "giabao123963@gmail.com",
      phone: "0352573142",
      gender: "male",
      date_of_birth: "2004-07-20T00:00:00.000Z",
    },
    userprofile_id: {
      _id: "688ef4f5eadc867beb1aa053",
      cccd: "111111111111",
    },
    hospital_id: {
      _id: "685e2769156fe3d352db3552",
      name: "Bệnh viện Quân Dân Y Miền Đông",
      address: "50 Lê Văn Việt, Hiệp Phú, TP. Thủ Đức, TP.HCM",
      phone: "028 3897 0321",
    },
    donorDonationRequest_id: {
      _id: "688f6dae5f82851d117eca19",
      donation_time_range: {
        from: "12:00",
        to: "14:00",
      },
      donation_date: "2025-08-03T00:00:00.000Z",
      donation_type: "whole",
      notes: "dfff",
      status: "approved",
    },
    status: "in_progress",
    comment: "",
    createdAt: "2025-08-03T14:50:49.579Z",
    updatedAt: "2025-08-03T14:50:49.579Z",
  },
]




  const mockDonationRequests = [
    {
      _id: "req1",
      user_id: { _id: "user1", email: "nguyenvana@example.com" },
      hospital: {
        name: "Bệnh viện Trung ương",
        address: "123 Đường A, Quận 1, TP.HCM",
        phone: "0123456789",
      },
      donation_date: "2025-08-06T00:00:00.000Z",
      donation_time_range: {
        from: "10:00",
        to: "12:00",
      },
      donation_type: "whole",
      notes: "Sẵn sàng bất cứ lúc nào",
      status: "pending",
      createdAt: "2025-08-03T13:05:25.150Z",
    },
    {
      _id: "req2",
      user_id: { _id: "user2", email: "tranthib@example.com" },
      hospital: {
        name: "Bệnh viện Chợ Rẫy",
        address: "456 Đường B, Quận 5, TP.HCM",
        phone: "0987654321",
      },
      donation_date: "2025-08-03T00:00:00.000Z",
      donation_time_range: {
        from: "8:00",
        to: "10:00",
      },
      donation_type: "whole",
      notes: "",
      status: "approved",
      createdAt: "2025-08-03T13:05:11.717Z",
    },
    {
      _id: "req3",
      user_id: { _id: "user3", email: "lethilan@example.com" },
      hospital: {
        name: "Bệnh viện Nhân Dân 115",
        address: "789 Đường C, Quận 10, TP.HCM",
        phone: "0912345678",
      },
      donation_date: "2025-08-03T00:00:00.000Z",
      donation_time_range: {
        from: "12:00",
        to: "14:00",
      },
      donation_type: "separated",
      notes: "Ưu tiên buổi chiều",
      status: "rejected",
      createdAt: "2025-08-03T12:56:57.998Z",
    },
  ]

  const [requestFilter, setRequestFilter] = useState("newest");




  function StatusSummary({ summary }: { summary: { pending: number, approved: number, rejected: number } }) {
    return (
      <div className="flex gap-4 text-sm text-gray-700">
        <Badge className="bg-yellow-100 text-yellow-800">Đang chờ: {summary.pending}</Badge>
        <Badge className="bg-green-100 text-green-800">Đã duyệt: {summary.approved}</Badge>
        <Badge className="bg-red-100 text-red-800">Từ chối: {summary.rejected}</Badge>
      </div>
    )
  }

  function translateStatus(status: string): string {
    switch (status) {
      case "pending": return "Đang chờ duyệt";
      case "approved": return "Đã duyệt";
      case "rejected": return "Đã từ chối";
      case "verified": return "Đã xác minh";
      case "unverified": return "Chưa xác minh";
      case "in_progress": return "Đang xử lý";
      default: return "Không rõ";
    }
  }

  function translateDonationType(type: string): string {
    switch (type) {
      case "whole": return "Máu toàn phần";
      case "separated": return "Thành phần máu";
      default: return "Không rõ";
    }
  }

  useEffect(() => {
    async function fetchBloodRequests() {
      
      try {
        const response2 = await api.get(`/donation-requests/donor-donation-request/hospital/${staff?.hospital?._id}`)
        console.log("Fetched donor requests:", response2.data)
        setTotal(response2.data.total || 0)
        setPending(response2.data.status_summary.pending || 0)
        setApproved(response2.data.status_summary.approved || 0)
        setRejected(response2.data.status_summary.rejected || 0)
        setDonationRequests(response2.data.requests || [])
      } catch (error: any) {
        console.error("Error fetching donor requests:", error)
        console.error("Error details:", error.response?.data)
        
        // Show user-friendly error message
        if (error.response?.status === 404) {
          console.error("User not found or not a valid donor")
        } else if (error.response?.status === 500) {
          console.error("Server error occurred")
        }
        
        setBloodRequests([])
      } finally {
        setLoading(false)
      }
    }

    fetchBloodRequests()
  }, [staff])


  const warehouseDonationsList = [
    {
      _id: "6877457f831b2a12c790cd57",
      inventory_item: {
        _id: "6876423a8e865f4e6cbb83bc",
        blood_type: "A+",
        component: "RBC",
        quantity: 452,
        expiring_quantity: 12,
        low_stock_alert: false,
        last_updated: "2025-07-16T06:26:03.261Z",
        hospital: {
          _id: "685e2769156fe3d352db3552",
          name: "Bệnh viện Quân Dân Y Miền Đông",
          address: "50 Lê Văn Việt, Hiệp Phú, TP. Thủ Đức, TP.HCM"
        },
        createdAt: "2025-07-15T11:57:46.030Z",
        updatedAt: "2025-07-16T06:26:03.262Z",
        __v: 0
      },
      recipient_id: {
        _id: "6857d7dcd2429b1ef0e6af3c",
        full_name: "Chữ A",
        email: "a@a.a",
        phone: "0901234567"
      },
      donation_date: "2025-07-27T00:00:00.000Z",
      volume: 12,
      status: "in_progress",
      updated_by: {
        _id: "6857c0f098b0c3e8061bd59e",
        full_name: "Lê Văn C",
        email: "staff@example.com"
      },
      notes: "Gấp rút cho ca mổ tim",
      hospital: {
        _id: "685e2769156fe3d352db3552",
        name: "Bệnh viện Quân Dân Y Miền Đông",
        address: "50 Lê Văn Việt, Hiệp Phú, TP. Thủ Đức, TP.HCM"
      },
      createdAt: "2025-07-16T06:23:59.809Z",
      updatedAt: "2025-07-16T06:23:59.809Z",
      __v: 0
    },
    {
      _id: "6877457f831b2a12c790cd99",
      inventory_item: {
        _id: "6876423a8e865f4e6cbb8499",
        blood_type: "O-",
        component: "plasma",
        quantity: 88,
        expiring_quantity: 5,
        low_stock_alert: false,
        last_updated: "2025-07-15T11:26:03.261Z",
        hospital: {
          _id: "685e2769156fe3d352db3552",
          name: "Bệnh viện Quân Dân Y Miền Đông",
          address: "50 Lê Văn Việt, Hiệp Phú, TP. Thủ Đức, TP.HCM"
        },
        createdAt: "2025-07-12T09:11:46.030Z",
        updatedAt: "2025-07-15T11:26:03.262Z",
        __v: 0
      },
      recipient_id: null,
      donation_date: "2025-07-28T00:00:00.000Z",
      volume: 8,
      status: "fulfilled",
      updated_by: {
        _id: "6857c0f098b0c3e8061bd59e",
        full_name: "Lê Văn C",
        email: "staff@example.com"
      },
      notes: "Dự phòng nội bộ",
      hospital: {
        _id: "685e2769156fe3d352db3552",
        name: "Bệnh viện Quân Dân Y Miền Đông",
        address: "50 Lê Văn Việt, Hiệp Phú, TP. Thủ Đức, TP.HCM"
      },
      createdAt: "2025-07-15T08:00:00.000Z",
      updatedAt: "2025-07-15T08:00:00.000Z",
      __v: 0
    }
  ];


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

  // Function to sort blood requests based on filter
  const getSortedBloodRequests = (requests: any[]) => {
    if (!Array.isArray(requests)) return [];

    const sortedRequests = [...requests];

    switch (bloodRequestFilter) {
      case "newest":
        return sortedRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "oldest":
        return sortedRequests.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "emergency":
        return sortedRequests.sort((a, b) => {
          // Khẩn cấp lên đầu, sau đó sắp xếp theo thời gian mới nhất
          if (a.is_emergency && !b.is_emergency) return -1;
          if (!a.is_emergency && b.is_emergency) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      default:
        return sortedRequests;
    }
  };

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

          const checkInns = await api.get(`/checkin/hospital/${staffData.hospital._id}`);
          setCheckIns(checkInns.data.checkIns);

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
    totalDonationsStat: Object.values(donorDonationCounts).reduce((total: number, count: number) => total + count, 0),
    // Thống kê hiến máu vào kho
    pendingDonorRequests: mockDonorRequests?.filter((req: any) => req.status === "in_progress").length || 0,
    completedDonorRequests: mockDonorRequests?.filter((req: any) => req.status === "completed").length || 0,
    totalVolumeFromDonorRequests: mockDonorRequests?.filter((req: any) => req.status === "completed")
      .reduce((total: number, req: any) => total + (req.amount_offered || 0), 0) || 0,
  }

  // Mock blood inventory
  const bloodInventory = [
    { type: "O-", available: 45, reserved: 5, status: "low", target: 100, color: "bg-red-500", expiringSoon: 5 },
    { type: "O+", available: 120, reserved: 10, status: "good", target: 150, color: "bg-red-400", expiringSoon: 8 },
    { type: "A-", available: 78, reserved: 8, status: "good", target: 100, color: "bg-blue-500", expiringSoon: 3 },
    { type: "A+", available: 156, reserved: 15, status: "good", target: 150, color: "bg-blue-400", expiringSoon: 12 },
    { type: "B-", available: 34, reserved: 3, status: "critical", target: 80, color: "bg-green-500", expiringSoon: 2 },
    { type: "B+", available: 89, reserved: 9, status: "good", target: 120, color: "bg-green-400", expiringSoon: 7 },
    { type: "AB-", available: 23, reserved: 2, status: "critical", target: 60, color: "bg-purple-500", expiringSoon: 1 },
    { type: "AB+", available: 67, reserved: 7, status: "good", target: 80, color: "bg-purple-400", expiringSoon: 4 },
  ]

  // Mock blood requests
  const bloodRequests = [
    {
      id: "REQ001",
      patientName: "Nguyễn Văn C",
      hospital: "Bệnh viện Chợ Rẫy",
      bloodType: "O-",
      unitsNeeded: 2,
      urgency: "Khẩn cấp",
      contactPhone: "0901111111",
      doctorName: "BS. Trần Văn D",
      reason: "Phẫu thuật tim",
      status: "pending",
      requestTime: "08:00 - 24/12/2024",
      neededBy: "14:00 - 24/12/2024",
    },
    {
      id: "REQ002",
      patientName: "Lê Thị E",
      hospital: "Bệnh viện Bình Dan",
      bloodType: "A+",
      unitsNeeded: 1,
      urgency: "Cao",
      contactPhone: "0902222222",
      doctorName: "BS. Phạm Thị F",
      reason: "Tai nạn giao thông",
      status: "approved",
      requestTime: "09:30 - 24/12/2024",
      neededBy: "16:00 - 24/12/2024",
    },
    {
      id: "REQ003",
      name: "Hoàng Văn G",
      hospital: "Bệnh viện Từ Dũ",
      bloodType: "B+",
      unitsNeeded: 3,
      urgency: "Trung bình",
      contactPhone: "0903333333",
      doctorName: "BS. Nguyễn Văn H",
      reason: "Sinh con khó",
      status: "completed",
      requestTime: "15:00 - 23/12/2024",
      neededBy: "10:00 - 24/12/2024",
    },
  ]

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
        return "bg-green-100 text-green-800"
      case "verified":
        return "bg-green-500 text-white";
      case "unverified":
        return "bg-red-500 text-white";
      case "in_progress":
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getBloodStatusColor = (quantity: number) => {
    if (quantity < 30) {
      return "bg-red-100 text-red-800"
    } else if (quantity < 150) {
      return "bg-yellow-100 text-yellow-800"
    } else {
      return "bg-green-100 text-green-800"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Khẩn cấp":
        return "bg-red-100 text-red-800"
      case "Cao":
        return "bg-orange-100 text-orange-800"
      case "Trung bình":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  async function handleUpdateStatus(_id: any, arg1: string): Promise<void> {
    if (!window.confirm("Bạn có chắc chắn muốn chấp nhận yêu cầu hiến máu này?")) {
      return
    }

    try {
      const response = await api.put(`/donation-requests/donor-donation-request/approve/${_id}`)

      // Cập nhật state local
      setDonationRequests(prev => 
        prev.map(req => 
          req._id === _id 
            ? { ...req, status: "approved" }
            : req
        )
      )

      console.log(donationRequests)

      setApproved(prev => prev + 1)
      setPending(prev => prev - 1)

      const response2 = await api.get(`/users/user-profile/${response.data.request.user_id._id}`)

      await api.post(`/checkin`, {
        user_id: response.data.request.user_id._id,
        userprofile_id: response2.data.profile._id,
        hospital_id: response.data.request.hospital._id,
        donorDonationRequest_id: response.data.request._id
      })

      toast.success("Đã chấp nhận yêu cầu hiến máu thành công!")
    } catch (error: any) {
      console.error("Error cancelling request:", error)
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi hủy yêu cầu."
      toast.error(errorMessage)
    }
  }

  async function handleCancelStatus(_id: any, arg1: string): Promise<void> {
    if (!window.confirm("Bạn có chắc chắn muốn hủy yêu cầu hiến máu này?")) {
      return
    }

    try {
      await api.put(`/donation-requests/donor-donation-request/reject/${_id}`)

      // Cập nhật state local
      setDonationRequests(prev => 
        prev.map(req => 
          req._id === _id 
            ? { ...req, status: "rejected" }
            : req
        )
      )

      console.log(donationRequests)

      setRejected(prev => prev + 1)
      setPending(prev => prev - 1)
      
      toast.success("Đã hủy yêu cầu hiến máu thành công!")
    } catch (error: any) {
      console.error("Error cancelling request:", error)
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi hủy yêu cầu."
      toast.error(errorMessage)
    }
  }

  async function handleUnverifiedStatus(_id: any, arg1: string): Promise<void> {
    if (!window.confirm("Bạn có chắc chắn muốn hủy xác minh thông tin này?")) {
      return
    }

    try {
      await api.put(`/checkin/unverify/${_id}`)

      // Cập nhật state local
      setCheckIns((prev: any[]) => 
        prev.map(req => 
          req._id === _id 
            ? { ...req, status: "unverified" }
            : req
        )
      )
      
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
      await api.put(`/checkin/checkins/${_id}/verify`)

      // Cập nhật state local
      setCheckIns((prev: any[]) => 
        prev.map(req => 
          req._id === _id 
            ? { ...req, status: "verified" }
            : req
        )
      )
      
      toast.success("Đã xác minh thành công!")
    } catch (error: any) {
      console.error("Error cancelling request:", error)
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi hủy yêu cầu."
      toast.error(errorMessage)
    }
  }

  function setCheckinFilter(value: string): void {
    throw new Error("Function not implemented.")
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
          {/* Staff Stats Overview - Expanded with Blood Donation to Inventory Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kho máu tổng</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{staffStats.totalBloodUnits} ml</div>
                <p className="text-xs text-muted-foreground">
                  {staffStats.lowStockTypes > 0 ? `${staffStats.lowStockTypes} loại thiếu` : "Tình trạng tốt"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Yêu cầu hiến máu</CardTitle>
                <Hospital className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pending}</div>
                <p className="text-xs text-muted-foreground">đang chờ xử lý</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hiến máu vào kho</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{staffStats.completedDonorRequests}</div>
                <p className="text-xs text-muted-foreground">
                  đã hoàn tất | {staffStats.pendingDonorRequests} đang xử lý
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Máu nhận được</CardTitle>
                <Droplet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{staffStats.totalVolumeFromDonorRequests} ml</div>
                <p className="text-xs text-muted-foreground">từ hiến máu vào kho</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cơ sở làm việc</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{staff?.hospital?.name || "Không có thông tin"}</div>
                <p className="text-xs text-muted-foreground">{staff?.hospital?.address || "Không có thông tin"}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="inventory" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="donation-requests">Yêu cầu hiến máu</TabsTrigger>
              <TabsTrigger value="check-in">Check In</TabsTrigger>
              <TabsTrigger value="inventory">Kho máu</TabsTrigger>
              <TabsTrigger value="requests">Yêu cầu máu</TabsTrigger>
              <TabsTrigger value="reports">Quản lý lịch trình hiến máu</TabsTrigger>
            </TabsList>

            <TabsContent value="donation-requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Quản lý yêu cầu hiến máu</span>
                    <Select onValueChange={setRequestFilter} defaultValue="newest">
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sắp xếp theo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Mới nhất</SelectItem>
                        <SelectItem value="oldest">Cũ nhất</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardTitle>
                  <CardDescription>Quản lý các yêu cầu hiến máu đã gửi bởi người dùng</CardDescription>
                  <StatusSummary summary={{ pending: pending, approved: approved, rejected: rejected }} />
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {donationRequests.map((request: any) => (
                      <div
                        key={request._id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p><strong>Email:</strong> {request.user_id.email}</p>
                            <p><strong>Ngày hiến:</strong> {formatDate(request.donation_date)}</p>
                            <p><strong>Khung giờ:</strong> {request.donation_time_range.from} - {request.donation_time_range.to}</p>
                            <p><strong>Loại hiến:</strong> {translateDonationType(request.donation_type)}</p>
                            <p><strong>Ghi chú:</strong> {request.notes || "Không có"}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge className={getStatusColor(request.status)}>
                              {translateStatus(request.status)}
                            </Badge>
                            <p className="text-sm text-gray-600">Ngày tạo: {formatDate(request.createdAt)}</p>

                            {/* Nút xử lý nếu còn trạng thái pending */}
                            {request.status === "pending" && (
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(request._id, "approved")}
                                >
                                  Chấp nhận
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleCancelStatus(request._id, "rejected")}
                                >
                                  Từ chối
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="check-in" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Quản lý điểm danh hiến máu</span>
                    <Select onValueChange={setCheckinFilter} defaultValue="newest">
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sắp xếp theo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Mới nhất</SelectItem>
                        <SelectItem value="oldest">Cũ nhất</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardTitle>
                  <CardDescription>
                    Danh sách người dùng đã đến bệnh viện để hiến máu
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {checkIns.map((checkIn: any) => (
                      <div
                        key={checkIn._id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p><strong>Họ tên:</strong> {checkIn.user_id.full_name}</p>
                            <p><strong>Email:</strong> {checkIn.user_id.email}</p>
                            <p><strong>CCCD:</strong> {checkIn.userprofile_id?.cccd || "Không có"}</p>
                            <p><strong>Giới tính:</strong> {checkIn.user_id.gender}</p>
                            <p><strong>SĐT:</strong> {checkIn.user_id.phone}</p>
                            <p><strong>Ngày sinh:</strong> {formatDate(checkIn.user_id.date_of_birth)}</p>
                            <p><strong>Bệnh viện:</strong> {checkIn.hospital_id.name}</p>
                            <p><strong>Địa chỉ:</strong> {checkIn.hospital_id.address}</p>

                            {/* Nếu có donorDonationRequest_id thì hiển thị */}
                            {checkIn.donorDonationRequest_id && (
                              <>
                                <hr />
                                <p><strong>Ngày đăng ký hiến:</strong> {formatDate(checkIn.donorDonationRequest_id.donation_date)}</p>
                                <p><strong>Thời gian:</strong> {checkIn.donorDonationRequest_id.donation_time_range.from} - {checkIn.donorDonationRequest_id.donation_time_range.to}</p>
                                <p><strong>Loại hiến máu:</strong> {checkIn.donorDonationRequest_id.donation_type === "whole" ? "Toàn phần" : "Tách thành phần"}</p>
                                {checkIn.donorDonationRequest_id.separated_component && (
                                  <p><strong>Thành phần:</strong> {checkIn.donorDonationRequest_id.separated_component}</p>
                                )}
                                <p><strong>Ghi chú:</strong> {checkIn.donorDonationRequest_id.notes || "Không có"}</p>
                                <p><strong>Trạng thái yêu cầu:</strong> {translateStatus(checkIn.donorDonationRequest_id.status)}</p>
                              </>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <Badge className={getStatusColor(checkIn.status)}>
                              {translateStatus(checkIn.status)}
                            </Badge>
                            <p className="text-sm text-gray-600">
                              Ngày điểm danh: {formatDate(checkIn.createdAt)}
                            </p>

                            {/* Nút xử lý trạng thái */}
                            {checkIn.status === "in_progress" && (
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleVerifiedStatus(checkIn._id, "verified")}
                                >
                                  Xác minh
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleUnverifiedStatus(checkIn._id, "unverified")}
                                >
                                  Huỷ xác minh
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>




            <TabsContent value="inventory" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Quản lý kho máu
                    </span>
                  </CardTitle>
                  <CardDescription>Theo dõi tồn kho và tình trạng máu theo từng nhóm</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {bloodInven.map((blood: any) => (
                      <Card key={blood.blood_type} className="relative">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold text-red-600">{blood.blood_type}</CardTitle>
                            <Badge className={getBloodStatusColor(blood.quantity)}>
                              {blood.quantity < 30
                                ? "Rất thấp"
                                : blood.quantity < 150
                                  ? "Thấp"
                                  : "Tốt"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Có sẵn:</span>
                              <span className="font-semibold">{blood.quantity} ml</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Đã đặt:</span>
                              <span className="font-semibold">0 ml</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Sắp hết hạn:</span>
                              <span className="font-semibold text-orange-600">{blood.expiring_quantity} ml</span>
                            </div>
                            <Progress
                              value={Math.min((blood.quantity / 50000) * 100, 100)}
                              className="h-2 mt-2"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Quản lý yêu cầu máu</span>
                    <Select onValueChange={setBloodRequestFilter} defaultValue="newest">
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sắp xếp theo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Mới nhất</SelectItem>
                        <SelectItem value="oldest">Cũ nhất</SelectItem>
                        <SelectItem value="emergency">Khẩn cấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardTitle>
                  <CardDescription>Quản lý thông tin về yêu cầu máu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getSortedBloodRequests(bloodReqList.data || []).map((recipient: any) => (
                      <Link
                        key={recipient._id}
                        href={`/staff/edit/request?requestId=${recipient._id}`}
                        className="block"
                      >
                        <div
                          className="flex flex-col md:flex-row justify-between p-4 border rounded-lg space-y-4 md:space-y-0 md:space-x-6 hover:bg-gray-50 transition"
                        >
                          {/* BÊN TRÁI: THÔNG TIN NGƯỜI NHẬN & YÊU CẦU */}
                          <div className="flex-1 flex flex-col space-y-2">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-orange-600" />
                              </div>
                              <div>
                                <p className="font-medium">{recipient.recipient_id?.full_name || "Không rõ tên"}</p>
                                <p className="text-sm text-gray-600">{recipient.recipient_id?.email || "Không rõ email"}</p>
                                <p className="text-sm text-gray-600">SĐT: {recipient.recipient_id?.phone || "Không rõ SĐT"}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-red-600">{recipient.blood_type_needed}</Badge>
                              <Badge className="bg-blue-100 text-blue-800">{recipient.components_needed?.map((comp: string) => translateComponent(comp)).join(", ") || "Không rõ"}</Badge>
                              <Badge className={recipient.is_emergency ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                                {recipient.is_emergency ? "Khẩn cấp" : "Không khẩn cấp"}
                              </Badge>
                              <Badge className={getStatusColor(recipient.status)}>{translateStatus(recipient.status)}</Badge>
                            </div>

                            <div className="text-sm text-gray-600">
                              <p>Số lượng cần: <strong>{recipient.amount_needed}</strong> ml</p>
                              <p>Khoảng cách: <strong>{recipient.distance} km</strong></p>
                              <p>Ghi chú: {recipient.comment || "Không có"}</p>
                              <p>Ngày tạo: {formatDate(recipient.createdAt)}</p>
                            </div>
                          </div>

                          {/* BÊN PHẢI: BỆNH VIỆN & NÚT */}
                          <div className="flex flex-col justify-between items-end space-y-3 min-w-[220px]">
                            <div className="text-right text-sm">
                              <p className="font-medium text-gray-800">{recipient.hospital?.name || "Không rõ bệnh viện"}</p>
                              <p className="text-gray-600">{recipient.hospital?.address || "Không rõ địa chỉ"}</p>
                              <p className="text-gray-600">SĐT: {recipient.hospital?.phone || "Không rõ SĐT"}</p>
                            </div>

                            <div className="flex space-x-2">
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Quản lý lịch trình hiến máu</span>
                    <Select onValueChange={setBloodManageFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Loại quản lý" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="donor">Truyền Máu</SelectItem>
                        <SelectItem value="blood-inventory">Yêu Cầu Máu Trong Kho</SelectItem>
                        <SelectItem value="donor-request">Hiến Máu Vào Kho</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardTitle>
                  <CardDescription>Quản lý thông tin về lịch trình hiến máu</CardDescription>
                </CardHeader>
                <CardContent>
                  <CardContent className="space-y-4">
                    {bloodManageFilter === "donor" && Array.isArray(donationList) && donationList.length > 0 ? (
                      donationList.map((donation) => (
                        <div
                          key={donation._id}
                          className="flex flex-col md:flex-row justify-between p-4 border rounded-lg space-y-4 md:space-y-0 md:space-x-6 hover:bg-gray-50 transition"
                        >
                          {/* BÊN TRÁI: DONOR & RECIPIENT */}
                          <div className="flex-1 flex flex-col space-y-2">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-red-600" />
                              </div>
                              <div>
                                <p className="font-medium">Người hiến: {donation.donor_id?.full_name || "Không rõ"}</p>
                                <p className="text-sm text-gray-600">{donation.donor_id?.email}</p>
                                <p className="text-sm text-gray-600">SĐT: {donation.donor_id?.phone}</p>
                              </div>
                            </div>

                            {donation.recipient_id && (
                              <div className="mt-2 border-t pt-2">
                                <p className="font-medium">Người nhận: {donation.recipient_id?.full_name}</p>
                                <p className="text-sm text-gray-600">{donation.recipient_id?.email}</p>
                                <p className="text-sm text-gray-600">SĐT: {donation.recipient_id?.phone}</p>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge className="bg-blue-100 text-blue-800">{donation.donation_type?.map((type: string) => translateComponent(type)).join(", ")}</Badge>
                              <Badge className={donation.status === "scheduled" ? "bg-yellow-100 text-yellow-800" : donation.status === "completed" ? "bg-green-100 text-green-800" : donation.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}>
                                {translateStatus(donation.status)}
                              </Badge>
                            </div>

                            <div className="text-sm text-gray-600 mt-1">
                              <p>Ngày hiến: <strong>{formatDate(donation.donation_date)}</strong></p>
                              <p>Khối lượng: <strong>{donation.volume}</strong> ml</p>
                              <p>Ghi chú: {donation.notes || "Không có"}</p>
                              <p>Ngày tạo: {formatDate(donation.createdAt)}</p>
                            </div>
                          </div>

                          {/* BÊN PHẢI: STAFF & NÚT */}
                          <div className="flex flex-col justify-between items-end space-y-3 min-w-[220px]">
                            <div className="text-right text-sm">
                              <p className="font-medium text-gray-800">Cập nhật bởi:</p>
                              <p className="text-gray-600">{donation.updated_by?.full_name || "Chưa rõ"}</p>
                              <p className="text-gray-600">{donation.updated_by?.email || "-"}</p>
                              <p className="font-medium text-gray-800">🛠 Cập nhật trạng thái:</p>
                              <Select
                                onValueChange={(value) => setSelectedDonationStatus(prev => ({ ...prev, [donation._id]: value }))}
                                value={selectedDonationStatus[donation._id] || ""}
                              >
                                <SelectTrigger className="w-full md:w-[300px] border-gray-300">
                                  <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    { key: "scheduled", label: "Đã lên lịch" },
                                    { key: "completed", label: "Đã hoàn tất" },
                                    { key: "cancelled", label: "Đã hủy" },
                                  ].map((status) => (
                                    <SelectItem key={status.key} value={status.key}>
                                      {status.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Button
                                className="mt-2 bg-blue-600 text-white hover:bg-blue-700"
                                disabled={!selectedDonationStatus[donation._id] || selectedDonationStatus[donation._id] === donation?.status}
                                onClick={() => handleStatusUpdate(selectedDonationStatus[donation._id], donation._id)}
                              >
                                Cập nhật trạng thái
                              </Button>
                            </div>

                            <div className="flex space-x-2">
                            </div>
                          </div>
                        </div>
                      ))
                    ) : bloodManageFilter === "blood-inventory" ? (
                      ""
                    ) : bloodManageFilter === "donor-request" ? "" : <p className="text-gray-600">Không tìm thấy dữ liệu truyền máu.</p>}

                    {bloodManageFilter === "blood-inventory" && Array.isArray(warehouseDonationsList2) && warehouseDonationsList2.length > 0 ? (
                      warehouseDonationsList2.map((donation) => (
                        <div
                          key={donation._id}
                          className="flex flex-col md:flex-row justify-between p-4 border rounded-lg space-y-4 md:space-y-0 md:space-x-6 hover:bg-gray-50 transition"
                        >
                          {/* BÊN TRÁI: INVENTORY & RECIPIENT */}
                          <div className="flex-1 flex flex-col space-y-2">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Droplet className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  Nhóm máu: {donation.inventory_item?.blood_type || "Không rõ"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Thành phần: {translateComponent(donation.inventory_item?.component)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Lượng tồn: {donation.inventory_item?.quantity} ml
                                </p>
                              </div>
                            </div>

                            {donation.recipient_id && (
                              <div className="mt-2 border-t pt-2">
                                <p className="font-medium">Người nhận: {donation.recipient_id?.full_name}</p>
                                <p className="text-sm text-gray-600">{donation.recipient_id?.email}</p>
                                <p className="text-sm text-gray-600">SĐT: {donation.recipient_id?.phone}</p>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge className="bg-blue-100 text-blue-800">{translateComponent(donation.inventory_item?.component)}</Badge>
                              <Badge
                                className={
                                  donation.status === "in_progress"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : donation.status === "fulfilled"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {translateStatus(donation.status)}
                              </Badge>
                            </div>

                            <div className="text-sm text-gray-600 mt-1">
                              <p>Ngày rút máu: <strong>{formatDate(donation.donation_date)}</strong></p>
                              <p>Khối lượng rút: <strong>{donation.volume}</strong> ml</p>
                              <p>Ghi chú: {donation.notes || "Không có"}</p>
                              <p>Ngày tạo: {formatDate(donation.createdAt)}</p>
                            </div>
                          </div>

                          {/* BÊN PHẢI: STAFF & NÚT */}
                          <div className="flex flex-col justify-between items-end space-y-3 min-w-[220px]">
                            <div className="text-right text-sm">
                              <p className="font-medium text-gray-800">Cập nhật bởi:</p>
                              <p className="text-gray-600">{donation.updated_by?.full_name || "Chưa rõ"}</p>
                              <p className="text-gray-600">{donation.updated_by?.email || "-"}</p>
                              <p className="font-medium text-gray-800">🛠 Cập nhật trạng thái:</p>
                              <Select
                                onValueChange={(value) => setSelectedWarehouseStatus(prev => ({ ...prev, [donation._id]: value }))}
                                value={selectedWarehouseStatus[donation._id] || ""}
                              >
                                <SelectTrigger className="w-full md:w-[300px] border-gray-300">
                                  <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    { key: "in_progress", label: "Đang tiến hành" },
                                    { key: "fulfilled", label: "Đã hoàn tất" },
                                    { key: "cancelled", label: "Đã hủy" },
                                  ].map((status) => (
                                    <SelectItem key={status.key} value={status.key}>
                                      {status.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Button
                                className="mt-2 bg-blue-600 text-white hover:bg-blue-700"
                                disabled={!selectedWarehouseStatus[donation._id] || selectedWarehouseStatus[donation._id] === donation.status}
                                onClick={() => handleWarehouseStatusUpdate(selectedWarehouseStatus[donation._id], donation._id)}
                              >
                                Cập nhật trạng thái
                              </Button>
                            </div>

                            <div className="flex space-x-2">
                            </div>
                          </div>
                        </div>
                      ))
                    ) : bloodManageFilter === "donor" ? (
                      ""
                    ) : bloodManageFilter === "donor-request" ? "" : <p className="text-gray-600">Không tìm thấy dữ liệu yêu cầu máu trong kho.</p>}

                    {bloodManageFilter === "donor-request" &&
                      Array.isArray(mockDonorRequests) &&
                      mockDonorRequests.length > 0 ? (
                      mockDonorRequests.map((request) => (
                        <div
                          key={request._id}
                          className="flex flex-col md:flex-row justify-between p-4 border rounded-lg space-y-4 md:space-y-0 md:space-x-6 hover:bg-gray-50 transition"
                        >
                          {/* BÊN TRÁI: THÔNG TIN HIẾN */}
                          <div className="flex-1 flex flex-col space-y-2">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Droplet className="w-6 h-6 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium">Người hiến: {request.donor_id?.full_name || "Không rõ"}</p>
                                <p className="text-sm text-gray-600">{request.donor_id?.email}</p>
                                <p className="text-sm text-gray-600">SĐT: {request.donor_id?.phone}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-red-600">{request.blood_type_offered}</Badge>
                              <Badge className="bg-blue-100 text-blue-800">{request.components_offered?.map((comp: string) => translateComponent(comp)).join(", ")}</Badge>
                              <Badge
                                className={
                                  request.status === "in_progress"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : request.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : request.status === "cancelled"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                }
                              >
                                {translateStatus(request.status)}
                              </Badge>
                            </div>

                            <div className="text-sm text-gray-600 mt-1">
                              <p>Ngày hiến dự kiến: <strong>{formatDate(request.available_date)}</strong></p>
                              <p>Khung giờ: <strong>{request.available_time_range?.from} - {request.available_time_range?.to}</strong></p>
                              <p>Số lượng: <strong>{request.amount_offered}</strong> ml</p>
                              <p>Ghi chú: {request.comment || "Không có"}</p>
                              <p>Ngày tạo: {formatDate(request.createdAt)}</p>
                            </div>
                          </div>

                          {/* BÊN PHẢI: BỆNH VIỆN & NÚT */}
                          <div className="flex flex-col justify-between items-end space-y-3 min-w-[220px]">
                            <div className="text-right text-sm">
                              <p className="font-medium text-gray-800">{request.hospital?.name}</p>
                              <p className="text-gray-600">{request.hospital?.address}</p>

                              {/* Hiển thị trạng thái kho máu hiện tại với thông tin chi tiết */}
                              {(() => {
                                const targetComponent = request.components_offered?.[0] || 'whole';

                                // Áp dụng cùng logic matching như trong handleDonorRequestStatusUpdate
                                let currentInventory = bloodInven.find((inv: any) =>
                                  inv.blood_type === request.blood_type_offered &&
                                  inv.component?.toLowerCase() === targetComponent?.toLowerCase()
                                );

                                // Fallback: tìm với component 'whole' nếu không tìm thấy
                                if (!currentInventory && targetComponent !== 'whole') {
                                  currentInventory = bloodInven.find((inv: any) =>
                                    inv.blood_type === request.blood_type_offered &&
                                    inv.component?.toLowerCase() === 'whole'
                                  );
                                }

                                // Fallback cuối: tìm bất kỳ inventory nào có cùng blood type
                                if (!currentInventory) {
                                  currentInventory = bloodInven.find((inv: any) =>
                                    inv.blood_type === request.blood_type_offered
                                  );
                                }

                                const isCompleting = selectedDonorRequestStatus[request._id] === "completed" && request.status !== "completed";
                                const isCancelling = selectedDonorRequestStatus[request._id] === "cancelled" && request.status === "completed";

                                return currentInventory ? (
                                  null
                                ) : (
                                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                                    <p className="font-semibold text-yellow-800">⚠️ Chưa có trong kho</p>
                                    <p className="text-yellow-700">
                                      Loại: {request.blood_type_offered} ({translateComponent(targetComponent)})
                                    </p>
                                    <p className="text-yellow-700 text-xs mt-1">
                                      💡 Hệ thống sẽ tìm kho có sẵn cùng nhóm máu hoặc tạo mới nếu cần
                                    </p>

                                    {isCompleting && (
                                      <div className="mt-1 p-2 bg-green-100 border border-green-300 rounded">
                                        <p className="text-green-800 font-semibold">
                                          ✨ Sẽ tạo mới: {request.amount_offered}ml
                                        </p>
                                        <p className="text-green-700 text-xs">
                                          Tạo inventory mới cho loại máu này
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                              <p className="font-medium text-gray-800 mt-2">🛠 Cập nhật trạng thái:</p>
                              <Select
                                onValueChange={(value) => setSelectedDonorRequestStatus(prev => ({ ...prev, [request._id]: value }))}
                                value={selectedDonorRequestStatus[request._id] || ""}
                              >
                                <SelectTrigger className="w-full md:w-[300px] border-gray-300">
                                  <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    { key: "in_progress", label: "Đang tiến hành" },
                                    { key: "completed", label: "Hoàn tất" },
                                    { key: "cancelled", label: "Đã hủy" },
                                  ].map((status) => (
                                    <SelectItem key={status.key} value={status.key}>
                                      {status.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Button
                                className="mt-2 bg-blue-600 text-white hover:bg-blue-700"
                                disabled={!selectedDonorRequestStatus[request._id] || selectedDonorRequestStatus[request._id] === request.status}
                                onClick={() => {
                                  const newStatus = selectedDonorRequestStatus[request._id];
                                  handleDonorRequestStatusUpdate(newStatus, request._id, request.donor_id?._id);
                                }}
                              >
                                Cập nhật trạng thái
                              </Button>
                            </div>

                            <div className="flex space-x-2">
                            </div>
                          </div>
                        </div>
                      ))
                    ) : bloodManageFilter === "donor" ? (
                      ""
                    ) : bloodManageFilter === "blood-inventory" ? "" : <p className="text-gray-600">Không tìm thấy yêu cầu hiến máu từ người hiến.</p>}

                  </CardContent>
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
