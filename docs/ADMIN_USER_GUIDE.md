# Panduan Admin & User

## Fitur Baru

Aplikasi ZZZ Character Analyzer sekarang memiliki sistem admin dan user:

### 👤 **User Biasa**
- ✅ Dapat **melihat** tier list karakter
- ❌ **TIDAK dapat** menambah/edit/hapus karakter
- 📊 View-only mode untuk melihat data

### 🔐 **Admin**
- ✅ Dapat **menambah** karakter baru dari web interface
- ✅ Dapat **mengedit** karakter yang ada
- ✅ Dapat **menghapus** karakter
- 🎯 Akses penuh untuk mengelola database

---

## Cara Menggunakan

### 1. **Sebagai User Biasa**
1. Buka aplikasi
2. Klik "About" untuk melihat tier list
3. Lihat semua karakter yang tersedia
4. Tidak bisa menambah/edit karakter (view-only)

### 2. **Sebagai Admin**

#### Login Admin:
1. Klik tombol **"Admin Panel"** di navbar (tombol orange)
2. Masukkan kredensial admin:
   - **Username:** `admin`
   - **Password:** `Admin123`
3. Klik **Login**

#### Menambah Karakter Baru:
1. Setelah login sebagai admin, isi form:
   - **Nama Karakter** (wajib)
   - **Element** (opsional, misal: Ice, Fire, Electric)
   - **Rarity** (pilih 3, 4, atau 5 star)
   - **Role** (pilih: Attacker, Stun, atau Support)
   - **Image URL** (URL gambar karakter)
2. Preview gambar akan muncul otomatis
3. Klik **"Tambah Karakter"**
4. Karakter akan langsung masuk ke database
5. Refresh otomatis untuk melihat karakter baru di tier list

---

## Cara Menjalankan

### Backend:
```bash
cd backend
npm install
node server.js
```
Server akan berjalan di: `http://localhost:3001`

### Frontend:
```bash
npm install
npm run dev
```
Aplikasi akan berjalan di: `http://localhost:5173`

---

## API Endpoints

### Public (Semua user bisa akses):
- `GET /api/characters` - Lihat semua karakter
- `GET /api/characters/:id` - Lihat detail karakter
- `POST /api/auth/login` - Login user

### Admin Only (Harus login sebagai admin):
- `POST /api/characters` - Tambah karakter baru
- `PUT /api/characters/:id` - Edit karakter
- `DELETE /api/characters/:id` - Hapus karakter

---

## Database Schema

### Tabel `users`
```sql
- id (PRIMARY KEY)
- username (UNIQUE)
- password
- role (admin/user)
- created_at
```

### Tabel `characters`
```sql
- id (PRIMARY KEY)
- name
- element
- rarity
- role
- image_url
- created_at
```

---

## Keamanan

⚠️ **PENTING:** Aplikasi ini menggunakan autentikasi sederhana untuk demonstrasi.

Untuk production, sebaiknya:
- Gunakan JWT tokens
- Hash password dengan bcrypt
- Implementasi HTTPS
- Rate limiting
- Session management

---

## Troubleshooting

### Masalah: Tidak bisa menambah karakter
✅ **Solusi:** Pastikan sudah login sebagai admin (bukan user biasa)

### Masalah: Gambar karakter tidak muncul
✅ **Solusi:** Pastikan URL gambar valid dan bisa diakses

### Masalah: Error 403 saat tambah karakter
✅ **Solusi:** Periksa username dan password admin sudah benar

---

## Kredensial Default

**Admin:**
- Username: `admin`
- Password: `Admin123`

**Note:** Anda bisa menambah user/admin baru langsung di database SQLite.

---

Selamat menggunakan! 🎮
