import { supabase } from '../config/supabase.js';

// Signup user - Menggunakan Supabase Auth
export async function signup(req, res) {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, dan password diperlukan' });
  }
  
  try {
    // Sign up dengan Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    });
    
    if (error) throw error;
    
    res.status(201).json({
      message: 'User berhasil didaftarkan',
      user: {
        id: data.user.id,
        email: data.user.email,
        username: username
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Login user - Menggunakan Supabase Auth
export async function login(req, res) {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password diperlukan' });
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Get user profile untuk cek role
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.error('Profile error:', profileError);
    }
    
    res.json({
      message: 'Login berhasil',
      user: {
        id: data.user.id,
        email: data.user.email,
        username: profile?.username || data.user.user_metadata?.username,
        role: profile?.role || 'user'
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Email atau password salah' });
  }
}

// Check if user is admin
export async function checkAdmin(req, res) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token tidak ditemukan' });
    }
    
    const token = authHeader.substring(7);
    
    // Verify token dengan Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Token tidak valid' });
    }
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Profile error:', profileError);
      return res.status(500).json({ error: 'Gagal mengambil data user' });
    }
    
    res.json({
      isAdmin: profile.role === 'admin',
      role: profile.role,
      username: profile.username
    });
  } catch (error) {
    console.error('Check admin error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Logout user
export async function logout(req, res) {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    res.json({ message: 'Logout berhasil' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Get current user
export async function getCurrentUser(req, res) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token tidak ditemukan' });
    }
    
    const token = authHeader.substring(7);
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Token tidak valid' });
    }
    
    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    res.json({
      id: user.id,
      email: user.email,
      username: profile?.username || user.user_metadata?.username,
      role: profile?.role || 'user'
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: error.message });
  }
}
