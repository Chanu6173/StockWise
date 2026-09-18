const express = require('express');
const router = express.Router();
const { searchStocks, getStockDetails } = require('../controllers/stockController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // Secure all stock endpoints

router.get('/search', searchStocks);
router.get('/:symbol', getStockDetails);

module.exports = router;
