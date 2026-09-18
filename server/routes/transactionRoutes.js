const express = require('express');
const router = express.Router();
const { getTransactions } = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // Secure all transactions endpoints

router.get('/', getTransactions);

module.exports = router;
