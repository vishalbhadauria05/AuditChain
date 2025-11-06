const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  blockchainProjectId: {
    type: Number,
    required: true
  },
  transactionHash: {
    type: String,
    required: true
  },
  transactionType: {
    type: String,
    enum: ['createProject', 'verifyMilestone', 'releaseFunds', 'cancelProject'],
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    default: ''
  },
  amount: {
    type: String,
    default: '0'
  },
  milestoneIndex: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  blockNumber: {
    type: Number,
    default: null
  },
  gasUsed: {
    type: String,
    default: '0'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
