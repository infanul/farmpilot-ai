import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getExpenses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const expenses = await prisma.expense.findMany({
      where: { userId },
      include: { farm: true },
      orderBy: { date: 'desc' },
    });

    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

    // Group by category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((item) => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });

    const categoryBreakdown = Object.keys(categoryTotals).map((cat) => ({
      category: cat,
      amount: categoryTotals[cat],
    }));

    // Estimated revenue calculations (based on typical 3.5 acre yield at current market prices)
    const estimatedYieldKg = 4500; // 4.5 tonnes
    const avgMarketPricePerKg = 34.50; // INR
    const estimatedRevenue = Math.round(estimatedYieldKg * avgMarketPricePerKg);
    const estimatedProfit = Math.max(0, estimatedRevenue - totalExpenses);
    const profitMargin = estimatedRevenue > 0 ? Math.round((estimatedProfit / estimatedRevenue) * 100 * 10) / 10 : 0;

    res.json({
      success: true,
      data: {
        expenses,
        totalExpenses,
        categoryBreakdown,
        projections: {
          estimatedYieldKg,
          estimatedRevenue,
          estimatedProfit,
          profitMarginPercentage: profitMargin,
          note: 'Estimated values calculated based on target yield and average local market prices.',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { farmId, category, description, amount, date } = req.body;

    if (!category || !amount) {
      return res.status(400).json({ success: false, message: 'Category and amount are required.' });
    }

    const expense = await prisma.expense.create({
      data: {
        userId,
        farmId: farmId || null,
        category,
        description: description || category + ' expense',
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
      },
    });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};
