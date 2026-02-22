import { supabase } from '../config/supabase.js';

// Get all tier lists
export async function getAllTierLists(req, res) {
  try {
    const { data: tierLists, error } = await supabase
      .from('tier_lists')
      .select(`
        *,
        tier_list_items(id)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Add item_count to each tier list
    const result = tierLists.map(tl => ({
      ...tl,
      item_count: tl.tier_list_items?.length || 0,
      tier_list_items: undefined
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get tier list by ID with items
export async function getTierListById(req, res) {
  try {
    const { id } = req.params;
    
    const { data: tierList, error } = await supabase
      .from('tier_lists')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Tier list not found' });
      }
      throw error;
    }
    
    // Get items with character details
    const { data: items, error: itemsError } = await supabase
      .from('tier_list_items')
      .select(`
        *,
        characters(name, element, rarity, role, image_url)
      `)
      .eq('tier_list_id', id)
      .order('tier');
    
    if (itemsError) throw itemsError;
    
    // Flatten character data
    const flatItems = items.map(item => ({
      ...item,
      name: item.characters?.name,
      element: item.characters?.element,
      rarity: item.characters?.rarity,
      role: item.characters?.role,
      image_url: item.characters?.image_url,
      characters: undefined
    }));
    
    res.json({ ...tierList, items: flatItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Create new tier list
export async function createTierList(req, res) {
  try {
    const { user_name, items } = req.body;
    const userId = req.user?.id;
    
    const { data: tierList, error } = await supabase
      .from('tier_lists')
      .insert([{
        user_name,
        user_id: userId
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    if (items && items.length > 0) {
      const itemsToInsert = items.map(item => ({
        tier_list_id: tierList.id,
        character_id: item.character_id,
        tier: item.tier
      }));
      
      const { error: itemsError } = await supabase
        .from('tier_list_items')
        .insert(itemsToInsert);
      
      if (itemsError) throw itemsError;
    }
    
    res.status(201).json({ 
      id: tierList.id,
      message: 'Tier list created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update tier list
export async function updateTierList(req, res) {
  try {
    const { id } = req.params;
    const { user_name, items } = req.body;
    
    const { error: updateError } = await supabase
      .from('tier_lists')
      .update({ user_name })
      .eq('id', id);
    
    if (updateError) throw updateError;
    
    // Delete existing items
    const { error: deleteError } = await supabase
      .from('tier_list_items')
      .delete()
      .eq('tier_list_id', id);
    
    if (deleteError) throw deleteError;
    
    // Insert new items
    if (items && items.length > 0) {
      const itemsToInsert = items.map(item => ({
        tier_list_id: id,
        character_id: item.character_id,
        tier: item.tier
      }));
      
      const { error: insertError } = await supabase
        .from('tier_list_items')
        .insert(itemsToInsert);
      
      if (insertError) throw insertError;
    }
    
    res.json({ message: 'Tier list updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete tier list
export async function deleteTierList(req, res) {
  try {
    const { id } = req.params;
    
    // Items will be deleted automatically via CASCADE
    const { error } = await supabase
      .from('tier_lists')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ message: 'Tier list deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
