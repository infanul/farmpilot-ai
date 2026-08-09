import { Router } from 'express';
import multer from 'multer';
import path from 'path';

import { register, login, getMe } from '../controllers/authController';
import { getWeather, getWeatherAlerts } from '../controllers/weatherController';
import { getAllCrops, getCropById } from '../controllers/cropController';
import { getAllDiseases, getDiseaseById, scanCropImage, getScanHistory } from '../controllers/diseaseController';
import { getSoilRecords, createSoilRecord } from '../controllers/soilController';
import { getMarketPrices, getMarketTrends } from '../controllers/marketController';
import { getCalendarEvents, generateCropCalendar, updateCalendarEvent } from '../controllers/calendarController';
import { getFarms, createFarm, updateFarm, deleteFarm } from '../controllers/farmController';
import { getNotifications, markNotificationRead } from '../controllers/notificationController';
import { askAdvisor } from '../controllers/advisorController';
import { getAnalytics } from '../controllers/analyticsController';
import { getExpenses, addExpense } from '../controllers/financeController';
import { authenticateToken } from '../middleware/authMiddleware';

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

const router = Router();

// Health Check Endpoint (Req 36)
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'FarmPilot AI API is running',
    timestamp: new Date().toISOString(),
  });
});

// Authentication
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getMe);

// Weather
router.get('/weather', getWeather);
router.get('/weather/alerts', getWeatherAlerts);

// Crops
router.get('/crops', getAllCrops);
router.get('/crops/:id', getCropById);

// Diseases & Scanning
router.get('/diseases', getAllDiseases);
router.get('/diseases/:id', getDiseaseById);
router.post('/disease/scan', upload.single('image'), scanCropImage);
router.get('/disease/scans', authenticateToken, getScanHistory);

// Soil Intelligence
router.get('/soil', getSoilRecords);
router.post('/soil', createSoilRecord);

// Market Intelligence
router.get('/market', getMarketPrices);
router.get('/market/trends', getMarketTrends);

// Crop Calendar
router.get('/calendar', authenticateToken, getCalendarEvents);
router.post('/calendar/generate', authenticateToken, generateCropCalendar);
router.put('/calendar/:id', authenticateToken, updateCalendarEvent);

// Multi-Farm Management
router.get('/farms', authenticateToken, getFarms);
router.post('/farms', authenticateToken, createFarm);
router.put('/farms/:id', authenticateToken, updateFarm);
router.delete('/farms/:id', authenticateToken, deleteFarm);

// Notifications
router.get('/notifications', authenticateToken, getNotifications);
router.put('/notifications/:id/read', authenticateToken, markNotificationRead);

// Advisor
router.post('/advisor', askAdvisor);

// Analytics & Finance
router.get('/analytics', getAnalytics);
router.get('/finance', authenticateToken, getExpenses);
router.post('/finance', authenticateToken, addExpense);

export default router;
