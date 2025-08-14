import HealthCheck from "../models/HealthCheck.js";
import CheckIn from "../models/CheckIn.js";
import Hospital from "../models/Hospital.js";
import BloodTest from "../models/BloodTest.js";

export async function createHealthCheck(req, res) {
  try {
    const { checkin_id, hospital_id } = req.body;

    // Kiểm tra các tham số bắt buộc
    if (!checkin_id || !hospital_id) {
      return res.status(400).json({ message: "checkin_id and hospital_id are required." });
    }

    // Kiểm tra checkin_id có tồn tại không
    const checkIn = await CheckIn.findById(checkin_id);
    if (!checkIn) {
      return res.status(404).json({ message: "Check-in not found." });
    }

    // Kiểm tra hospital_id có tồn tại không (tuỳ thuộc vào yêu cầu của bạn)
    const hospitalExists = await Hospital.findById(hospital_id);
    if (!hospitalExists) {
      return res.status(404).json({ message: "Hospital not found." });
    }

    // Tạo bản ghi HealthCheck mới với cả checkin_id và hospital_id
    const newHealthCheck = await HealthCheck.create({
      checkin_id,
      hospital_id, // Lưu bệnh viện vào bản ghi HealthCheck
    });

    return res.status(201).json({
      message: "Health check record created successfully with checkin_id and hospital_id.",
      healthCheck: newHealthCheck,
    });
  } catch (error) {
    console.error("Error creating health check:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function updateHealthCheck(req, res) {
  try {
    const { id } = req.params; // Lấy id từ URL
    const updateData = req.body;

    // Kiểm tra xem bản ghi có tồn tại không
    const existing = await HealthCheck.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Health check record not found." });
    }

    // Cập nhật bản ghi
    const updated = await HealthCheck.findByIdAndUpdate(id, updateData, {
      new: true, // Trả về bản ghi sau khi update
      runValidators: true, // Kiểm tra ràng buộc schema
    });

    return res.status(200).json({
      message: "Health check record updated successfully.",
      healthCheck: updated,
    });
  } catch (error) {
    console.error("Error updating health check:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function markHealthCheckFailed(req, res) {
  try {
    const { id } = req.params;

    // Kiểm tra xem bản ghi HealthCheck có tồn tại không
    const healthCheck = await HealthCheck.findById(id);
    if (!healthCheck) {
      return res.status(404).json({ message: "Health check record not found." });
    }

    // Cập nhật overall_result thành "failed"
    healthCheck.overall_result = "failed";
    await healthCheck.save();

    return res.status(200).json({
      message: "Health check marked as failed.",
      healthCheck,
    });
  } catch (error) {
    console.error("Error marking health check failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function markHealthCheckPassed(req, res) {
  try {
    const { id } = req.params;

    // Kiểm tra bản ghi tồn tại không
    const healthCheck = await HealthCheck.findById(id);
    if (!healthCheck) {
      return res.status(404).json({ message: "Health check record not found." });
    }



  // Cập nhật overall_result thành "passed"
    healthCheck.overall_result = "passed";
    await healthCheck.save();

    // Truy vấn thông tin check-in từ checkin_id
    const checkIn = await CheckIn.findById(healthCheck.checkin_id)
      .populate({
        path: "user_id",
        model: "User",
        select: "full_name email phone gender date_of_birth",
      })
      .populate({
        path: "userprofile_id",
        model: "UserProfile",
        select: "blood_type cccd cooldown_until",
      })
      .populate({
        path: "hospital_id",
        model: "Hospital",
        select: "name address phone",
      })
      .populate({
        path: "donorDonationRequest_id",
        model: "DonorDonationRequest",
        select: "donation_date donation_time_range donation_type separated_component notes status",
      });

    // Tự động tạo bản ghi xét nghiệm máu (BloodTest) ở trạng thái pending nếu chưa tồn tại
    let bloodTest = await BloodTest.findOne({ healthcheck_id: healthCheck._id });
    if (!bloodTest) {
      try {
        bloodTest = await BloodTest.create({
          user_id: checkIn.user_id?._id || checkIn.user_id,
          user_profile_id: checkIn.userprofile_id?._id || checkIn.userprofile_id,
          hospital_id: checkIn.hospital_id?._id || checkIn.hospital_id,
          healthcheck_id: healthCheck._id,
          // Các trường bắt buộc, sẽ cập nhật sau khi có kết quả xét nghiệm thực tế
          HBsAg: false,
          hemoglobin: 0,
          status: "pending",
        });
      } catch (err) {
        console.error("Auto-create blood test failed:", err);
        // Không chặn quy trình nếu tạo blood test thất bại
      }
    }

    return res.status(200).json({
      message: "Health check marked as passed.",
      healthCheck,
      checkIn,
      bloodTest,
    });
  } catch (error) {
    console.error("Error marking health check passed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}




export async function getCheckInStatusByHealthCheckId(req, res) {
  try {
    const { id } = req.params; // health check ID

    if (!id) {
      return res.status(400).json({ message: "HealthCheck ID is required." });
    }

    // Tìm bản ghi HealthCheck
    const healthCheck = await HealthCheck.findById(id);
    if (!healthCheck) {
      return res.status(404).json({ message: "HealthCheck not found." });
    }

    // Truy vấn thông tin check-in từ checkin_id
    const checkIn = await CheckIn.findById(healthCheck.checkin_id)
      .populate({
        path: "user_id",
        model: "User",
        select: "full_name email phone gender date_of_birth",
      })
      .populate({
        path: "userprofile_id",
        model: "UserProfile",
        select: "blood_type cccd cooldown_until",
      })
      .populate({
        path: "hospital_id",
        model: "Hospital",
        select: "name address phone",
      })
      .populate({
        path: "donorDonationRequest_id",
        model: "DonorDonationRequest",
        select: "donation_date donation_time_range donation_type separated_component notes status",
      });

    if (!checkIn) {
      return res.status(404).json({ message: "Check-in not found." });
    }

    // Xác định status từ overall_result
    let status = "pending"; // Mặc định
    if (healthCheck.overall_result === "passed") {
      status = "passed";
    } else if (healthCheck.overall_result === "failed") {
      status = "failed";
    }

    return res.status(200).json({
      checkIn,
      status,
    });
  } catch (error) {
    console.error("Error retrieving check-in by health check ID:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function getAllCheckInStatusesByHospitalId(req, res) {
  try {
    const { hospitalId } = req.params;

    if (!hospitalId) {
      return res.status(400).json({ message: "Hospital ID is required." });
    }

    // Lấy tất cả HealthCheck tại bệnh viện này
    const healthChecks = await HealthCheck.find({ hospital_id: hospitalId });

    if (!healthChecks || healthChecks.length === 0) {
      return res.status(404).json({ message: "No health checks found for this hospital." });
    }

    const results = await Promise.all(
      healthChecks.map(async (healthCheck) => {
        const checkIn = await CheckIn.findById(healthCheck.checkin_id)
          .populate({
            path: "user_id",
            model: "User",
            select: "full_name email phone gender date_of_birth",
          })
          .populate({
            path: "userprofile_id",
            model: "UserProfile",
            select: "blood_type cccd cooldown_until",
          })
          .populate({
            path: "hospital_id",
            model: "Hospital",
            select: "name address phone",
          })
          .populate({
            path: "donorDonationRequest_id",
            model: "DonorDonationRequest",
            select: "donation_date donation_time_range donation_type separated_component notes status",
          });

        if (!checkIn) return null;

        let status = "pending"; // Mặc định là pending
        if (healthCheck.overall_result === "passed") {
          status = "passed";
        } else if (healthCheck.overall_result === "failed") {
          status = "failed";
        }

        return {
          checkIn: {
            _id: checkIn._id,
            user_id: checkIn.user_id,
            userprofile_id: checkIn.userprofile_id,
            hospital_id: checkIn.hospital_id,
            donorDonationRequest_id: checkIn.donorDonationRequest_id,
            status: checkIn.status,
          },
          healthCheck: {
            _id: healthCheck._id,
            checkin_id: healthCheck.checkin_id,
            overall_result: healthCheck.overall_result,
            createdAt: healthCheck.createdAt,
          },
          status, // "passed", "failed", or "pending"
        };
      })
    );

    // Lọc bỏ các kết quả null nếu không có checkIn
    const validResults = results.filter((r) => r !== null);

    return res.status(200).json(validResults);
  } catch (error) {
    console.error("Error retrieving check-in statuses by hospital ID:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function getHealthCheckById(req, res) {
  try {
    const { id } = req.params; // HealthCheck ID from URL

    if (!id) {
      return res.status(400).json({ message: "HealthCheck ID is required." });
    }

    // Tìm bản ghi HealthCheck
    const healthCheck = await HealthCheck.findById(id)
      .populate({
        path: "checkin_id",  // Populate checkin_id field
        model: "CheckIn",
        select: "user_id hospital_id status",  // Select necessary fields from CheckIn model
      })
      .populate({
        path: "hospital_id",  // Populate hospital_id field
        model: "Hospital",
        select: "name address phone",  // Select necessary fields from Hospital model
      });

    if (!healthCheck) {
      return res.status(404).json({ message: "HealthCheck not found." });
    }

    const checkIn = await CheckIn.findById(healthCheck.checkin_id)
      .populate({
        path: "user_id",
        model: "User",
        select: "full_name email phone gender date_of_birth",
      })
      .populate({
        path: "userprofile_id",
        model: "UserProfile",
        select: "blood_type cccd cooldown_until",
      })
      .populate({
        path: "hospital_id",
        model: "Hospital",
        select: "name address phone",
      })
      .populate({
        path: "donorDonationRequest_id",
        model: "DonorDonationRequest",
        select: "donation_date donation_time_range donation_type separated_component notes status",
      });

    return res.status(200).json({
      message: "HealthCheck details retrieved successfully.",
      healthCheck,
      checkIn
    });
  } catch (error) {
    console.error("Error retrieving health check by ID:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
