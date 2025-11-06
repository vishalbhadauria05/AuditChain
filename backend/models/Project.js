const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: String, // in wei or ETH string
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  released: {
    type: Boolean,
    default: false
  },
  proofCID: {
    type: String,
    default: '' // IPFS CID of uploaded proof
  },
  proofDescription: {
    type: String,
    default: ''
  },
  verifiedAt: {
    type: Date
  },
  releasedAt: {
    type: Date
  }
});

const projectSchema = new mongoose.Schema({
  blockchainProjectId: {
    type: Number,
    default: null // Set after blockchain createProject
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  giver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  giverAddress: {
    type: String,
    required: true
  },
  taker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  takerAddress: {
    type: String,
    required: true
  },
  auditor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  auditorAddress: {
    type: String,
    required: true
  },
  totalFunds: {
    type: String, // in wei or ETH string
    required: true
  },
  milestones: [milestoneSchema],
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  transactionHash: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
