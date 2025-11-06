const Project = require('../models/Project');
const User = require('../models/User');
const blockchainService = require('../services/blockchainService');
const { ethers } = require('ethers');

/**
 * Create a new project (Step 1 & 2)
 * - Save to MongoDB
 * - Call smart contract createProject
 */
exports.createProject = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      takerAddress, 
      auditorAddress, 
      milestones,
      giverPrivateKey // In production, use better key management
    } = req.body;

    // Validate inputs
    if (!name || !description || !takerAddress || !auditorAddress || !milestones || !giverPrivateKey) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!Array.isArray(milestones) || milestones.length === 0) {
      return res.status(400).json({ error: 'Milestones must be a non-empty array' });
    }

    // Get giver (current user)
    const giver = req.user;

    // Find taker and auditor
    const taker = await User.findOne({ walletAddress: takerAddress.toLowerCase() });
    const auditor = await User.findOne({ walletAddress: auditorAddress.toLowerCase() });

    if (!taker) {
      return res.status(404).json({ error: 'Taker not found' });
    }

    if (!auditor) {
      return res.status(404).json({ error: 'Auditor not found' });
    }

    // Calculate total funds
    const amounts = milestones.map(m => ethers.parseEther(m.amount.toString()).toString());
    const totalFunds = amounts.reduce((sum, amt) => sum + BigInt(amt), BigInt(0)).toString();

    // Create project in MongoDB first
    const project = new Project({
      name,
      description,
      giver: giver._id,
      giverAddress: giver.walletAddress,
      taker: taker._id,
      takerAddress: taker.walletAddress,
      auditor: auditor._id,
      auditorAddress: auditor.walletAddress,
      totalFunds,
      milestones: milestones.map((m, index) => ({
        title: m.title,
        description: m.description,
        amount: amounts[index]
      })),
      status: 'pending'
    });

    await project.save();

    // Call blockchain service to create project on-chain
    try {
      const result = await blockchainService.createProject(
        giverPrivateKey,
        takerAddress,
        auditorAddress,
        amounts
      );

      // Update project with blockchain details
      project.blockchainProjectId = result.projectId;
      project.transactionHash = result.txHash;
      project.status = 'active';
      await project.save();

      // Save transaction
      await blockchainService.saveTransaction({
        projectId: project._id,
        blockchainProjectId: result.projectId,
        transactionHash: result.txHash,
        transactionType: 'createProject',
        from: giver.walletAddress,
        amount: totalFunds,
        status: 'confirmed',
        blockNumber: result.receipt.blockNumber,
        gasUsed: result.receipt.gasUsed.toString()
      });

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        project: {
          id: project._id,
          blockchainProjectId: project.blockchainProjectId,
          transactionHash: project.transactionHash,
          name: project.name,
          status: project.status
        }
      });
    } catch (blockchainError) {
      // If blockchain fails, mark project as failed
      project.status = 'cancelled';
      await project.save();
      
      throw blockchainError;
    }
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ 
      error: 'Failed to create project',
      details: error.message 
    });
  }
};

/**
 * Get all projects
 */
exports.getAllProjects = async (req, res) => {
  try {
    const { status, role } = req.query;
    
    let query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by user role
    if (role === 'giver') {
      query.giver = req.user._id;
    } else if (role === 'taker') {
      query.taker = req.user._id;
    } else if (role === 'auditor') {
      query.auditor = req.user._id;
    }

    const projects = await Project.find(query)
      .populate('giver', 'name walletAddress')
      .populate('taker', 'name walletAddress')
      .populate('auditor', 'name walletAddress')
      .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
};

/**
 * Get project by ID
 */
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate('giver', 'name walletAddress email')
      .populate('taker', 'name walletAddress email')
      .populate('auditor', 'name walletAddress email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Optionally fetch blockchain data for verification
    if (project.blockchainProjectId !== null) {
      try {
        const blockchainData = await blockchainService.getProject(project.blockchainProjectId);
        project._doc.blockchainData = blockchainData;
      } catch (err) {
        console.error('Failed to fetch blockchain data:', err);
      }
    }

    res.json({ success: true, project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
};

/**
 * Cancel project (only giver can cancel)
 */
exports.cancelProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { giverPrivateKey } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is the giver
    if (project.giver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only giver can cancel project' });
    }

    if (project.status !== 'active') {
      return res.status(400).json({ error: 'Project is not active' });
    }

    // Call blockchain service
    const result = await blockchainService.cancelProject(
      giverPrivateKey,
      project.blockchainProjectId
    );

    // Update project status
    project.status = 'cancelled';
    await project.save();

    // Save transaction
    await blockchainService.saveTransaction({
      projectId: project._id,
      blockchainProjectId: project.blockchainProjectId,
      transactionHash: result.txHash,
      transactionType: 'cancelProject',
      from: req.user.walletAddress,
      status: 'confirmed',
      blockNumber: result.receipt.blockNumber,
      gasUsed: result.receipt.gasUsed.toString()
    });

    res.json({
      success: true,
      message: 'Project cancelled successfully',
      transactionHash: result.txHash
    });
  } catch (error) {
    console.error('Cancel project error:', error);
    res.status(500).json({ 
      error: 'Failed to cancel project',
      details: error.message 
    });
  }
};
