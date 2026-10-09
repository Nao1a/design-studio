import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { seedInitialDatabase } from './utils/seedData.js';

import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';

dotenv.config();

import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
await connectDB();

// Seed initial content and default admin
await seedInitialDatabase();

// Performance: Response compression (gzip / deflate)
app.use(compression());

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory with caching
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '7d',
  immutable: true,
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'AAU Biomedical Design Studio Backend API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/proposals', proposalRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`[Server Error] ${err.stack || err.message}`);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` AAU Biomedical Design Studio Backend API`);
  console.log(` Running on: http://localhost:${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log(` Default Admin: ${process.env.ADMIN_DEFAULT_EMAIL || 'admin@aau-designstudio.edu.et'}`);
  console.log(`======================================================\n`);
});
