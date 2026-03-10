import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// Gunakan SERVICE_ROLE_KEY di server untuk bypass RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diset di .env file');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function untuk handle errors
export const handleSupabaseError = (error) => {
  console.error('Supabase Error:', error);
  return {
    success: false,
    error: error.message || 'Database error occurred'
  };
};

// Helper function untuk response sukses
export const handleSupabaseSuccess = (data) => {
  return {
    success: true,
    data
  };
};
