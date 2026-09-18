const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const stockService = require('../services/stockService');
const { asyncHandler } = require('../middlewares/errorHandler');

// @desc    Get user portfolio with real-time price enrichment
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = asyncHandler(async (req, res) => {
  const holdings = await Portfolio.find({ userId: req.user._id });

  // Enrich each holding with current price info from stockService
  const enrichedHoldings = await Promise.all(
    holdings.map(async (holding) => {
      try {
        const quote = await stockService.getQuote(holding.symbol);
        const currentPrice = quote.price || holding.buyPrice;
        const totalInvestment = holding.buyPrice * holding.quantity;
        const currentValue = currentPrice * holding.quantity;
        const profit = currentValue - totalInvestment;
        const profitPercent = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;

        return {
          _id: holding._id,
          symbol: holding.symbol,
          companyName: holding.companyName,
          quantity: holding.quantity,
          buyPrice: holding.buyPrice,
          purchaseDate: holding.purchaseDate,
          currentPrice,
          totalInvestment: parseFloat(totalInvestment.toFixed(2)),
          currentValue: parseFloat(currentValue.toFixed(2)),
          profit: parseFloat(profit.toFixed(2)),
          profitPercent: parseFloat(profitPercent.toFixed(2)),
          dailyChangePercent: quote.changePercent || 0,
        };
      } catch (error) {
        // Fallback if API fails
        const totalInvestment = holding.buyPrice * holding.quantity;
        return {
          _id: holding._id,
          symbol: holding.symbol,
          companyName: holding.companyName,
          quantity: holding.quantity,
          buyPrice: holding.buyPrice,
          purchaseDate: holding.purchaseDate,
          currentPrice: holding.buyPrice,
          totalInvestment: parseFloat(totalInvestment.toFixed(2)),
          currentValue: parseFloat(totalInvestment.toFixed(2)),
          profit: 0,
          profitPercent: 0,
          dailyChangePercent: 0,
        };
      }
    })
  );

  res.json({
    success: true,
    count: enrichedHoldings.length,
    data: enrichedHoldings,
  });
});

// @desc    Add stock to portfolio
// @route   POST /api/portfolio
// @access  Private
const addStock = asyncHandler(async (req, res) => {
  const { symbol, companyName, quantity, buyPrice, purchaseDate } = req.body;

  // Check if stock already exists in user's portfolio
  let holding = await Portfolio.findOne({ userId: req.user._id, symbol: symbol.toUpperCase() });

  if (holding) {
    // If it exists, update it by averaging costs
    const oldQty = holding.quantity;
    const oldPrice = holding.buyPrice;
    const newQty = oldQty + Number(quantity);
    const newAveragePrice = ((oldPrice * oldQty) + (Number(buyPrice) * Number(quantity))) / newQty;

    holding.quantity = newQty;
    holding.buyPrice = parseFloat(newAveragePrice.toFixed(4));
    holding.purchaseDate = purchaseDate || holding.purchaseDate;
    await holding.save();
  } else {
    // Create new holding
    holding = await Portfolio.create({
      userId: req.user._id,
      symbol: symbol.toUpperCase(),
      companyName,
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
      purchaseDate: purchaseDate || new Date(),
    });
  }

  // Create BUY transaction
  await Transaction.create({
    userId: req.user._id,
    symbol: symbol.toUpperCase(),
    companyName,
    type: 'BUY',
    quantity: Number(quantity),
    price: Number(buyPrice),
    totalAmount: Number(quantity) * Number(buyPrice),
    date: purchaseDate || new Date(),
  });

  res.status(201).json({
    success: true,
    data: holding,
  });
});

// @desc    Update portfolio stock position details
// @route   PUT /api/portfolio/:id
// @access  Private
const updateStock = asyncHandler(async (req, res) => {
  const { quantity, buyPrice, purchaseDate } = req.body;
  const holding = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id });

  if (!holding) {
    res.status(404);
    throw new Error('Stock holding not found');
  }

  const oldQty = holding.quantity;
  const oldPrice = holding.buyPrice;
  const newQty = Number(quantity);
  const newPrice = Number(buyPrice);

  holding.quantity = newQty;
  holding.buyPrice = newPrice;
  holding.purchaseDate = purchaseDate || holding.purchaseDate;

  await holding.save();

  // Log transaction reflecting correction/change
  // For simplicity, we can record a BUY transaction adjusting the difference,
  // but registering a BUY with the updated values is clean enough.
  await Transaction.create({
    userId: req.user._id,
    symbol: holding.symbol,
    companyName: holding.companyName,
    type: newQty > oldQty ? 'BUY' : 'SELL',
    quantity: Math.abs(newQty - oldQty),
    price: newPrice,
    totalAmount: Math.abs(newQty - oldQty) * newPrice,
    date: new Date(),
  });

  res.json({
    success: true,
    data: holding,
  });
});

// @desc    Delete stock from portfolio (Liquidate position)
// @route   DELETE /api/portfolio/:id
// @access  Private
const deleteStock = asyncHandler(async (req, res) => {
  const holding = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id });

  if (!holding) {
    res.status(404);
    throw new Error('Stock holding not found');
  }

  // Record SELL transaction for liquidation
  await Transaction.create({
    userId: req.user._id,
    symbol: holding.symbol,
    companyName: holding.companyName,
    type: 'SELL',
    quantity: holding.quantity,
    price: holding.buyPrice, // sell at cost or current price fallback
    totalAmount: holding.quantity * holding.buyPrice,
    date: new Date(),
  });

  await Portfolio.deleteOne({ _id: req.params.id });

  res.json({
    success: true,
    message: 'Stock removed from portfolio',
  });
});

module.exports = {
  getPortfolio,
  addStock,
  updateStock,
  deleteStock,
};
