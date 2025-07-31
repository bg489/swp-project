import Hospital from "../models/Hospital.js";

/**
 * GET /api/hospitals
 * Trả về danh sách tất cả bệnh viện
 */
export const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ name: 1 }); // sắp xếp theo tên
    res.status(200).json({ success: true, hospitals });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bệnh viện:", error);
    res.status(500).json({ success: false, message: "Không thể lấy danh sách bệnh viện" });
  }
};

export const createHospital = async (req, res) => {
  try {
    const { name, latitude, longitude, address, phone } = req.body;

    if (!name || latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đủ name, latitude và longitude.",
      });
    }

    const newHospital = new Hospital({
      name,
      address: address || "", // fallback nếu chưa có
      phone: phone || "",
      latitude,
      longitude,
    });

    await newHospital.save();

    res.status(201).json({ success: true, hospital: newHospital });
  } catch (error) {
    console.error("Lỗi khi tạo bệnh viện:", error);
    res.status(500).json({ success: false, message: "Không thể tạo bệnh viện." });
  }
};

export const createHospitals = async (req, res) => {
  try {
    const hospitals = req.body; // Expecting an array of hospitals

    if (!Array.isArray(hospitals) || hospitals.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng gửi một mảng các bệnh viện.",
      });
    }

    // Validate each hospital item
    const invalid = hospitals.find(
      (h) => !h.name || h.latitude == null || h.longitude == null
    );
    if (invalid) {
      return res.status(400).json({
        success: false,
        message: "Mỗi bệnh viện phải có name, latitude và longitude.",
      });
    }

    const hospitalsToInsert = hospitals.map((h) => ({
      name: h.name,
      address: h.address || "",
      phone: h.phone || "",
      latitude: h.latitude,
      longitude: h.longitude,
    }));

    const insertedHospitals = await Hospital.insertMany(hospitalsToInsert);

    res.status(201).json({
      success: true,
      hospitals: insertedHospitals,
    });
  } catch (error) {
    console.error("Lỗi khi tạo danh sách bệnh viện:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tạo danh sách bệnh viện.",
    });
  }
};



/**
 * GET /api/hospitals/:id
 * Lấy thông tin chi tiết bệnh viện theo ID
 */
export const getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;
    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bệnh viện." });
    }

    res.status(200).json({ success: true, hospital });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin bệnh viện:", error);
    res.status(500).json({ success: false, message: "Không thể lấy thông tin bệnh viện." });
  }
};
