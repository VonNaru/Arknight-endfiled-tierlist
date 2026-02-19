import { initializeDatabase, getDb } from './database/db.js';

async function test() {
  await initializeDatabase();
  const db = getDb();
  
  const stmt = db.prepare('SELECT * FROM characters ORDER BY id');
  
  console.log('Characters in database:');
  while (stmt.step()) {
    const row = stmt.getAsObject();
    console.log(`${row.id}: ${row.name} - ${row.role} (Rarity: ${row.rarity})`);
  }
  stmt.free();
}

test().catch(console.error);
