const Transaction = require('../models/Transaction');
const { asyncHandler } = require('../middlewares/errorHandler');

// @desc    Get user transactions history (supports search, sort, pagination)
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Query filter construction
  const queryFilter = { userId };

  // Search by symbol or companyName
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    queryFilter.$or = [
      { symbol: searchRegex },
      { companyName: searchRegex },
    ];
  }

  // Filter by type (BUY/SELL)
  if (req.query.type) {
    queryFilter.type = req.query.type.toUpperCase();
  }

  // Sort direction config
  const sortBy = req.query.sortBy || 'date';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder;

  // Execute query
  const total = await Transaction.countDocuments(queryFilter);
  const transactions = await Transaction.find(queryFilter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    count: transactions.length,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: transactions,
  });
});

module.exports = {
  getTransactions,
};
