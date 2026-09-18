const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const {
  validateRegister,
  validateLogin,
} = require('../validators/authValidator');

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
