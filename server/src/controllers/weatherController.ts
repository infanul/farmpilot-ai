import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { WeatherService } from '../services/weatherService';

const prisma = new PrismaClient();

export const getWeather = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const location = (req.query.location as string) || 'Kottayam, Kerala';
    const weatherData = await WeatherService.getWeather(location);

    res.json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    next(error);
  }
};

export const getWeatherAlerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alerts = await prisma.weatherAlert.findMany({
      where: {
        validUntil: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};
