import { Request, Response, NextFunction } from 'express';
import { AdvisorService } from '../services/advisorService';

export const askAdvisor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cropId, farmId, question } = req.body;
    const advice = await AdvisorService.askAdvisor(cropId, farmId, question);

    res.json({
      success: true,
      data: advice,
    });
  } catch (error) {
    next(error);
  }
};
