import Patient from "../models/Patient.js";

// POST /api/patients - Tạo mới bệnh nhân
export async function createPatient(req, res) {
  try {
    const patientData = req.body;
    const newPatient = new Patient(patientData);
    await newPatient.save();
    return res.status(201).json({
      message: "Tạo bệnh nhân thành công",
      patient: newPatient,
    });
  } catch (error) {
    console.error("Lỗi khi tạo bệnh nhân:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// GET /api/patients/:id - Lấy thông tin bệnh nhân theo id
export async function getPatientById(req, res) {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Không tìm thấy bệnh nhân" });
    }
    return res.status(200).json({ message: "Lấy thông tin thành công", patient });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin bệnh nhân:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// PATCH /api/patients/:id - Cập nhật thông tin bệnh nhân theo id
export async function updatePatientById(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const patient = await Patient.findByIdAndUpdate(id, updateData, { new: true });
    if (!patient) {
      return res.status(404).json({ message: "Không tìm thấy bệnh nhân" });
    }
    return res.status(200).json({ message: "Cập nhật thành công", patient });
  } catch (error) {
    console.error("Lỗi khi cập nhật bệnh nhân:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// GET /api/patients/by-hospital/:hospital_id - Lấy tất cả bệnh nhân theo hospital_id
export async function getPatientsByHospital(req, res) {
  try {
    const { hospital_id } = req.params;
    const patients = await Patient.find({ hospital: hospital_id });
    return res.status(200).json({
      message: "Lấy danh sách bệnh nhân thành công",
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bệnh nhân:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}