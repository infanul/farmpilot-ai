import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const calculateSoilHealthScore = (
  ph: number,
  moisture: number,
  nitrogen: number,
  phosphorus: number,
  potassium: number,
  organicMatter: number
): number => {
  let score = 100;

  // pH optimal range 6.0 - 7.2
  if (ph < 5.5 || ph > 7.8) score -= 15;
  else if (ph < 6.0 || ph > 7.2) score -= 5;

  // Moisture optimal 30% - 50%
  if (moisture < 20 || moisture > 65) score -= 15;
  else if (moisture < 30 || moisture > 50) score -= 5;

  // Nitrogen (optimal 180-280 ppm)
  if (nitrogen < 120) score -= 15;
  else if (nitrogen < 180) score -= 5;

  // Phosphorus (optimal 20-40 ppm)
  if (phosphorus < 15) score -= 10;

  // Potassium (optimal 150-250 ppm)
  if (potassium < 120) score -= 10;

  // Organic matter (optimal > 2.5%)
  if (organicMatter < 1.5) score -= 10;
  else if (organicMatter < 2.5) score -= 5;

  return Math.max(20, Math.min(100, Math.round(score * 10) / 10));
};

export const getSoilRecords = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    const records = await prisma.soilRecord.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

export const createSoilRecord = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'demo-user';
    const { farmId, location, soilType, ph, moisture, nitrogen, phosphorus, potassium, organicMatter, isEstimated } = req.body;

    const phVal = parseFloat(ph) || 6.5;
    const moistVal = parseFloat(moisture) || 40;
    const nVal = parseFloat(nitrogen) || 200;
    const pVal = parseFloat(phosphorus) || 25;
    const kVal = parseFloat(potassium) || 180;
    const omVal = parseFloat(organicMatter) || 2.5;

    const healthScore = calculateSoilHealthScore(phVal, moistVal, nVal, pVal, kVal, omVal);

    const recs: string[] = [];
    if (phVal < 6.0) recs.push('Soil is acidic. Apply agricultural lime (Calcium Carbonate) to raise pH towards 6.5.');
    if (phVal > 7.5) recs.push('Soil is alkaline. Apply agricultural gypsum or organic compost to buffer pH down.');
    if (nVal < 180) recs.push('Nitrogen is below optimal. Top-dress with organic vermicompost or split Nitrogen application.');
    if (omVal < 2.5) recs.push('Incorporate cover crops or 5 tonnes FYM per acre to boost soil organic matter.');
    if (recs.length === 0) recs.push('Soil parameters are well balanced. Maintain current organic mulching schedule.');

    const record = await prisma.soilRecord.create({
      data: {
        userId,
        farmId: farmId || null,
        location: location || 'Main Farm Field',
        soilType: soilType || 'Clay Loam',
        ph: phVal,
        moisture: moistVal,
        nitrogen: nVal,
        phosphorus: pVal,
        potassium: kVal,
        organicMatter: omVal,
        healthScore,
        isEstimated: Boolean(isEstimated),
        recommendations: recs.join(' '),
      },
    });

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};
