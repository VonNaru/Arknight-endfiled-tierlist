-- ============================================
-- FIX ROW LEVEL SECURITY POLICIES
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================

-- ============================================
-- FIX 1: Tambahkan INSERT POLICY untuk user_profiles
-- ============================================
-- Ini perlu ada agar trigger function bisa INSERT saat user signup
CREATE POLICY "System can insert user profiles"
    ON user_profiles FOR INSERT
    WITH CHECK (true);

-- ============================================
-- FIX 2: Drop policies lama pada characters (terlalu permisif)
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can insert characters" ON characters;
DROP POLICY IF EXISTS "Authenticated users can update characters" ON characters;
DROP POLICY IF EXISTS "Authenticated users can delete characters" ON characters;

-- ============================================
-- FIX 3: Buat policies BARU untuk characters yang check admin role
-- ============================================

-- Policy untuk INSERT - HANYA ADMIN
CREATE POLICY "Only admins can insert characters"
    ON characters FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy untuk UPDATE - HANYA ADMIN
CREATE POLICY "Only admins can update characters"
    ON characters FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy untuk DELETE - HANYA ADMIN
CREATE POLICY "Only admins can delete characters"
    ON characters FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- OPTIONAL: Tambahkan policy untuk tier_lists agar public bisa read
-- ============================================
-- Jika ingin orang bisa lihat tier lists yang dibuat orang lain:
-- CREATE POLICY "Anyone can read public tier lists"
--     ON tier_lists FOR SELECT
--     USING (true);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Jalankan queries ini untuk verify:

-- 1. Check apakah user_profiles ada:
-- SELECT * FROM user_profiles;

-- 2. Check policies pada user_profiles:
-- SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles';

-- 3. Check policies pada characters:
-- SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'characters';

-- 4. Jika ada profile yang error saat signup, create manually:
-- INSERT INTO user_profiles (id, username, role) 
-- VALUES ('user-id-from-auth', 'username', 'user');
