import { getAuthDb } from '../database/db.js';
import bcrypt from 'bcrypt';

// Middleware untuk cek apakah user adalah admin
export function isAdmin(req, res, next) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(401).json({ error: 'Username dan password diperlukan' });
  }
  
  try {
    const db = getAuthDb();
    const stmt = db.prepare('SELECT id, username, email, password, role FROM users WHERE username = ?');
    stmt.bind([username]);
    
    if (stmt.step()) {
      const user = stmt.getAsObject();
      stmt.free();
      
      // Verifikasi password dengan bcrypt
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      
      if (isPasswordValid && user.role === 'admin') {
        // Jangan kirim password ke req.user
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        };
        next();
      } else {
        res.status(403).json({ error: 'Akses ditolak. Hanya admin yang dapat melakukan aksi ini.' });
      }
    } else {
      stmt.free();
      res.status(403).json({ error: 'Akses ditolak. Hanya admin yang dapat melakukan aksi ini.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Middleware untuk verifikasi login
export function authenticate(req, res, next) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(401).json({ error: 'Username dan password diperlukan' });
  }
  
  try {
    const db = getAuthDb();
    const stmt = db.prepare('SELECT id, username, email, password, role FROM users WHERE username = ?');
    stmt.bind([username]);
    
    if (stmt.step()) {
      const user = stmt.getAsObject();
      stmt.free();
      
      // Verifikasi password dengan bcrypt
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      
      if (isPasswordValid) {
        // Jangan kirim password ke req.user
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        };
        next();
      } else {
        res.status(401).json({ error: 'Username atau password salah' });
      }
    } else {
      stmt.free();
      res.status(401).json({ error: 'Username atau password salah' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
