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
  const bloodTestId = searchParams.get("bloodTestId") || ""
  const name = searchParams.get("name") || ""
  const separated_component = searchParams.get("separated_component")?.split(",") || ""
  const [form, setForm] = useState({
    HBsAg: false,
    hemoglobin: 0,
    total_protein: 0,
    platelet_count: ""
  });

  useEffect(() => {
    async function fetch() {
      try {
        const response = await api.get(`/blood-test/blood-test/${bloodTestId}`);
        const data = response.data;
        setForm({
          HBsAg: data.HBsAg,
          hemoglobin: data.hemoglobin,
          total_protein: data.total_protein,
          platelet_count: data.platelet_count,
        })
      } catch (error) {
        toast.error("Có lỗi khi fetch data")
      }
    }
    fetch();
  }, []);

  // Tính thể tích máu được hiến dựa vào cân nặng
  const symptoms = [
    { value: "none", label: "Không có" },
    { value: "rapid_weight_loss", label: "Sụt cân nhanh" },
    { value: "pale_skin", label: "Da nhợt nhạt" },
    { value: "dizziness", label: "Chóng mặt" },
    { value: "sweating", label: "Đổ mồ hôi" },
    { value: "swollen_lymph_nodes", label: "Sưng hạch bạch huyết" },
    { value: "fever", label: "Sốt" },
    { value: "edema", label: "Phù" },
    { value: "cough", label: "Ho" },
    { value: "dyspnea", label: "Khó thở" },
    { value: "diarrhea", label: "Tiêu chảy" },
    { value: "bleeding", label: "Chảy máu" },
    { value: "skin_abnormalities", label: "Bất thường da" },
  ];


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Health check submitted:", form);
    // You can redirect or send to backend here
  };

  async function saveField(): Promise<void> {
    try {
      await api.put(`/blood-test/blood-test/${bloodTestId}`, {
        HBsAg: form.HBsAg,
        hemoglobin: Number(form.hemoglobin)
      })

      await api.put(`/blood-test/blood-test/update-values/${bloodTestId}`, {
        total_protein: Number(form.total_protein),
        platelet_count: form.platelet_count
      })
      toast.success("Đã lưu thành công!")
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu!")
    }
  }

  async function rejectForm(): Promise<void> {
    try {
      await api.put(`/blood-test/blood-test/${bloodTestId}/fail`);
      toast.success("Từ chối thành công!")
      router.push("/staff/dashboard");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi từ chối đơn khám!")
    }
  }

  async function acceptForm(): Promise<void> {
    try {

      const response = await api.put(`/blood-test/blood-test/${bloodTestId}/pass`);
      if (separated_component.includes("RBC")) {
        const response2 = await api.post(`/whole-blood/red-blood-cell/create`, {
          user_id: response.data.bloodTest.user_id,
          user_profile_id: response.data.bloodTest.user_profile_id,
          hospital_id: response.data.bloodTest.hospital_id,
          volumeOrWeight: response.data.blood_volume_allowed / separated_component.length
        });



        const now = new Date();
        now.setMonth(now.getMonth() + 2);
        await api.put(`/whole-blood/red-blood-cell/${response2.data.unit._id}`, {
          bloodGroupABO: undefined,
          bloodGroupRh: undefined,
          collectionDate: Date.now(),
          expiryDate: now,
          storageTemperature: "",
          irradiated: false,
          notes: "",
        })
      }




      if (separated_component.includes("plasma")) {
        const response2 = await api.post(`/whole-blood/plasma/create`, {
          user_id: response.data.bloodTest.user_id,
          user_profile_id: response.data.bloodTest.user_profile_id,
          hospital_id: response.data.bloodTest.hospital_id,
          volumeOrWeight: response.data.blood_volume_allowed / separated_component.length
        });



        const now = new Date();
        now.setMonth(now.getMonth() + 2);
        await api.put(`/whole-blood/plasma/${response2.data.unit._id}`, {
          bloodGroupABO: undefined,
          bloodGroupRh: undefined,
          collectionDate: Date.now(),
          expiryDate: now,
          storageTemperature: "",
          irradiated: false,
          notes: "",
        })
      }

      if (separated_component.includes("platelet")) {
        const response2 = await api.post(`/whole-blood/platelet/create`, {
          user_id: response.data.bloodTest.user_id,
          user_profile_id: response.data.bloodTest.user_profile_id,
          hospital_id: response.data.bloodTest.hospital_id,
          volumeOrWeight: response.data.blood_volume_allowed / separated_component.length
        });

        const now = new Date();
        now.setMonth(now.getMonth() + 2);
        await api.put(`/whole-blood/platelet/${response2.data.unit._id}`, {
          bloodGroupABO: undefined,
          bloodGroupRh: undefined,
          collectionDate: Date.now(),
          expiryDate: now,
          storageTemperature: "",
          irradiated: false,
          notes: "",
        })
      }



      toast.success("Chấp nhận thành công!")
      router.push("/staff/dashboard");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi chấp nhận đơn khám!")
    }
  }

  return (
    <div>
      <Header />
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Form xét nghiệm máu của {name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="hemoglobin">Huyết sắc tố (Trên 120g/l)</Label>
                    <Input name="hemoglobin" type="number" value={form.hemoglobin} onChange={handleChange} />
                  </div>
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
              </div>
              {separated_component.includes("plasma") &&
                <div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="total_protein">Protein huyết thanh toàn phần (Trên 60g/l)</Label>
                      <Input name="total_protein" type="number" value={form.total_protein} onChange={handleChange} />
                    </div>
                    <Button type="button" onClick={() => saveField()} className="mt-6">
                      Lưu
                    </Button>
                  </div>
                </div>
              }
              {separated_component.includes("platelet") &&
                <div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="platelet_count">Số lượng tiểu cầu (150x10^9/l)</Label>
                      <Input name="platelet_count" type="text" value={form.platelet_count} onChange={handleChange} />
                    </div>
                    <Button type="button" onClick={() => saveField()} className="mt-6">
                      Lưu
                    </Button>
                  </div>
                </div>
              }
              <div className="grid grid-cols-2 gap-4">
                <Label>
                  <Checkbox name="HBsAg" checked={form.HBsAg} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      HBsAg: Boolean(checked),
                    }))
                  } />
                  Xét nghiệm nhanh HBsAg bị dương tính
                </Label>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <Button type="button" onClick={() => saveField()}>
                  Lưu
                </Button>
                <Button type="button" variant="destructive" onClick={() => rejectForm()}>
                  Từ chối
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
    </div >
  );
}