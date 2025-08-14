"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios";

export default function HealthCheckFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const healthCheck = searchParams.get("healthCheck") || "";
  const name = searchParams.get("name") || "";

  const [loading, setLoading] = useState(true);
  const [missingParam, setMissingParam] = useState(false);

  const [form, setForm] = useState({
  createdAt: "",
    weight: 0,
    systolic_bp: 0,
    diastolic_bp: 0,
    heart_rate: 0,
    blood_volume_allowed: 0,
  has_collected_blood: false,
    has_chronic_disease: false,
    is_pregnant: false,
    has_history_of_transplant: false,
    drug_use_violation: false,
    disability_severity: "none",
    infectious_disease: false,
    sexually_transmitted_disease: false,
    is_clinically_alert: true,
    abnormal_symptoms: "",
    can_donate_whole_blood: false,
    donor_feeling_healthy: false,
    last_donation_date: false,
    has_cardiovascular_disease: false,
    has_liver_disease: false,
    has_kidney_disease: false,
    has_endocrine_disorder: false,
    has_tuberculosis_or_respiratory_disease: false,
    has_blood_disease: false,
    has_mental_or_neurological_disorder: false,
    has_malaria: false,
    has_syphilis: false,
    has_hiv_or_aids: false,
    has_other_transmissible_diseases: false,
    has_surgical_or_medical_history: false,
    exposure_to_blood_or_body_fluids: false,
    received_vaccine_or_biologics: false,
    tattoo_or_organ_transplant: false,
    has_unexplained_weight_loss: false,
    has_night_sweats: false,
    has_skin_or_mucosal_tumors: false,
    has_enlarged_lymph_nodes: false,
    has_digestive_disorder: false,
    has_fever_over_37_5_long: false,
    uses_illegal_drugs: false,
    has_sexual_contact_with_risk_person: false,
    has_infant_under_12_months: false,
    declaration_understood_questions: false,
    declaration_feels_healthy: false,
    declaration_voluntary: false,
    declaration_will_report_if_risk_found: false,
    has_taken_medicine_last_week: false,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        if (!healthCheck) {
          setMissingParam(true);
          return;
        }
        const response = await api.get(`/health-check/healthcheck/${healthCheck}`);
        const data = response.data?.healthCheck || {};
        setForm((prev) => ({
          ...prev,
          createdAt: data.createdAt ?? "",
          weight: data.weight ?? 0,
          systolic_bp: data.systolic_bp ?? 0,
          diastolic_bp: data.diastolic_bp ?? 0,
          heart_rate: data.heart_rate ?? 0,
          blood_volume_allowed: data.blood_volume_allowed ?? 0,
          has_collected_blood: !!data.has_collected_blood,
          has_chronic_disease: !!data.has_chronic_disease,
          is_pregnant: !!data.is_pregnant,
          has_history_of_transplant: !!data.has_history_of_transplant,
          drug_use_violation: !!data.drug_use_violation,
          disability_severity: data.disability_severity ?? "none",
          infectious_disease: !!data.infectious_disease,
          sexually_transmitted_disease: !!data.sexually_transmitted_disease,
          is_clinically_alert: data.is_clinically_alert ?? true,
          abnormal_symptoms: Array.isArray(data.abnormal_symptoms) ? data.abnormal_symptoms.join(", ") : (data.abnormal_symptoms ?? ""),
          can_donate_whole_blood: !!data.can_donate_whole_blood,
          donor_feeling_healthy: !!data.donor_feeling_healthy,
          last_donation_date: !!data.last_donation_date,
          has_cardiovascular_disease: !!data.has_cardiovascular_disease,
          has_liver_disease: !!data.has_liver_disease,
          has_kidney_disease: !!data.has_kidney_disease,
          has_endocrine_disorder: !!data.has_endocrine_disorder,
          has_tuberculosis_or_respiratory_disease: !!data.has_tuberculosis_or_respiratory_disease,
          has_blood_disease: !!data.has_blood_disease,
          has_mental_or_neurological_disorder: !!data.has_mental_or_neurological_disorder,
          has_malaria: !!data.has_malaria,
          has_syphilis: !!data.has_syphilis,
          has_hiv_or_aids: !!data.has_hiv_or_aids,
          has_other_transmissible_diseases: !!data.has_other_transmissible_diseases,
          has_surgical_or_medical_history: !!data.has_surgical_or_medical_history,
          exposure_to_blood_or_body_fluids: !!data.exposure_to_blood_or_body_fluids,
          received_vaccine_or_biologics: !!data.received_vaccine_or_biologics,
          tattoo_or_organ_transplant: !!data.tattoo_or_organ_transplant,
          has_unexplained_weight_loss: !!data.has_unexplained_weight_loss,
          has_night_sweats: !!data.has_night_sweats,
          has_skin_or_mucosal_tumors: !!data.has_skin_or_mucosal_tumors,
          has_enlarged_lymph_nodes: !!data.has_enlarged_lymph_nodes,
          has_digestive_disorder: !!data.has_digestive_disorder,
          has_fever_over_37_5_long: !!data.has_fever_over_37_5_long,
          uses_illegal_drugs: !!data.uses_illegal_drugs,
          has_sexual_contact_with_risk_person: !!data.has_sexual_contact_with_risk_person,
          has_infant_under_12_months: !!data.has_infant_under_12_months,
          declaration_understood_questions: !!data.declaration_understood_questions,
          declaration_feels_healthy: !!data.declaration_feels_healthy,
          declaration_voluntary: !!data.declaration_voluntary,
          declaration_will_report_if_risk_found: !!data.declaration_will_report_if_risk_found,
          has_taken_medicine_last_week: !!data.has_taken_medicine_last_week,
        }));
      } catch (err) {
        toast.error("Có lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [healthCheck]);

  useEffect(() => {
    // Fixed policy: whole blood allowable volume is 250 ml
    setForm((p) => ({ ...p, blood_volume_allowed: 250 }));
  }, [form.weight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const name = target.name as keyof typeof form as string;
    const type = (target as HTMLInputElement).type;
    const isCheckbox = type === "checkbox";
    const isNumber = type === "number";
    const value = isCheckbox ? (target as HTMLInputElement).checked : target.value;
    setForm((prev) => ({
      ...prev,
      [name]: isCheckbox ? Boolean(value) : isNumber ? Number(value) : value,
    }));
  };

  async function saveField() {
    try {
      // Normalize fields to match backend schema
      const allowedSeverities = new Set(["none", "mild", "severe", "extreme"]);
      const severity = allowedSeverities.has(form.disability_severity as any)
        ? form.disability_severity
        : "none";

      const symptomsArray = typeof form.abnormal_symptoms === "string"
        ? form.abnormal_symptoms
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            // Without a mapping table, restrict to empty array to satisfy enum validation
            .map(() => "none")
            .filter(() => false) // results in []
        : Array.isArray(form.abnormal_symptoms) ? form.abnormal_symptoms : [];

      const payload = {
        ...form,
        disability_severity: severity,
        abnormal_symptoms: symptomsArray,
      } as const;

      await api.put(`/health-check/health-check/${healthCheck}`, payload);
      toast.success("Đã lưu thành công!");
    } catch (err) {
  const anyErr = err as any;
  const msg = anyErr?.response?.data?.message || "Có lỗi xảy ra khi lưu!";
  console.error("Save health check failed:", anyErr?.response?.data || anyErr);
  toast.error(msg);
    }
  }

  async function rejectForm() {
    try {
      await api.put(`/health-check/health-check/${healthCheck}/fail`);
      toast.success("Từ chối thành công!");
  router.push("/staff/dashboard/donation-requests");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi từ chối đơn khám!");
    }
  }

  async function acceptForm() {
    if (!form.declaration_understood_questions || !form.declaration_feels_healthy || !form.declaration_voluntary || !form.declaration_will_report_if_risk_found) {
      toast.error("Vui lòng cam đoan tất cả trước khi chấp nhận");
      return;
    }
    try {
      await api.put(`/health-check/health-check/${healthCheck}/pass`);
      toast.success("Chấp nhận thành công!");
  router.push("/staff/dashboard/donation-requests");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi chấp nhận đơn khám!");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto p-4 w-full max-w-6xl flex-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Khám sức khỏe hiến máu toàn phần{name ? ` - ${name}` : ""}</CardTitle>
            {form.createdAt ? (
              <p className="text-sm text-muted-foreground mt-1">
                Ngày khám: {new Date(form.createdAt).toLocaleString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" })}
              </p>
            ) : null}
          </CardHeader>
          <CardContent>
            {missingParam ? (
              <div className="py-8">
                <p className="text-sm text-muted-foreground mb-4">Thiếu tham số healthCheck. Hãy mở trang từ bảng điều khiển.</p>
                <Button onClick={() => router.push("/staff/dashboard")}>Quay lại bảng điều khiển</Button>
              </div>
            ) : loading ? (
              <div className="py-8 text-sm text-muted-foreground">Đang tải dữ liệu...</div>
            ) : (
            <form onSubmit={(e) => { e.preventDefault(); acceptForm(); }} className="space-y-6">
              <section>
                <h2 className="text-lg font-semibold mb-3">Thông tin cơ bản</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="weight">Cân nặng (kg)</Label>
                    <Input id="weight" name="weight" type="number" value={form.weight} onChange={handleChange} min={0} />
                    <p className="text-sm text-muted-foreground mt-1">Lớn hơn 42 kg đối với phụ nữ, 45 kg đối với nam giới</p>
                  </div>
                  <div>
                    <Label htmlFor="systolic_bp">Huyết áp tâm thu</Label>
                    <Input id="systolic_bp" name="systolic_bp" type="number" value={form.systolic_bp} onChange={handleChange} min={0} />
                    <p className="text-sm text-muted-foreground mt-1">Từ 100 mmHg đến dưới 160 mmHg</p>
                  </div>
                  <div>
                    <Label htmlFor="diastolic_bp">Huyết áp tâm trương</Label>
                    <Input id="diastolic_bp" name="diastolic_bp" type="number" value={form.diastolic_bp} onChange={handleChange} min={0} />
                    <p className="text-sm text-muted-foreground mt-1">Từ 60 mmHg đến dưới 100 mmHg</p>
                  </div>
                  <div>
                    <Label htmlFor="heart_rate">Nhịp tim</Label>
                    <Input id="heart_rate" name="heart_rate" type="number" value={form.heart_rate} onChange={handleChange} min={0} />
                    <p className="text-sm text-muted-foreground mt-1">Tần số trong khoảng từ 60 lần đến 90 lần/phút</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="can_donate_whole_blood" checked={form.can_donate_whole_blood} onCheckedChange={(c) => setForm((p) => ({ ...p, can_donate_whole_blood: Boolean(c) }))} />
                    <Label htmlFor="can_donate_whole_blood">Đủ điều kiện hiến máu toàn phần</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="has_collected_blood" checked={form.has_collected_blood} onCheckedChange={(c) => setForm((p) => ({ ...p, has_collected_blood: Boolean(c) }))} />
                    <Label htmlFor="has_collected_blood">Đã lấy máu</Label>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="abnormal_symptoms">Triệu chứng bất thường (nếu có)</Label>
                  <Textarea id="abnormal_symptoms" name="abnormal_symptoms" value={form.abnormal_symptoms} onChange={handleChange} placeholder="Nhập triệu chứng, cách nhau bởi dấu phẩy" />
                </div>
                <div className="mt-4 max-w-xs">
                  <Label>Mức độ khuyết tật</Label>
                  <Select value={form.disability_severity} onValueChange={(v) => setForm((p) => ({ ...p, disability_severity: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mức độ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không</SelectItem>
                      <SelectItem value="mild">Nhẹ</SelectItem>
                      <SelectItem value="severe">Nặng</SelectItem>
                      <SelectItem value="extreme">Rất nặng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">Tình trạng bệnh/khả năng hiến</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_chronic_disease" checked={form.has_chronic_disease} onCheckedChange={(c) => setForm((p) => ({ ...p, has_chronic_disease: Boolean(c) }))} />
                    Có bệnh mãn tính
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="is_pregnant" checked={form.is_pregnant} onCheckedChange={(c) => setForm((p) => ({ ...p, is_pregnant: Boolean(c) }))} />
                    Đang mang thai
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_history_of_transplant" checked={form.has_history_of_transplant} onCheckedChange={(c) => setForm((p) => ({ ...p, has_history_of_transplant: Boolean(c) }))} />
                    Có ghép tạng trong quá khứ
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="drug_use_violation" checked={form.drug_use_violation} onCheckedChange={(c) => setForm((p) => ({ ...p, drug_use_violation: Boolean(c) }))} />
                    Sử dụng chất kích thích
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="infectious_disease" checked={form.infectious_disease} onCheckedChange={(c) => setForm((p) => ({ ...p, infectious_disease: Boolean(c) }))} />
                    Bệnh truyền nhiễm
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="sexually_transmitted_disease" checked={form.sexually_transmitted_disease} onCheckedChange={(c) => setForm((p) => ({ ...p, sexually_transmitted_disease: Boolean(c) }))} />
                    Bệnh lây qua đường tình dục
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="is_clinically_alert" checked={form.is_clinically_alert} onCheckedChange={(c) => setForm((p) => ({ ...p, is_clinically_alert: Boolean(c) }))} />
                    Tỉnh táo về mặt lâm sàng
                  </Label>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">Khám và tư vấn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label className="flex items-center gap-2">
                    <Checkbox name="donor_feeling_healthy" checked={form.donor_feeling_healthy} onCheckedChange={(c) => setForm((p) => ({ ...p, donor_feeling_healthy: Boolean(c) }))} />
                    Người hiến tự cảm thấy khỏe
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="last_donation_date" checked={form.last_donation_date} onCheckedChange={(c) => setForm((p) => ({ ...p, last_donation_date: Boolean(c) }))} />
                    Lần hiến máu gần đây dưới 12 tuần
                  </Label>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">Tiền sử sức khoẻ chung và bệnh tật</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_cardiovascular_disease" checked={form.has_cardiovascular_disease} onCheckedChange={(c) => setForm((p) => ({ ...p, has_cardiovascular_disease: Boolean(c) }))} />
                    Mắc bệnh tim mạch
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_liver_disease" checked={form.has_liver_disease} onCheckedChange={(c) => setForm((p) => ({ ...p, has_liver_disease: Boolean(c) }))} />
                    Mắc bệnh gan
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_kidney_disease" checked={form.has_kidney_disease} onCheckedChange={(c) => setForm((p) => ({ ...p, has_kidney_disease: Boolean(c) }))} />
                    Mắc bệnh thận
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_endocrine_disorder" checked={form.has_endocrine_disorder} onCheckedChange={(c) => setForm((p) => ({ ...p, has_endocrine_disorder: Boolean(c) }))} />
                    Rối loạn nội tiết
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_tuberculosis_or_respiratory_disease" checked={form.has_tuberculosis_or_respiratory_disease} onCheckedChange={(c) => setForm((p) => ({ ...p, has_tuberculosis_or_respiratory_disease: Boolean(c) }))} />
                    Mắc bệnh lao hoặc bệnh đường hô hấp
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_blood_disease" checked={form.has_blood_disease} onCheckedChange={(c) => setForm((p) => ({ ...p, has_blood_disease: Boolean(c) }))} />
                    Mắc bệnh máu
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_mental_or_neurological_disorder" checked={form.has_mental_or_neurological_disorder} onCheckedChange={(c) => setForm((p) => ({ ...p, has_mental_or_neurological_disorder: Boolean(c) }))} />
                    Rối loạn tâm thần hoặc thần kinh
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_malaria" checked={form.has_malaria} onCheckedChange={(c) => setForm((p) => ({ ...p, has_malaria: Boolean(c) }))} />
                    Mắc bệnh sốt rét
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_syphilis" checked={form.has_syphilis} onCheckedChange={(c) => setForm((p) => ({ ...p, has_syphilis: Boolean(c) }))} />
                    Mắc bệnh giang mai
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_hiv_or_aids" checked={form.has_hiv_or_aids} onCheckedChange={(c) => setForm((p) => ({ ...p, has_hiv_or_aids: Boolean(c) }))} />
                    Mắc HIV hoặc AIDS
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_other_transmissible_diseases" checked={form.has_other_transmissible_diseases} onCheckedChange={(c) => setForm((p) => ({ ...p, has_other_transmissible_diseases: Boolean(c) }))} />
                    Mắc các bệnh truyền nhiễm khác
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_surgical_or_medical_history" checked={form.has_surgical_or_medical_history} onCheckedChange={(c) => setForm((p) => ({ ...p, has_surgical_or_medical_history: Boolean(c) }))} />
                    Có tiền sử phẫu thuật hoặc bệnh lý
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="exposure_to_blood_or_body_fluids" checked={form.exposure_to_blood_or_body_fluids} onCheckedChange={(c) => setForm((p) => ({ ...p, exposure_to_blood_or_body_fluids: Boolean(c) }))} />
                    Tiếp xúc với máu hoặc dịch cơ thể của người khác
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="received_vaccine_or_biologics" checked={form.received_vaccine_or_biologics} onCheckedChange={(c) => setForm((p) => ({ ...p, received_vaccine_or_biologics: Boolean(c) }))} />
                    Đã tiêm vắc xin hoặc sử dụng chế phẩm sinh học (biologics) trong thời gian gần đây
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="tattoo_or_organ_transplant" checked={form.tattoo_or_organ_transplant} onCheckedChange={(c) => setForm((p) => ({ ...p, tattoo_or_organ_transplant: Boolean(c) }))} />
                    Có xăm hình hoặc đã từng ghép tạng
                  </Label>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">Các biểu hiện bất thường bệnh lý</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_unexplained_weight_loss" checked={form.has_unexplained_weight_loss} onCheckedChange={(c) => setForm((p) => ({ ...p, has_unexplained_weight_loss: Boolean(c) }))} />
                    Bị sụt cân không rõ nguyên nhân
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_night_sweats" checked={form.has_night_sweats} onCheckedChange={(c) => setForm((p) => ({ ...p, has_night_sweats: Boolean(c) }))} />
                    Đổ mồ hôi về đêm
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_skin_or_mucosal_tumors" checked={form.has_skin_or_mucosal_tumors} onCheckedChange={(c) => setForm((p) => ({ ...p, has_skin_or_mucosal_tumors: Boolean(c) }))} />
                    Có u bướu ở da hoặc niêm mạc
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_enlarged_lymph_nodes" checked={form.has_enlarged_lymph_nodes} onCheckedChange={(c) => setForm((p) => ({ ...p, has_enlarged_lymph_nodes: Boolean(c) }))} />
                    Có hạch to bất thường
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_digestive_disorder" checked={form.has_digestive_disorder} onCheckedChange={(c) => setForm((p) => ({ ...p, has_digestive_disorder: Boolean(c) }))} />
                    Rối loạn tiêu hóa
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_fever_over_37_5_long" checked={form.has_fever_over_37_5_long} onCheckedChange={(c) => setForm((p) => ({ ...p, has_fever_over_37_5_long: Boolean(c) }))} />
                    Sốt trên 37.5°C kéo dài
                  </Label>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">Hành vi rủi ro</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label className="flex items-center gap-2">
                    <Checkbox name="uses_illegal_drugs" checked={form.uses_illegal_drugs} onCheckedChange={(c) => setForm((p) => ({ ...p, uses_illegal_drugs: Boolean(c) }))} />
                    Sử dụng ma túy bất hợp pháp
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_sexual_contact_with_risk_person" checked={form.has_sexual_contact_with_risk_person} onCheckedChange={(c) => setForm((p) => ({ ...p, has_sexual_contact_with_risk_person: Boolean(c) }))} />
                    Có quan hệ tình dục với người có nguy cơ cao (như mại dâm, nghiện, HIV...)
                  </Label>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">Sau sinh</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_infant_under_12_months" checked={form.has_infant_under_12_months} onCheckedChange={(c) => setForm((p) => ({ ...p, has_infant_under_12_months: Boolean(c) }))} />
                    Đang nuôi con dưới 12 tháng tuổi
                  </Label>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">Tiền sử sử dụng thuốc</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label className="flex items-center gap-2">
                    <Checkbox name="has_taken_medicine_last_week" checked={form.has_taken_medicine_last_week} onCheckedChange={(c) => setForm((p) => ({ ...p, has_taken_medicine_last_week: Boolean(c) }))} />
                    Đã dùng thuốc trong tuần vừa qua
                  </Label>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">Lời cam đoan của người hiến máu</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label className="flex items-center gap-2">
                    <Checkbox name="declaration_understood_questions" checked={form.declaration_understood_questions} onCheckedChange={(c) => setForm((p) => ({ ...p, declaration_understood_questions: Boolean(c) }))} />
                    Tôi đã hiểu rõ các câu hỏi trong phiếu sàng lọc
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="declaration_feels_healthy" checked={form.declaration_feels_healthy} onCheckedChange={(c) => setForm((p) => ({ ...p, declaration_feels_healthy: Boolean(c) }))} />
                    Tôi hiện cảm thấy khỏe mạnh
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="declaration_voluntary" checked={form.declaration_voluntary} onCheckedChange={(c) => setForm((p) => ({ ...p, declaration_voluntary: Boolean(c) }))} />
                    Tôi tự nguyện tham gia hiến máu
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Checkbox name="declaration_will_report_if_risk_found" checked={form.declaration_will_report_if_risk_found} onCheckedChange={(c) => setForm((p) => ({ ...p, declaration_will_report_if_risk_found: Boolean(c) }))} />
                    Tôi cam kết sẽ thông báo nếu phát hiện có yếu tố nguy cơ trước hoặc sau hiến máu
                  </Label>
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <Button type="button" onClick={saveField}>Lưu</Button>
                <Button type="button" variant="destructive" onClick={rejectForm}>Từ chối</Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Chấp nhận</Button>
              </div>
            </form>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-center" containerStyle={{ top: 80 }} />
      <Footer />
    </div>
  );
}