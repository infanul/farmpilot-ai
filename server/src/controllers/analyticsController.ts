import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    const totalFarms = await prisma.farm.count(userId ? { where: { userId } } : undefined);
    const activeCalendarTasks = await prisma.cropCalendarEvent.count({
      where: {
        ...(userId ? { userId } : {}),
        status: 'PENDING',
      },
    });
    const completedTasks = await prisma.cropCalendarEvent.count({
      where: {
        ...(userId ? { userId } : {}),
        status: 'COMPLETED',
      },
    });

    const expenses = await prisma.expense.findMany({
      where: userId ? { userId } : {},
    });

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    // Harvest progress estimation
    const harvestProgress = Math.min(100, Math.round((completedTasks / Math.max(1, completedTasks + activeCalendarTasks)) * 100));

    // Rainfall and Moisture history timeline for analytics charts
    const monthlyRainfall = [
      { month: 'Jan', rainfall: 45, moisture: 38 },
      { month: 'Feb', rainfall: 30, moisture: 35 },
      { month: 'Mar', rainfall: 65, moisture: 42 },
      { month: 'Apr', rainfall: 110, moisture: 55 },
      { month: 'May', rainfall: 180, moisture: 68 },
      { month: 'Jun', rainfall: 240, moisture: 78 },
      { month: 'Jul', rainfall: 210, moisture: 75 },
    ];

    res.json({
      success: true,
      data: {
        totalFarms,
        activeCalendarTasks,
        completedTasks,
        harvestProgress,
        totalExpenses,
        monthlyRainfall,
        activitiesSummary: {
          pending: activeCalendarTasks,
          completed: completedTasks,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
