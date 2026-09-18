const stockService = require('../services/stockService');
const { asyncHandler } = require('../middlewares/errorHandler');

// @desc    Search stocks by ticker or name
// @route   GET /api/stocks/search
// @access  Private
const searchStocks = asyncHandler(async (req, res) => {
  const query = req.query.q;

  if (!query) {
    res.status(400);
    throw new Error('Please provide search query');
  }

  const results = await stockService.searchStocks(query);

  res.json({
    success: true,
    data: results,
  });
});

// @desc    Get stock profile, metrics and chart history
// @route   GET /api/stocks/:symbol
// @access  Private
const getStockDetails = asyncHandler(async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const range = req.query.range || '1M'; // 1W, 1M, 3M, 1Y

  // Fetch quotes, profile, and historical data in parallel
  const [quote, profile, history] = await Promise.all([
    stockService.getQuote(symbol),
    stockService.getCompanyProfile(symbol),
    stockService.getHistoricalData(symbol, range),
  ]);

  res.json({
    success: true,
    data: {
      symbol,
      quote,
      profile,
      history,
    },
  });
});

module.exports = {
  searchStocks,
  getStockDetails,
};
