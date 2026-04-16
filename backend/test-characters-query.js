import { supabase } from './config/supabase.js';

async function testCharacters() {
  console.log('Testing /api/characters endpoint...');
  
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('name')
      .limit(1);
    
    if (error) {
      console.error('Query error:', error);
      return;
    }
    
    console.log('✓ Query successful!');
    console.log('Rows returned:', data.length);
    if (data.length > 0) {
      console.log('First row:', JSON.stringify(data[0], null, 2));
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

testCharacters();
