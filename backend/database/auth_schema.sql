-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: Admin123, hashed dengan bcrypt)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@zzz.com', '$2b$10$V/GrUpStaayTLdP1EVizxOyLIykDunX7ruCEMSCOXQ.NeU5nR0TfO', 'admin');
