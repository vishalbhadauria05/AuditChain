const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');

// Validate required environment variable
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

/**
 * Register or login user with wallet address
 */
exports.authenticateWallet = async (req, res) => {
  try {
    const { walletAddress, signature, message, name, email, role } = req.body;

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Find or create user
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!user) {
      // Create new user
      user = new User({
        walletAddress: walletAddress.toLowerCase(),
        name: name || 'User',
        email: email || `${walletAddress.slice(0, 10)}@auditchain.app`,
        role: role || 'taker'
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, walletAddress: user.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Get current user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, profileImage } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (profileImage) user.profileImage = profileImage;
    
    await user.save();
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

/**
 * Get users by role
 */
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role }).select('-__v');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users' });
  }
};
