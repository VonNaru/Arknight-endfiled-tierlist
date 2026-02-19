import { supabase } from './config/supabase.js';

async function createAdmin() {
  console.log('🔐 Creating admin user...\n');
  
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'Admin123!';
  
  try {
    // 1. Sign up admin user
    console.log('Step 1: Creating user account...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          username: 'admin'
        }
      }
    });
    
    if (signUpError) {
      // Cek apakah user sudah ada
      if (signUpError.message.includes('already registered')) {
        console.log('⚠️  User already exists, trying to login...\n');
        
        // Login untuk dapat user ID
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword
        });
        
        if (loginError) {
          console.log('❌ Login failed. Password might be different.');
          console.log('   Try resetting password in Supabase Dashboard.\n');
          return;
        }
        
        console.log('✅ Login successful!');
        console.log('   User ID:', loginData.user.id);
        
        // Update role to admin
        await updateUserRole(loginData.user.id);
        return;
      } else {
        throw signUpError;
      }
    }
    
    console.log('✅ User account created!');
    console.log('   User ID:', signUpData.user.id);
    console.log('   Email:', adminEmail);
    console.log('\n⚠️  CHECK YOUR EMAIL to confirm the account!');
    console.log('   Or disable email confirmation in Supabase Dashboard:');
    console.log('   Authentication → Settings → Email Auth → Disable "Confirm email"');
    
    // 2. Update user profile to admin role
    await updateUserRole(signUpData.user.id);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function updateUserRole(userId) {
  console.log('\nStep 2: Setting admin role...');
  
  const { error } = await supabase
    .from('user_profiles')
    .upsert({ 
      id: userId, 
      role: 'admin' 
    });
  
  if (error) {
    console.error('❌ Failed to set admin role:', error.message);
    console.log('\n📝 Manual SQL needed:');
    console.log(`   INSERT INTO user_profiles (id, role)`);
    console.log(`   VALUES ('${userId}', 'admin')`);
    console.log(`   ON CONFLICT (id) DO UPDATE SET role = 'admin';`);
  } else {
    console.log('✅ Admin role set successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ ADMIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@zzz.com');
    console.log('🔑 Password: Admin123!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
}

createAdmin().catch(console.error);
