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
  // Default shelf life for whole blood units (days)
  const DEFAULT_SHELF_LIFE_DAYS = 35;

  // Helper: format Date to yyyy-mm-dd (local time)
  const formatYMD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Helper: add days (local time)
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  const [form, setForm] = useState({
  bloodGroupABO: "",
  bloodGroupRh: "",
    collectionDate: "",
    anticoagulantSolution: "",
    expiryDate: "",
    storageTemperature: "",
    irradiated: false,
    notes: "",
  volumeOrWeight: 250,
    name: "",
    email: "",
    phone: "",
    gender: "",
    birth: "",
    cccd: "",
    user_id: "",
    abnormalAntibodyDetected: false,
    hivPositive: false,
    hbvPositive: false,
    hcvPositive: false,
    syphilisPositive: false,
    malariaPositive: false,
    cmvPositive: false
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
        const response = await api.get(`/whole-blood/whole-blood-unit/${bloodUnitId}`);
        const data = response.data;
        const collectionDateStr = new Date(data.unit.collectionDate).toISOString().split("T")[0];
        const expiryDateStr = data.unit.expiryDate ? new Date(data.unit.expiryDate).toISOString().split("T")[0] : "";
        const computedExpiry = expiryDateStr || formatYMD(addDays(new Date(collectionDateStr), DEFAULT_SHELF_LIFE_DAYS));
        setForm({
          bloodGroupABO: data.unit.bloodGroupABO,
          bloodGroupRh: data.unit.bloodGroupRh,
          collectionDate: collectionDateStr,
          anticoagulantSolution: data.unit.anticoagulantSolution,
          expiryDate: computedExpiry,
          storageTemperature: data.unit.storageTemperature,
          irradiated: data.unit.irradiated,
          notes: data.unit.notes,
          // Policy: whole blood volume fixed at 250 ml
          volumeOrWeight: 250,
          name: data.unit.user_id.full_name,
          email: data.unit.user_id.email,
          phone: data.unit.user_id.phone,
          gender: data.unit.user_id.gender,
          birth: data.unit.user_id.date_of_birth,
          cccd: data.unit.user_profile_id.cccd,
          user_id: data.unit.user_id._id,
          abnormalAntibodyDetected: data.unit.abnormalAntibodyDetected,
          hivPositive: data.unit.hivPositive,
          hbvPositive: data.unit.hbvPositive,
          hcvPositive: data.unit.hcvPositive,
          syphilisPositive: data.unit.syphilisPositive,
          malariaPositive: data.unit.malariaPositive,
          cmvPositive: data.unit.cmvPositive
        })

      } catch (error) {
        toast.error("Có lỗi khi fetch data")
      }
    }
    fetch();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const type = (e.target as HTMLInputElement).type;
    if (name === "volumeOrWeight") {
      // Ensure number, clamp between 0 and 250 ml
      const num = Number(value);
      const safe = Number.isFinite(num) ? Math.max(0, Math.min(250, num)) : 0;
      setForm((prev) => ({ ...prev, volumeOrWeight: safe }));
      return;
    }
    if (name === "collectionDate") {
      // When donation date changes, auto-calc expiry date
      if (!value) {
        setForm((prev) => ({ ...prev, collectionDate: "", expiryDate: "" }));
        return;
      }
      // Parse yyyy-mm-dd in local time to avoid TZ shift
      const [y, m, d] = value.split("-").map(Number);
      const col = new Date(y, (m || 1) - 1, d || 1);
      const exp = addDays(col, DEFAULT_SHELF_LIFE_DAYS);
      setForm((prev) => ({ ...prev, collectionDate: value, expiryDate: formatYMD(exp) }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Health check submitted:", form);
    // You can redirect or send to backend here
  };

  async function saveField(): Promise<void> {
    try {
  // Force whole blood volume to fixed 250 ml
  const vol = 250;
      await api.put(`/whole-blood/whole-blood-unit/${bloodUnitId}`, {
        bloodGroupABO: form.bloodGroupABO,
        bloodGroupRh: form.bloodGroupRh,
        collectionDate: form.collectionDate ? new Date(form.collectionDate) : null,
        anticoagulantSolution: form.anticoagulantSolution,
        expiryDate: form.expiryDate ? new Date(form.expiryDate) : null,
        volumeOrWeight: vol,
        storageTemperature: form.storageTemperature,
        irradiated: form.irradiated,
        notes: form.notes,
        abnormalAntibodyDetected: form.abnormalAntibodyDetected,
        hivPositive: form.hivPositive,
        hbvPositive: form.hbvPositive,
        hcvPositive: form.hcvPositive,
        syphilisPositive: form.syphilisPositive,
        malariaPositive: form.malariaPositive,
        cmvPositive: form.cmvPositive
      })

      const inputDate = new Date(form.expiryDate);
      const today = new Date();

      // Đặt giờ phút giây mili giây về 0 để so sánh theo ngày
      inputDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (inputDate <= today) {
        await api.put(`/whole-blood/whole-blood-unit/${bloodUnitId}/expire`);
        toast.success("Đã dán nhãn hết hạn!")
      }
      toast.success("Đã lưu thành công!")
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu!")
    }
  }

  async function emailBloodTypeToUser() {
    try {
      const responseBoolean = await api.get(`/whole-blood/whole-blood-unit/${bloodUnitId}/check-blood-type`);
      if (responseBoolean.data.isComplete) {
        await api.get(`/whole-blood/whole-blood-unit/${bloodUnitId}/email-blood-type`);
        await api.put(`/users/user-profile/set-blood-type`, {
          user_id: form.user_id,
          blood_type: (form.bloodGroupABO || "") + (form.bloodGroupRh || ""),
        });
        toast.success("Đã gửi email thông tin nhóm máu cho người dùng");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi gửi mail cho user");
    }
  }


  async function acceptForm(): Promise<void> {
    try {
  // Enforce fixed volume of 250 ml before accept
  const vol = 250;
      await api.put(`/whole-blood/whole-blood-unit/${bloodUnitId}/donate`);
      toast.success("Dán nhãn hiến máu thành công!")
      emailBloodTypeToUser();
  router.push("/staff/dashboard/donation-requests");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi chấp nhận đơn khám!")
    }
  }

  async function rejectForm(): Promise<void> {
    try {
      await api.put(`/whole-blood/whole-blood-unit/${bloodUnitId}/not-eligible`);
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
            <div><strong>Giới tính:</strong> {getGenderLabel(form.gender)}</div>
            <div><strong>Ngày sinh:</strong> {formatDate(form.birth)}</div>
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
                          bloodGroupABO: value,
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
                          bloodGroupRh: value,
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
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="collectionDate">Ngày hiến máu</Label>
                    <Input name="collectionDate" type="date" value={form.collectionDate} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="anticoagulantSolution">Tên dung dịch chống đông, bảo quản (nếu có)</Label>
                    <Input name="anticoagulantSolution" type="text" value={form.anticoagulantSolution} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                    <Input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="volumeOrWeight">Thể tích máu (ml) — cố định 250 ml</Label>
                    <Input
                      name="volumeOrWeight"
                      type="number"
                      value={form.volumeOrWeight}
                      onChange={handleChange}
                      min={0}
                      max={250}
                      step={1}
                      placeholder="Ví dụ: 250"
                      readOnly
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="storageTemperature">Nhiệt độ bảo quản (ví dụ: "2-6°C")</Label>
                    <Input name="storageTemperature" type="text" value={form.storageTemperature} onChange={handleChange} />
                  </div>
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

                <Label>
                  <Checkbox name="abnormalAntibodyDetected" checked={form.abnormalAntibodyDetected} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      abnormalAntibodyDetected: Boolean(checked),
                    }))
                  } />
                  Phát hiện kháng thể bất thường
                </Label>

                <Label>
                  <Checkbox name="hivPositive" checked={form.hivPositive} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      hivPositive: Boolean(checked),
                    }))
                  } />
                  Dương tính HIV
                </Label>

                <Label>
                  <Checkbox name="hbvPositive" checked={form.hbvPositive} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      hbvPositive: Boolean(checked),
                    }))
                  } />
                  Dương tính viêm gan B
                </Label>

                <Label>
                  <Checkbox name="hcvPositive" checked={form.hcvPositive} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      hcvPositive: Boolean(checked),
                    }))
                  } />
                  Dương tính viêm gan C
                </Label>

                <Label>
                  <Checkbox name="syphilisPositive" checked={form.syphilisPositive} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      syphilisPositive: Boolean(checked),
                    }))
                  } />
                  Dương tính giang mai
                </Label>

                <Label>
                  <Checkbox name="malariaPositive" checked={form.malariaPositive} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      malariaPositive: Boolean(checked),
                    }))
                  } />
                  Dương tính sốt rét
                </Label>

                <Label>
                  <Checkbox name="cmvPositive" checked={form.cmvPositive} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      cmvPositive: Boolean(checked),
                    }))
                  } />
                  Dương tính CMV (Cytomegalovirus – vi rút gây nhiễm trùng tế bào)
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