const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Authentication routes
router.post('/auth/wallet', authController.authenticateWallet);
router.get('/auth/profile', auth, authController.getProfile);
router.put('/auth/profile', auth, authController.updateProfile);
router.get('/users/role/:role', auth, authController.getUsersByRole);

module.exports = router;
