const Project = require('../models/Project');
const ipfsService = require('../services/ipfsService');
const blockchainService = require('../services/blockchainService');

/**
 * Upload proof for milestone (Step 3)
 * - Taker uploads file (bill/image/document)
 * - File stored on IPFS
 * - CID saved in MongoDB
 */
exports.uploadProof = async (req, res) => {
  try {
    const { projectId, milestoneIndex } = req.params;
    const { description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is the taker
    if (project.taker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only taker can upload proof' });
    }

    // Validate milestone index
    const index = parseInt(milestoneIndex);
    if (index < 0 || index >= project.milestones.length) {
      return res.status(400).json({ error: 'Invalid milestone index' });
    }

    const milestone = project.milestones[index];

    if (milestone.verified) {
      return res.status(400).json({ error: 'Milestone already verified' });
    }

    // Upload to IPFS
    const { cid, url } = await ipfsService.uploadFile(file.buffer, file.originalname);

    // Update milestone with proof
    milestone.proofCID = cid;
    milestone.proofDescription = description || '';

    await project.save();

    res.json({
      success: true,
      message: 'Proof uploaded successfully',
      data: {
        cid,
        url,
        milestoneIndex: index
      }
    });
  } catch (error) {
    console.error('Upload proof error:', error);
    res.status(500).json({ 
      error: 'Failed to upload proof',
      details: error.message 
    });
  }
};

/**
 * Verify milestone (Step 4)
 * - Auditor checks proof
 * - Auditor calls smart contract to verify milestone
 */
exports.verifyMilestone = async (req, res) => {
  try {
    const { projectId, milestoneIndex } = req.params;
    const { auditorPrivateKey } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is the auditor
    if (project.auditor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only auditor can verify milestone' });
    }

    // Validate milestone index
    const index = parseInt(milestoneIndex);
    if (index < 0 || index >= project.milestones.length) {
      return res.status(400).json({ error: 'Invalid milestone index' });
    }

    const milestone = project.milestones[index];

    if (milestone.verified) {
      return res.status(400).json({ error: 'Milestone already verified' });
    }

    if (!milestone.proofCID) {
      return res.status(400).json({ error: 'No proof uploaded for this milestone' });
    }

    // Call blockchain service to verify milestone
    const result = await blockchainService.verifyMilestone(
      auditorPrivateKey,
      project.blockchainProjectId,
      index
    );

    // Update milestone in MongoDB
    milestone.verified = true;
    milestone.verifiedAt = new Date();

    await project.save();

    // Save transaction
    await blockchainService.saveTransaction({
      projectId: project._id,
      blockchainProjectId: project.blockchainProjectId,
      transactionHash: result.txHash,
      transactionType: 'verifyMilestone',
      from: req.user.walletAddress,
      milestoneIndex: index,
      status: 'confirmed',
      blockNumber: result.receipt.blockNumber,
      gasUsed: result.receipt.gasUsed.toString()
    });

    res.json({
      success: true,
      message: 'Milestone verified successfully',
      transactionHash: result.txHash
    });
  } catch (error) {
    console.error('Verify milestone error:', error);
    res.status(500).json({ 
      error: 'Failed to verify milestone',
      details: error.message 
    });
  }
};

/**
 * Release funds for milestone (Step 5)
 * - After verification, funds are released to taker
 * - Can be called by anyone (usually frontend or backend automation)
 */
exports.releaseFunds = async (req, res) => {
  try {
    const { projectId, milestoneIndex } = req.params;
    const { signerPrivateKey } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Validate milestone index
    const index = parseInt(milestoneIndex);
    if (index < 0 || index >= project.milestones.length) {
      return res.status(400).json({ error: 'Invalid milestone index' });
    }

    const milestone = project.milestones[index];

    if (!milestone.verified) {
      return res.status(400).json({ error: 'Milestone not verified yet' });
    }

    if (milestone.released) {
      return res.status(400).json({ error: 'Funds already released' });
    }

    // Call blockchain service to release funds
    const result = await blockchainService.releaseFunds(
      signerPrivateKey,
      project.blockchainProjectId,
      index
    );

    // Update milestone in MongoDB
    milestone.released = true;
    milestone.releasedAt = new Date();

    await project.save();

    // Check if all milestones are released
    const allReleased = project.milestones.every(m => m.released);
    if (allReleased) {
      project.status = 'completed';
      await project.save();
    }

    // Save transaction
    await blockchainService.saveTransaction({
      projectId: project._id,
      blockchainProjectId: project.blockchainProjectId,
      transactionHash: result.txHash,
      transactionType: 'releaseFunds',
      from: req.user.walletAddress,
      to: project.takerAddress,
      amount: milestone.amount,
      milestoneIndex: index,
      status: 'confirmed',
      blockNumber: result.receipt.blockNumber,
      gasUsed: result.receipt.gasUsed.toString()
    });

    res.json({
      success: true,
      message: 'Funds released successfully',
      transactionHash: result.txHash,
      amount: milestone.amount
    });
  } catch (error) {
    console.error('Release funds error:', error);
    res.status(500).json({ 
      error: 'Failed to release funds',
      details: error.message 
    });
  }
};

/**
 * Get milestone details with proof
 */
exports.getMilestoneDetails = async (req, res) => {
  try {
    const { projectId, milestoneIndex } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const index = parseInt(milestoneIndex);
    if (index < 0 || index >= project.milestones.length) {
      return res.status(400).json({ error: 'Invalid milestone index' });
    }

    const milestone = project.milestones[index];

    // Get proof URL if available
    let proofUrl = null;
    if (milestone.proofCID) {
      const gatewayUrl = process.env.PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud';
      proofUrl = `${gatewayUrl}/ipfs/${milestone.proofCID}`;
    }

    res.json({
      success: true,
      milestone: {
        ...milestone.toObject(),
        proofUrl
      }
    });
  } catch (error) {
    console.error('Get milestone error:', error);
    res.status(500).json({ error: 'Failed to get milestone details' });
  }
};
