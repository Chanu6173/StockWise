const Portfolio = require('../models/Portfolio');
const stockService = require('../services/stockService');
const { asyncHandler } = require('../middlewares/errorHandler');

// @desc    Get detailed portfolio analytics
// @route   GET /api/analytics
// @access  Private
const getAnalyticsData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const holdings = await Portfolio.find({ userId });

  if (holdings.length === 0) {
    return res.json({
      success: true,
      data: {
        summary: { totalInvestment: 0, currentValue: 0, overallReturn: 0, overallReturnPercent: 0 },
        bestPerformer: null,
        worstPerformer: null,
        sectorDistribution: [],
      },
    });
  }

  let totalInvestment = 0;
  let currentValue = 0;
  const sectorMap = {};

  const analyzedHoldings = await Promise.all(
    holdings.map(async (h) => {
      try {
        const quote = await stockService.getQuote(h.symbol);
        const profile = await stockService.getCompanyProfile(h.symbol);
        
        const price = quote.price || h.buyPrice;
        const invested = h.buyPrice * h.quantity;
        const value = price * h.quantity;
        const profit = value - invested;
        const profitPercent = invested > 0 ? (profit / invested) * 100 : 0;
        
        totalInvestment += invested;
        currentValue += value;

        // Sector aggregation
        const sector = profile.sector || 'Other';
        sectorMap[sector] = (sectorMap[sector] || 0) + value;

        return {
          symbol: h.symbol,
          companyName: h.companyName,
          profit,
          profitPercent,
          currentValue: value,
        };
      } catch (error) {
        const invested = h.buyPrice * h.quantity;
        totalInvestment += invested;
        currentValue += invested;
        
        sectorMap['Other'] = (sectorMap['Other'] || 0) + invested;

        return {
          symbol: h.symbol,
          companyName: h.companyName,
          profit: 0,
          profitPercent: 0,
          currentValue: invested,
        };
      }
    })
  );

  // Sort by profit percent to find best/worst performers
  const sortedByPerformance = [...analyzedHoldings].sort(
    (a, b) => b.profitPercent - a.profitPercent
  );

  const bestPerformer = sortedByPerformance[0];
  const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1];

  const overallReturn = currentValue - totalInvestment;
  const overallReturnPercent = totalInvestment > 0 ? (overallReturn / totalInvestment) * 100 : 0;

  // Sector distribution array formatting
  const sectorDistribution = Object.keys(sectorMap).map((sector) => ({
    name: sector,
    value: parseFloat(sectorMap[sector].toFixed(2)),
    percentage: currentValue > 0 ? parseFloat(((sectorMap[sector] / currentValue) * 100).toFixed(2)) : 0,
  }));

  res.json({
    success: true,
    data: {
      summary: {
        totalInvestment: parseFloat(totalInvestment.toFixed(2)),
        currentValue: parseFloat(currentValue.toFixed(2)),
        overallReturn: parseFloat(overallReturn.toFixed(2)),
        overallReturnPercent: parseFloat(overallReturnPercent.toFixed(2)),
        averageReturnPercent: parseFloat(
          (
            analyzedHoldings.reduce((sum, h) => sum + h.profitPercent, 0) / holdings.length
          ).toFixed(2)
        ),
      },
      bestPerformer: bestPerformer.profit !== 0 ? bestPerformer : null,
      worstPerformer: worstPerformer.profit !== 0 ? worstPerformer : null,
      sectorDistribution,
    },
  });
});

module.exports = {
  getAnalyticsData,
};
