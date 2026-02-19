import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fixAdminPassword() {
  const SQL = await initSqlJs();
  const authDbPath = join(__dirname, 'database', 'auth.db');
  
  const buffer = readFileSync(authDbPath);
  const db = new SQL.Database(buffer);
  
  // Hash password yang benar
  const correctPassword = 'Admin123';
  const hashedPassword = bcrypt.hashSync(correctPassword, 10);
  
  console.log('Fixing admin password...');
  console.log('Password (plain):', correctPassword);
  console.log('Password (hash):', hashedPassword);
  
  // Update admin password
  db.run('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, 'admin']);
  
  console.log('\n✅ Admin password updated!');
  
  // Verify
  const result = db.exec('SELECT username, password FROM users WHERE username = "admin"');
  if (result.length > 0 && result[0].values.length > 0) {
    const [username, hash] = result[0].values[0];
    console.log('\nVerifying:');
    console.log('Username:', username);
    console.log('Hash:', hash);
    console.log('Password "Admin123" valid:', bcrypt.compareSync('Admin123', hash) ? '✅ YES' : '❌ NO');
  }
  
  // Save database
  const data = db.export();
  const bufferOut = Buffer.from(data);
  writeFileSync(authDbPath, bufferOut);
  
  console.log('\n✅ Database saved!');
  
  db.close();
}

fixAdminPassword().catch(console.error);
