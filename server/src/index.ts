import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import router from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: '*', // Allow all origins for development & production deployment
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded disease scan images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount API router under /api
app.use('/api', router);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 FarmPilot AI Backend API running on http://localhost:${PORT}`);
  console.log(`🌾 Health Check: http://localhost:${PORT}/api/health`);
});
