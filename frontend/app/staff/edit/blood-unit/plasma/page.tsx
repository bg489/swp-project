"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios";

export default function HealthCheckFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams()
  const bloodUnitId = searchParams.get("bloodUnitId") || ""
  const name = searchParams.get("name") || ""
  type ABOType = "A" | "B" | "AB" | "O";
  type RhType = "+" | "-";
  type FormValues = {
    bloodGroupABO: ABOType | undefined;
    bloodGroupRh: RhType | undefined;
    collectionDate: string; // yyyy-MM-dd
    anticoagulantSolution: string;
    expiryDate: string; // yyyy-MM-dd
    storageTemperature: string;
    irradiated: boolean;
    notes: string;
    volumeOrWeight: number;
    name: string;
    email: string;
    phone: string;
    gender: string;
    birth: string;
    cccd: string;
    user_id: string;
  };

  const [form, setForm] = useState<FormValues>({
    bloodGroupABO: undefined,
    bloodGroupRh: undefined,
    collectionDate: "",
    anticoagulantSolution: "",
    expiryDate: "",
    storageTemperature: "",
    irradiated: false,
    notes: "",
    volumeOrWeight: 0,
    name: "",
    email: "",
    phone: "",
    gender: "",
    birth: "",
    cccd: "",
    user_id: "",
  });

  function getGenderLabel(gender: string) {
    if (gender === "male") return "Nam";
    if (gender === "female") return "Nữ";
    return "Khác";
  }


  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng tính từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    async function fetch() {
      try {
        const response = await api.get(`/whole-blood/plasma/${bloodUnitId}`);
        const data = response.data;
        setForm({
          bloodGroupABO: data.unit.bloodGroupABO,
          bloodGroupRh: data.unit.bloodGroupRh,
          collectionDate: new Date(data.unit.collectionDate).toISOString().split("T")[0],
          anticoagulantSolution: data.unit.anticoagulantSolution,
          expiryDate: new Date(data.unit.expiryDate).toISOString().split("T")[0],
          storageTemperature: data.unit.storageTemperature,
          irradiated: data.unit.irradiated,
          notes: data.unit.notes,
          volumeOrWeight: data.unit.volumeOrWeight,
          name: data.unit.user_id.full_name,
          email: data.unit.user_id.email,
          phone: data.unit.user_id.phone,
          gender: data.unit.user_id.gender,
          birth: data.unit.user_id.date_of_birth,
          cccd: data.unit.user_profile_id.cccd,
          user_id: data.unit.user_id._id,
        })

      } catch (error) {
        toast.error("Có lỗi khi fetch data")
      }
    }
    fetch();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const name = (target as any).name as keyof FormValues;
    const isCheckbox = (target as HTMLInputElement).type === "checkbox";
    const rawValue = isCheckbox
      ? (target as HTMLInputElement).checked
      : (target as any).value;

    setForm((prev) => {
      // Coerce specific fields
      if (name === "volumeOrWeight") {
        const num = typeof rawValue === "string" ? parseFloat(rawValue) : Number(rawValue);
        return { ...prev, volumeOrWeight: isNaN(num) ? 0 : num };
      }
      if (name === "irradiated") {
        return { ...prev, irradiated: Boolean(rawValue) };
      }
      return { ...prev, [name]: rawValue } as FormValues;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Health check submitted:", form);
    // You can redirect or send to backend here
  };

  async function saveField(): Promise<void> {
    try {
      await api.put(`/whole-blood/plasma/${bloodUnitId}`, {
        bloodGroupABO: form.bloodGroupABO,
        bloodGroupRh: form.bloodGroupRh,
        collectionDate: form.collectionDate ? new Date(form.collectionDate) : null,
        anticoagulantSolution: form.anticoagulantSolution,
        expiryDate: form.expiryDate ? new Date(form.expiryDate) : null,
        volumeOrWeight: form.volumeOrWeight,
        storageTemperature: form.storageTemperature,
        irradiated: form.irradiated,
        notes: form.notes,
      })

      const inputDate = new Date(form.expiryDate);
      const today = new Date();

      // Đặt giờ phút giây mili giây về 0 để so sánh theo ngày
      inputDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (inputDate <= today) {
        await api.put(`/whole-blood/plasma/${bloodUnitId}/expire`);
        toast.success("Đã dán nhãn hết hạn!")
      }
      toast.success("Đã lưu thành công!")
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu!")
    }
  }


  async function acceptForm(): Promise<void> {
    try {
      await api.put(`/whole-blood/plasma/${bloodUnitId}/donate`);
      toast.success("Dán nhãn hiến máu thành công!")
  router.push("/staff/dashboard/donation-requests");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi chấp nhận đơn khám!")
    }
  }

  async function rejectForm(): Promise<void> {
    try {
      await api.put(`/whole-blood/plasma/${bloodUnitId}/not-eligible`);
      toast.success("Dán nhãn không phù hợp thành công!")
  router.push("/staff/dashboard/donation-requests");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi chấp nhận đơn khám!")
    }
  }

  return (
    <div>
      <Header />


      <div className="max-w-2xl mx-auto p-6">
        {/* Card: Thông tin cá nhân */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông tin cá nhân người hiến máu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Họ tên:</strong> {form.name}</div>
            <div><strong>Email:</strong> {form.email}</div>
            <div><strong>Số điện thoại:</strong> {form.phone}</div>
            <div><strong>Số CCCD:</strong> {form.cccd}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Đơn vị máu {name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="timeSlot">Phân loại nhóm ABO</Label>
                    <Select
                      value={form.bloodGroupABO}
                      onValueChange={(value) => {
                        setForm((prev) => ({
                          ...prev,
                          bloodGroupABO: value as ABOType,
                        }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="VD: A, B" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key="A" value="A">
                          A
                        </SelectItem>
                        <SelectItem key="B" value="B">
                          B
                        </SelectItem>
                        <SelectItem key="AB" value="AB">
                          AB
                        </SelectItem>
                        <SelectItem key="O" value="O">
                          O
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="timeSlot">Phân loại Rh(D)</Label>
                    <Select
                      value={form.bloodGroupRh}
                      onValueChange={(value) => {
                        setForm((prev) => ({
                          ...prev,
                          bloodGroupRh: value as RhType,
                        }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="VD: +, -" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key="plus" value="+">
                          +
                        </SelectItem>
                        <SelectItem key="minus" value="-">
                          -
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="collectionDate">Ngày hiến máu</Label>
                    <Input name="collectionDate" type="date" value={form.collectionDate} onChange={handleChange} />
                  </div>
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
              </div>
              <div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                    <Input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} />
                  </div>
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="volumeOrWeight">Thể tích máu (ml)</Label>
                    <Input name="volumeOrWeight" type="number" value={form.volumeOrWeight} onChange={handleChange} />
                  </div>
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="storageTemperature">Nhiệt độ bảo quản (ví dụ: "2-6°C")</Label>
                    <Input name="storageTemperature" type="text" value={form.storageTemperature} onChange={handleChange} />
                  </div>
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
              </div>

              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="notes">Ghi chú nhãn túi máu</Label>
                    <Textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Label>
                  <Checkbox name="irradiated" checked={form.irradiated} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      irradiated: Boolean(checked),
                    }))
                  } />
                  Có chiếu xạ
                </Label>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <Button type="button" onClick={() => saveField()}>
                  Lưu
                </Button>
                <Button type="button" variant="destructive" onClick={() => rejectForm()}>
                  Không phù hợp truyền
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => acceptForm()}>
                  Chấp nhận
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-center" containerStyle={{
        top: 80,
      }} />
      <Footer />
    </div>
  );
}