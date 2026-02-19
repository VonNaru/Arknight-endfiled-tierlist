# Character Images

Taruh gambar karakter di sini dengan format:

## Format File:
- `ellen-joe.jpg` atau `ellen.jpg`
- `zhu-yuan.jpg`
- `qingyi.jpg`
- `nekomata.jpg`
- `anby.jpg`
- `nicole.jpg`
- `billy.jpg`

## Ukuran Rekomendasi:
- Resolusi: 200-400px (karakter card kecil, tidak perlu HD)
- File size: 50-150KB per gambar (compress dulu!)
- Format: **WebP** (paling ringan) atau JPG (quality 70-80%)

## ⚠️ Penting - Compress Gambar!
Gambar besar = website lambat! Gunakan tools:
- TinyPNG: https://tinypng.com
- Squoosh: https://squoosh.app
- Compress JPG: https://compressjpeg.com

Contoh:
- ❌ Gambar 2MB = lambat loading
- ✅ Gambar 100KB = cepat loading

## Cara Pakai:
1. Download gambar karakter ZZZ
2. Rename sesuai nama di atas
3. Copy ke folder ini
4. Database sudah diset dengan path `/images/ellen.jpg` dll

## Contoh:
```
public/
  images/
    ellen-joe.jpg      ← File gambar Ellen Joe
    zhu-yuan.jpg       ← File gambar Zhu Yuan
    ...
```

## Update Database (jika perlu):
Jika nama file gambar berbeda, update di database:
```sql
UPDATE characters SET image_url = '/images/nama-file-baru.jpg' WHERE name = 'Nama Karakter';
```
