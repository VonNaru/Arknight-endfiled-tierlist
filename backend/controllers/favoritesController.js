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
        custom_tier,
        notes,
        created_at,
        characters (
          name,
          element,
          rarity,
          role,
          tier,
          skill,
          ultimate,
          image_url
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
      custom_tier: fav.custom_tier,
      notes: fav.notes,
      created_at: fav.created_at,
      name: fav.characters.name,
      element: fav.characters.element,
      rarity: fav.characters.rarity,
      role: fav.characters.role,
      original_tier: fav.characters.tier,
      skill: fav.characters.skill,
      ultimate: fav.characters.ultimate,
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
    const { userId, characterId, customTier, notes } = req.body;

    if (!userId || !characterId || !customTier) {
      return res.status(400).json({ 
        error: 'User ID, Character ID, and Custom Tier are required' 
      });
    }

    // Insert favorite (UNIQUE constraint akan handle duplicate)
    const { data, error } = await supabase
      .from('favorites')
      .insert([{
        user_id: userId,
        character_id: characterId,
        custom_tier: customTier,
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
    const { customTier, notes } = req.body;

    if (!customTier) {
      return res.status(400).json({ error: 'Custom tier is required' });
    }

    const { data, error } = await supabase
      .from('favorites')
      .update({
        custom_tier: customTier,
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
