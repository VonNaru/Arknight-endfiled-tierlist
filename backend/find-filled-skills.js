import { supabase } from './config/supabase.js';

async function findSkillsWithData() {
  try {
    console.log('🔍 Checking all character_skills rows for data...\n');
    
    // Get ALL character_skills
    const { data: allSkills, error: skillsError } = await supabase
      .from('character_skills')
      .select('*');
    
    if (skillsError) {
      console.error('❌ Error:', skillsError.message);
      return;
    }
    
    console.log(`Found total ${allSkills.length} character_skills rows\n`);
    
    // Check each row for data
    allSkills.forEach((skill, idx) => {
      const basicAttackName = skill.basic_attack_name;
      const normalSkillName = skill.normal_skill_name;
      const hasData = (basicAttackName && basicAttackName.trim() !== '') || 
                      (normalSkillName && normalSkillName.trim() !== '');
      
      console.log(`\nRow ${idx + 1}:`);
      console.log(`  character_id: ${skill.character_id}`);
      console.log(`  basic_attack_name: "${basicAttackName}"`);
      console.log(`  normal_skill_name: "${normalSkillName}"`);
      console.log(`  combo_skill_name: "${skill.combo_skill_name}"`);
      console.log(`  ultimate_name: "${skill.ultimate_name}"`);
      console.log(`  Has Data: ${hasData ? '✅ YES' : '❌ NO'}`);
    });
    
    // Now check characters table to get Yvonne's actual ID
    console.log('\n' + '─'.repeat(60));
    console.log('\n📍 Checking characters table for Yvonne...\n');
    
    const { data: characters, error: charError } = await supabase
      .from('characters')
      .select('id, name')
      .eq('name', 'Yvonne');
    
    if (charError) {
      console.error('❌ Error:', charError.message);
      return;
    }
    
    if (characters && characters.length > 0) {
      characters.forEach(char => {
        console.log(`Found Yvonne: ${char.id}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

findSkillsWithData();
