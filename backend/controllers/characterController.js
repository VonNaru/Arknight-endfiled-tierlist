import { supabase } from '../config/supabase.js';

// Get all characters
export async function getAllCharacters(req, res) {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        id,
        name,
        tier,
        skill,
        ultimate,
        image_url,
        element_id,
        elements(name),
        rarity_id,
        rarities(name, stars, display_text),
        role_id,
        roles(name, display_text, icon),
        weapon_id,
        weapons(name, weapon_type)
      `)
      .order('rarity', { ascending: false })
      .order('name');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get character by ID
export async function getCharacterById(req, res) {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Character not found' });
      }
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Add new character
export async function addCharacter(req, res) {
  try {
    const { name, element, rarity, role, tier, skill, ultimate, image_url } = req.body;
    
    const { data, error } = await supabase
      .from('characters')
      .insert([{
        name,
        element,
        rarity,
        role,
        tier: tier || 'T3',
        skill,
        ultimate,
        image_url
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({ 
      id: data.id,
      message: 'Character added successfully',
      data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update character
export async function updateCharacter(req, res) {
  try {
    const { id } = req.params;
    const { name, element, rarity, role, tier, skill, ultimate, image_url } = req.body;
    
    const { data, error } = await supabase
      .from('characters')
      .update({
        name,
        element,
        rarity,
        role,
        tier,
        skill,
        ultimate,
        image_url
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ 
      message: 'Character updated successfully',
      data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete character
export async function deleteCharacter(req, res) {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get character ratings
export async function getCharacterRatings(req, res) {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('character_id', id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Add rating to character
export async function addRating(req, res) {
  try {
    const { id } = req.params;
    const { rating, review, user_name, user_id } = req.body;
    
    const { data, error } = await supabase
      .from('ratings')
      .insert([{
        character_id: id,
        rating,
        review,
        user_name,
        user_id
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({ 
      id: data.id,
      message: 'Rating added successfully',
      data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET all characters dengan relasi
export const getAllCharacters = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        id,
        name,
        tier,
        skill,
        ultimate,
        image_url,
        element_id,
        elements(name),
        rarity_id,
        rarities(name, stars, display_text),
        role_id,
        roles(name, display_text, icon),
        weapon_id,
        weapons(name, weapon_type)
      `);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
