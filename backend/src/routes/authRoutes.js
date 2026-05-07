const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  refresh,
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const {
  registerValidation,
  loginValidation,
  changePasswordValidation,
} = require('../middleware/validators');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', verifyToken, logout);
router.post('/refresh', refresh);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePasswordValidation, changePassword);

module.exports = router;