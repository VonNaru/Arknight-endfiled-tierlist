import initSqlJs from 'sql.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function checkDatabase() {
  const SQL = await initSqlJs();
  const authDbPath = join(__dirname, 'database', 'auth.db');
  
  const buffer = readFileSync(authDbPath);
  const db = new SQL.Database(buffer);
  
  const result = db.exec('SELECT id, username, email, role, password FROM users');
  
  console.log('=== Users in database ===');
  if (result.length > 0 && result[0].values.length > 0) {
    result[0].values.forEach(row => {
      console.log(`\nID: ${row[0]}`);
      console.log(`Username: ${row[1]}`);
      console.log(`Email: ${row[2]}`);
      console.log(`Role: ${row[3]}`);
      console.log(`Password Hash: ${row[4]}`);
      
      // Test passwords
      const passwords = ['Admin123', 'admin123', 'admin'];
      console.log('\nTesting passwords:');
      passwords.forEach(pwd => {
        const isValid = bcrypt.compareSync(pwd, row[4]);
        console.log(`  "${pwd}": ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      });
    });
  } else {
    console.log('No users found in database!');
  }
  
  db.close();
}

checkDatabase().catch(console.error);
