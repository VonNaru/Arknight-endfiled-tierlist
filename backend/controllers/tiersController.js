import { supabase } from '../config/supabase.js';

// Get all tiers
export async function getAllTiers(req, res) {
  try {
    const { data: tiers, error } = await supabase
      .from('tiers')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    
    res.json(tiers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get tier by ID
export async function getTierById(req, res) {
  try {
    const { id } = req.params;
    
    const { data: tier, error } = await supabase
      .from('tiers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Tier not found' });
      }
      throw error;
    }
    
    res.json(tier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Create new tier
export async function createTier(req, res) {
  try {
    // Check if user is admin (akan di-implement dengan middleware)
    const { name, color_code, description, display_order } = req.body;
    
    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Tier name is required' });
    }
    if (!color_code || !color_code.trim()) {
      return res.status(400).json({ error: 'Color code is required' });
    }
    
    const { data: tier, error } = await supabase
      .from('tiers')
      .insert([{
        name: name.trim(),
        color_code: color_code.trim(),
        description: description || null,
        display_order: display_order || 0
      }])
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Tier name already exists' });
      }
      throw error;
    }
    
    res.status(201).json(tier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update tier
export async function updateTier(req, res) {
  try {
    const { id } = req.params;
    const { name, color_code, description, display_order } = req.body;
    
    // Validation
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ error: 'Tier name cannot be empty' });
    }
    if (color_code !== undefined && !color_code.trim()) {
      return res.status(400).json({ error: 'Color code cannot be empty' });
    }
    
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (color_code !== undefined) updateData.color_code = color_code.trim();
    if (description !== undefined) updateData.description = description;
    if (display_order !== undefined) updateData.display_order = display_order;
    updateData.updated_at = new Date();
    
    const { data: tier, error } = await supabase
      .from('tiers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Tier name already exists' });
      }
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Tier not found' });
      }
      throw error;
    }
    
    res.json(tier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete tier
export async function deleteTier(req, res) {
  try {
    const { id } = req.params;
    
    // Check if tier is being used by characters
    const { data: charactersWithTier, error: checkError } = await supabase
      .from('characters')
      .select('id')
      .eq('tier_id', id)
      .limit(1);
    
    if (checkError) throw checkError;
    
    if (charactersWithTier && charactersWithTier.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete tier that is assigned to characters. Please unassign characters first.' 
      });
    }
    
    const { error } = await supabase
      .from('tiers')
      .delete()
      .eq('id', id);
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Tier not found' });
      }
      throw error;
    }
    
    res.json({ message: 'Tier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get character count per tier (untuk info)
export async function getTierStats(req, res) {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('tier_id, tiers(name)')
      .order('tier_id');
    
    if (error) throw error;
    
    // Count characters per tier
    const stats = {};
    if (data) {
      data.forEach(char => {
        const tierName = char.tiers?.name || 'Unassigned';
        stats[tierName] = (stats[tierName] || 0) + 1;
      });
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
