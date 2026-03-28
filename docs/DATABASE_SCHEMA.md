# Database Schema Documentation

## Overview

This project uses **SQLite with sql.js** for the application database. The database is split into two separate files:
- **auth.db** - User authentication & role management
- **zzz_characters.db** - Character data, tier lists, and user preferences

## Database Architecture

### Two-Database Model

```
┌─────────────────┬──────────────────┐
│   auth.db       │ zzz_characters.db │
├─────────────────┼──────────────────┤
│ • users         │ • characters      │
│                 │ • tier_lists      │
│                 │ • tier_list_items │
│                 │ • ratings         │
│                 │ • favorites       │
└─────────────────┴──────────────────┘
```

### Why Two Databases?
- **auth.db** persists user accounts separately (survives character resets)
- **zzz_characters.db** can be reset without affecting user credentials
- Easier maintenance and testing

---

## Authentication Database (auth.db)

### `users` Table

Stores user account information and access control.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTO_INCREMENT | Unique user identifier |
| `username` | TEXT | NOT NULL, UNIQUE | Login username (case-sensitive) |
| `email` | TEXT | NOT NULL, UNIQUE | User email address |
| `password` | TEXT | NOT NULL | Bcrypt hashed password |
| `role` | TEXT | DEFAULT 'user', CHECK IN ('admin', 'user') | User privilege level |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

**Indexes:**
- `username` (implied via UNIQUE)
- `email` (implied via UNIQUE)

**Default Admin Account:**
```sql
username: admin
email: admin@zzz.com
password: $2b$10$V/GrUpStaayTLdP1EVizxOyLIykDunX7ruCEMSCOXQ.NeU5nR0TfO (Admin123 hashed)
role: admin
```

**Role Descriptions:**
- `admin` - Full access to character management and tier list operations
- `user` - Can view characters and manage personal tier lists

**Example Query:**
```javascript
// Check if user is admin
const user = db.exec(`
  SELECT role FROM users WHERE id = ?
`, [userId]);
```

---

## Character Management Database (zzz_characters.db)

### `characters` Table

Stores master character data for Zenless Zone Zero.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTO_INCREMENT | Unique character identifier |
| `name` | TEXT | NOT NULL | Character name (e.g., "Jane Doe") |
| `element` | TEXT | - | Combat element (Physical, Electric, Fire, Ice, Ether) |
| `rarity` | INTEGER | - | Character rarity rank (4-5 stars) |
| `role` | TEXT | - | Combat role (Attacker, Support, Stun, etc.) |
| `weapon` | TEXT | - | Weapon type (Sword, Spear, Gun, Hammer, Staff, Bow, Wand, Whip, Greatsword) |
| `tier` | TEXT | DEFAULT 'T3' | Official tier ranking (T0, T0.5, T1, T2, T3, etc.) |
| `image_url` | TEXT | - | URL to character portrait image |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Element Types:**
- `Physical` - Physical damage dealer
- `Electric` - Electric element specialist
- `Fire` - Fire element specialist
- `Ice` - Ice element specialist
- `Ether` - Ether element specialist

**Combat Roles:**
- `Attacker` - High damage output
- `Support` - Team support and healing
- `Stun` - Control and crowd control

**Weapon Types:**
- Sword, Spear, Gun, Hammer, Staff, Bow, Wand, Whip, Greatsword

**Tier Scale:**
- `T0` - Top tier (Best)
- `T0.5` - Between T0 and T1
- `T1` - Excellent
- `T2` - Good
- `T3` - Average (Default)
- `T4` - Below average
- `T5` - Poor (Lowest)

**Sample Characters:**
```sql
-- 11 default characters seeded
Jane Doe       (Physical, 5-star, Attacker, Sword, T0)
Yixuan         (Electric, 5-star, Attacker, Spear, T0)
Miyabi         (Ice, 5-star, Attacker, Sword, T0.5)
Astra Yao      (Fire, 5-star, Support, Whip, T0)
Yuzuha         (Ether, 5-star, Support, Greatsword, T0)
Lucia          (Physical, 5-star, Support, Bow, T0)
Trigger        (Electric, 5-star, Stun, Gun, T0)
Ju fufu        (Physical, 5-star, Stun, Hammer, T0)
Dialyn         (Ice, 5-star, Stun, Sword, T0)
Seed           (Ether, 5-star, Attacker, Staff, T0.5)
Alice          (Fire, 5-star, Attacker, Wand, T0.5)
```

---

### `tier_lists` Table

Stores official tier list records created by users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTO_INCREMENT | Unique tier list identifier |
| `user_name` | TEXT | - | Creator's username |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Tier list creation timestamp |

**Purpose:** Tracks when tier lists are created and by whom.

**Relationship:** One `tier_lists` → Many `tier_list_items`

---

### `tier_list_items` Table

Contains individual character assignments within a tier list.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTO_INCREMENT | Unique item identifier |
| `tier_list_id` | INTEGER | FOREIGN KEY (tier_lists.id) | Reference to parent tier list |
| `character_id` | INTEGER | FOREIGN KEY (characters.id) | Reference to character |
| `tier` | TEXT | NOT NULL | Assigned tier (S, A, B, C, D) |

**Foreign Key Constraints:**
- `tier_list_id` → references `tier_lists(id)` (cascades on delete)
- `character_id` → references `characters(id)` (cascades on delete)

**Tier Values (for tier lists):**
- `S` - Best (Red)
- `A` - Very Good (Orange)
- `B` - Good (Yellow)
- `C` - Average (Green)
- `D` - Poor (Gray)

---

### `ratings` Table

Stores user reviews and ratings for characters.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTO_INCREMENT | Unique rating identifier |
| `character_id` | INTEGER | FOREIGN KEY (characters.id) | Reference to character |
| `rating` | INTEGER | CHECK (1-5) | Numeric rating (1 = poor, 5 = excellent) |
| `review` | TEXT | - | Optional review text |
| `user_name` | TEXT | - | Username of reviewer |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Rating creation timestamp |

**Constraints:**
- Rating must be between 1 and 5 (inclusive)
- `character_id` references `characters(id)`

---

### `favorites` Table

Stores user's personal tier list with custom categorization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTO_INCREMENT | Unique favorite identifier |
| `user_id` | INTEGER | NOT NULL, FOREIGN KEY (users.id) | Reference to user |
| `character_id` | INTEGER | NOT NULL, FOREIGN KEY (characters.id) | Reference to character |
| `custom_tier` | TEXT | NOT NULL | User's personal tier ranking (S, A, B, C, D) |
| `notes` | TEXT | - | Optional personal notes about character |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Unique Constraint:**
- `UNIQUE(user_id, character_id)` - Each user can favorite each character only once

**Foreign Keys:**
- `user_id` → references `users(id)` from auth.db
- `character_id` → references `characters(id)` from zzz_characters.db

**Tier Values:**
- `S` - My Best (Red)
- `A` - Very Strong (Orange)
- `B` - Strong (Yellow)
- `C` - Good (Green)
- `D` - Weak (Gray)

**Use Cases:**
- Personal character ranking
- Filtering favorite characters
- Tracking preferred team compositions

---

## Data Relationships

```
┌─────────────────────────────────────────┐
│           auth.db (users)               │
│  ┌──────────────────────────────┐      │
│  │ users                        │      │
│  │ • id (PK)                    │      │
│  └──────────────┬───────────────┘      │
└─────────────────┼──────────────────────┘
                  │ user_id (1:many)
                  │
        ┌─────────▼──────────┐
        │   zzz_characters   │
        │   db (favorites)   │
        └────────┬───────────┘
                 │
         (join relationship)
                 │
        ┌────────▼──────────┐
        │   characters(id)  │
        └──────────────────┘
```

### Cross-Database References

The `favorites` table uses a **cross-database** join:
- `user_id` references `users` table in **auth.db**
- `character_id` references `characters` table in **zzz_characters.db**

This requires careful handling in queries:

```javascript
// Example: Get user's favorites
function getUserFavorites(userId) {
  return zzz_charactersDb.query(`
    SELECT 
      f.*,
      c.name,
      c.element,
      c.rarity,
      c.role
    FROM favorites f
    JOIN characters c ON f.character_id = c.id
    WHERE f.user_id = ?
  `, [userId]);
}
```

---

## Database Initialization

### File Locations

```
backend/
└── database/
    ├── auth.db                  # [Auto-created] User authentication
    ├── zzz_characters.db        # [Auto-created] Character data
    ├── auth_schema.sql          # Schema definition
    ├── schema.sql               # Schema definition
    ├── supabase_schema.sql      # Future Supabase migration
    └── db.js                    # Database initialization code
```

### Initialization Process (`db.js`)

```javascript
export async function initializeDatabase() {
  // 1. Initialize Characters Database
  if (zzz_characters.db exists) {
    Load from file
  } else {
    Create new
    Execute schema.sql
    Save to file
  }
  
  // 2. Initialize Auth Database
  if (auth.db exists) {
    Load from file
  } else {
    Create new
    Execute auth_schema.sql
    Save to file
  }
}
```

**First Run Behavior:**
1. Creates both empty databases
2. Executes SQL schemas
3. Inserts sample data
4. Saves to disk

---

## Common Database Queries

### Authentication

```javascript
// Login verification
SELECT * FROM users WHERE username = ? AND password = ?

// Check admin status
SELECT role FROM users WHERE id = ?

// Get user by ID
SELECT * FROM users WHERE id = ?
```

### Character Management

```javascript
// Get all characters with pagination
SELECT * FROM characters ORDER BY tier ASC, name ASC LIMIT 10 OFFSET ?

// Get character with full details
SELECT * FROM characters WHERE id = ?

// Filter by tier
SELECT * FROM characters WHERE tier = ?

// Filter by role
SELECT * FROM characters WHERE role = ?

// Filter by element
SELECT * FROM characters WHERE element = ?
```

### Personal Tier Lists

```javascript
// Get user's favorite characters
SELECT f.*, c.* FROM favorites f
JOIN characters c ON f.character_id = c.id
WHERE f.user_id = ?
ORDER BY f.custom_tier

// Get character count by tier
SELECT custom_tier, COUNT(*) as count FROM favorites
WHERE user_id = ?
GROUP BY custom_tier

// Check if character is favorited
SELECT id FROM favorites
WHERE user_id = ? AND character_id = ?

// Add to favorites
INSERT INTO favorites (user_id, character_id, custom_tier)
VALUES (?, ?, ?)

// Update tier
UPDATE favorites SET custom_tier = ?
WHERE user_id = ? AND character_id = ?

// Remove from favorites
DELETE FROM favorites
WHERE user_id = ? AND character_id = ?
```

### Tier Lists

```javascript
// Get all tier lists
SELECT * FROM tier_lists ORDER BY created_at DESC

// Get tier list with items
SELECT tli.*, c.* FROM tier_list_items tli
JOIN characters c ON tli.character_id = c.id
WHERE tli.tier_list_id = ?
ORDER BY tli.tier
```

---

## Database Reset & Maintenance

### Reset Characters Only (Preserve Users)

```bash
# Delete character database only
rm backend/database/zzz_characters.db

# Restart server to recreate with defaults
npm run dev:all
```

**Result:**
- All character data reset to defaults
- All user accounts preserved
- New admin account recreated

### Reset Everything (Full Wipe)

```bash
# Delete both databases
rm backend/database/auth.db
rm backend/database/zzz_characters.db

# Restart server to recreate all
npm run dev:all
```

**Result:**
- All data deleted
- Both databases recreated from schemas
- Only default admin account exists

### Backup Databases

```bash
# Create backup
cp backend/database/auth.db backend/database/auth.db.backup
cp backend/database/zzz_characters.db backend/database/zzz_characters.db.backup

# Restore from backup
cp backend/database/auth.db.backup backend/database/auth.db
cp backend/database/zzz_characters.db.backup backend/database/zzz_characters.db
```

---

## Migration to Supabase

The project includes a `supabase_schema.sql` file for future Supabase migration.

### Key Differences from SQLite

| Feature | SQLite | Supabase (PostgreSQL) |
|---------|--------|----------------------|
| IDs | INTEGER AUTO_INCREMENT | UUID with gen_random_uuid() |
| Timestamps | DATETIME | TIMESTAMP WITH TIME ZONE |
| Security | None | Row Level Security (RLS) |
| Authentication | Manual user table | Supabase Auth |
| Concurrency | Limited | Full support |

### Migration Process

When ready to migrate:

1. Set up Supabase project
2. Create tables using `supabase_schema.sql`
3. Configure environment variables
4. Update `database/db.js` to use Supabase client instead of sql.js
5. Test thoroughly before going live

---

## Performance Considerations

### Indexes

Current SQLite schema relies on implicit indexes from PRIMARY KEY and UNIQUE constraints.

**Recommended Additional Indexes for Production:**

```sql
-- Characters table
CREATE INDEX idx_characters_element ON characters(element);
CREATE INDEX idx_characters_role ON characters(role);
CREATE INDEX idx_characters_tier ON characters(tier);

-- Favorites table
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_character_id ON favorites(character_id);

-- Tier list items
CREATE INDEX idx_tier_items_tier_list_id ON tier_list_items(tier_list_id);
CREATE INDEX idx_tier_items_character_id ON tier_list_items(character_id);

-- Ratings
CREATE INDEX idx_ratings_character_id ON ratings(character_id);
CREATE INDEX idx_ratings_user_name ON ratings(user_name);
```

### Query Optimization Tips

1. **Always use LIMIT** for list queries to avoid loading entire table
2. **Join only needed columns** - avoid `SELECT *` in production
3. **Use WHERE clauses** to filter before JOIN operations
4. **Cache frequently accessed data** (character list, user profiles)
5. **Implement pagination** for large result sets

---

## Error Handling

### Foreign Key Violations

```javascript
// Example: Deleting character in use
DELETE FROM characters WHERE id = 100;
// Error if character_id is referenced in tier_list_items

// Solution: Delete references first
DELETE FROM tier_list_items WHERE character_id = 100;
DELETE FROM favorites WHERE character_id = 100;
DELETE FROM ratings WHERE character_id = 100;
DELETE FROM characters WHERE id = 100;
```

### Unique Constraint Violations

```javascript
// Example: Duplicate favorite
INSERT INTO favorites (user_id, character_id, custom_tier)
VALUES (1, 50, 'S');
// Error if (user_id=1, character_id=50) already exists

// Solution: Use UPDATE instead
UPDATE favorites SET custom_tier = 'A'
WHERE user_id = 1 AND character_id = 50;
```

---

## Testing Database Locally

### Inspect Database Files

```bash
# Using sqlite3 CLI (if installed)
sqlite3 backend/database/zzz_characters.db

# Inside sqlite3 shell
.tables              # List all tables
.schema              # Show schema
SELECT COUNT(*) FROM characters;
```

### Test Scripts

Located in `backend/`:

- `test-db.js` - Basic database connectivity test
- `test-db-simple.js` - Simplified database test
- `check-characters-skills-status.js` - Character status verification

Run tests:
```bash
cd backend
node test-db.js
```

---

## Security Notes

### Current State (Development)

⚠️ **Not Production Ready:**
- Passwords stored encrypted (bcrypt) ✅
- No rate limiting
- No input validation
- No CORS configured properly
- No SQL injection protection (using parameters helps)

### For Production

1. **Enable CORS** with specific origins
2. **Add input validation** using libraries like Joi or Zod
3. **Implement rate limiting** (express-rate-limit)
4. **Add SQL injection protection** (use parameterized queries - already done)
5. **Implement JWT tokens** instead of storing credentials
6. **Add logging and monitoring**
7. **Use HTTPS** with proper certificates
8. **Migrate to proper database** (PostgreSQL/Supabase)
9. **Add environment variable validation**
10. **Enable Row Level Security** (RLS) if using Supabase

---

## Troubleshooting

### Database Locked Error

```
Error: SQLITE_CANTOPEN(14) [SQLITE_CANTOPEN] cannot open file
```

**Solution:** Database file may be corrupted. Delete and recreate:
```bash
rm backend/database/zzz_characters.db
npm run dev:all
```

### Missing Tables

```
Error: no such table: characters
```

**Solutions:**
- Restart server (schema.sql will be executed)
- Check if schema.sql exists and is readable
- Verify database initialization in db.js

### Foreign Key Constraint Errors

```
Error: FOREIGN KEY constraint failed
```

**Causes:**
- Trying to delete record referenced by another table
- Inserting record with invalid foreign key ID

**Solution:** Check foreign key relationships before delete operations.

---

## Related Files

- [Backend API Documentation](./DOKUMENTASI.md) - API endpoints
- [Admin User Guide](./ADMIN_USER_GUIDE.md) - Admin features
- Backend Schema: [schema.sql](../backend/database/schema.sql)
- Auth Schema: [auth_schema.sql](../backend/database/auth_schema.sql)
- Database Code: [db.js](../backend/database/db.js)
