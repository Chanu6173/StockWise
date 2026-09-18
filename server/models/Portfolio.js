const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    symbol: {
      type: String,
      required: [true, 'Please add a stock symbol'],
      uppercase: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: [1, 'Quantity must be at least 1'],
    },
    buyPrice: {
      type: Number,
      required: [true, 'Please add a buy price'],
      min: [0, 'Buy price cannot be negative'],
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Please add a purchase date'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so a user cannot duplicate holdings for a symbol
PortfolioSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
