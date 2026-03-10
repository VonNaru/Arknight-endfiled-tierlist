# Tier System Fix - Relational Database Structure

## Problem yang Dipecahkan

User sebelumnya **tidak bisa mengubah tier character dalam tier list melalui admin panel** karena desain database yang salah:
- Tier hanya disimpan sebagai `TEXT` di `characters` table (default tier)
- Tidak ada hubungan langsung antara `tier_list_items` dan tabel master `tiers`
- Admin panel tidak bisa merubah tier untuk individual item dalam tier list

## Solusi: Foreign Key Relationships

### Database Schema Sebelum
```sql
-- WRONG: tier disimpan sebagai string
characters: [id, name, tier (TEXT), ...]
tier_list_items: [id, tier_list_id, character_id, tier (TEXT), ...]
favorites: [id, user_id, character_id, custom_tier (TEXT), ...]
```

### Database Schema Sekarang
```sql
-- CORRECT: tier adalah referensi ke tabel master
tiers: [id (PK), name (UNIQUE), color_code, ...]
characters: [id, name, tiers_id (FK→tiers), ...]
tier_list_items: [id, tier_list_id, character_id, tiers_id (FK→tiers), ...]
favorites: [id, user_id, character_id, tiers_id (FK→tiers), ...]
```

## Hubungan Antar Tabel

```
tiers (Master Data)
├── characters.tiers_id → tiers.id (Default tier untuk character)
├── tier_list_items.tiers_id → tiers.id (Tier di tier list spesifik)
└── favorites.tiers_id → tiers.id (Custom tier di favorites)

tier_lists (User's tier list)
└── tier_list_items.tier_list_id → tier_lists.id

characters (Master character list)
└── tier_list_items.character_id → characters.id
└── favorites.character_id → characters.id
```

## Backend Controller Updates

### TierListController
- **getTierListById()**: Sekarang mengembalikan `tiers_id` + `tier_name` + `tier_color` untuk setiap item
- **createTierList()**: Request body harus menggunakan `tiers_id` (UUID FK) bukan `tier` (string)
- **updateTierList()**: Items harus dikirim dengan `tiers_id` untuk bisa bisa diganti tiernya

### FavoritesController
- **addFavorite()**: Request parameter berubah dari `customTier` → `tiersId`
- **updateFavorite()**: Sekarang bisa update tier dengan mengirim `tiersId` baru
- **getUserFavorites()**: Response sekarang include `tiers_id`, `tier_name`, `tier_color`

## How to Fix Database (Migration Script)

Jika database sudah ada data lama, jalankan migration ini:

```sql
-- 1. Create new tiers table with sample data
CREATE TABLE IF NOT EXISTS tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    color_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO tiers (name, color_code) VALUES
('T0', '#FF6B6B'),
('T0.5', '#FF8C42'),
('T1', '#FFC93C'),
('T1.5', '#95E1D3'),
('T2', '#38A3A5'),
('T2.5', '#073B4C'),
('T3', '#CCCCCC');

-- 2. Add tiers_id FK to characters table
ALTER TABLE characters ADD COLUMN tiers_id UUID REFERENCES tiers(id) ON DELETE SET NULL;

-- 3. Migrate existing tier data (if exists)
UPDATE characters 
SET tiers_id = (
  SELECT id FROM tiers WHERE tiers.name = characters.tier
)
WHERE tier IS NOT NULL;

-- 4. Drop old tier column (optional, keep for safety)
-- ALTER TABLE characters DROP COLUMN tier;

-- 5. Update tier_list_items table
ALTER TABLE tier_list_items DROP COLUMN IF EXISTS tier;
ALTER TABLE tier_list_items ADD COLUMN tiers_id UUID REFERENCES tiers(id) ON DELETE CASCADE NOT NULL;

-- 6. Update favorites table
ALTER TABLE favorites DROP COLUMN IF EXISTS custom_tier;
ALTER TABLE favorites ADD COLUMN tiers_id UUID REFERENCES tiers(id) ON DELETE CASCADE;
```

## Frontend Changes Required

### AdminPanel.jsx
Request body untuk create/update character:
```javascript
// BEFORE
const characterData = {
  name, element, rarity, role, weapon, 
  tier: selectedTier,  // STRING
  skill, ultimate, image_url
};

// AFTER
const characterData = {
  name, elements_id, rarities_id, roles_id, weapons_id, 
  tiers_id: selectedTierId,  // UUID FK
  character_skills_id, image_url
};
```

### Tier List Update (Admin Panel)
Request body untuk update tier list items:
```javascript
// BEFORE
const items = [
  { character_id: "...", tier: "T0" }  // Tier as string
];

// AFTER  
const items = [
  { character_id: "...", tiers_id: "uuid-of-tier" }  // Tier as FK
];
```

## API Request Examples

### Create Tier List Item dengan FK
```bash
POST /api/tier-lists/list-id/items
{
  "character_id": "char-uuid",
  "tiers_id": "tier-uuid"  # bukan tier: "T0"
}
```

### Update Favorite Tier
```bash
PUT /api/favorites/fav-id
{
  "tiersId": "tier-uuid",  # FK reference
  "notes": "Optional notes"
}
```

### Get Tier List (Response)
```json
{
  "id": "list-uuid",
  "items": [
    {
      "id": "item-uuid",
      "character_id": "char-uuid",
      "tiers_id": "tier-uuid",
      "tier_name": "T0",
      "tier_color": "#FF6B6B",
      "name": "Jane Doe",
      "element_name": "Physical",
      "rarity_name": "5★",
      ...
    }
  ]
}
```

## Benefits

✅ **Proper relationship**: Tiers adalah master data, bukan duplikat di dalam characters  
✅ **Editable**: Admin bisa ubah tier item di tier list tanpa ubah character default tier  
✅ **Consistent**: Satu sumber kebenaran untuk data tier  
✅ **Extensible**: Bisa tambah properti tier baru (rarity cutoff, bonus, dll) di tabel tiers  
✅ **Referential integrity**: Database enforce FK constraints otomatis  

## Files Modified

- `backend/database/supabase_schema_updated.sql` - New complete schema with proper FKs
- `backend/controllers/tierListController.js` - Updated to use `tiers_id` FK
- `backend/controllers/favoritesController.js` - Updated to use `tiers_id` FK instead of `custom_tier`
