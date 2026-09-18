const express = require('express');
const router = express.Router();
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require('../controllers/watchlistController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // Secure all watchlist endpoints

router.route('/')
  .get(getWatchlist)
  .post(addToWatchlist);

router.route('/:id')
  .delete(removeFromWatchlist);

module.exports = router;
