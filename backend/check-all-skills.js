import { supabase } from './config/supabase.js';

async function getAllCharacterSkills() {
  try {
    console.log('📊 Mengambil semua data dari character_skills...\n');
    
    // Get all skills dari character_skills
    const { data: skills, error } = await supabase
      .from('character_skills')
      .select('*')
      .order('character_name', { ascending: true });
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    if (!skills || skills.length === 0) {
      console.log('❌ Tidak ada data di tabel character_skills');
      return;
    }
    
    console.log(`✅ Total skills di database: ${skills.length}\n`);
    console.log('═'.repeat(80));
    
    skills.forEach((skill, index) => {
      console.log(`\n[${index + 1}] ${skill.character_name}`);
      console.log('─'.repeat(80));
      console.log(`ID: ${skill.id}`);
      console.log(`Character ID: ${skill.character_id}`);
      console.log(`Created: ${new Date(skill.created_at).toLocaleString()}`);
      console.log(`Updated: ${new Date(skill.updated_at).toLocaleString()}`);
      console.log('\n🎯 SKILLS BREAKDOWN:');
      console.log(`  • Basic Attack: ${skill.basic_attack_name}`);
      console.log(`  • Battle Skill: ${skill.normal_skill_name}`);
      console.log(`  • Combo Skill: ${skill.combo_skill_name}`);
      console.log(`  • Ultimate: ${skill.ultimate_name}`);
      console.log(`  • Talent 1: ${skill.talent_1_name}`);
      console.log(`  • Talent 2: ${skill.talent_2_name}`);
    });
    
    console.log('\n' + '═'.repeat(80));
    console.log(`\n✨ Summary: Total ${skills.length} character(s) dengan skill data\n`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getAllCharacterSkills();
