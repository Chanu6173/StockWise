const express = require('express');
const router = express.Router();
const { getAnalyticsData } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAnalyticsData);

module.exports = router;
