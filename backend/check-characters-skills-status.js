import { supabase } from './config/supabase.js';

async function checkCharactersAndSkills() {
  try {
    console.log('📋 Checking characters table and skills status...\n');
    
    // Get all characters
    const { data: characters, error: charError } = await supabase
      .from('characters')
      .select('id, name')
      .order('name', { ascending: true });
    
    if (charError) {
      console.error('❌ Error getting characters:', charError.message);
      return;
    }
    
    // Get all character skills
    const { data: skills, error: skillError } = await supabase
      .from('character_skills')
      .select('character_id, character_name');
    
    if (skillError) {
      console.error('❌ Error getting skills:', skillError.message);
      return;
    }
    
    console.log(`📍 Total Characters: ${characters.length}`);
    console.log(`🎯 Total Characters with Skills: ${skills.length}\n`);
    console.log('═'.repeat(80));
    
    // Get character IDs with skills
    const skillCharacterIds = new Set(skills.map(s => s.character_id));
    
    console.log('\n✅ CHARACTERS WITH SKILLS:');
    console.log('─'.repeat(80));
    skills.forEach((skill, idx) => {
      const charName = skill.character_name || '(NO NAME)';
      console.log(`[${idx + 1}] ${charName} (ID: ${skill.character_id})`);
    });
    
    console.log('\n❌ CHARACTERS WITHOUT SKILLS:');
    console.log('─'.repeat(80));
    const charactersWithoutSkills = characters.filter(c => !skillCharacterIds.has(c.id));
    
    if (charactersWithoutSkills.length === 0) {
      console.log('✨ Semua characters sudah punya skills!');
    } else {
      charactersWithoutSkills.forEach((char, idx) => {
        console.log(`[${idx + 1}] ${char.name} (ID: ${char.id})`);
      });
      console.log(`\n⚠️  Total ${charactersWithoutSkills.length} characters belum punya skill data`);
    }
    
    console.log('\n' + '═'.repeat(80));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkCharactersAndSkills();
