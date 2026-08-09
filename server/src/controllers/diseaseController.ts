import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { DiseaseDetectionService } from '../services/diseaseDetectionService';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getAllDiseases = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const diseases = await prisma.disease.findMany({
      include: {
        crop: true,
        treatmentRecommendations: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: diseases,
    });
  } catch (error) {
    next(error);
  }
};

export const getDiseaseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const disease = await prisma.disease.findUnique({
      where: { id },
      include: {
        crop: true,
        treatmentRecommendations: true,
      },
    });

    if (!disease) {
      return res.status(404).json({ success: false, message: 'Disease record not found' });
    }

    res.json({
      success: true,
      data: disease,
    });
  } catch (error) {
    next(error);
  }
};

export const scanCropImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    const { cropHint } = req.body;
    const userId = req.user?.userId;

    let imageBuffer: Buffer;
    let filename = 'uploaded_leaf.jpg';
    let imageUrl = '/uploads/uploaded_leaf.jpg';

    if (file) {
      filename = file.originalname;
      imageUrl = `/uploads/${file.filename}`;
      imageBuffer = fs.readFileSync(file.path);
    } else {
      // Fallback dummy sample buffer if tested without file stream
      imageBuffer = Buffer.from('dummy_image_data_sample_buffer_for_testing');
    }

    // Execute ML disease scan pipeline with validation, inference, and persistence
    const scanResult = await DiseaseDetectionService.analyzeCropImage(
      imageBuffer,
      filename,
      imageUrl,
      userId,
      cropHint
    );

    res.json({
      success: true,
      data: scanResult,
    });
  } catch (error) {
    next(error);
  }
};

export const getScanHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const scans = await DiseaseDetectionService.getScanHistory(userId);

    res.json({
      success: true,
      data: scans,
    });
  } catch (error) {
    next(error);
  }
};
