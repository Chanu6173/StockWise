const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// Ensure user can watch a stock symbol only once
WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', WatchlistSchema);
