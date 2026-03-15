import { supabase } from './config/supabase.js';

async function fixYvonneSkills() {
  try {
    console.log('🔧 Fixing Yvonne skills assignment...\n');
    
    const yvonneCorrectId = '6da1945a-af2b-4031-813a-37951fed089a';
    const wrongCharacterId = '769c8a4c-554e-4517-b317-da0184fed04f';
    
    // Get the skills from wrong character_id
    console.log('1️⃣ Fetching skills from wrong character_id...');
    const { data: wrongSkills, error: fetchError } = await supabase
      .from('character_skills')
      .select('*')
      .eq('character_id', wrongCharacterId)
      .single();
    
    if (fetchError) {
      console.error('❌ Error fetching:', fetchError.message);
      return;
    }
    
    console.log('✅ Found skills data\n');
    
    // Update Yvonne's skills row with this data
    console.log('2️⃣ Updating Yvonne skills row with correct data...');
    const { data: updatedSkills, error: updateError } = await supabase
      .from('character_skills')
      .update({
        basic_attack_name: wrongSkills.basic_attack_name,
        basic_attack_description: wrongSkills.basic_attack_description,
        normal_skill_name: wrongSkills.normal_skill_name,
        normal_skill_description: wrongSkills.normal_skill_description,
        combo_skill_name: wrongSkills.combo_skill_name,
        combo_skill_description: wrongSkills.combo_skill_description,
        ultimate_name: wrongSkills.ultimate_name,
        ultimate_description: wrongSkills.ultimate_description,
        potential_1_name: wrongSkills.potential_1_name,
        potential_1_description: wrongSkills.potential_1_description,
        potential_2_name: wrongSkills.potential_2_name,
        potential_2_description: wrongSkills.potential_2_description,
        potential_3_name: wrongSkills.potential_3_name,
        potential_3_description: wrongSkills.potential_3_description,
        potential_4_name: wrongSkills.potential_4_name,
        potential_4_description: wrongSkills.potential_4_description,
        potential_5_name: wrongSkills.potential_5_name,
        potential_5_description: wrongSkills.potential_5_description,
        talent_1_name: wrongSkills.talent_1_name,
        talent_1_description: wrongSkills.talent_1_description,
        talent_2_name: wrongSkills.talent_2_name,
        talent_2_description: wrongSkills.talent_2_description
      })
      .eq('character_id', yvonneCorrectId)
      .select();
    
    if (updateError) {
      console.error('❌ Error updating:', updateError.message);
      return;
    }
    
    console.log('✅ Updated Yvonne skills!\n');
    
    console.log('📋 Verification - Updated fields:');
    console.log('─'.repeat(60));
    console.log('basic_attack_name:', updatedSkills[0].basic_attack_name);
    console.log('normal_skill_name:', updatedSkills[0].normal_skill_name);
    console.log('combo_skill_name:', updatedSkills[0].combo_skill_name);
    console.log('ultimate_name:', updatedSkills[0].ultimate_name);
    console.log('potential_1_name:', updatedSkills[0].potential_1_name);
    console.log('talent_1_name:', updatedSkills[0].talent_1_name);
    console.log('─'.repeat(60));
    
    console.log('\n✅ SUCCESS! Yvonne skills now correctly assigned!');
    console.log('   Refresh the browser to see the changes.');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixYvonneSkills();
