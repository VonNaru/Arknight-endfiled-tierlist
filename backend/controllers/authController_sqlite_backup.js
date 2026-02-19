import { getAuthDb, saveAuthDatabase } from '../database/db.js';
import bcrypt from 'bcrypt';

// Dummy hash untuk mencegah timing attack - hash dari string random
const DUMMY_HASH = '$2b$10$aaaaaaaaaaaaaaaaaaaaaaaa.eeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

// Validasi email
function isValidEmail(email) {
  if (!email) return false;
  
  // Harus ada @ dan .
  if (!email.includes('@') || !email.includes('.')) {
    return false;
  }
  
  // Harus ada 'com' di akhir atau di domain
  if (!email.toLowerCase().includes('com')) {
    return false;
  }
  
  // Format dasar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validasi password
function isValidPassword(password) {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password minimal 6 karakter' };
  }
  
  // Harus ada huruf besar
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password harus mengandung minimal 1 huruf besar' };
  }
  
  // Harus ada huruf kecil
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password harus mengandung minimal 1 huruf kecil' };
  }
  
  return { valid: true };
}

// Signup user
export function signup(req, res) {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, dan password diperlukan' });
  }
  
  // Validasi email
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email tidak valid. Harus mengandung @, ., dan com' });
  }
  
  // Validasi password
  const passwordValidation = isValidPassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ error: passwordValidation.message });
  }
  
  try {
    const db = getAuthDb();
    
    // Cek apakah username sudah ada
    const checkUserStmt = db.prepare('SELECT id FROM users WHERE username = ?');
    checkUserStmt.bind([username]);
    
    if (checkUserStmt.step()) {
      checkUserStmt.free();
      return res.status(400).json({ error: 'Username sudah digunakan' });
    }
    checkUserStmt.free();
    
    // Cek apakah email sudah ada
    const checkEmailStmt = db.prepare('SELECT id FROM users WHERE email = ?');
    checkEmailStmt.bind([email]);
    
    if (checkEmailStmt.step()) {
      checkEmailStmt.free();
      return res.status(400).json({ error: 'Email sudah digunakan' });
    }
    checkEmailStmt.free();
    
    // Hash password sebelum disimpan
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    
    // Insert user baru dengan role 'user'
    const insertStmt = db.prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)');
    insertStmt.bind([username, email, hashedPassword, 'user']);
    insertStmt.step();
    insertStmt.free();
    
    // Ambil user yang baru dibuat
    const userStmt = db.prepare('SELECT id, username, email, role FROM users WHERE username = ?');
    userStmt.bind([username]);
    
    if (userStmt.step()) {
      const user = userStmt.getAsObject();
      userStmt.free();
      
      // Save auth database
      saveAuthDatabase();
      
      res.json({ 
        success: true, 
        message: 'Pendaftaran berhasil',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Login user
export function login(req, res) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password diperlukan' });
  }
  
  try {
    const db = getAuthDb();
    const stmt = db.prepare('SELECT id, username, email, password, role FROM users WHERE username = ?');
    stmt.bind([username]);
    
    let user = null;
    let hashToCompare = DUMMY_HASH; // Default ke dummy hash
    
    if (stmt.step()) {
      user = stmt.getAsObject();
      hashToCompare = user.password; // Gunakan hash asli jika user ditemukan
    }
    stmt.free();
    
    // SELALU lakukan bcrypt comparison untuk constant-time execution
    const isPasswordValid = bcrypt.compareSync(password, hashToCompare);
    
    // Hanya berhasil jika user ditemukan DAN password valid
    if (user && isPasswordValid) {
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } else {
      // Error message yang sama untuk user tidak ditemukan ATAU password salah
      res.status(401).json({ error: 'Username atau password salah' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Check if user is admin
export function checkAdmin(req, res) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password diperlukan' });
  }
  
  try {
    const db = getAuthDb();
    const stmt = db.prepare('SELECT password, role FROM users WHERE username = ?');
    stmt.bind([username]);
    
    let user = null;
    let hashToCompare = DUMMY_HASH; // Default ke dummy hash
    
    if (stmt.step()) {
      user = stmt.getAsObject();
      hashToCompare = user.password; // Gunakan hash asli jika user ditemukan
    }
    stmt.free();
    
    // SELALU lakukan bcrypt comparison untuk constant-time execution
    const isPasswordValid = bcrypt.compareSync(password, hashToCompare);
    
    // Hanya berhasil jika user ditemukan DAN password valid
    if (user && isPasswordValid) {
      res.json({ isAdmin: user.role === 'admin' });
    } else {
      // Error message yang sama untuk user tidak ditemukan ATAU password salah
      res.status(401).json({ error: 'Username atau password salah' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
