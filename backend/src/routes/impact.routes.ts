import { Router, Response, Request } from 'express';
import { prisma } from '../prisma.js';

export const impactRouter = Router();

impactRouter.get('/summary', async (req: Request, res: Response): Promise<void> => {
  try {
    const records = await prisma.impactRecord.findMany({
      orderBy: { recordedAt: 'asc' },
    });

    const totalKg = records.reduce((sum, r) => sum + r.quantityKg, 0);
    const totalCo2Kg = records.reduce((sum, r) => sum + r.co2SavedKg, 0);
    const totalLandfillKg = records.reduce((sum, r) => sum + r.landfillDivertedKg, 0);
    const totalWaterLiters = records.reduce((sum, r) => sum + r.waterSavedLiters, 0);
    const totalTrees = records.reduce((sum, r) => sum + r.treesEquivalent, 0);
    const totalValue = records.reduce((sum, r) => sum + r.transactionValue, 0);
    const completedTransactions = records.length;

    // Category breakdown
    const categoryMap: Record<string, { weightKg: number; co2Kg: number; value: number }> = {};
    records.forEach((r) => {
      if (!categoryMap[r.materialCategory]) {
        categoryMap[r.materialCategory] = { weightKg: 0, co2Kg: 0, value: 0 };
      }
      categoryMap[r.materialCategory].weightKg += r.quantityKg;
      categoryMap[r.materialCategory].co2Kg += r.co2SavedKg;
      categoryMap[r.materialCategory].value += r.transactionValue;
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      weightKg: Math.round(data.weightKg),
      co2Kg: Math.round(data.co2Kg),
      value: Math.round(data.value),
    }));

    // Monthly trends
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap: Record<string, { month: string; weightKg: number; co2Kg: number; transactions: number }> = {};

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear() % 100}`;
      monthlyMap[key] = { month: key, weightKg: 0, co2Kg: 0, transactions: 0 };
    }

    records.forEach((r) => {
      const d = new Date(r.recordedAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear() % 100}`;
      if (monthlyMap[key]) {
        monthlyMap[key].weightKg += r.quantityKg;
        monthlyMap[key].co2Kg += r.co2SavedKg;
        monthlyMap[key].transactions += 1;
      }
    });

    const monthlyTrends = Object.values(monthlyMap);

    res.json({
      metrics: {
        totalMaterialsReusedKg: Math.round(totalKg),
        totalMaterialsReusedTons: Math.round((totalKg / 1000) * 10) / 10,
        totalCo2SavedKg: Math.round(totalCo2Kg),
        totalLandfillDivertedKg: Math.round(totalLandfillKg),
        totalWaterSavedLiters: Math.round(totalWaterLiters),
        totalTreesEquivalent: Math.round(totalTrees),
        totalValueExchanged: Math.round(totalValue),
        completedTransactions,
      },
      categoryBreakdown,
      monthlyTrends,
      disclaimer: 'Environmental calculations are peer-reviewed lifecycle estimates using standard circular economy carbon & resource offset indices.',
    });
  } catch (error) {
    console.error('Impact summary error:', error);
    res.status(500).json({ error: 'Failed to fetch environmental impact summary.' });
  }
});
