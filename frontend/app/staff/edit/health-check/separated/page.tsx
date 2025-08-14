"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    separated_component: [] as any[],
  });

  useEffect(() => {
    async function fetch() {
      try {
        if (!healthCheck) {
          setMissingParam(true);
          return;
        }
        const response = await api.get(`/health-check/healthcheck/${healthCheck}`);
        const data = response.data;
        setForm((prev) => ({
          ...prev,
          createdAt: data.healthCheck?.createdAt || "",
          weight: data.healthCheck?.weight || 0,
          systolic_bp: data.healthCheck?.systolic_bp || 0,
          diastolic_bp: data.healthCheck?.diastolic_bp || 0,
          heart_rate: data.healthCheck?.heart_rate || 0,
          blood_volume_allowed: data.healthCheck?.blood_volume_allowed || 0,
          has_collected_blood: !!data.healthCheck?.has_collected_blood,
          has_chronic_disease: !!data.healthCheck?.has_chronic_disease,
          is_pregnant: !!data.healthCheck?.is_pregnant,
          has_history_of_transplant: !!data.healthCheck?.has_history_of_transplant,
          drug_use_violation: !!data.healthCheck?.drug_use_violation,
          disability_severity: data.healthCheck?.disability_severity || "none",
          infectious_disease: !!data.healthCheck?.infectious_disease,
          sexually_transmitted_disease: !!data.healthCheck?.sexually_transmitted_disease,
          is_clinically_alert: data.healthCheck?.is_clinically_alert ?? true,
          abnormal_symptoms: Array.isArray(data.healthCheck?.abnormal_symptoms)
            ? data.healthCheck?.abnormal_symptoms.join(", ")
            : (data.healthCheck?.abnormal_symptoms || ""),
          can_donate_whole_blood: !!data.healthCheck?.can_donate_whole_blood,
          donor_feeling_healthy: !!data.healthCheck?.donor_feeling_healthy,
          last_donation_date: !!data.healthCheck?.last_donation_date,
          has_cardiovascular_disease: !!data.healthCheck?.has_cardiovascular_disease,
          has_liver_disease: !!data.healthCheck?.has_liver_disease,
          has_kidney_disease: !!data.healthCheck?.has_kidney_disease,
          has_endocrine_disorder: !!data.healthCheck?.has_endocrine_disorder,
          has_tuberculosis_or_respiratory_disease: !!data.healthCheck?.has_tuberculosis_or_respiratory_disease,
          has_blood_disease: !!data.healthCheck?.has_blood_disease,
          has_mental_or_neurological_disorder: !!data.healthCheck?.has_mental_or_neurological_disorder,
          has_malaria: !!data.healthCheck?.has_malaria,
          has_syphilis: !!data.healthCheck?.has_syphilis,
          has_hiv_or_aids: !!data.healthCheck?.has_hiv_or_aids,
          has_other_transmissible_diseases: !!data.healthCheck?.has_other_transmissible_diseases,
          has_surgical_or_medical_history: !!data.healthCheck?.has_surgical_or_medical_history,
          exposure_to_blood_or_body_fluids: !!data.healthCheck?.exposure_to_blood_or_body_fluids,
          received_vaccine_or_biologics: !!data.healthCheck?.received_vaccine_or_biologics,
          tattoo_or_organ_transplant: !!data.healthCheck?.tattoo_or_organ_transplant,
          has_unexplained_weight_loss: !!data.healthCheck?.has_unexplained_weight_loss,
          has_night_sweats: !!data.healthCheck?.has_night_sweats,
          has_skin_or_mucosal_tumors: !!data.healthCheck?.has_skin_or_mucosal_tumors,
          has_enlarged_lymph_nodes: !!data.healthCheck?.has_enlarged_lymph_nodes,
          has_digestive_disorder: !!data.healthCheck?.has_digestive_disorder,
          has_fever_over_37_5_long: !!data.healthCheck?.has_fever_over_37_5_long,
          uses_illegal_drugs: !!data.healthCheck?.uses_illegal_drugs,
          has_sexual_contact_with_risk_person: !!data.healthCheck?.has_sexual_contact_with_risk_person,
          has_infant_under_12_months: !!data.healthCheck?.has_infant_under_12_months,
          declaration_understood_questions: !!data.healthCheck?.declaration_understood_questions,
          declaration_feels_healthy: !!data.healthCheck?.declaration_feels_healthy,
          declaration_voluntary: !!data.healthCheck?.declaration_voluntary,
          declaration_will_report_if_risk_found: !!data.healthCheck?.declaration_will_report_if_risk_found,
          has_taken_medicine_last_week: !!data.healthCheck?.has_taken_medicine_last_week,
          separated_component: data.checkIn?.donorDonationRequest_id?.separated_component || [],
        }));
      } catch (error) {
        toast.error("Có lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [healthCheck]);

  // Tính thể tích máu được hiến dựa vào cân nặng (gạn tách)
  useEffect(() => {
    setForm((prev) => {
      let volume = 0;
      if (prev.weight >= 60) volume = 650;
      else if (prev.weight >= 50) volume = 500;
      else volume = 0;
      return { ...prev, blood_volume_allowed: volume };
    });
  }, [form.weight]);


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

  async function saveField(): Promise<void> {
    try {
      await api.put(`/health-check/health-check/${healthCheck}`, {
        weight: form.weight,
        blood_volume_allowed: form.blood_volume_allowed,
        can_donate_whole_blood: form.can_donate_whole_blood,
  has_collected_blood: form.has_collected_blood,
        has_chronic_disease: form.has_chronic_disease,
        is_pregnant: form.is_pregnant,
        has_history_of_transplant: form.has_history_of_transplant,
        drug_use_violation: form.drug_use_violation,
        disability_severity: form.disability_severity,
        infectious_disease: form.infectious_disease,
        sexually_transmitted_disease: form.sexually_transmitted_disease,
        is_clinically_alert: form.is_clinically_alert,
        systolic_bp: form.systolic_bp,
        diastolic_bp: form.diastolic_bp,
        heart_rate: form.heart_rate,
        abnormal_symptoms: form.abnormal_symptoms,
        donor_feeling_healthy: form.donor_feeling_healthy,
        last_donation_date: form.last_donation_date,
        has_cardiovascular_disease: form.has_cardiovascular_disease,
        has_liver_disease: form.has_liver_disease,
        has_kidney_disease: form.has_kidney_disease,
        has_endocrine_disorder: form.has_endocrine_disorder,
        has_tuberculosis_or_respiratory_disease: form.has_tuberculosis_or_respiratory_disease,
        has_blood_disease: form.has_blood_disease,
        has_mental_or_neurological_disorder: form.has_mental_or_neurological_disorder,
        has_malaria: form.has_malaria,
        has_syphilis: form.has_syphilis,
        has_hiv_or_aids: form.has_hiv_or_aids,
        has_other_transmissible_diseases: form.has_other_transmissible_diseases,
        has_surgical_or_medical_history: form.has_surgical_or_medical_history,
        exposure_to_blood_or_body_fluids: form.exposure_to_blood_or_body_fluids,
        received_vaccine_or_biologics: form.received_vaccine_or_biologics,
        tattoo_or_organ_transplant: form.tattoo_or_organ_transplant,
        has_unexplained_weight_loss: form.has_unexplained_weight_loss,
        has_night_sweats: form.has_night_sweats,
        has_skin_or_mucosal_tumors: form.has_skin_or_mucosal_tumors,
        has_enlarged_lymph_nodes: form.has_enlarged_lymph_nodes,
        has_digestive_disorder: form.has_digestive_disorder,
        has_fever_over_37_5_long: form.has_fever_over_37_5_long,
        uses_illegal_drugs: form.uses_illegal_drugs,
        has_sexual_contact_with_risk_person: form.has_sexual_contact_with_risk_person,
        has_infant_under_12_months: form.has_infant_under_12_months,
        has_taken_medicine_last_week: form.has_taken_medicine_last_week,
        declaration_understood_questions: form.declaration_understood_questions,
        declaration_feels_healthy: form.declaration_feels_healthy,
        declaration_voluntary: form.declaration_voluntary,
        declaration_will_report_if_risk_found: form.declaration_will_report_if_risk_found,
      });
      toast.success("Đã lưu thành công!")
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu!")
    }
  }

  async function rejectForm(): Promise<void> {
    try {
      await api.put(`/health-check/health-check/${healthCheck}/fail`);
      toast.success("Từ chối thành công!")
      router.push("/staff/dashboard/donation-requests");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi từ chối đơn khám!")
    }
  }

  async function acceptForm(): Promise<void> {
    if (!form.declaration_understood_questions || !form.declaration_feels_healthy || !form.declaration_voluntary || !form.declaration_will_report_if_risk_found) {
      toast.error("Vui lòng cam đoan tất cả trước khi chấp nhận");
      return;
    }

    try {
      const response = await api.put(`/health-check/health-check/${healthCheck}/pass`);
      const response2 = await api.post(`/blood-test/create`, {
        user_id: response.data.checkIn.user_id._id,
        user_profile_id: response.data.checkIn.userprofile_id._id,
        hospital_id: response.data.checkIn.hospital_id._id,
        healthcheck_id: healthCheck,
        HBsAg: false,
        hemoglobin: 0
      })

      console.log(response2.data.bloodTest._id)

      await api.put(`/blood-test/blood-tests/${response2.data.bloodTest._id}/separation`, {
        is_seperated: true,
        separated_component: form.separated_component
      });

      toast.success("Chấp nhận thành công!")
      router.push("/staff/dashboard/donation-requests");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi chấp nhận đơn khám!")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto p-4 w-full max-w-6xl flex-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Gạn tách - Khám sức khỏe {name ? ` - ${name}` : ""}</CardTitle>
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
                      <p className="text-sm text-muted-foreground mt-1">Tối thiểu 50 kg đối với gạn tách</p>
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
                      <p className="text-sm text-muted-foreground mt-1">60 - 90 lần/phút</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="can_donate_whole_blood" checked={form.can_donate_whole_blood} onCheckedChange={(c) => setForm((p) => ({ ...p, can_donate_whole_blood: Boolean(c) }))} />
                      <Label htmlFor="can_donate_whole_blood">Đủ điều kiện hiến</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="has_collected_blood" checked={form.has_collected_blood} onCheckedChange={(c) => setForm((p) => ({ ...p, has_collected_blood: Boolean(c) }))} />
                      <Label htmlFor="has_collected_blood">Đã lấy máu</Label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Triệu chứng bất thường</Label>
                    <Select
                      value={form.abnormal_symptoms}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, abnormal_symptoms: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="VD: Sụt cân nhanh, da nhợt nhạt, v.v" />
                      </SelectTrigger>
                      <SelectContent>
                        {symptoms.map((symptom) => (
                          <SelectItem key={symptom.value} value={symptom.value}>
                            {symptom.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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