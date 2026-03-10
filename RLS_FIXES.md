# MASALAH RLS DAN TOKEN INVALID - SOLUSI

## 🔴 MASALAH UTAMA YANG DITEMUKAN:

### 1. **MISSING INSERT POLICY pada `user_profiles` TABLE**
**Location**: [backend/database/supabase_schema.sql](backend/database/supabase_schema.sql#L227)

**Masalah:**
- Ketika user signup, trigger `handle_new_user()` mencoba INSERT record baru ke `user_profiles`
- Tapi di schema SQL, hanya ada policies untuk SELECT dan UPDATE
- **TIDAK ADA INSERT POLICY**
- Hasil: INSERT gagal → profile tidak terbuat → middleware tidak bisa ambil role user → token terlihat invalid

**Policy yang ada:**
```sql
CREATE POLICY "Users can read own profile"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);
-- MISSING: INSERT POLICY!
```

**Solusi:**
Tambahkan INSERT policy untuk trigger function yang SECURITY DEFINER:
```sql
CREATE POLICY "System can insert profiles"
    ON user_profiles FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);
```

### 2. **RLS POLICIES untuk `characters` TERLALU PERMISIF**
**Location**: [backend/database/supabase_schema.sql](backend/database/supabase_schema.sql#L37-L46)

**Masalah:**
- Policy memungkinkan SEMUA authenticated users untuk INSERT/UPDATE/DELETE characters
- Seharusnya hanya admin yang bisa melakukan modifikasi
- Policies tidak check `user_profiles.role` = 'admin'

**Policy saat ini:**
```sql
CREATE POLICY "Authenticated users can insert characters"
    ON characters FOR INSERT
    TO authenticated
    WITH CHECK (true);  -- ❌ TERLALU PERMISIF!
```

**Solusi:**
Tambahkan role checking:
```sql
CREATE POLICY "Only admins can insert characters"
    ON characters FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update characters"
    ON characters FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete characters"
    ON characters FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

## 📋 CHECKLIST PERBAIKAN:

- [ ] Tambahkan INSERT policy untuk `user_profiles`
- [ ] Update character policies untuk check admin role
- [ ] Verify trigger function berhasil membuat profile saat signup
- [ ] Test login dan verify token valid

## 🧪 CARA TEST:

1. Signup user baru
2. Check di Supabase SQL Editor:
   ```sql
   SELECT * FROM user_profiles WHERE username = 'your_username';
   ```
   Harus ada record, bukan NULL

3. Login dan cek token response:
   ```
   POST /api/auth/login
   ```
   Token harus valid

4. Cek admin status:
   ```
   POST /api/auth/check-admin
   Headers: Authorization: Bearer {token}
   ```
   Harus return role user, bukan error "Token tidak valid"
