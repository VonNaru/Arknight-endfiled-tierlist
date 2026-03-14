import { supabase } from '../config/supabase.js';

// Get all weapons
export async function getAllWeapons(req, res) {
  try {
    const { data, error } = await supabase
      .from('weapons')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get weapon by ID
export async function getWeaponById(req, res) {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('weapons')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Add weapon (admin only)
export async function addWeapon(req, res) {
  try {
    const { name, type, rarity, effect, image_url } = req.body;
    
    const { data, error } = await supabase
      .from('weapons')
      .insert([{ name, type, rarity, effect, image_url }])
      .select();
    
    if (error) throw error;
    
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update weapon (admin only)
export async function updateWeapon(req, res) {
  try {
    const { id } = req.params;
    const { name, type, rarity, effect, image_url } = req.body;
    
    const { data, error } = await supabase
      .from('weapons')
      .update({ name, type, rarity, effect, image_url })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete weapon (admin only)
export async function deleteWeapon(req, res) {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('weapons')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ message: 'Weapon deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
