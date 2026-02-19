-- Characters table
CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    element TEXT,
    rarity INTEGER,
    role TEXT,
    tier TEXT DEFAULT 'T3',
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tier lists table
CREATE TABLE IF NOT EXISTS tier_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tier list items table
CREATE TABLE IF NOT EXISTS tier_list_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tier_list_id INTEGER,
    character_id INTEGER,
    tier TEXT NOT NULL,
    FOREIGN KEY (tier_list_id) REFERENCES tier_lists(id),
    FOREIGN KEY (character_id) REFERENCES characters(id)
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    review TEXT,
    user_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES characters(id)
);

-- Favorites table - user can add characters with custom tier
CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    character_id INTEGER NOT NULL,
    custom_tier TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (character_id) REFERENCES characters(id),
    UNIQUE(user_id, character_id)
);

-- Insert sample characters with tier
INSERT INTO characters (name, element, rarity, role, tier, image_url) VALUES
('Jane Doe', NULL, 5, 'Attacker', 'T0', 'https://img.game8.co/4372195/ea916a2155290708a65bdec8dba028ce.png/show'),
('Yixuan', NULL, 5, 'Attacker', 'T0', 'https://img.game8.co/4178829/017e13743c4762e07e0df875888bf56b.png/show'),
('Miyabi', NULL, 5, 'Attacker', 'T0.5', 'https://img.game8.co/4059078/d955d184a5e8c2a1841d0f9723a19da0.png/show'),
('Astra Yao', NULL, 5, 'Support', 'T0', 'https://img.game8.co/4080088/fa217d0eba80ff3a1694f354d33cc12e.png/show'),
('Yuzuha', NULL, 5, 'Support', 'T0', 'https://img.game8.co/4212687/46603f907c8d4befa538f9bb94dd22d4.png/show'),
('Lucia', NULL, 5, 'Support', 'T0', 'https://img.game8.co/4303634/f8acab2bfbfc82495f4afd63269347a8.png/show'),
('Trigger', NULL, 5, 'Stun', 'T0', 'https://img.game8.co/4143972/69524d93a8cd46f584c18ebbbac24e2d.png/show'),
('Ju fufu', NULL, 5, 'Stun', 'T0', 'https://img.game8.co/4204351/754c4dd9dd679ae1e930f4977645c09a.png/show'),
('Dialyn', NULL, 5, 'Stun', 'T0', 'https://img.game8.co/4348758/b4114e6aa73ddfd3b1c8bead24aa6592.png/show'),
('Seed', NULL, 5, 'Attacker', 'T0.5', 'https://img.game8.co/4268683/6bd516365ea3af34ea429bba2141ab5d.png/show'),
('Alice', NULL, 5, 'Attacker', 'T0.5', 'https://img.game8.co/4212685/2d8f46bc9a469ba89977a3bb97952495.png/show');

