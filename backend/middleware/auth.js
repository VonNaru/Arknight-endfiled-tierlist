import { supabase } from '../config/supabase.js';

// Middleware untuk cek apakah user adalah admin (token-based)
export async function isAdmin(req, res, next) {
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
    
    // Get user profile untuk cek role
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Profile error:', profileError);
      // Jika profile tidak ada (status 406), kemungkinan user baru atau data corrupt
      if (profileError.code === 'PGRST116') {
        // Coba buat profile baru
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            username: user.user_metadata?.username || user.email?.split('@')[0],
            role: 'user'
          });
        
        if (insertError) {
          console.error('Error creating user profile:', insertError);
          return res.status(403).json({ error: 'Akses ditolak. Profil user tidak dapat dibuat.' });
        }
      } else {
        return res.status(403).json({ error: 'Akses ditolak. Hanya admin yang dapat melakukan aksi ini.' });
      }
    }
    
    if (!profile || profile.role !== 'admin') {
      return res.status(403).json({ error: 'Akses ditolak. Hanya admin yang dapat melakukan aksi ini.' });
    }
    
    req.user = {
      id: user.id,
      email: user.email,
      username: profile.username,
      role: profile.role
    };
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Middleware untuk verifikasi login (token-based)
export async function authenticate(req, res, next) {
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
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    // Jika profile tidak ada, coba buat
    if (!profile) {
      const { data: newProfile } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0],
          role: 'user'
        })
        .select('*')
        .single();
      
      req.user = {
        id: user.id,
        email: user.email,
        username: newProfile?.username || user.user_metadata?.username,
        role: newProfile?.role || 'user'
      };
    } else {
      req.user = {
        id: user.id,
        email: user.email,
        username: profile?.username || user.user_metadata?.username,
        role: profile?.role || 'user'
      };
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
