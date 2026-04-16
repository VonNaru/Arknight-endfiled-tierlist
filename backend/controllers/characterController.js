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
    console.error('Error in getAllCharacters:', error);
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
    console.error('Error in getCharacterById:', error);
    res.status(500).json({ error: error.message });
  }
}

// Add new character
export async function addCharacter(req, res) {
  try {
    const { name, elements_id, rarities_id, roles_id, weapons_id, tiers_id, character_skills_id, image_url } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const { data, error } = await supabase
      .from('characters')
      .insert([{
        name,
        elements_id,
        rarities_id,
        roles_id,
        weapons_id,
        tiers_id,
        character_skills_id,
        image_url
      }])
      .select(`
        *,
        tiers(name, color_code),
        roles(name),
        elements(name, color_code),
        weapons(name, damage),
        rarities(name, display_text)
      `)
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
    const { name, elements_id, rarities_id, roles_id, weapons_id, tiers_id, character_skills_id, image_url } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (elements_id !== undefined) updateData.elements_id = elements_id;
    if (rarities_id !== undefined) updateData.rarities_id = rarities_id;
    if (roles_id !== undefined) updateData.roles_id = roles_id;
    if (weapons_id !== undefined) updateData.weapons_id = weapons_id;
    if (tiers_id !== undefined) updateData.tiers_id = tiers_id;
    if (character_skills_id !== undefined) updateData.character_skills_id = character_skills_id;
    if (image_url !== undefined) updateData.image_url = image_url;
    
    const { data, error } = await supabase
      .from('characters')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        tiers(name, color_code),
        roles(name),
        elements(name, color_code),
        weapons(name, damage),
        rarities(name, display_text)
      `)
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
    console.log(`\n=== Fetching skills for character: ${characterId} ===`);
    
    // First verify character exists
    const { data: charCheck, error: charError } = await supabase
      .from('characters')
      .select('id, name')
      .eq('id', characterId)
      .single();
    
    if (charError) {
      console.error('Character not found:', charError);
      return res.status(404).json({ error: 'Character not found' });
    }
    console.log(`✓ Character found: ${charCheck.name}`);
    
    const { data, error } = await supabase
      .from('character_skills')
      .select('*')
      .eq('character_id', characterId)
      .single();
    
    console.log('Query error:', error);
    console.log('Query result data:', data ? 'Found' : 'Not found');
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No skills found, return empty object
        console.log('No skills found for this character, returning empty object');
        return res.json({
          character_id: characterId,
          basic_attack_name: null,
          basic_attack_description: null,
          normal_skill_name: null,
          normal_skill_description: null,
          combo_skill_name: null,
          combo_skill_description: null,
          ultimate_name: null,
          ultimate_description: null,
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
      console.error('Database error:', error.message);
      throw error;
    }
    
    console.log(`✓ Skills found with fields:`, Object.keys(data).filter(k => data[k]).length, 'fields populated');
    console.log('Basic attack name:', data.basic_attack_name);
    console.log('Normal skill name:', data.normal_skill_name);
    res.json(data);
  } catch (error) {
    console.error('Error fetching character skills:', error.message);
    res.status(500).json({ error: error.message });
  }
}
