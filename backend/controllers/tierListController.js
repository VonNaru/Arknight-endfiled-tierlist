import { getDb, saveDatabase } from '../database/db.js';

// Helper function to execute SELECT queries
function executeQuery(query, params = []) {
  const db = getDb();
  const stmt = db.prepare(query);
  if (params.length > 0) {
    stmt.bind(params);
  }
  
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Helper function to execute INSERT/UPDATE/DELETE
function executeUpdate(query, params = []) {
  const db = getDb();
  db.run(query, params);
  saveDatabase();
}

// Get all tier lists
export function getAllTierLists(req, res) {
  try {
    const tierLists = executeQuery(`
      SELECT tl.*, COUNT(tli.id) as item_count 
      FROM tier_lists tl
      LEFT JOIN tier_list_items tli ON tl.id = tli.tier_list_id
      GROUP BY tl.id
      ORDER BY tl.created_at DESC
    `);
    
    res.json(tierLists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get tier list by ID with items
export function getTierListById(req, res) {
  try {
    const { id } = req.params;
    
    const tierLists = executeQuery('SELECT * FROM tier_lists WHERE id = ?', [id]);
    
    if (tierLists.length === 0) {
      return res.status(404).json({ error: 'Tier list not found' });
    }
    
    const items = executeQuery(`
      SELECT tli.*, c.name, c.element, c.rarity, c.role, c.image_url
      FROM tier_list_items tli
      JOIN characters c ON tli.character_id = c.id
      WHERE tli.tier_list_id = ?
      ORDER BY tli.tier
    `, [id]);
    
    res.json({ ...tierLists[0], items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Create new tier list
export function createTierList(req, res) {
  try {
    const { user_name, items } = req.body;
    
    executeUpdate('INSERT INTO tier_lists (user_name) VALUES (?)', [user_name]);
    const tierListId = executeQuery('SELECT last_insert_rowid() as id')[0].id;
    
    if (items && items.length > 0) {
      items.forEach(item => {
        executeUpdate(
          'INSERT INTO tier_list_items (tier_list_id, character_id, tier) VALUES (?, ?, ?)',
          [tierListId, item.character_id, item.tier]
        );
      });
    }
    
    res.status(201).json({ 
      id: tierListId,
      message: 'Tier list created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update tier list
export function updateTierList(req, res) {
  try {
    const { id } = req.params;
    const { user_name, items } = req.body;
    
    executeUpdate('UPDATE tier_lists SET user_name = ? WHERE id = ?', [user_name, id]);
    executeUpdate('DELETE FROM tier_list_items WHERE tier_list_id = ?', [id]);
    
    if (items && items.length > 0) {
      items.forEach(item => {
        executeUpdate(
          'INSERT INTO tier_list_items (tier_list_id, character_id, tier) VALUES (?, ?, ?)',
          [id, item.character_id, item.tier]
        );
      });
    }
    
    res.json({ message: 'Tier list updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete tier list
export function deleteTierList(req, res) {
  try {
    const { id } = req.params;
    
    executeUpdate('DELETE FROM tier_list_items WHERE tier_list_id = ?', [id]);
    executeUpdate('DELETE FROM tier_lists WHERE id = ?', [id]);
    
    res.json({ message: 'Tier list deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
