import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db; // Characters database
let authDb; // Authentication database

// Initialize databases
export async function initializeDatabase() {
  const SQL = await initSqlJs();
  
  // Initialize Characters Database
  const dbPath = join(__dirname, 'zzz_characters.db');
  if (existsSync(dbPath)) {
    const buffer = readFileSync(dbPath);
    db = new SQL.Database(buffer);
    console.log('Characters database loaded from file');
  } else {
    db = new SQL.Database();
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    db.exec(schema);
    saveDatabase();
    console.log('Characters database initialized successfully');
  }
  
  // Initialize Auth Database
  const authDbPath = join(__dirname, 'auth.db');
  if (existsSync(authDbPath)) {
    const buffer = readFileSync(authDbPath);
    authDb = new SQL.Database(buffer);
    console.log('Auth database loaded from file');
  } else {
    authDb = new SQL.Database();
    const authSchema = readFileSync(join(__dirname, 'auth_schema.sql'), 'utf-8');
    authDb.exec(authSchema);
    saveAuthDatabase();
    console.log('Auth database initialized successfully');
  }
}

// Save characters database to file
export function saveDatabase() {
  const dbPath = join(__dirname, 'zzz_characters.db');
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(dbPath, buffer);
}

// Save auth database to file
export function saveAuthDatabase() {
  const authDbPath = join(__dirname, 'auth.db');
  const data = authDb.export();
  const buffer = Buffer.from(data);
  writeFileSync(authDbPath, buffer);
}

// Get characters database instance
export function getDb() {
  return db;
}

// Get auth database instance
export function getAuthDb() {
  return authDb;
}

export default { initializeDatabase, getDb, getAuthDb, saveDatabase, saveAuthDatabase };
