-- ============================================
-- TIERS TABLE (Master Data)
-- Untuk ZZZ Character Analyzer
-- ============================================

-- Buat table tiers jika belum ada
CREATE TABLE IF NOT EXISTS tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    color_code TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS untuk tiers
ALTER TABLE tiers ENABLE ROW LEVEL SECURITY;

-- Drop policies lama jika ada sebelum membuat yang baru
DROP POLICY IF EXISTS "Anyone can read tiers" ON tiers;
DROP POLICY IF EXISTS "Authenticated users can manage tiers" ON tiers;
DROP POLICY IF EXISTS "Authenticated users can update tiers" ON tiers;
DROP POLICY IF EXISTS "Authenticated users can delete tiers" ON tiers;

-- Policy: Semua orang bisa read tiers (public)
CREATE POLICY "Anyone can read tiers"
    ON tiers FOR SELECT
    TO authenticated, anon
    USING (true);

-- Policy: Hanya authenticated users bisa insert/update/delete (akan di-check di backend untuk admin)
CREATE POLICY "Authenticated users can manage tiers"
    ON tiers FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update tiers"
    ON tiers FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete tiers"
    ON tiers FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- ALTER CHARACTERS TABLE - Tambah tier_id
-- ============================================

-- Tambahkan kolom tier_id ke characters jika belum ada
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS tier_id UUID REFERENCES tiers(id) ON DELETE SET NULL;

-- Buat index untuk performance
CREATE INDEX IF NOT EXISTS idx_characters_tier_id ON characters(tier_id);
CREATE INDEX IF NOT EXISTS idx_tiers_name ON tiers(name);

-- Insert default tiers jika belum ada
INSERT INTO tiers (name, color_code, description, display_order)
VALUES 
    ('S', '#FFD700', 'Tier tertinggi - Sangat recommended', 1),
    ('A', '#FF6B6B', 'Tier baik - Recommended', 2),
    ('B', '#4ECDC4', 'Tier sedang - Cukup baik', 3),
    ('C', '#95E1D3', 'Tier lumayan - Standar', 4),
    ('D', '#A8DADC', 'Tier rendah - Kurang recommended', 5)
ON CONFLICT (name) DO UPDATE SET
    color_code = EXCLUDED.color_code,
    updated_at = NOW();
