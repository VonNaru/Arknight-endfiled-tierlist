# Backend Server

Backend API untuk ZZZ Character Analyzer menggunakan Express.js dan SQLite.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start server:
```bash
npm start
```

Server akan berjalan di `http://localhost:3001`

## API Endpoints

### Characters

- `GET /api/characters` - Get all characters
- `GET /api/characters/:id` - Get character by ID
- `POST /api/characters` - Add new character
- `PUT /api/characters/:id` - Update character
- `DELETE /api/characters/:id` - Delete character
- `GET /api/characters/:id/ratings` - Get character ratings
- `POST /api/characters/:id/ratings` - Add rating to character

### Tier Lists

- `GET /api/tierlists` - Get all tier lists
- `GET /api/tierlists/:id` - Get tier list by ID with items
- `POST /api/tierlists` - Create new tier list
- `PUT /api/tierlists/:id` - Update tier list
- `DELETE /api/tierlists/:id` - Delete tier list

## Database

SQLite database akan dibuat otomatis di `backend/database/zzz_characters.db` saat server pertama kali dijalankan.

Database sudah terisi dengan sample data characters dari ZZZ.

## Development Mode

Untuk auto-reload saat development:
```bash
npm run dev
```
