-- ============================================
-- MIGRATION SCRIPT - ADD FK RELATIONSHIPS
-- Untuk ZZZ Character Analyzer
-- Aman: Hanya alter tabel yang ada
-- ============================================

-- ============================================
-- STEP 0: Create tier_lists jika belum ada
-- ============================================
CREATE TABLE IF NOT EXISTS tier_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tier_lists ENABLE ROW LEVEL SECURITY;

-- RLS policy untuk tier_lists
DROP POLICY IF EXISTS "Users can read own tier lists" ON tier_lists;
DROP POLICY IF EXISTS "Users can insert own tier lists" ON tier_lists;
DROP POLICY IF EXISTS "Users can update own tier lists" ON tier_lists;
DROP POLICY IF EXISTS "Users can delete own tier lists" ON tier_lists;

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
-- STEP 1: Create tier_list_items jika belum ada
-- ============================================
CREATE TABLE IF NOT EXISTS tier_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_list_id UUID REFERENCES tier_lists(id) ON DELETE CASCADE,
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    tiers_id UUID REFERENCES tiers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tier_list_items ENABLE ROW LEVEL SECURITY;

-- Drop policies lama jika ada (jika ada error, abaikan)
DROP POLICY IF EXISTS "Users can read own tier list items" ON tier_list_items;
DROP POLICY IF EXISTS "Users can insert own tier list items" ON tier_list_items;
DROP POLICY IF EXISTS "Users can update own tier list items" ON tier_list_items;
DROP POLICY IF EXISTS "Users can delete own tier list items" ON tier_list_items;

-- Add RLS policy untuk tier_list_items
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
    )
    WITH CHECK (
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
-- STEP 2: Add tiers_id FK ke characters (jika belum ada)
-- ============================================
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS tiers_id UUID REFERENCES tiers(id) ON DELETE SET NULL;

-- ============================================
-- STEP 3: Create favorites table jika belum ada
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    tiers_id UUID REFERENCES tiers(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, character_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS policies untuk favorites
DROP POLICY IF EXISTS "Users can read own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can update own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;

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
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
    ON favorites FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Alternative: Jika tabel favorites sudah ada tapi belum ada tiers_id column
-- ALTER TABLE favorites
-- ADD COLUMN IF NOT EXISTS tiers_id UUID REFERENCES tiers(id) ON DELETE CASCADE;

-- ============================================
-- STEP 4: Verify structure
-- ============================================
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
-- ORDER BY table_name;
