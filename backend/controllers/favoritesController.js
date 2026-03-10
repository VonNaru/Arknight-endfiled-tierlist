import { supabase } from '../config/supabase.js';

// Get all favorites for a user
export async function getUserFavorites(req, res) {
  try {
    const userId = req.query.userId || req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        user_id,
        character_id,
        tiers_id,
        notes,
        created_at,
        tiers:tiers_id(id, name, color_code),
        characters (
          id,
          name,
          image_url,
          tiers:tiers_id(name, color_code),
          elements:elements_id(name, color),
          rarities:rarities_id(name, display_text),
          roles:roles_id(name),
          weapons:weapons_id(name, damage)
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
    const { userId, characterId, tiersId, notes } = req.body;

    if (!userId || !characterId || !tiersId) {
      return res.status(400).json({ 
        error: 'User ID, Character ID, and Tier ID are required' 
      });
    }

    // Insert favorite (UNIQUE constraint akan handle duplicate)
    const { data, error } = await supabase
      .from('favorites')
      .insert([{
        user_id: userId,
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
