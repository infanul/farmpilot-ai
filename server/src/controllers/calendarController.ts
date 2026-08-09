import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { CalendarService } from '../services/calendarService';

const prisma = new PrismaClient();

export const getCalendarEvents = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const events = await CalendarService.getSmartCalendarEvents(userId);

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const generateCropCalendar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { farmId, cropId, plantingDate } = req.body;
    if (!cropId || !plantingDate) {
      return res.status(400).json({ success: false, message: 'Crop and planting date are required' });
    }

    const events = await CalendarService.generateCalendarForCrop(userId, farmId || null, cropId, plantingDate);

    res.status(201).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCalendarEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, completedDate } = req.body;

    const event = await prisma.cropCalendarEvent.update({
      where: { id },
      data: {
        status: status || 'COMPLETED',
        completedDate: status === 'COMPLETED' ? new Date(completedDate || Date.now()) : null,
      },
    });

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};
