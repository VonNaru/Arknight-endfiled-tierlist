import { supabase } from '../config/supabase.js';

// Get all characters
export async function getAllCharacters(req, res) {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
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

// Get character skills
export async function getCharacterSkills(req, res) {
  try {
    const { characterId } = req.params;
    
    const { data, error } = await supabase
      .from('character_skills')
      .select('*')
      .eq('character_id', characterId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No skills found, return empty object
        return res.json({
          character_id: characterId,
          basic_attack_name: null,
          basic_attack_description: null,
          basic_attack_rank: 1,
          normal_skill_name: null,
          normal_skill_description: null,
          normal_skill_rank: 1,
          combo_skill_name: null,
          combo_skill_description: null,
          combo_skill_rank: 1,
          ultimate_name: null,
          ultimate_description: null,
          ultimate_rank: 1,
          potential_1_name: null,
          potential_1_description: null,
          potential_2_name: null,
          potential_2_description: null,
          potential_3_name: null,
          potential_3_description: null,
          potential_4_name: null,
          potential_4_description: null,
          potential_5_name: null,
          potential_5_description: null,
          talent_1_name: null,
          talent_1_description: null,
          talent_2_name: null,
          talent_2_description: null
        });
      }
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
