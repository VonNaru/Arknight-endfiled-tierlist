const API_URL = 'http://localhost:3001/api';

async function testAPI() {
  try {
    console.log('🔍 Testing API...\n');
    
    // 1. Test getting all characters
    console.log('1️⃣ Fetching all characters...');
    const charsRes = await fetch(`${API_URL}/characters`);
    const characters = await charsRes.json();
    console.log(`Found ${characters.length} characters`);
    
    // Find Yvonne
    const yvonne = characters.find(c => c.name === 'Yvonne');
    if (!yvonne) {
      console.error('❌ Yvonne not found');
      console.log('Available characters:', characters.map(c => c.name));
      return;
    }
    
    console.log(`\n2️⃣ Found Yvonne`);
    console.log('Yvonne ID:', yvonne.id);
    console.log('Yvonne full data:', yvonne);
    
    // 2. Test getting Yvonne skills
    console.log(`\n3️⃣ Fetching skills for character ID: ${yvonne.id}`);
    const skillsRes = await fetch(`${API_URL}/characters/skills/${yvonne.id}`);
    const skills = await skillsRes.json();
    console.log('\n✅ Skills API Response:');
    console.log(JSON.stringify(skills, null, 2));
    
    console.log('\n📋 Summary:');
    console.log('- basic_attack_name:', skills.basic_attack_name);
    console.log('- normal_skill_name:', skills.normal_skill_name);
    console.log('- combo_skill_name:', skills.combo_skill_name);
    console.log('- ultimate_name:', skills.ultimate_name);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
