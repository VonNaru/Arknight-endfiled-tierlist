import { supabase } from '../config/supabase.js';

// Get all favorites for a user
export async function getUserFavorites(req, res) {
  try {
    // Get userId from Supabase Auth token
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized - No valid session' });
    }

    const userId = user.id;

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        user_id,
        character_id,
        tiers_id,
        notes,
        created_at,
        tiers(id, name, color_code),
        characters (
          id,
          name,
          image_url,
          tiers(name, color_code),
          elements(name, color_code),
          rarities(name, display_text),
          roles(name),
          weapons(name, damage)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Flatten structure untuk kompatibilitas
    const favorites = data.map(fav => ({
      id: fav.id,
      user_id: fav.user_id,
      character_id: fav.character_id,
      tiers_id: fav.tiers_id,
      tier_name: fav.tiers?.name,
      tier_color: fav.tiers?.color_code,
      notes: fav.notes,
      created_at: fav.created_at,
      name: fav.characters.name,
      element_name: fav.characters.elements?.name,
      rarity_name: fav.characters.rarities?.name,
      role_name: fav.characters.roles?.name,
      weapon_name: fav.characters.weapons?.name,
      image_url: fav.characters.image_url
    }));

    res.json(favorites);
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
}

// Add character to favorites
export async function addFavorite(req, res) {
  try {
    // Get userId from Supabase Auth token
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized - No valid session' });
    }

    const { characterId, tiersId, notes } = req.body;

    if (!characterId || !tiersId) {
      return res.status(400).json({ 
        error: 'Character ID and Tier ID are required' 
      });
    }

    // Insert favorite (UNIQUE constraint akan handle duplicate)
    const { data, error } = await supabase
      .from('favorites')
      .insert([{
        user_id: user.id,
        character_id: characterId,
        tiers_id: tiersId,
        notes: notes || null
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Duplicate key
        return res.status(400).json({ error: 'Character already in favorites' });
      }
      throw error;
    }

    res.status(201).json({
      message: 'Character added to favorites',
      favorite: data
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
}

// Update favorite
export async function updateFavorite(req, res) {
  try {
    const { id } = req.params;
    const { tiersId, notes } = req.body;

    if (!tiersId) {
      return res.status(400).json({ error: 'Tier ID is required' });
    }

    const { data, error } = await supabase
      .from('favorites')
      .update({
        tiers_id: tiersId,
        notes: notes || null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Favorite updated successfully',
      favorite: data
    });
  } catch (error) {
    console.error('Error updating favorite:', error);
    res.status(500).json({ error: 'Failed to update favorite' });
  }
}

// Delete favorite
export async function deleteFavorite(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Favorite deleted successfully' });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
}
