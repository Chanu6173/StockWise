const express = require('express');
const router = express.Router();
const {
  getPortfolio,
  addStock,
  updateStock,
  deleteStock,
} = require('../controllers/portfolioController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // Secure all portfolio endpoints

router.route('/')
  .get(getPortfolio)
  .post(addStock);

router.route('/:id')
  .put(updateStock)
  .delete(deleteStock);

module.exports = router;
