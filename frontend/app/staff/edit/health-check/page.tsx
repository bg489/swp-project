"use client";

import { useState } from "react";
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

export default function HealthCheckFormPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    weight: "",
    systolic_bp: "",
    diastolic_bp: "",
    heart_rate: "",
    blood_volume_allowed: "",
    has_chronic_disease: false,
    is_pregnant: false,
    has_history_of_transplant: false,
    drug_use_violation: false,
    disability_severity: "none",
    infectious_disease: false,
    sexually_transmitted_disease: false,
    is_clinically_alert: true,
    abnormal_symptoms: "",
  });

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

  return (
    <div>
      <Header />
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Form kiểm tra sức khỏe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="weight">Cân nặng (kg)</Label>
                <Input name="weight" type="number" value={form.weight} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="systolic_bp">Huyết áp tâm thu</Label>
                <Input name="systolic_bp" type="number" value={form.systolic_bp} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="diastolic_bp">Huyết áp tâm trương</Label>
                <Input name="diastolic_bp" type="number" value={form.diastolic_bp} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="heart_rate">Nhịp tim (lần/phút)</Label>
                <Input name="heart_rate" type="number" value={form.heart_rate} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="blood_volume_allowed">Thể tích máu cho phép (ml)</Label>
                <Input name="blood_volume_allowed" type="number" value={form.blood_volume_allowed} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Label>
                  <Checkbox name="has_chronic_disease" checked={form.has_chronic_disease} onChange={handleChange} />
                  Có bệnh mãn tính
                </Label>
                <Label>
                  <Checkbox name="is_pregnant" checked={form.is_pregnant} onChange={handleChange} />
                  Đang mang thai
                </Label>
                <Label>
                  <Checkbox name="has_history_of_transplant" checked={form.has_history_of_transplant} onChange={handleChange} />
                  Có ghép tạng trong quá khứ
                </Label>
                <Label>
                  <Checkbox name="drug_use_violation" checked={form.drug_use_violation} onChange={handleChange} />
                  Sử dụng chất kích thích
                </Label>
                <Label>
                  <Checkbox name="infectious_disease" checked={form.infectious_disease} onChange={handleChange} />
                  Bệnh truyền nhiễm
                </Label>
                <Label>
                  <Checkbox name="sexually_transmitted_disease" checked={form.sexually_transmitted_disease} onChange={handleChange} />
                  Bệnh lây qua đường tình dục
                </Label>
                <Label>
                  <Checkbox name="is_clinically_alert" checked={form.is_clinically_alert} onChange={handleChange} />
                  Tỉnh táo về mặt lâm sàng
                </Label>
              </div>
              <div>
                <Label htmlFor="abnormal_symptoms">Triệu chứng bất thường</Label>
                <Textarea
                  name="abnormal_symptoms"
                  placeholder="Nhập các triệu chứng nếu có..."
                  value={form.abnormal_symptoms}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full">Gửi kết quả</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}