-- ============================================
-- SUPABASE DATABASE SCHEMA
-- Untuk ZZZ Character Analyzer
-- ============================================

-- Enable Row Level Security (RLS)
-- Supabase secara otomatis membuat id dengan UUID

-- ============================================
-- CHARACTERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    element TEXT,
    rarity INTEGER,
    role TEXT,
    weapon TEXT,
    tier TEXT DEFAULT 'T3',
    skill TEXT,  -- Kolom baru untuk skill
    ultimate TEXT,  -- Kolom baru untuk ultimate
    image_url TEXT,
    -- Combat Skills (Wajib Diisi)
    combat_skill_1_rank INTEGER NOT NULL DEFAULT 1,
    combat_skill_1_mastery INTEGER NOT NULL DEFAULT 0,
    combat_skill_2_rank INTEGER NOT NULL DEFAULT 1,
    combat_skill_2_mastery INTEGER NOT NULL DEFAULT 0,
    combat_skill_3_rank INTEGER NOT NULL DEFAULT 1,
    combat_skill_3_mastery INTEGER NOT NULL DEFAULT 0,
    combat_skill_4_rank INTEGER NOT NULL DEFAULT 1,
    combat_skill_4_mastery INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS untuk characters
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Policy: Semua orang bisa read
CREATE POLICY "Anyone can read characters"
    ON characters FOR SELECT
    TO authenticated, anon
    USING (true);

-- Policy: Hanya authenticated users bisa insert/update/delete
-- (Nanti kita akan tambah role checking untuk admin)
CREATE POLICY "Authenticated users can insert characters"
    ON characters FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update characters"
    ON characters FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete characters"
    ON characters FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- TIER LISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tier_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tier_lists ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own tier lists
CREATE POLICY "Users can read own tier lists"
    ON tier_lists FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tier lists"
    ON tier_lists FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tier lists"
    ON tier_lists FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tier lists"
    ON tier_lists FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================
-- TIER LIST ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tier_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_list_id UUID REFERENCES tier_lists(id) ON DELETE CASCADE,
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    tier TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tier_list_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage tier list items for their own tier lists
CREATE POLICY "Users can read own tier list items"
    ON tier_list_items FOR SELECT
    TO authenticated
    USING (
        tier_list_id IN (
            SELECT id FROM tier_lists WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own tier list items"
    ON tier_list_items FOR INSERT
    TO authenticated
    WITH CHECK (
        tier_list_id IN (
            SELECT id FROM tier_lists WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own tier list items"
    ON tier_list_items FOR UPDATE
    TO authenticated
    USING (
        tier_list_id IN (
            SELECT id FROM tier_lists WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own tier list items"
    ON tier_list_items FOR DELETE
    TO authenticated
    USING (
        tier_list_id IN (
            SELECT id FROM tier_lists WHERE user_id = auth.uid()
        )
    );

-- ============================================
-- RATINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    review TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read ratings
CREATE POLICY "Anyone can read ratings"
    ON ratings FOR SELECT
    TO authenticated, anon
    USING (true);

-- Policy: Authenticated users can create ratings
CREATE POLICY "Authenticated users can insert ratings"
    ON ratings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own ratings
CREATE POLICY "Users can update own ratings"
    ON ratings FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own ratings
CREATE POLICY "Users can delete own ratings"
    ON ratings FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================
-- FAVORITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    custom_tier TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, character_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own favorites
CREATE POLICY "Users can read own favorites"
    ON favorites FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
    ON favorites FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites"
    ON favorites FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
    ON favorites FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================
-- USER PROFILES TABLE (Untuk custom data)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- ============================================
-- SAMPLE DATA (Opsional - jalankan setelah tabel dibuat)
-- ============================================

-- Insert sample characters
INSERT INTO characters (
    name, element, rarity, role, weapon, tier, skill, ultimate, image_url,
    combat_skill_1_rank, combat_skill_1_mastery,
    combat_skill_2_rank, combat_skill_2_mastery,
    combat_skill_3_rank, combat_skill_3_mastery,
    combat_skill_4_rank, combat_skill_4_mastery
) VALUES
('Jane Doe', 'Physical', 5, 'Attacker', 'Sword', 'T0', 'Powerful slash attacks', 'Devastating ultimate combo', 'https://img.game8.co/4372195/ea916a2155290708a65bdec8dba028ce.png/show', 9, 95, 9, 90, 8, 85, 8, 80),
('Yixuan', 'Electric', 5, 'Attacker', 'Spear', 'T0', 'Swift strikes', 'Thunder storm', 'https://img.game8.co/4178829/017e13743c4762e07e0df875888bf56b.png/show', 9, 92, 9, 88, 9, 90, 8, 82),
('Miyabi', 'Ice', 5, 'Attacker', 'Sword', 'T0.5', 'Ice blade dance', 'Frozen domain', 'https://img.game8.co/4059078/d955d184a5e8c2a1841d0f9723a19da0.png/show', 9, 94, 9, 91, 8, 87, 8, 84),
('Astra Yao', 'Fire', 5, 'Support', 'Whip', 'T0', 'Team buff', 'Healing wave', 'https://img.game8.co/4080088/fa217d0eba80ff3a1694f354d33cc12e.png/show', 9, 89, 9, 91, 9, 88, 8, 85),
('Yuzuha', 'Ether', 5, 'Support', 'Greatsword', 'T0', 'Shield allies', 'Barrier dome', 'https://img.game8.co/4212687/46603f907c8d4befa538f9bb94dd22d4.png/show', 9, 90, 9, 89, 9, 87, 9, 88),
('Lucia', 'Physical', 5, 'Support', 'Bow', 'T0', 'Energy restore', 'Mass regeneration', 'https://img.game8.co/4303634/f8acab2bfbfc82495f4afd63269347a8.png/show', 9, 88, 9, 90, 8, 86, 9, 87),
('Trigger', 'Electric', 5, 'Stun', 'Gun', 'T0', 'Stun shot', 'Paralysis field', 'https://img.game8.co/4143972/69524d93a8cd46f584c18ebbbac24e2d.png/show', 9, 93, 9, 89, 9, 91, 8, 83),
('Ju fufu', 'Physical', 5, 'Stun', 'Hammer', 'T0', 'Heavy impact', 'Earthquake smash', 'https://img.game8.co/4204351/754c4dd9dd679ae1e930f4977645c09a.png/show', 9, 91, 9, 90, 8, 88, 8, 86),
('Dialyn', 'Ice', 5, 'Stun', 'Sword', 'T0', 'Chain stun', 'Time stop', 'https://img.game8.co/4348758/b4114e6aa73ddfd3b1c8bead24aa6592.png/show', 9, 92, 9, 92, 9, 89, 8, 85),
('Seed', 'Ether', 5, 'Attacker', 'Staff', 'T0.5', 'Nature strike', 'Overgrowth', 'https://img.game8.co/4268683/6bd516365ea3af34ea429bba2141ab5d.png/show', 8, 87, 8, 85, 8, 83, 8, 81),
('Alice', 'Fire', 5, 'Attacker', 'Wand', 'T0.5', 'Magic burst', 'Wonderland', 'https://img.game8.co/4212685/2d8f46bc9a469ba89977a3bb97952495.png/show', 8, 84, 8, 86, 8, 82, 8, 79)
ON CONFLICT DO NOTHING;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, role)
    VALUES (new.id, new.raw_user_meta_data->>'username', 'user');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
