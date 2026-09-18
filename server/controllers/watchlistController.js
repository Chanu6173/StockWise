const Watchlist = require('../models/Watchlist');
const stockService = require('../services/stockService');
const { asyncHandler } = require('../middlewares/errorHandler');

// @desc    Get user watchlist with current price details
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = asyncHandler(async (req, res) => {
  const watchlist = await Watchlist.find({ userId: req.user._id });

  const enrichedWatchlist = await Promise.all(
    watchlist.map(async (item) => {
      try {
        const quote = await stockService.getQuote(item.symbol);
        return {
          _id: item._id,
          symbol: item.symbol,
          companyName: item.companyName,
          currentPrice: quote.price || 0,
          change: quote.change || 0,
          changePercent: quote.changePercent || 0,
        };
      } catch (error) {
        return {
          _id: item._id,
          symbol: item.symbol,
          companyName: item.companyName,
          currentPrice: 0,
          change: 0,
          changePercent: 0,
        };
      }
    })
  );

  res.json({
    success: true,
    count: enrichedWatchlist.length,
    data: enrichedWatchlist,
  });
});

// @desc    Add stock to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = asyncHandler(async (req, res) => {
  const { symbol, companyName } = req.body;

  if (!symbol || !companyName) {
    res.status(400);
    throw new Error('Please provide symbol and companyName');
  }

  // Check if already in watchlist
  const exists = await Watchlist.findOne({
    userId: req.user._id,
    symbol: symbol.toUpperCase(),
  });

  if (exists) {
    res.status(400);
    throw new Error('Stock is already in watchlist');
  }

  const watchItem = await Watchlist.create({
    userId: req.user._id,
    symbol: symbol.toUpperCase(),
    companyName,
  });

  res.status(201).json({
    success: true,
    data: watchItem,
  });
});

// @desc    Remove stock from watchlist
// @route   DELETE /api/watchlist/:id
// @access  Private
const removeFromWatchlist = asyncHandler(async (req, res) => {
  const watchItem = await Watchlist.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!watchItem) {
    res.status(404);
    throw new Error('Watchlist item not found');
  }

  await Watchlist.deleteOne({ _id: req.params.id });

  res.json({
    success: true,
    message: 'Stock removed from watchlist',
  });
});

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};
