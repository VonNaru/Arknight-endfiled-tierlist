-- ============================================
-- FIX MISSING RLS POLICIES
-- Mengatasi masalah RLS yang belum diaktifkan
-- ============================================

-- ============================================
-- 1. FIX USER_PROFILES TABLE
-- ============================================

-- Drop existing policies jika ada
DROP POLICY IF EXISTS "System can insert user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Pastikan RLS enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Insert policy untuk trigger function (SECURITY DEFINER memungkinkan bypass dengan CHECK (true))
CREATE POLICY "System can insert user profiles"
    ON user_profiles FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

-- Select policy - users dapat melihat profil mereka sendiri
CREATE POLICY "Users can read own profile"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Update policy - users dapat update profil mereka sendiri
CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. CREATE ELEMENTS TABLE (jika belum ada)
-- ============================================

CREATE TABLE IF NOT EXISTS elements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    color_code TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE elements ENABLE ROW LEVEL SECURITY;

-- Anyone can read elements
CREATE POLICY "Anyone can read elements"
    ON elements FOR SELECT
    TO authenticated, anon
    USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Only admins can insert elements"
    ON elements FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update elements"
    ON elements FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete elements"
    ON elements FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- 3. CREATE RARITIES TABLE (jika belum ada)
-- ============================================

CREATE TABLE IF NOT EXISTS rarities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    level INTEGER UNIQUE,
    color_code TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE rarities ENABLE ROW LEVEL SECURITY;

-- Anyone can read rarities
CREATE POLICY "Anyone can read rarities"
    ON rarities FOR SELECT
    TO authenticated, anon
    USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Only admins can insert rarities"
    ON rarities FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update rarities"
    ON rarities FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete rarities"
    ON rarities FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- 4. CREATE ROLES TABLE (jika belum ada)
-- ============================================

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    color_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Anyone can read roles
CREATE POLICY "Anyone can read roles"
    ON roles FOR SELECT
    TO authenticated, anon
    USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Only admins can insert roles"
    ON roles FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update roles"
    ON roles FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete roles"
    ON roles FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- 5. VERIFY CHARACTERS TABLE POLICIES
-- ============================================

-- Drop existing character policies
DROP POLICY IF EXISTS "Anyone can read characters" ON characters;
DROP POLICY IF EXISTS "Only admins can insert characters" ON characters;
DROP POLICY IF EXISTS "Only admins can update characters" ON characters;
DROP POLICY IF EXISTS "Only admins can delete characters" ON characters;

-- Pastikan RLS enabled
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Recreate with proper policies
CREATE POLICY "Anyone can read characters"
    ON characters FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Only admins can insert characters"
    ON characters FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update characters"
    ON characters FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

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
-- 6. SAMPLE DATA (Optional)
-- ============================================

-- Insert sample elements
INSERT INTO elements (name, color_code, description) VALUES
('Physical', '#8B4513', 'Physical element'),
('Fire', '#FF6B6B', 'Fire element'),
('Ice', '#4ECDC4', 'Ice/Frost element'),
('Electric', '#FFD93D', 'Electric/Lightning element'),
('Ether', '#9B59B6', 'Ether/Mystical element')
ON CONFLICT DO NOTHING;

-- Insert sample rarities
INSERT INTO rarities (name, level, color_code, description) VALUES
('6 Star', 6, '#FFD700', 'Legendary rarity'),
('5 Star', 5, '#C0C0C0', 'Epic rarity'),
('4 Star', 4, '#87CEEB', 'Rare rarity'),
('3 Star', 3, '#90EE90', 'Uncommon rarity'),
('2 Star', 2, '#D3D3D3', 'Common rarity'),
('1 Star', 1, '#A9A9A9', 'Basic rarity')
ON CONFLICT DO NOTHING;

-- Insert sample roles
INSERT INTO roles (name, color_code, description) VALUES
('Attacker', '#FF6B6B', 'Offensive role'),
('Support', '#87CEEB', 'Support role'),
('Defender', '#90EE90', 'Defensive role'),
('Stun', '#FFD93D', 'Crowd control role'),
('Healing', '#87CEEB', 'Healing role')
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION COMMANDS
-- ============================================

-- Jalankan query di bawah untuk verify RLS policies sudah benar:
-- 
-- SELECT schemaname, tablename 
-- FROM pg_tables 
-- WHERE tablename IN ('characters', 'user_profiles', 'elements', 'rarities', 'roles');
--
-- SELECT tablename, (SELECT count(*) FROM information_schema.role_table_grants 
-- WHERE table_name = t.tablename AND is_grantable='NO') 
-- FROM pg_tables t 
-- WHERE schemaname='public' AND tablename IN ('characters', 'user_profiles', 'elements', 'rarities', 'roles');
--
-- \d+ characters
-- \d+ user_profiles
-- \d+ elements
-- \d+ rarities
-- \d+ roles
