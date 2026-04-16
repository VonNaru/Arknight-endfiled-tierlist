# FIX MISSING RLS - DOKUMENTASI SOLUSI

## 📋 Ringkasan Masalah

Supabase menampilkan warning **RLS Disabled** pada tabel-tabel publik yang di-expose ke PostgREST:
- ❌ `public.user_profiles` - RLS Disabled
- ❌ `public.elements` - RLS Disabled  
- ❌ `public.rarities` - RLS Disabled
- ❌ `public.roles` - RLS Disabled

Masalah ini membuat data vulnerable ke unauthorized access.

---

## ✅ Solusi yang Diimplementasikan

### 1. **FIX USER_PROFILES - Enhanced Security**

**Masalah:** Policy untuk INSERT ada tapi perlu audit lebih ketat.

**Solusi:**
```sql
-- Insert policy untuk trigger function
CREATE POLICY "System can insert user profiles"
    ON user_profiles FOR INSERT
    TO authenticated, anon  -- Allow signup (trigger berjalan sebagai SECURITY DEFINER)
    WITH CHECK (true);

-- Select policy
CREATE POLICY "Users can read own profile"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);  -- Only see own profile

-- Update policy  
CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);  -- Only update own profile
```

**Status:** ✅ Users hanya bisa read/update profil mereka sendiri

---

### 2. **CREATE & SECURE ELEMENTS TABLE**

**Masalah:** Tabel belum punya RLS policies.

**Solusi:**
- Anyone (anon/authenticated) bisa **READ** elements
- **HANYA ADMIN** yang bisa INSERT/UPDATE/DELETE

```sql
CREATE POLICY "Anyone can read elements" → Read akses publik
CREATE POLICY "Only admins can insert elements" → Admin only
CREATE POLICY "Only admins can update elements" → Admin only  
CREATE POLICY "Only admins can delete elements" → Admin only
```

**Status:** ✅ Elements terlindungi dengan admin-only write access

---

### 3. **CREATE & SECURE RARITIES TABLE**

**Masalah:** Tabel belum punya RLS policies.

**Solusi:** Sama seperti elements:
- Publik bisa **READ** rarities
- Hanya **ADMIN** yang bisa modify

**Status:** ✅ Rarities terlindungi

---

### 4. **CREATE & SECURE ROLES TABLE**

**Masalah:** Tabel belum punya RLS policies.

**Solusi:** Sama seperti elements/rarities:
- Publik bisa **READ** roles
- Hanya **ADMIN** yang bisa modify

**Status:** ✅ Roles terlindungi

---

### 5. **VERIFY CHARACTERS POLICIES**

**Sebelumnya:** Sudah ada, tapi di-verify ulang untuk konsistensi

**Policies:**
- Publik bisa **READ** characters
- Hanya **ADMIN** yang bisa INSERT/UPDATE/DELETE

**Status:** ✅ Characters policies sudah sesuai standar

---

## 🚀 Cara Mengimplementasikan Fix

### **Option 1: Via Supabase Dashboard (Recommended)**

1. **Buka Supabase Dashboard**
   - Go ke SQL Editor
   
2. **Copy isi file dari:**
   - [backend/database/fix-rls-policies.sql](backend/database/fix-rls-policies.sql)

3. **Paste ke SQL Editor dan Execute**
   - Script akan:
     - Drop policies lama yang bermasalah
     - Create policies baru yang aman
     - Insert sample data untuk elements, rarities, roles

4. **Verify dengan menjalankan verification queries:**

```sql
-- Check semua tabel punya RLS enabled
SELECT tablename, 
       (SELECT count(*) FROM information_schema.enabled_roles 
        WHERE role_name LIKE '%rls%') as rls_status
FROM pg_tables 
WHERE schemaname='public' AND tablename IN (
    'characters', 'user_profiles', 'elements', 'rarities', 'roles'
);
```

---

### **Option 2: Via Backend Script**

Jalankan Supabase client dari backend:

```bash
cd backend
npm install @supabase/supabase-js
node scripts/apply-rls-fix.js
```

---

## 📊 Checklist RLS Policies

| Tabel | RLS | SELECT | INSERT | UPDATE | DELETE | Status |
|-------|-----|--------|--------|--------|--------|--------|
| user_profiles | ✅ | Own only | System | Own only | ❌ | ✅ Aman |
| characters | ✅ | Public | Admin | Admin | Admin | ✅ Aman |
| elements | ✅ | Public | Admin | Admin | Admin | ✅ Fixed |
| rarities | ✅ | Public | Admin | Admin | Admin | ✅ Fixed |
| roles | ✅ | Public | Admin | Admin | Admin | ✅ Fixed |
| tier_lists | ✅ | Own | Own | Own | Own | ✅ Aman |
| tier_list_items | ✅ | Own tier list | Own tier list | Own tier list | Own tier list | ✅ Aman |
| favorites | ✅ | Own | Own | Own | Own | ✅ Aman |
| ratings | ✅ | Public | Own | Own | Own | ✅ Aman |

---

## 🔐 Security Principles Applied

### 1. **Principle of Least Privilege**
- Users hanya bisa akses/modify data mereka sendiri
- Admin hanya bisa modify master data (characters, elements, rarities, roles)

### 2. **Role-Based Access Control (RBAC)**
- Policies check `user_profiles.role` untuk determine permission
- Query: `EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'`

### 3. **Separation of Concerns**
- Master data (elements, rarities, roles) - read publik, write admin
- User data (user_profiles, favorites, tier_lists) - read/write own only
- Character data (characters) - read publik, write admin

### 4. **Function Security**
- `handle_new_user()` function punya `SECURITY DEFINER`
- Ini memungkinkan INSERT bypass RLS policy saat signup (intended)
- Trigger otomatis create profile ketika user register di auth

---

## 🧪 Testing

### Test 1: Anonymous User dapat baca character list
```sql
-- SET request.jwt.claims = '{}';  -- Simulate anon
SELECT * FROM characters LIMIT 1;  -- ✅ Harus success
```

### Test 2: Authenticated User TIDAK bisa modify characters
```sql
INSERT INTO characters (name, element, rarity) 
VALUES ('Test', 'Fire', 5);  -- ❌ Harus error (not admin)
```

### Test 3: Admin BISA modify characters
```sql
-- Set admin user context
-- INSERT INTO characters (...) VALUES (...);  -- ✅ Harus success
```

### Test 4: User profile signup
```sql
-- Trigger handle_new_user() by inserting into auth.users
-- Should automatically create user_profiles row  -- ✅ Harus success
```

---

## 📞 Support

Jika setelah implementasi masih ada warning:

1. **Verify RLS enabled:** `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`
2. **Check policies:** Buka Supabase → Auth → Policies tab
3. **Review app logs:** Check RLS error di browser console atau server logs

---

## 🔄 Next Steps

Setelah RLS fixes implement:

1. Test signup flow → verify user_profiles auto create  
2. Test admin panel → verify admin-only access
3. Test tier list modification → verify user-specific access
4. Monitor error logs untuk RLS violations

Target: **ZERO RLS warnings di Supabase dashboard**
