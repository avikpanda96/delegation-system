-- ============================
-- DATABASE CREATE
-- ============================

CREATE DATABASE delegation_system;

USE delegation_system;


-- ============================
-- USERS TABLE
-- ============================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================
-- DELEGATIONS TABLE
-- ============================

CREATE TABLE delegations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,

    assigned_to INT,
    created_by INT,

    status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_assigned_user
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_created_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================
-- ACTIVITY LOGS
-- ============================

CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    action VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_log_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================
-- DEFAULT SUPERADMIN
-- password = 123456 (bcrypt later)
-- ============================

INSERT INTO users (name, email, password, role)
VALUES (
    'Super Admin',
    'superadmin@test.com',
    '$2b$10$7QJ9W0xQxQxQxQxQxQxQxOeYxqYxqYxqYxqYxqYxqYxqYxqYxqYxq', 
    'superadmin'
);