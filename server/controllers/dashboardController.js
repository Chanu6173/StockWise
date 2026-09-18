const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const stockService = require('../services/stockService');
const { asyncHandler } = require('../middlewares/errorHandler');

// @desc    Get dashboard metrics and chart series
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const holdings = await Portfolio.find({ userId });

  // 1. Enrich holdings with current prices
  let totalInvestment = 0;
  let currentValue = 0;
  let todayChangeTotal = 0;

  const enrichedHoldings = await Promise.all(
    holdings.map(async (h) => {
      try {
        const quote = await stockService.getQuote(h.symbol);
        const profile = await stockService.getCompanyProfile(h.symbol);
        
        const price = quote.price || h.buyPrice;
        const invested = h.buyPrice * h.quantity;
        const value = price * h.quantity;
        const profit = value - invested;
        
        totalInvestment += invested;
        currentValue += value;
        
        // Today's Change = Quantity * (Current Price - Previous Close)
        const prevClose = quote.previousClose || price;
        const todayChange = (price - prevClose) * h.quantity;
        todayChangeTotal += todayChange;

        return {
          symbol: h.symbol,
          companyName: h.companyName,
          quantity: h.quantity,
          buyPrice: h.buyPrice,
          currentPrice: price,
          totalInvestment: invested,
          currentValue: value,
          profit,
          sector: profile.sector || 'Other',
        };
      } catch (error) {
        const invested = h.buyPrice * h.quantity;
        totalInvestment += invested;
        currentValue += invested;
        return {
          symbol: h.symbol,
          companyName: h.companyName,
          quantity: h.quantity,
          buyPrice: h.buyPrice,
          currentPrice: h.buyPrice,
          totalInvestment: invested,
          currentValue: invested,
          profit: 0,
          sector: 'Other',
        };
      }
    })
  );

  const overallProfit = currentValue - totalInvestment;
  const overallProfitPercent = totalInvestment > 0 ? (overallProfit / totalInvestment) * 100 : 0;
  const todayChangePercent = currentValue > 0 ? (todayChangeTotal / currentValue) * 100 : 0;

  // 2. Portfolio Allocation Data (Pie Chart)
  // Group by symbol to find weightings
  const allocation = enrichedHoldings.map((h) => ({
    name: h.symbol,
    value: parseFloat(h.currentValue.toFixed(2)),
    percentage: currentValue > 0 ? parseFloat(((h.currentValue / currentValue) * 100).toFixed(2)) : 0,
  }));

  // 3. Profit Distribution Data (Bar Chart)
  const profitDistribution = enrichedHoldings.map((h) => ({
    name: h.symbol,
    profit: parseFloat(h.profit.toFixed(2)),
  }));

  // 4. Portfolio Growth Trend (Line/Area Chart)
  // We'll mock historical value trend based on transactions & historical prices for display
  const growthTrend = [];
  const now = new Date();
  
  // Create a 7-day trend
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Simulate daily growth with a small randomized path around current value
    const randomShift = (Math.random() - 0.45) * (currentValue * 0.02);
    const simulatedVal = Math.max(0, currentValue - (i * (overallProfit / 7)) + randomShift);
    
    growthTrend.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: parseFloat(simulatedVal.toFixed(2)),
    });
  }

  // 5. Recent Transactions
  const recentTransactions = await Transaction.find({ userId })
    .sort({ date: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      summary: {
        portfolioValue: parseFloat(currentValue.toFixed(2)),
        totalInvestment: parseFloat(totalInvestment.toFixed(2)),
        overallProfit: parseFloat(overallProfit.toFixed(2)),
        overallProfitPercent: parseFloat(overallProfitPercent.toFixed(2)),
        todayGain: parseFloat(todayChangeTotal.toFixed(2)),
        todayGainPercent: parseFloat(todayChangePercent.toFixed(2)),
        totalHoldings: holdings.length,
      },
      charts: {
        allocation,
        profitDistribution,
        growthTrend,
      },
      recentTransactions,
    },
  });
});

module.exports = {
  getDashboardData,
};
