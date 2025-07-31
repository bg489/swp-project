"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Calendar, Droplets } from "lucide-react";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useSearchParams } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/axios"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Định nghĩa kiểu dữ liệu
interface BloodRequest {
  _id?: string;
  recipient_id?: {
    _id: string;
    full_name: string;
    email: string;
    phone: string;
  };
  blood_type_needed?: string;
  components_needed?: string[];
  amount_needed?: number;
  distance?: number;
  hospital?: {
    _id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  status?: string;
  is_emergency?: boolean;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Staff {
  hospital?: {
    _id: string;
    name: string;
  };
  user_id?: {
    _id: string;
  };
}

interface Donor {
  _id: string;
  user_id: {
    _id: string;
    full_name: string;
    email: string;
    phone: string;
  };
  hospital: {
    name: string;
  };
  blood_type: string;
  availability_date: string;
}

interface BloodInventory {
  _id: string;
  blood_type: string;
  component: string;
  quantity: number;
}

export default function EditRequestPage() {
  const { user, logout } = useAuth()
  const router = useRouter();
  const [request, setRequest] = useState<any>(null);
  const searchParams = useSearchParams()
  const requestId = searchParams.get("requestId") || ""
  const [availableDonors, setAvailableDonors] = useState<any[]>([]);
  const [staff, setStaff] = useState<Staff>({});
  const [donorList, setDonorList] = useState<{donors: Donor[]}>({donors: []});
  const [bloodReq, setBloodReq] = useState<BloodRequest>({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [donorInputs, setDonorInputs] = useState<{[key: string]: {date: string, comment: string}}>({});
  const [bloodInven, setBloodInven] = useState<BloodInventory[]>([]);
  const [warehouseDonationDate, setWarehouseDonationDate] = useState("");
  const [warehouseDonationComment, setWarehouseDonationComment] = useState("");
  const [nearbyHospitals, setNearbyHospitals] = useState<{ _id: string; name: string, address: string, phone: string }[]>([]);

  function getInventoryAmount(inventory: BloodInventory[], bloodType: string, component: string) {
    const match = inventory.find(item => item.blood_type === bloodType && item.component === component);
    return match ? match.quantity : 0;
  }

  // Hàm trợ giúp để lấy ngày hôm nay theo định dạng YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Hàm trợ giúp để lấy ngày mai theo định dạng YYYY-MM-DD
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Hàm trợ giúp để cập nhật thông tin đầu vào của người hiến
  const updateDonorInput = (donorId: string, field: 'date' | 'comment', value: string) => {
    setDonorInputs(prev => ({
      ...prev,
      [donorId]: {
        date: field === 'date' ? value : (prev[donorId]?.date || ''),
        comment: field === 'comment' ? value : (prev[donorId]?.comment || '')
      }
    }));
  };

  const handleWarehouseConfirm = async () => {
    try {
      if (!bloodReq.blood_type_needed || !bloodReq.recipient_id?._id || !staff.user_id?._id || !staff.hospital?._id) {
        toast.error("Thiếu thông tin cần thiết");
        return;
      }

      const bloodInvenId = bloodInven.find(item => item.blood_type === bloodReq.blood_type_needed);
      if (!bloodInvenId) {
        toast.error("Không tìm thấy máu phù hợp trong kho");
        return;
      }

      console.log(staff.hospital._id)

      await api.post(`/staff/donation-blood-inventory`, {
        inventory_item: bloodInvenId._id,
        recipient_id: bloodReq.recipient_id._id,
        donation_date: warehouseDonationDate,
        volume: bloodReq.amount_needed,
        updated_by: staff.user_id._id,
        notes: warehouseDonationComment,
        hospital: staff.hospital._id
      });

      await api.put(`/staff/blood-requests/${requestId}/status`, {
        status: "matched",
      });

      toast.success("Đã xác nhận lấy máu từ kho");
      router.push("/staff/dashboard"); // hoặc reload / chuyển trang
    } catch (error) {
      console.error("Lỗi xác nhận lấy máu từ kho:", error);
      toast.error("Xác nhận thất bại, vui lòng thử lại!");
    }
  };

  function isBloodInventorySufficient(inventory: BloodInventory[], requiredBloodType: string, requiredAmount: number) {
    const match = inventory.find(item => item.blood_type === requiredBloodType && item.component === "RBC");
    return match && match.quantity >= requiredAmount;
  }

  function getInventoryAmountByComponent(inventory: BloodInventory[], bloodType: string, component: string) {
    const match = inventory.find(item => item.blood_type === bloodType && item.component === component);
    return match ? match.quantity : 0;
  }

  const latestRequest = {
    blood_type_needed: "A+",
    amount_needed: 3,
  };


  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng tính từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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

  useEffect(() => {
    const handleFindHospitalsNearby = async (latitude: number, longitude: number, radiusKm: number) => {
      try {
        const response = await api.get("/hospital/");
        const hospitals = response.data.hospitals;

        const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371;
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLon = ((lon2 - lon1) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        const filtered = hospitals.filter((h: any) => {
          const dist = getDistanceKm(latitude, longitude, h.latitude, h.longitude);
          return dist <= radiusKm;
        }).map((h: any) => ({
          _id: h._id,
          name: h.name,
          address: h.address,
          phone: h.phone,
        }));

        setNearbyHospitals(filtered);


        if (filtered.length > 0) {
          toast.success(`Tìm thấy ${filtered.length} bệnh viện trong ${radiusKm} km!`);
          return filtered;
        } else {
          toast.error(`Không tìm thấy bệnh viện nào trong ${radiusKm} km.`);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách bệnh viện:", error);
        toast.error("Đã xảy ra lỗi khi tìm bệnh viện!");
      }
    };
    async function fetchProfile() {
      try {
        if (!user?._id) return;

        const profileRes = await api.get(`/users/staff-profiles/active/${user._id}`);
        const staffData = profileRes.data.staffProfile;
        setStaff(staffData);

        // Chỉ fetch donor list sau khi staffData có hospital
        if (staffData?.hospital?._id) {


          const profileBR = await api.get(`/staff/blood-request/get-by-id/${requestId}`);
          setBloodReq(profileBR.data);
          setSelectedStatus(profileBR.data?.status || "")

          const hospitals2 = await handleFindHospitalsNearby(profileBR.data.hospital.latitude, profileBR.data.hospital.longitude, profileBR.data.distance);
          const hospitalIds2 = hospitals2.map((h: { _id: any; }) => h._id);
          const profileDonList = await api.post("/users/donors/by-hospitals-and-bloodtype", {
            hospitalIds: hospitalIds2,
            recipientBloodType: profileBR.data.blood_type_needed
          });
          setDonorList(profileDonList.data);

          const bloodinvens = await api.get(`/blood-in/blood-inventory/hospital/${staffData.hospital._id}`);

          // setBloodInven([
          //   { blood_type: "A+", component: "RBC", quantity: 5 },
          //   { blood_type: "O+", component: "RBC", quantity: 1 },
          // ]);

          setBloodInven(bloodinvens.data.inventories);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin nhân viên hoặc bệnh viện:", error);
      }
    }

    if (user?._id) {
      fetchProfile();
    }
  }, [user, requestId]);

  useEffect(() => {
    setRequest({
      recipient_id: { full_name: "Nguyễn Văn A" },
      blood_type_needed: "O+",
      amount_needed: 2,
      status: "pending",
      is_emergency: true,
      createdAt: new Date().toISOString(),
    });

    setAvailableDonors([
      {
        _id: "donor1",
        user_id: { full_name: "Nguyễn Văn B", email: "nguyenvanb@gmail.com", phone: "0123456789" },
        distance: 5.2,
        blood_type: "A+",
        donation_start_date: "2024-06-15T00:00:00Z"
      }
      ,
      {
        _id: "donor2",
        user_id: {
          full_name: "Lê Văn C",
          email: "levanc@gmail.com",
          phone: "0987654321",
        },
        distance: 8.7,
        blood_type: "A+",
        donation_start_date: "2024-06-15T00:00:00Z"
      },
    ]);
  }, []);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await api.put(`/staff/blood-requests/${requestId}/status`, {
        status: newStatus,
      });

      toast.success(`Đã thay đổi status thành ${newStatus}`)
      setBloodReq((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái. Vui lòng thử lại!");
      console.error(error);
    }
  };

  const handleMatchDonor = async (donorId: string) => {
    try {
      if (!bloodReq.recipient_id?._id || !bloodReq.components_needed?.[0] || !staff.user_id?._id) {
        toast.error("Thiếu thông tin cần thiết");
        return;
      }

      const donorInput = donorInputs[donorId];
      if (!donorInput?.date) {
        toast.error("Vui lòng chọn ngày hiến máu");
        return;
      }

      // Tìm donor trong danh sách để lấy user_id
      const selectedDonor = donorList.donors.find(donor => donor._id === donorId);
      if (!selectedDonor) {
        toast.error("Không tìm thấy thông tin người hiến");
        return;
      }

      await api.post("/staff/donation", {
        donor_id: selectedDonor.user_id._id, // Sử dụng user_id từ donor object
        recipient_id: bloodReq.recipient_id._id,
        donation_date: donorInput.date,
        donation_type: bloodReq.components_needed[0],
        volume: bloodReq.amount_needed,
        status: "scheduled",
        updated_by: staff.user_id._id,
        notes: donorInput.comment || "",
      });
      await api.put(`/staff/blood-requests/${requestId}/status`, {
        status: "matched",
      });

      toast.success("Thành công yêu cầu hiến máu")
      router.push("/staff/dashboard");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái. Vui lòng thử lại!");
      console.error(error);
    }
  };

  if (!request) return <p className="p-8 text-center text-gray-600">Đang tải dữ liệu...</p>;

  return (
    <div>
      <Header />
      <div className="container mx-auto py-8 space-y-8">

        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">🩸 Chi tiết yêu cầu máu</CardTitle>
            <CardDescription className="text-gray-600">Thông tin chi tiết & cập nhật trạng thái</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Bệnh nhân:</strong> {bloodReq?.recipient_id?.full_name || "Không rõ"}</p>
                <p className="text-gray-700"><strong>Email:</strong> {bloodReq?.recipient_id?.email || "Không rõ"}</p>
                <p className="text-gray-700"><strong>Điện thoại:</strong> {bloodReq?.recipient_id?.phone || "Không rõ"}</p>
                <p className="text-gray-700"><strong>Nhóm máu cần:</strong> {bloodReq?.blood_type_needed || "Không rõ"}</p>
                <p className="text-gray-700"><strong>Thành phần cần:</strong> {bloodReq?.components_needed?.map(comp => translateComponent(comp)).join(", ") || "Không rõ"}</p>
                <p className="text-gray-700"><strong>Số lượng:</strong> {bloodReq?.amount_needed || "Không rõ"} đơn vị</p>
                <p className="text-gray-700"><strong>Khoảng cách:</strong> {bloodReq?.distance !== undefined ? `${bloodReq.distance} km` : "Không rõ"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Bệnh viện:</strong> {bloodReq?.hospital?.name || "Không rõ"}</p>
                <p className="text-gray-700"><strong>Địa chỉ BV:</strong> {bloodReq?.hospital?.address || "Không rõ"}</p>
                <p className="text-gray-700"><strong>Tình trạng:</strong> <Badge className="capitalize">{translateStatus(bloodReq?.status || "Đang chờ")}</Badge></p>
                <p className="text-gray-700"><strong>Khẩn cấp:</strong> {bloodReq?.is_emergency ? "Có" : "Không"}</p>
                <p className="text-gray-700"><strong>Ghi chú:</strong> {bloodReq?.comment || "Không có"}</p>
                <p className="text-gray-700"><strong>Ngày tạo:</strong> {bloodReq?.createdAt ? formatDate(bloodReq.createdAt) : "Không rõ"}</p>
                <p className="text-gray-700"><strong>Cập nhật lần cuối:</strong> {bloodReq?.updatedAt ? formatDate(bloodReq.updatedAt) : "Không rõ"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-gray-800">🛠 Cập nhật trạng thái:</p>
              <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                <SelectTrigger className="w-full md:w-[300px] border-gray-300">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { key: "pending", label: "Đang chờ duyệt" },
                    // { key: "approved", label: "Đã phê duyệt" },
                    // { key: "matched", label: "Đã ghép người hiến" },
                    // { key: "in_progress", label: "Đang xử lý" },
                    // { key: "completed", label: "Hoàn tất" },
                    { key: "cancelled", label: "Đã hủy" },
                    { key: "rejected", label: "Bị từ chối" },
                  ].map((status) => (
                    <SelectItem key={status.key} value={status.key}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="mt-2 bg-blue-600 text-white hover:bg-blue-700"
                disabled={!selectedStatus || selectedStatus === bloodReq?.status}
                onClick={() => handleStatusUpdate(selectedStatus)}
              >
                Cập nhật trạng thái
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tình trạng yêu cầu gần nhất</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {bloodInven.length > 0 && bloodReq.blood_type_needed && bloodReq.amount_needed && 
             isBloodInventorySufficient(bloodInven, bloodReq.blood_type_needed, bloodReq.amount_needed) ? (
              <>
                <div className="text-green-600 font-bold mb-2">
                  ✅ Có đủ máu ({bloodReq.blood_type_needed}) trong kho
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Cần {bloodReq.amount_needed} đơn vị nhóm {bloodReq.blood_type_needed}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 w-fit mb-5">
                  💉 Hiện có: {getInventoryAmount(bloodInven, bloodReq.blood_type_needed, "RBC")} đơn vị {translateComponent("RBC")}
                </div>


                <div className="space-y-3">
                  <div className="flex flex-col">
                    <Label htmlFor="warehouse-donation-date">Ngày hiến máu</Label>
                    <div className="relative mt-5">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                      <Input
                        id="warehouse-donation-date"
                        type="date"
                        value={warehouseDonationDate}
                        onChange={(e) => setWarehouseDonationDate(e.target.value)}
                        min={getTodayDate()}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <Label htmlFor="warehouse-comment">Ghi chú</Label>
                    <Input
                      id="warehouse-comment"
                      placeholder="Nhập ghi chú khi lấy máu từ kho..."
                      value={warehouseDonationComment}
                      onChange={(e) => setWarehouseDonationComment(e.target.value)}
                      className="mt-5"
                    />
                  </div>

                  <Button
                    onClick={handleWarehouseConfirm}
                    className="bg-purple-600 text-white hover:bg-purple-700"
                    disabled={!warehouseDonationDate}
                  >
                    ✅ Xác nhận lấy máu từ kho
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-red-600 font-bold">❌ Không đủ máu {bloodReq.blood_type_needed || "N/A"} trong kho</div>
                <p className="text-xs text-muted-foreground mb-1">
                  Cần {bloodReq.amount_needed} đơn vị nhóm {bloodReq.blood_type_needed}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200 w-fit mb-5">
                  💉 Hiện có: {bloodReq.blood_type_needed ? getInventoryAmount(bloodInven, bloodReq.blood_type_needed, "RBC") : 0} đơn vị {translateComponent("RBC")}
                </div>

              </>
            )}
          </CardContent>
        </Card>




        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">🩺 Người hiến máu khả dụng</CardTitle>
            <CardDescription className="text-gray-600">
              Danh sách người hiến phù hợp theo nhóm máu & khoảng cách
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {donorList.donors?.length === 0 ? (
              <p className="text-gray-600">Không tìm thấy người hiến phù hợp.</p>
            ) : (
              Array.isArray(donorList?.donors) &&
              donorList.donors.map((donor) => (
                <div
                  key={donor._id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-xl bg-gray-50 hover:shadow transition"
                >
                  <div className="space-y-1 mb-4 md:mb-0">
                    <p className="font-semibold text-lg">{donor.user_id.full_name}</p>
                    <p className="text-sm text-gray-600">
                      {donor.user_id.email} | 📞 {donor.user_id.phone} | {donor.hospital.name}
                    </p>
                    <p className="text-sm text-gray-600">Nhóm máu: {donor.blood_type || "Không rõ"}</p>
                    <p className="text-sm text-gray-600">
                      Bắt đầu hiến từ: {formatDate(donor.availability_date)}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 w-full md:w-auto">
                    <div className="flex flex-col">
                      <Label className="mb-5" htmlFor={`donation-date-${donor._id}`}>Ngày hiến máu</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                        <Input
                          id={`donation-date-${donor._id}`}
                          type="date"
                          value={donorInputs[donor._id]?.date || ''}
                          onChange={(e) => updateDonorInput(donor._id, 'date', e.target.value)}
                          min={getTodayDate()}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <Label className="mb-5" htmlFor={`comment-${donor._id}`}>Ghi chú</Label>
                      <Input
                        id={`comment-${donor._id}`}
                        type="text"
                        value={donorInputs[donor._id]?.comment || ''}
                        onChange={(e) => updateDonorInput(donor._id, 'comment', e.target.value)}
                        placeholder="Nhập ghi chú..."
                        className="w-full md:w-48"
                      />
                    </div>

                    <Button
                      size="sm"
                      className="bg-green-600 text-white hover:bg-green-700"
                      onClick={() => handleMatchDonor(donor._id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Ghép
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>


        <div className="flex justify-center">
          <Button onClick={() => router.back()} variant="outline" className="px-6 py-3 rounded-xl">
            ← Quay lại
          </Button>
        </div>
      </div>
      <Toaster position="top-center" containerStyle={{
        top: 80,
      }} />
      <Footer />
    </div>
  );
}
