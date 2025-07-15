import BloodInventory from "../models/BloodInventory.js";
import Hospital from "../models/Hospital.js";

// Tạo blood inventory mới
export async function createBloodInventory(req, res) {
    try {
        const {
            blood_type,
            component,
            quantity,
            low_stock_alert,
            expiring_quantity,
            hospital,
        } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!blood_type || !component || quantity == null || !hospital) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Kiểm tra bệnh viện tồn tại
        const hospitalExists = await Hospital.findById(hospital);
        if (!hospitalExists) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        // Tạo inventory
        const newInventory = new BloodInventory({
            blood_type,
            component,
            quantity,
            hospital,
            low_stock_alert: low_stock_alert || quantity < 30,
            expiring_quantity: expiring_quantity || 0, // default nếu không truyền
        });

        const savedInventory = await newInventory.save();

        return res.status(201).json({
            message: "Blood inventory created successfully",
            inventory: savedInventory,
        });
    } catch (error) {
        console.error("Error creating blood inventory:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function getBloodInventoryById(req, res) {
    try {
        const { inventoryId } = req.params;

        if (!inventoryId) {
            return res.status(400).json({ message: "Inventory ID is required" });
        }

        const inventory = await BloodInventory.findById(inventoryId)
            .populate("hospital", "name address");

        if (!inventory) {
            return res.status(404).json({ message: "Blood inventory not found" });
        }

        return res.status(200).json({ inventory });
    } catch (error) {
        console.error("Error fetching blood inventory by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function getBloodInventoriesByHospital(req, res) {
    try {
        const { hospitalId } = req.params;

        if (!hospitalId) {
            return res.status(400).json({ message: "Hospital ID is required" });
        }

        const inventories = await BloodInventory.find({ hospital: hospitalId })
            .sort({ blood_type: 1 }) // sắp xếp cho dễ nhìn
            .populate("hospital", "name address");

        if (!inventories.length) {
            return res.status(404).json({ message: "No blood inventories found for this hospital" });
        }

        return res.status(200).json({ inventories });
    } catch (error) {
        console.error("Error fetching blood inventories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateBloodInventoryQuantity(req, res) {
    try {
        const { inventoryId } = req.params;
        const { quantity, expiring_quantity } = req.body;

        if (!inventoryId || quantity == null) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const lowStockAlert = quantity < 30;

        const updateFields = {
            quantity,
            low_stock_alert: lowStockAlert,
            last_updated: Date.now(),
        };

        // Nếu client có gửi expiring_quantity thì cập nhật luôn
        if (expiring_quantity != null) {
            updateFields.expiring_quantity = expiring_quantity;
        }

        const updatedInventory = await BloodInventory.findByIdAndUpdate(
            inventoryId,
            updateFields,
            { new: true }
        ).populate("hospital", "name address");

        if (!updatedInventory) {
            return res.status(404).json({ message: "Blood inventory not found" });
        }

        return res.status(200).json({
            message: "Quantity updated successfully",
            inventory: updatedInventory,
        });
    } catch (error) {
        console.error("Error updating blood inventory:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export async function createAllBloodInventories(req, res) {
    try {
        const {
            component,
            quantity,
            low_stock_alert,
            expiring_quantity,
            hospital,
        } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!component || quantity == null || !hospital) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Kiểm tra bệnh viện tồn tại
        const hospitalExists = await Hospital.findById(hospital);
        if (!hospitalExists) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

        const inventoryData = bloodTypes.map((blood_type) => ({
            blood_type,
            component,
            quantity,
            hospital,
            low_stock_alert: low_stock_alert || quantity < 30,
            expiring_quantity: expiring_quantity || 0,
        }));

        // Tạo tất cả inventories trong 1 lần
        const createdInventories = await BloodInventory.insertMany(inventoryData);

        return res.status(201).json({
            message: "All blood inventories created successfully",
            inventories: createdInventories,
        });
    } catch (error) {
        console.error("Error creating all blood inventories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getAllBloodInventories(req, res) {
    try {
        const inventories = await BloodInventory.find({})
            .sort({ blood_type: 1 }) // sắp xếp theo nhóm máu
            .populate("hospital", "name address"); // lấy tên và địa chỉ bệnh viện

        if (!inventories.length) {
            return res.status(404).json({ message: "No blood inventories found" });
        }

        return res.status(200).json({ inventories });
    } catch (error) {
        console.error("Error fetching all blood inventories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
