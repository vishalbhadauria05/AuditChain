const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

// Get all transactions for a project
router.get('/projects/:projectId/transactions', auth, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const transactions = await Transaction.find({ projectId })
      .sort({ timestamp: -1 });
    
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// Get transaction by hash
router.get('/transactions/:hash', auth, async (req, res) => {
  try {
    const { hash } = req.params;
    
    const transaction = await Transaction.findOne({ transactionHash: hash });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get transaction' });
  }
});

module.exports = router;
