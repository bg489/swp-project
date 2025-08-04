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
  const healthCheck = searchParams.get("healthCheck") || ""
  const name = searchParams.get("name") || ""
  const [form, setForm] = useState({
    weight: 0,
    systolic_bp: 0,
    diastolic_bp: 0,
    heart_rate: 0,
    blood_volume_allowed: 0,
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
    has_taken_medicine_last_week: false
  });

  useEffect(() => {
    async function fetch() {
      try {
        const response = await api.get(`/health-check/healthcheck/${healthCheck}`);
        const data = response.data;

        setForm({
          weight: data.healthCheck?.weight || 0,
          systolic_bp: data.healthCheck?.systolic_bp || 0,
          diastolic_bp: data.healthCheck?.diastolic_bp || 0,
          heart_rate: data.healthCheck?.heart_rate || 0,
          blood_volume_allowed: data.healthCheck?.blood_volume_allowed || 0,
          has_chronic_disease: data.healthCheck?.has_chronic_disease || false,
          is_pregnant: data.healthCheck?.is_pregnant || false,
          has_history_of_transplant: data.healthCheck?.has_history_of_transplant || false,
          drug_use_violation: data.healthCheck?.drug_use_violation || false,
          disability_severity: data.healthCheck?.disability_severity || "none",
          infectious_disease: data.healthCheck?.infectious_disease || false,
          sexually_transmitted_disease: data.healthCheck?.sexually_transmitted_disease || false,
          is_clinically_alert: data.healthCheck?.is_clinically_alert || true,
          abnormal_symptoms: data.healthCheck?.abnormal_symptoms?.join(", ") || "",  // Joining if it's an array
          can_donate_whole_blood: data.healthCheck?.can_donate_whole_blood || false,
          donor_feeling_healthy: data.healthCheck?.donor_feeling_healthy || false,
          last_donation_date: data.healthCheck?.last_donation_date || false,
          has_cardiovascular_disease: data.healthCheck?.has_cardiovascular_disease || false,
          has_liver_disease: data.healthCheck?.has_liver_disease || false,
          has_kidney_disease: data.healthCheck?.has_kidney_disease || false,
          has_endocrine_disorder: data.healthCheck?.has_endocrine_disorder || false,
          has_tuberculosis_or_respiratory_disease: data.healthCheck?.has_tuberculosis_or_respiratory_disease || false,
          has_blood_disease: data.healthCheck?.has_blood_disease || false,
          has_mental_or_neurological_disorder: data.healthCheck?.has_mental_or_neurological_disorder || false,
          has_malaria: data.healthCheck?.has_malaria || false,
          has_syphilis: data.healthCheck?.has_syphilis || false,
          has_hiv_or_aids: data.healthCheck?.has_hiv_or_aids || false,
          has_other_transmissible_diseases: data.healthCheck?.has_other_transmissible_diseases || false,
          has_surgical_or_medical_history: data.healthCheck?.has_surgical_or_medical_history || false,
          exposure_to_blood_or_body_fluids: data.healthCheck?.exposure_to_blood_or_body_fluids || false,
          received_vaccine_or_biologics: data.healthCheck?.received_vaccine_or_biologics || false,
          tattoo_or_organ_transplant: data.healthCheck?.tattoo_or_organ_transplant || false,
          has_unexplained_weight_loss: data.healthCheck?.has_unexplained_weight_loss || false,
          has_night_sweats: data.healthCheck?.has_night_sweats || false,
          has_skin_or_mucosal_tumors: data.healthCheck?.has_skin_or_mucosal_tumors || false,
          has_enlarged_lymph_nodes: data.healthCheck?.has_enlarged_lymph_nodes || false,
          has_digestive_disorder: data.healthCheck?.has_digestive_disorder || false,
          has_fever_over_37_5_long: data.healthCheck?.has_fever_over_37_5_long || false,
          uses_illegal_drugs: data.healthCheck?.uses_illegal_drugs || false,
          has_sexual_contact_with_risk_person: data.healthCheck?.has_sexual_contact_with_risk_person || false,
          has_infant_under_12_months: data.healthCheck?.has_infant_under_12_months || false,
          declaration_understood_questions: data.healthCheck?.declaration_understood_questions || false,
          declaration_feels_healthy: data.healthCheck?.declaration_feels_healthy || false,
          declaration_voluntary: data.healthCheck?.declaration_voluntary || false,
          declaration_will_report_if_risk_found: data.healthCheck?.declaration_will_report_if_risk_found || false,
          has_taken_medicine_last_week: data.healthCheck?.has_taken_medicine_last_week || false,
        });
      } catch (error) {
        toast.error("Có lỗi khi fetch data")
      }
    }
    fetch();
  }, []);

  // Tính thể tích máu được hiến dựa vào cân nặng
  useEffect(() => {
    let volume = 0;
    if (form.weight >= 42 && form.weight < 45) {
      volume = 250;
    } else if (form.weight >= 45) {
      volume = Math.min(form.weight * 9, 500);
    } else {
      volume = 0; // Dưới 42kg không đủ điều kiện hiến
    }

    setForm((prev) => ({ ...prev, blood_volume_allowed: volume }));
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
      await api.put(`/health-check/health-check/${healthCheck}`, {
        weight: form.weight,
        blood_volume_allowed: form.blood_volume_allowed,
        can_donate_whole_blood: form.can_donate_whole_blood,
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
      })
      toast.success("Đã lưu thành công!")
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu!")
    }
  }

  async function rejectForm(): Promise<void> {
    try {
      await api.put(`/health-check/health-check/${healthCheck}/fail`);
      toast.success("Từ chối thành công!")
      router.push("/staff/dashboard");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi từ chối đơn khám!")
    }
  }

  async function acceptForm(): Promise<void> {
    try {
      await api.put(`/health-check/health-check/${healthCheck}/pass`);
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
            <CardTitle>Form kiểm tra sức khỏe hiến máu toàn phần của {name}</CardTitle>
          </CardHeader>
          <CardContent>
            <h1>Thông tin cơ bản</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="weight">Cân nặng (kg). Lớn hơn 42 kg đối với phụ nữ, 45 kg đối với nam giới</Label>
                    <Input name="weight" type="number" value={form.weight} onChange={handleChange} />
                  </div>
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="systolic_bp">Huyết áp tâm thu (Từ 100 mmHg đến dưới 160 mmHg)</Label>
                    <Input name="systolic_bp" type="number" value={form.systolic_bp} onChange={handleChange} />
                  </div>
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="diastolic_bp">Huyết áp tâm trương (Từ 60 mmHg đến dưới 100 mmHg)</Label>
                    <Input name="diastolic_bp" type="number" value={form.diastolic_bp} onChange={handleChange} />
                  </div>
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                <Label htmlFor="heart_rate">Nhịp tim (Tần số trong khoảng từ 60 lần đến 90 lần/phút)</Label>
                <Input name="heart_rate" type="number" value={form.heart_rate} onChange={handleChange} />
              </div>
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                <Label htmlFor="blood_volume_allowed">Thể tích máu cho phép (ml)</Label>
                <Input name="blood_volume_allowed" type="number" value={form.blood_volume_allowed} onChange={handleChange} />
              </div>
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                <Label htmlFor="timeSlot">Triệu chứng bất thường</Label>
                <Select
                  value={form.abnormal_symptoms}
                  onValueChange={(value) => {
                    setForm((prev) => ({
                      ...prev,
                      abnormal_symptoms: value,
                    }))
                  }}
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
                  <Button type="button" onClick={() => saveField()} className="mt-6">
                    Lưu
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Label>
                  <Checkbox name="has_chronic_disease" checked={form.has_chronic_disease} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      has_chronic_disease: Boolean(checked),
                    }))
                  } />
                  Có bệnh mãn tính
                </Label>
                <Label>
                  <Checkbox name="is_pregnant" checked={form.is_pregnant} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      is_pregnant: Boolean(checked),
                    }))
                  } />
                  Đang mang thai
                </Label>
                <Label>
                  <Checkbox name="has_history_of_transplant" checked={form.has_history_of_transplant} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      has_history_of_transplant: Boolean(checked),
                    }))
                  } />
                  Có ghép tạng trong quá khứ
                </Label>
                <Label>
                  <Checkbox name="drug_use_violation" checked={form.drug_use_violation} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      drug_use_violation: Boolean(checked),
                    }))
                  } />
                  Sử dụng chất kích thích
                </Label>
                <Label>
                  <Checkbox name="infectious_disease" checked={form.infectious_disease} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      infectious_disease: Boolean(checked),
                    }))
                  } />
                  Bệnh truyền nhiễm
                </Label>
                <Label>
                  <Checkbox name="sexually_transmitted_disease" checked={form.sexually_transmitted_disease} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      sexually_transmitted_disease: Boolean(checked),
                    }))
                  } />
                  Bệnh lây qua đường tình dục
                </Label>
                <Label>
                  <Checkbox name="is_clinically_alert" checked={form.is_clinically_alert} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      is_clinically_alert: Boolean(checked),
                    }))
                  } />
                  Tỉnh táo về mặt lâm sàng
                </Label>
              </div>
              <h1>Khám và tư vấn</h1>
              <div className="grid grid-cols-2 gap-4">
                <Label>
                  <Checkbox name="donor_feeling_healthy" checked={form.donor_feeling_healthy} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      donor_feeling_healthy: Boolean(checked),
                    }))
                  } />
                  Người hiến tự cảm thấy khỏe
                </Label>

                <Label>
                  <Checkbox name="last_donation_date" checked={form.last_donation_date} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      last_donation_date: Boolean(checked),
                    }))
                  } />
                  Lần hiến máu gần đây dưới 12 tuần
                </Label>
              </div>
              <h1>Tiền sử sức khoẻ chung và bệnh tật</h1>
              <div className="grid grid-cols-2 gap-4">
                <Label>
                  <Checkbox name="has_cardiovascular_disease" checked={form.has_cardiovascular_disease} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      has_cardiovascular_disease: Boolean(checked),
                    }))
                  } />
                  Mắc bệnh tim mạch
                </Label>

                <Label>
                  <Checkbox name="has_liver_disease" checked={form.has_liver_disease} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      has_liver_disease: Boolean(checked),
                    }))
                  } />
                  Mắc bệnh gan
                </Label>

                <Label>
                  <Checkbox name="has_kidney_disease" checked={form.has_kidney_disease} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      has_kidney_disease: Boolean(checked),
                    }))
                  } />
                  Mắc bệnh thận
                </Label>

                <Label>
                  <Checkbox name="has_endocrine_disorder" checked={form.has_endocrine_disorder} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      has_endocrine_disorder: Boolean(checked),
                    }))
                  } />
                  Rối loạn nội tiết
                </Label>

                <Label>
                  <Checkbox name="has_tuberculosis_or_respiratory_disease" checked={form.has_tuberculosis_or_respiratory_disease} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      has_tuberculosis_or_respiratory_disease: Boolean(checked),
                    }))
                  } />
                  Mắc bệnh lao hoặc bệnh đường hô hấp
                </Label>

                <Label>
                  <Checkbox name="has_blood_disease" checked={form.has_blood_disease} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      has_blood_disease: Boolean(checked),
                    }))
                  } />
                  Mắc bệnh máu
                </Label>

                <Label>
                  <Checkbox name="has_mental_or_neurological_disorder" checked={form.has_mental_or_neurological_disorder} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      has_mental_or_neurological_disorder: Boolean(checked),
                    }))
                  } />
                  Rối loạn tâm thần hoặc thần kinh
                </Label>

                <Label>
                  <Checkbox name="has_malaria" checked={form.has_malaria} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      has_malaria: Boolean(checked),
                    }))
                  } />
                  Mắc bệnh sốt rét
                </Label>

                <Label>
                  <Checkbox name="has_syphilis" checked={form.has_syphilis} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      has_syphilis: Boolean(checked),
                    }))
                  } />
                  Mắc bệnh giang mai
                </Label>

                <Label>
                  <Checkbox name="has_hiv_or_aids" checked={form.has_hiv_or_aids} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      has_hiv_or_aids: Boolean(checked),
                    }))
                  } />
                  Mắc HIV hoặc AIDS
                </Label>

                <Label>
                  <Checkbox name="has_other_transmissible_diseases" checked={form.has_other_transmissible_diseases} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      has_other_transmissible_diseases: Boolean(checked),
                    }))
                  } />
                  Mắc các bệnh truyền nhiễm khác
                </Label>

                <Label>
                  <Checkbox name="has_surgical_or_medical_history" checked={form.has_surgical_or_medical_history} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      has_surgical_or_medical_history: Boolean(checked),
                    }))
                  } />
                  Có tiền sử phẫu thuật hoặc bệnh lý
                </Label>

                <Label>
                  <Checkbox name="exposure_to_blood_or_body_fluids" checked={form.exposure_to_blood_or_body_fluids} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      exposure_to_blood_or_body_fluids: Boolean(checked),
                    }))
                  } />
                  Tiếp xúc với máu hoặc dịch cơ thể của người khác
                </Label>

                <Label>
                  <Checkbox name="received_vaccine_or_biologics" checked={form.received_vaccine_or_biologics} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      received_vaccine_or_biologics: Boolean(checked),
                    }))
                  } />
                  Đã tiêm vắc xin hoặc sử dụng chế phẩm sinh học (biologics) trong thời gian gần đây
                </Label>

                <Label>
                  <Checkbox name="tattoo_or_organ_transplant" checked={form.tattoo_or_organ_transplant} onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      tattoo_or_organ_transplant: Boolean(checked),
                    }))
                  } />
                  Có xăm hình hoặc đã từng ghép tạng
                </Label>
              </div>

              <h1>Các biểu hiện bất thường bệnh lý</h1>

              <div className="grid grid-cols-2 gap-4">
                <Label>
                    <Checkbox name="has_unexplained_weight_loss" checked={form.has_unexplained_weight_loss} onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        has_unexplained_weight_loss: Boolean(checked),
                      }))
                    } />
                    Bị sụt cân không rõ nguyên nhân
                  </Label>

                  <Label>
                    <Checkbox name="has_night_sweats" checked={form.has_night_sweats} onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        has_night_sweats: Boolean(checked),
                      }))
                    } />
                    Đổ mồ hôi về đêm
                  </Label>

                  <Label>
                    <Checkbox name="has_skin_or_mucosal_tumors" checked={form.has_skin_or_mucosal_tumors} onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        has_skin_or_mucosal_tumors: Boolean(checked),
                      }))
                    } />
                    Có u bướu ở da hoặc niêm mạc
                  </Label>

                  <Label>
                    <Checkbox name="has_enlarged_lymph_nodes" checked={form.has_enlarged_lymph_nodes} onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        has_enlarged_lymph_nodes: Boolean(checked),
                      }))
                    } />
                    Có hạch to bất thường
                  </Label>

                  <Label>
                    <Checkbox name="has_digestive_disorder" checked={form.has_digestive_disorder} onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        has_digestive_disorder: Boolean(checked),
                      }))
                    } />
                    Rối loạn tiêu hóa
                  </Label>

                  <Label>
                    <Checkbox name="has_fever_over_37_5_long" checked={form.has_fever_over_37_5_long} onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        has_fever_over_37_5_long: Boolean(checked),
                      }))
                    } />
                    Sốt trên 37.5°C kéo dài
                  </Label>
                </div>

                <h1>Hành vi rủi ro</h1>

                <div className="grid grid-cols-2 gap-4">
                  <Label>
                    <Checkbox name="uses_illegal_drugs" checked={form.uses_illegal_drugs} onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        uses_illegal_drugs: Boolean(checked),
                      }))
                    } />
                    Sử dụng ma túy bất hợp pháp
                  </Label>

                  <Label>
                    <Checkbox name="has_sexual_contact_with_risk_person" checked={form.has_sexual_contact_with_risk_person} onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        has_sexual_contact_with_risk_person: Boolean(checked),
                      }))
                    } />
                    Có quan hệ tình dục với người có nguy cơ cao (như mại dâm, nghiện, HIV...)
                  </Label>
                </div>

                <h1>Sau sinh</h1>

                <div className="grid grid-cols-2 gap-4">
                  <Label>
                    <Checkbox name="has_infant_under_12_months" checked={form.has_infant_under_12_months} onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        has_infant_under_12_months: Boolean(checked),
                      }))
                    } />
                    Đang nuôi con dưới 12 tháng tuổi
                  </Label>
                </div>

                <h1>Tiền sử dụng thuốc</h1>

                <div className="grid grid-cols-2 gap-4">
                  <Label>
                    <Checkbox name="has_taken_medicine_last_week" checked={form.has_taken_medicine_last_week} onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        has_taken_medicine_last_week: Boolean(checked),
                      }))
                    } />
                    Đã dùng thuốc trong tuần vừa qua
                  </Label>
                </div>

                <h1>Lời cam đoan của người hiến máu</h1>

                <div className="grid grid-cols-2 gap-4">
                  <Label>
                    <Checkbox name="declaration_understood_questions" checked={form.declaration_understood_questions} onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        declaration_understood_questions: Boolean(checked),
                      }))
                    } required />
                    Tôi đã hiểu rõ các câu hỏi trong phiếu sàng lọc
                  </Label>

                  <Label>
                    <Checkbox name="declaration_feels_healthy" checked={form.declaration_feels_healthy} onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        declaration_feels_healthy: Boolean(checked),
                      }))
                    } required />
                    Tôi hiện cảm thấy khỏe mạnh
                  </Label>

                  <Label>
                    <Checkbox name="declaration_voluntary" checked={form.declaration_voluntary} onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        declaration_voluntary: Boolean(checked),
                      }))
                    } required />
                    Tôi tự nguyện tham gia hiến máu
                  </Label>

                  <Label>
                    <Checkbox name="declaration_will_report_if_risk_found" checked={form.declaration_will_report_if_risk_found} onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        declaration_will_report_if_risk_found: Boolean(checked),
                      }))
                    } required />
                    Tôi cam kết sẽ thông báo nếu phát hiện có yếu tố nguy cơ trước hoặc sau hiến máu
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
    </div>
  );
}