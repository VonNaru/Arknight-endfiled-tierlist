import { initializeDatabase, getDb } from './database/db.js';

async function testDatabase() {
  await initializeDatabase();
  const db = getDb();
  
  const stmt = db.prepare('SELECT * FROM characters ORDER BY rarity DESC, name');
  const results = [];
  
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  
  console.log('Total characters:', results.length);
  console.log('\nCharacters:');
  results.forEach(char => {
    console.log(`- ${char.name} (${char.element}, ${char.rarity}★, ${char.role})`);
  });
}

testDatabase().catch(console.error);
