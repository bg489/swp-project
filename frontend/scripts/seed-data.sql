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
