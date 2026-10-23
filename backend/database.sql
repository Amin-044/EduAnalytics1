-- ============================================================
-- EduAnalytics database
-- Import via phpMyAdmin (http://localhost/phpmyadmin) or:
--   mysql -u root < database.sql
-- Default admin login: admin@example.com / password
-- ============================================================

CREATE DATABASE IF NOT EXISTS eduanalytics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eduanalytics;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS marks;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    course VARCHAR(50) DEFAULT NULL,
    semester INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    internal_1 DECIMAL(5,2) NOT NULL DEFAULT 0,
    internal_2 DECIMAL(5,2) NOT NULL DEFAULT 0,
    assignment DECIMAL(5,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    total_classes INT NOT NULL DEFAULT 0,
    present_classes INT NOT NULL DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- password = "password"
-- admin = full rights (add/edit/delete), user = view only + download results
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@example.com', 'password', 'admin'),
('Demo User', 'user@example.com', 'password', 'user');

INSERT INTO students (id, student_id, name, email, phone, course, semester) VALUES
(1, 'BCA001', 'Rahul Patel', 'rahul@example.com', '9876543210', 'BCA', 6),
(2, 'BCA002', 'Priya Singh', 'priya@example.com', '8765432109', 'BCA', 4),
(3, 'BCA003', 'Amit Kumar', 'amit@example.com', '7654321098', 'BCA', 6),
(4, 'BCA004', 'Neha Sharma', 'neha@example.com', '6543210987', 'BCA', 5),
(5, 'BCA005', 'Sunil Roy', 'sunil@example.com', '5432109876', 'BCA', 6);

INSERT INTO subjects (id, code, name) VALUES
(1, 'BCA601', 'Database Management System'),
(2, 'BCA602', 'Java Programming'),
(3, 'BCA603', 'Computer Networks'),
(4, 'BCA604', 'Web Development'),
(5, 'BCA605', 'Software Engineering');

INSERT INTO marks (id, student_id, subject_id, internal_1, internal_2, assignment) VALUES
(1, 1, 1, 70, 65, 80),
(2, 1, 2, 60, 72, 72),
(3, 1, 3, 55, 60, 68),
(4, 2, 1, 85, 78, 90),
(5, 2, 2, 80, 82, 88),
(6, 3, 1, 45, 50, 55),
(7, 4, 2, 75, 78, 75);

INSERT INTO attendance (id, student_id, subject_id, total_classes, present_classes) VALUES
(1, 1, 1, 40, 32),
(2, 1, 2, 36, 27),
(3, 2, 1, 40, 38),
(4, 2, 2, 36, 20),
(5, 3, 1, 40, 22),
(6, 4, 2, 36, 30);
