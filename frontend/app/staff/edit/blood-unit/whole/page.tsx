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

// Form state typing for safety
type FormState = {
  bloodGroupABO?: string;
  bloodGroupRh?: string;
  collectionDate: string; // yyyy-mm-dd
  anticoagulantSolution: string;
  expiryDate: string; // yyyy-mm-dd
  storageTemperature: string;
  irradiated: boolean;
  notes: string;
  volumeOrWeight: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  birth: string; // ISO or date string
  cccd: string;
  user_id: string;
  abnormalAntibodyDetected: boolean;
  hivPositive: boolean;
  hbvPositive: boolean;
  hcvPositive: boolean;
  syphilisPositive: boolean;
  malariaPositive: boolean;
  cmvPositive: boolean;
};

export default function HealthCheckFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams()
  const bloodUnitId = searchParams.get("bloodUnitId") || ""
  const name = searchParams.get("name") || ""
  const [form, setForm] = useState<FormState>({
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
    abnormalAntibodyDetected: false,
    hivPositive: false,
    hbvPositive: false,
    hcvPositive: false,
    syphilisPositive: false,
    malariaPositive: false,
    cmvPositive: false,
  });

  function getGenderLabel(gender: string) {
    if (gender === "male") return "Nam";
    if (gender === "female") return "Nữ";
    return "Khác";
  }


  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng tính từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    async function fetchData() {
      if (!bloodUnitId) return; // nothing to load
      try {
        const response = await api.get(`/whole-blood/whole-blood-unit/${bloodUnitId}`);
        const data = response.data;
        const unit = data?.unit ?? {};
        const user = unit?.user_id ?? {};
        const profile = unit?.user_profile_id ?? {};

        setForm({
          bloodGroupABO: unit.bloodGroupABO,
          bloodGroupRh: unit.bloodGroupRh,
          collectionDate: unit.collectionDate ? new Date(unit.collectionDate).toISOString().split("T")[0] : "",
          anticoagulantSolution: unit.anticoagulantSolution ?? "",
          expiryDate: unit.expiryDate ? new Date(unit.expiryDate).toISOString().split("T")[0] : "",
          storageTemperature: unit.storageTemperature ?? "",
          irradiated: Boolean(unit.irradiated),
          notes: unit.notes ?? "",
          volumeOrWeight: Number(unit.volumeOrWeight ?? 0),
          name: user.full_name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          gender: user.gender ?? "",
          birth: user.date_of_birth ?? "",
          cccd: profile.cccd ?? "",
          user_id: user._id ?? "",
          abnormalAntibodyDetected: Boolean(unit.abnormalAntibodyDetected),
          hivPositive: Boolean(unit.hivPositive),
          hbvPositive: Boolean(unit.hbvPositive),
          hcvPositive: Boolean(unit.hcvPositive),
          syphilisPositive: Boolean(unit.syphilisPositive),
          malariaPositive: Boolean(unit.malariaPositive),
          cmvPositive: Boolean(unit.cmvPositive),
        });
      } catch (error) {
        toast.error("Có lỗi khi fetch data");
      }
    }
    fetchData();
  }, [bloodUnitId]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      // Only text/date fields handled here
      [name]: value,
    } as FormState));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const num = value === "" ? 0 : Number(value);
    setForm((prev) => ({
      ...prev,
      [name]: isNaN(num) ? 0 : num,
    } as FormState));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Health check submitted:", form);
    // You can redirect or send to backend here
  };

  async function saveField(): Promise<void> {
    try {
      await api.put(`/whole-blood/whole-blood-unit/${bloodUnitId}`, {
        bloodGroupABO: form.bloodGroupABO,
        bloodGroupRh: form.bloodGroupRh,
        collectionDate: form.collectionDate ? new Date(form.collectionDate) : null,
        anticoagulantSolution: form.anticoagulantSolution,
        expiryDate: form.expiryDate ? new Date(form.expiryDate) : null,
        volumeOrWeight: form.volumeOrWeight,
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

      if (form.expiryDate) {
        const inputDate = new Date(form.expiryDate);
        const today = new Date();
        // Đặt giờ phút giây mili giây về 0 để so sánh theo ngày
        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        if (!isNaN(inputDate.getTime()) && inputDate <= today) {
          await api.put(`/whole-blood/whole-blood-unit/${bloodUnitId}/expire`);
          toast.success("Đã dán nhãn hết hạn!");
        }
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
        const blood_type = `${form.bloodGroupABO ?? ""}${form.bloodGroupRh ?? ""}`;
        await api.put(`/users/user-profile/set-blood-type`, {
          user_id: form.user_id,
          blood_type,
        });
        toast.success("Đã gửi email thông tin nhóm máu cho người dùng");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi gửi mail cho user");
    }
  }


  async function acceptForm(): Promise<void> {
    try {
      await api.put(`/whole-blood/whole-blood-unit/${bloodUnitId}/donate`);
      toast.success("Dán nhãn hiến máu thành công!")
      await emailBloodTypeToUser();
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
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="anticoagulantSolution">Tên dung dịch chống đông, bảo quản (nếu có)</Label>
                    <Input name="anticoagulantSolution" type="text" value={form.anticoagulantSolution} onChange={handleChange} />
                  </div>
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
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
                    <Input name="volumeOrWeight" type="number" value={form.volumeOrWeight} onChange={handleNumberChange} />
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