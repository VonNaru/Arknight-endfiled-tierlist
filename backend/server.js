import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// SQLite tidak digunakan lagi - menggunakan Supabase
// import { initializeDatabase } from './database/db.js';
import characterRoutes from './routes/characters.js';
import tierListRoutes from './routes/tierLists.js';
import authRoutes from './routes/auth.js';
import favoritesRoutes from './routes/favorites.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database sudah di Supabase, tidak perlu initialize
// await initializeDatabase();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'ZZZ Character Analyzer API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/tierlists', tierListRoutes);
app.use('/api/favorites', favoritesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  POST   http://localhost:${PORT}/api/auth/signup`);
  console.log(`  POST   http://localhost:${PORT}/api/auth/login`);
  console.log(`  POST   http://localhost:${PORT}/api/auth/check-admin`);
  console.log(`  GET    http://localhost:${PORT}/api/characters (Public)`);
  console.log(`  GET    http://localhost:${PORT}/api/characters/:id (Public)`);
  console.log(`  POST   http://localhost:${PORT}/api/characters (Admin Only)`);
  console.log(`  PUT    http://localhost:${PORT}/api/characters/:id (Admin Only)`);
  console.log(`  DELETE http://localhost:${PORT}/api/characters/:id (Admin Only)`);
  console.log(`  GET    http://localhost:${PORT}/api/tierlists`);
  console.log(`  GET    http://localhost:${PORT}/api/tierlists/:id`);
  console.log(`  POST   http://localhost:${PORT}/api/tierlists`);
  console.log(`  PUT    http://localhost:${PORT}/api/tierlists/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/tierlists/:id`);
  console.log(`  GET    http://localhost:${PORT}/api/favorites`);
  console.log(`  POST   http://localhost:${PORT}/api/favorites`);
  console.log(`  PUT    http://localhost:${PORT}/api/favorites/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/favorites/:id`);
});
