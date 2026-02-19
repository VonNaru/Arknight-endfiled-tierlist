import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function addFavoritesTable() {
  const SQL = await initSqlJs();
  
  const dbPath = join(__dirname, 'zzz_characters.db');
  
  if (!existsSync(dbPath)) {
    console.log('Database file not found!');
    return;
  }

  // Load database
  const buffer = readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  // Check if favorites table already exists
  const tableCheck = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='favorites'");
  
  if (tableCheck.length > 0 && tableCheck[0].values.length > 0) {
    console.log('Favorites table already exists!');
    db.close();
    return;
  }

  // Create favorites table
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      character_id INTEGER NOT NULL,
      custom_tier TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (character_id) REFERENCES characters(id),
      UNIQUE(user_id, character_id)
    );
  `;

  db.run(createTableSQL);
  console.log('Favorites table created successfully!');

  // Save database
  const data = db.export();
  const newBuffer = Buffer.from(data);
  writeFileSync(dbPath, newBuffer);
  console.log('Database saved!');

  db.close();
}

addFavoritesTable().catch(console.error);
