import { supabase } from './config/supabase.js';

async function detailedComparison() {
  try {
    console.log('🔍 Detailed Comparison:\n');
    
    // Get all characters with ALL fields
    const { data: characters, error: charError } = await supabase
      .from('characters')
      .select('*')
      .order('name', { ascending: true });
    
    if (charError) {
      console.error('❌ Error:', charError.message);
      return;
    }
    
    console.log('━━━ TABEL CHARACTERS ━━━');
    console.log(`Total: ${characters.length} rows\n`);
    characters.forEach((char, idx) => {
      console.log(`[${idx + 1}] ${char.name || '(NO NAME)'}`);
      console.log(`    ID: ${char.id}`);
      console.log(`    Element: ${char.element}, Rarity: ${char.rarity}, Role: ${char.role}`);
      console.log(`    Weapon: ${char.weapon}, Tier: ${char.tier}`);
      console.log(`    Created: ${new Date(char.created_at).toLocaleString()}`);
      console.log('');
    });
    
    // Get all character skills with details
    const { data: skills, error: skillError } = await supabase
      .from('character_skills')
      .select('*')
      .order('character_name', { ascending: true });
    
    if (skillError) {
      console.error('❌ Error:', skillError.message);
      return;
    }
    
    console.log('\n━━━ TABEL CHARACTER_SKILLS ━━━');
    console.log(`Total: ${skills.length} rows\n`);
    skills.forEach((skill, idx) => {
      console.log(`[${idx + 1}] ${skill.character_name || '(NO NAME)'}`);
      console.log(`    ID: ${skill.id}`);
      console.log(`    Character ID: ${skill.character_id}`);
      console.log(`    Has skill data: ${skill.basic_attack_name ? '✅ YES' : '❌ NO'}`);
      if (skill.basic_attack_name) {
        console.log(`    - Basic: ${skill.basic_attack_name}`);
        console.log(`    - Battle: ${skill.normal_skill_name}`);
        console.log(`    - Combo: ${skill.combo_skill_name}`);
        console.log(`    - Ultimate: ${skill.ultimate_name}`);
      }
      console.log('');
    });
    
    // Find mismatches
    console.log('\n━━━ MISMATCH ANALYSIS ━━━');
    const charIds = new Set(characters.map(c => c.id));
    const skillCharIds = new Set(skills.map(s => s.character_id));
    
    // IDs in skills but not in characters
    const orphanSkills = skills.filter(s => !charIds.has(s.character_id));
    if (orphanSkills.length > 0) {
      console.log('\n⚠️  SKILLS WITHOUT MATCHING CHARACTER:');
      orphanSkills.forEach((s, idx) => {
        console.log(`[${idx + 1}] Character ID: ${s.character_id} (Name: ${s.character_name || 'UNKNOWN'})`);
      });
    }
    
    // IDs in characters but not in skills
    const emptyCharacters = characters.filter(c => !skillCharIds.has(c.id));
    if (emptyCharacters.length > 0) {
      console.log('\n⚠️  CHARACTERS WITHOUT SKILL DATA:');
      emptyCharacters.forEach((c, idx) => {
        console.log(`[${idx + 1}] ${c.name} (ID: ${c.id})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

detailedComparison();
