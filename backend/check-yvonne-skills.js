import { supabase } from './config/supabase.js';

async function checkYvonneSkillsInDB() {
  try {
    console.log('🔍 Checking Yvonne skills in database...\n');
    
    // Get Yvonne skills directly
    const { data: skills, error: skillsError } = await supabase
      .from('character_skills')
      .select('*')
      .eq('character_id', '6da1945a-af2b-4031-813a-37951fed089a')
      .single();
    
    if (skillsError) {
      console.error('❌ Error fetching skills:', skillsError.message);
      return;
    }
    
    if (!skills) {
      console.log('❌ No skills found for Yvonne');
      return;
    }
    
    console.log('✅ Found Yvonne skills in database!\n');
    
    // Check each field
    console.log('📋 Skill Fields Status:');
    console.log('─'.repeat(50));
    
    const fields = [
      'basic_attack_name',
      'basic_attack_description',
      'normal_skill_name',
      'normal_skill_description',
      'combo_skill_name',
      'combo_skill_description',
      'ultimate_name',
      'ultimate_description',
      'potential_1_name',
      'potential_1_description',
      'potential_2_name',
      'potential_2_description',
      'potential_3_name',
      'potential_3_description',
      'potential_4_name',
      'potential_4_description',
      'potential_5_name',
      'potential_5_description',
      'talent_1_name',
      'talent_1_description',
      'talent_2_name',
      'talent_2_description'
    ];
    
    let filledCount = 0;
    let emptyCount = 0;
    
    fields.forEach(field => {
      const value = skills[field];
      const isEmpty = !value || value.trim() === '';
      
      if (isEmpty) {
        console.log(`❌ ${field}: (EMPTY)`);
        emptyCount++;
      } else {
        console.log(`✅ ${field}: ${value.substring(0, 50)}...`);
        filledCount++;
      }
    });
    
    console.log('─'.repeat(50));
    console.log(`\n📊 Summary: ${filledCount} filled, ${emptyCount} empty`);
    
    if (emptyCount > 0) {
      console.log('\n⚠️  Some fields are empty! Need to insert data.');
    } else {
      console.log('\n✅ All fields are populated! Frontend should display correctly.');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkYvonneSkillsInDB();
