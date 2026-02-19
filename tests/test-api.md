# Test API Endpoints

## 1. Get All Characters
```bash
GET http://localhost:3001/api/characters
```

## 2. Create Tier List

**POST** `http://localhost:3001/api/tierlists`

Body (JSON):
```json
{
  "user_name": "Player1",
  "items": [
    { "character_id": 1, "tier": "T0" },
    { "character_id": 2, "tier": "T0" },
    { "character_id": 3, "tier": "T0" },
    { "character_id": 4, "tier": "T0.5" },
    { "character_id": 5, "tier": "T0.5" },
    { "character_id": 6, "tier": "T0.5" },
    { "character_id": 7, "tier": "T1" }
  ]
}
```

Penjelasan:
- `character_id: 1` = Ellen Joe → Tier T0
- `character_id: 2` = Zhu Yuan → Tier T0
- `character_id: 3` = Qingyi → Tier T0
- `character_id: 4` = Nekomata → Tier T0.5
- `character_id: 5` = Anby → Tier T0.5
- `character_id: 6` = Nicole → Tier T0.5
- `character_id: 7` = Billy → Tier T1

## 3. Get All Tier Lists
```bash
GET http://localhost:3001/api/tierlists
```

## 4. Get Specific Tier List
```bash
GET http://localhost:3001/api/tierlists/1
```

## 5. Add Rating to Character

**POST** `http://localhost:3001/api/characters/1/ratings`

Body (JSON):
```json
{
  "rating": 5,
  "review": "Ellen Joe is the best ice attacker!",
  "user_name": "Player1"
}
```

## Test di Browser Console

Buka http://localhost:3000 (frontend), tekan F12, paste di Console:

```javascript
// Import API (jika sudah ada di frontend)
import { characterAPI, tierListAPI } from './api/api.js'

// Atau langsung pakai fetch
fetch('http://localhost:3001/api/tierlists', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_name: "MyTierList",
    items: [
      { character_id: 1, tier: "T0" },
      { character_id: 2, tier: "T0" },
      { character_id: 3, tier: "T0" }
    ]
  })
})
.then(r => r.json())
.then(console.log)
```
