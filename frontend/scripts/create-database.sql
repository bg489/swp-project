-- Tạo database cho hệ thống hiến máu
CREATE DATABASE IF NOT EXISTS blood_donation_system;
USE blood_donation_system;

-- Bảng users (người dùng)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    blood_type ENUM('O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'),
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    last_donation DATE,
    total_donations INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng donation_history (lịch sử hiến máu)
CREATE TABLE donation_history (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    donation_date DATE NOT NULL,
    location VARCHAR(255),
    units_donated INT DEFAULT 350,
    status ENUM('completed', 'cancelled', 'pending') DEFAULT 'completed',
    points_earned INT DEFAULT 50,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng blood_requests (yêu cầu máu)
CREATE TABLE blood_requests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    patient_name VARCHAR(255) NOT NULL,
    hospital_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    blood_type ENUM('O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+') NOT NULL,
    units_needed INT NOT NULL,
    urgency_level ENUM('critical', 'urgent', 'high', 'medium') NOT NULL,
    medical_condition TEXT,
    location VARCHAR(255) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng blood_inventory (kho máu)
CREATE TABLE blood_inventory (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    blood_type ENUM('O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+') NOT NULL,
    units_available INT DEFAULT 0,
    units_reserved INT DEFAULT 0,
    expiry_date DATE,
    location VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng appointments (lịch hẹn)
CREATE TABLE appointments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(100) DEFAULT 'Hiến máu định kỳ',
    status ENUM('confirmed', 'pending', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng notifications (thông báo)
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('reminder', 'emergency', 'achievement', 'general') DEFAULT 'general',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Thêm dữ liệu mẫu
INSERT INTO users (email, password_hash, name, role, is_active) VALUES
('admin@bloodconnect.vn', '$2b$10$hash_for_123456', 'Quản trị viên', 'admin', true),
('user@example.com', '$2b$10$hash_for_123456', 'Nguyễn Văn A', 'user', true);

-- Thêm dữ liệu kho máu mẫu
INSERT INTO blood_inventory (blood_type, units_available) VALUES
('O-', 45), ('O+', 120), ('A-', 78), ('A+', 156),
('B-', 34), ('B+', 89), ('AB-', 23), ('AB+', 67);
