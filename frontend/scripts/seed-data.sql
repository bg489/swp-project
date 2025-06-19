-- Thêm dữ liệu mẫu cho hệ thống

-- Thêm người dùng mẫu
INSERT INTO users (email, password_hash, name, phone, address, blood_type, total_donations, last_donation) VALUES
('nguyenvana@email.com', '$2b$10$hash_for_123456', 'Nguyễn Văn A', '0901234567', 'Quận 1, TP.HCM', 'O+', 5, '2024-09-15'),
('tranthib@email.com', '$2b$10$hash_for_123456', 'Trần Thị B', '0907654321', 'Quận 3, TP.HCM', 'A-', 3, '2024-08-20'),
('levanc@email.com', '$2b$10$hash_for_123456', 'Lê Văn C', '0912345678', 'Quận 5, TP.HCM', 'B+', 8, '2024-07-10');

-- Thêm lịch sử hiến máu mẫu
INSERT INTO donation_history (user_id, donation_date, location, status) VALUES
((SELECT id FROM users WHERE email = 'nguyenvana@email.com'), '2024-09-15', 'Trung tâm Hiến máu Nhân đạo', 'completed'),
((SELECT id FROM users WHERE email = 'nguyenvana@email.com'), '2024-06-15', 'Bệnh viện Chợ Rẫy', 'completed'),
((SELECT id FROM users WHERE email = 'tranthib@email.com'), '2024-08-20', 'Trung tâm Hiến máu Nhân đạo', 'completed');

-- Thêm yêu cầu máu mẫu
INSERT INTO blood_requests (patient_name, hospital_name, contact_person, phone, blood_type, units_needed, urgency_level, medical_condition, location) VALUES
('Nguyễn Văn X', 'Bệnh viện Chợ Rẫy', 'BS. Nguyễn Văn Y', '0901111111', 'O-', 2, 'critical', 'Tai nạn giao thông, mất máu nhiều', '201B Nguyễn Chí Thanh, Q.5, TP.HCM'),
('Trần Thị Y', 'Bệnh viện Bình Dan', 'BS. Lê Thị Z', '0902222222', 'A+', 1, 'urgent', 'Phẫu thuật khẩn cấp', '371 Điện Biên Phủ, Q.3, TP.HCM');

-- Thêm lịch hẹn mẫu
INSERT INTO appointments (user_id, appointment_date, appointment_time, location, status) VALUES
((SELECT id FROM users WHERE email = 'nguyenvana@email.com'), '2024-12-20', '09:00:00', 'Trung tâm Hiến máu Nhân đạo', 'confirmed'),
((SELECT id FROM users WHERE email = 'tranthib@email.com'), '2024-12-22', '14:00:00', 'Bệnh viện Chợ Rẫy', 'pending');

-- Thêm thông báo mẫu
INSERT INTO notifications (user_id, title, message, type) VALUES
((SELECT id FROM users WHERE email = 'nguyenvana@email.com'), 'Nhắc nhở hiến máu', 'Bạn có thể hiến máu trở lại từ ngày 15/12/2024', 'reminder'),
((SELECT id FROM users WHERE email = 'nguyenvana@email.com'), 'Yêu cầu khẩn cấp', 'Cần gấp nhóm máu O+ tại BV Chợ Rẫy', 'emergency');

-- Dữ liệu khởi tạo cho hệ thống hiến máu
-- File này đã được làm sạch, không còn tài khoản demo

-- Khởi tạo kho máu với số lượng ban đầu là 0
INSERT INTO blood_inventory (blood_type, units_available, units_reserved, last_updated) VALUES
('O-', 0, 0, NOW()),
('O+', 0, 0, NOW()),
('A-', 0, 0, NOW()),
('A+', 0, 0, NOW()),
('B-', 0, 0, NOW()),
('B+', 0, 0, NOW()),
('AB-', 0, 0, NOW()),
('AB+', 0, 0, NOW());

-- Thêm cài đặt hệ thống mặc định
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('min_donation_interval_days', '56', 'Khoảng cách tối thiểu giữa các lần hiến máu (ngày)'),
('max_donation_per_year', '5', 'Số lần hiến máu tối đa trong một năm'),
('min_age', '18', 'Tuổi tối thiểu để hiến máu'),
('max_age', '60', 'Tuổi tối đa để hiến máu'),
('min_weight', '45', 'Cân nặng tối thiểu để hiến máu (kg)'),
('notification_enabled', 'true', 'Bật/tắt thông báo hệ thống'),
('emergency_alert_enabled', 'true', 'Bật/tắt cảnh báo khẩn cấp');

-- Thêm thông tin về tương thích nhóm máu
INSERT INTO blood_compatibility (donor_type, recipient_type, compatible) VALUES
-- O- có thể hiến cho tất cả
('O-', 'O-', true), ('O-', 'O+', true), ('O-', 'A-', true), ('O-', 'A+', true),
('O-', 'B-', true), ('O-', 'B+', true), ('O-', 'AB-', true), ('O-', 'AB+', true),
-- O+ có thể hiến cho O+, A+, B+, AB+
('O+', 'O+', true), ('O+', 'A+', true), ('O+', 'B+', true), ('O+', 'AB+', true),
-- A- có thể hiến cho A-, A+, AB-, AB+
('A-', 'A-', true), ('A-', 'A+', true), ('A-', 'AB-', true), ('A-', 'AB+', true),
-- A+ có thể hiến cho A+, AB+
('A+', 'A+', true), ('A+', 'AB+', true),
-- B- có thể hiến cho B-, B+, AB-, AB+
('B-', 'B-', true), ('B-', 'B+', true), ('B-', 'AB-', true), ('B-', 'AB+', true),
-- B+ có thể hiến cho B+, AB+
('B+', 'B+', true), ('B+', 'AB+', true),
-- AB- có thể hiến cho AB-, AB+
('AB-', 'AB-', true), ('AB-', 'AB+', true),
-- AB+ chỉ có thể hiến cho AB+
('AB+', 'AB+', true);
