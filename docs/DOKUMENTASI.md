# ZZZ Character Analyzer - Dokumentasi

## 📋 Deskripsi
Website untuk analisis tier list karakter game Zenless Zone Zero dengan sistem login, role-based access control, dan personal tier list.

## 📁 Struktur Folder

```
ZZZ-character-analyzer/
├── backend/              # Backend server & API
│   ├── controllers/      # Logic untuk API endpoints
│   ├── database/         # Database files & schema
│   ├── middleware/       # Authentication middleware
│   └── routes/           # API route definitions
├── config/               # Configuration files (credentials)
├── docs/                 # Documentation files
├── public/               # Static assets
│   └── images/          # Character images
├── src/                  # Frontend React components
│   ├── api/             # API client
│   ├── assets/          # Frontend assets
│   └── components/      # React components
└── tests/                # Testing files
```

## 🚀 Cara Menjalankan

### Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Jalankan Server (Backend + Frontend)
```bash
npm run dev:all
```

Atau jalankan terpisah:
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev
```

### Akses Website
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🔐 Login Credentials

### Admin (Full Access)
- Username: `admin`
- Password: `Admin123`
- Email: `admin@zzz.com`

### User Biasa (Read + Personal Tier)
Daftar melalui Sign Up dengan:
- Username: bebas (unik)
- Email: harus ada @, ., dan com
- Password: min 6 karakter, ada huruf BESAR dan kecil

## ✨ Fitur

### 🌐 Untuk Semua User
- ✅ Lihat tier list karakter official
- ✅ Lihat detail karakter
- ✅ Sign up & login
- ✅ **Buat personal tier list** (setelah login)
- ✅ **Drag & drop karakter** ke tier S/A/B/C/D
- ✅ **Pindahkan tier** karakter dengan drag-drop
- ✅ **Remove karakter** dari personal tier (double click)

### 👑 Khusus Admin
- ✅ Tambah karakter baru
- ✅ Edit tier karakter official
- ✅ Hapus karakter
- ✅ Manage database

## 🎮 Cara Menggunakan Personal Tier List

1. **Login** ke akun Anda
2. Klik menu **⭐ Favorites** di sidebar
3. **Drag karakter** dari "Available Characters" ke tier yang diinginkan:
   - Tier S (Merah) - Karakter terbaik menurut Anda
   - Tier A (Orange) - Sangat bagus
   - Tier B (Kuning) - Bagus
   - Tier C (Hijau) - Cukup
   - Tier D (Abu) - Kurang
4. **Pindahkan tier**: Drag karakter dari tier lama ke tier baru
5. **Hapus dari list**: Double click pada karakter

## 📂 Database

### auth.db
- **Tabel**: `users`
- Data user (id, username, email, password, role)
- Tidak hilang saat reset karakter

### zzz_characters.db  
- **Tabel**: `characters` - Data karakter (nama, tier, role, image)
- **Tabel**: `tier_lists` - Tier list yang dibuat user
- **Tabel**: `tier_list_items` - Item dalam tier list
- **Tabel**: `ratings` - Rating karakter
- **Tabel**: `favorites` - Personal tier list user (BARU!)

## 🎮 Karakter Default (11 karakter)

**T0 Tier:**
- Jane Doe (Attacker)
- Yixuan (Attacker)
- Astra Yao (Support)
- Yuzuha (Support)
- Lucia (Support)
- Trigger (Stun)
- Ju fufu (Stun)
- Dialyn (Stun)

**T0.5 Tier:**
- Miyabi (Attacker)
- Seed (Attacker)
- Alice (Attacker)

## 📝 API Endpoints

### Auth
- `POST /api/auth/signup` - Daftar user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/check-admin` - Cek admin status

### Characters (Public)
- `GET /api/characters` - List semua karakter
- `GET /api/characters/:id` - Detail karakter

### Characters (Admin Only)
- `POST /api/characters` - Tambah karakter
- `PUT /api/characters/:id` - Edit karakter
- `DELETE /api/characters/:id` - Hapus karakter

### Tier Lists
- `GET /api/tierlists` - List semua tier lists
- `GET /api/tierlists/:id` - Detail tier list
- `POST /api/tierlists` - Buat tier list baru
- `PUT /api/tierlists/:id` - Update tier list
- `DELETE /api/tierlists/:id` - Hapus tier list

### Favorites (Personal Tier List) - NEW!
- `GET /api/favorites?userId=X` - Get personal tier list user
- `POST /api/favorites` - Add karakter ke personal tier
- `PUT /api/favorites/:id` - Update tier karakter
- `DELETE /api/favorites/:id` - Remove dari personal tier

## ⚙️ Tech Stack
- **Frontend**: React 19 + Vite 7 (Rolldown)
- **Backend**: Node.js + Express.js
- **Database**: SQLite (sql.js)
- **Auth**: bcrypt + localStorage
- **Styling**: Inline React styles

## 🔄 Update Terbaru

### v2.0 - Personal Tier List Feature
- ✅ Reorganisasi folder structure (config/, docs/, tests/)
- ✅ Fitur Personal Tier List dengan drag & drop
- ✅ User bisa ranking karakter favorit (S/A/B/C/D)
- ✅ Pindah tier dengan drag-drop
- ✅ Remove dengan double-click
- ✅ UI mirip tier list professional
- ✅ Database tabel favorites baru
- **Database**: SQLite (sql.js)
- **Auth**: Simple username/password (plain text)

## 📁 Struktur Project
```
ZZZ-character-analyzer/
├── backend/
│   ├── database/
│   │   ├── auth.db              # Database user
│   │   ├── zzz_characters.db    # Database karakter
│   │   ├── auth_schema.sql      # Schema auth
│   │   └── schema.sql           # Schema karakter
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── server.js
├── src/
│   ├── components/
│   │   ├── LoginModal.jsx       # Login/Signup
│   │   ├── AdminPanel.jsx       # Panel admin
│   │   ├── Header.jsx
│   │   └── tierlist.jsx
│   └── App.jsx
└── package.json
```

## 🛠️ Reset Database

### Reset Karakter (User tetap ada)
```bash
cd backend/database
del zzz_characters.db
cd ../..
npm run dev:all
```

### Reset Semua (termasuk user)
```bash
cd backend/database
del auth.db
del zzz_characters.db
cd ../..
npm run dev:all
```

## 📌 Catatan
- Password disimpan plain text (untuk production gunakan bcrypt)
- Gunakan JWT token untuk auth yang lebih aman
- Database SQLite untuk development, gunakan PostgreSQL/MySQL untuk production
