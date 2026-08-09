import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getFarms = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const farms = await prisma.farm.findMany({
      where: { userId },
      include: {
        soilRecords: { take: 1, orderBy: { createdAt: 'desc' } },
        calendarEvents: { take: 5, orderBy: { scheduledDate: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: farms,
    });
  } catch (error) {
    next(error);
  }
};

export const createFarm = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { name, location, area, soilType, irrigationType, mainCropId } = req.body;

    if (!name || !area || !location) {
      return res.status(400).json({ success: false, message: 'Farm name, location, and area are required.' });
    }

    const farm = await prisma.farm.create({
      data: {
        userId,
        name,
        location,
        area: parseFloat(area),
        soilType: soilType || 'Clay Loam',
        irrigationType: irrigationType || 'Drip & Canal',
        mainCropId: mainCropId || null,
      },
    });

    res.status(201).json({
      success: true,
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFarm = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, location, area, soilType, irrigationType, mainCropId } = req.body;

    const farm = await prisma.farm.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(location && { location }),
        ...(area && { area: parseFloat(area) }),
        ...(soilType && { soilType }),
        ...(irrigationType && { irrigationType }),
        ...(mainCropId && { mainCropId }),
      },
    });

    res.json({
      success: true,
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFarm = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.farm.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Farm deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
