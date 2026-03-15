import { supabase } from './config/supabase.js';

async function inspectCharacterSkillsTable() {
  try {
    console.log('🔍 Inspecting character_skills table structure...\n');
    
    // Get one row dari character_skills tanpa filter
    const { data: skills, error: skillsError } = await supabase
      .from('character_skills')
      .select('*')
      .limit(1)
      .single();
    
    if (skillsError) {
      console.error('❌ Error:', skillsError.message);
      return;
    }
    
    if (!skills) {
      console.log('❌ No skills found in table');
      return;
    }
    
    console.log('📋 Actual columns in character_skills table:');
    console.log('─'.repeat(60));
    
    const allKeys = Object.keys(skills);
    
    allKeys.forEach(key => {
      const value = skills[key];
      console.log(`${key}: ${typeof value} = ${JSON.stringify(value).substring(0, 80)}`);
    });
    
    console.log('─'.repeat(60));
    console.log(`\n✅ Total columns: ${allKeys.length}`);
    console.log('\nAll column names:');
    console.log(allKeys.join(', '));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

inspectCharacterSkillsTable();
