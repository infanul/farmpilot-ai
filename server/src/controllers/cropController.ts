import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCrops = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const crops = await prisma.crop.findMany({
      include: {
        diseases: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: crops,
    });
  } catch (error) {
    next(error);
  }
};

export const getCropById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const crop = await prisma.crop.findUnique({
      where: { id },
      include: {
        diseases: {
          include: {
            treatmentRecommendations: true,
          },
        },
        marketPrices: {
          orderBy: { recordedAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    res.json({
      success: true,
      data: crop,
    });
  } catch (error) {
    next(error);
  }
};
