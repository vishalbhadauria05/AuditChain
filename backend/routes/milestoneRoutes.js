const express = require('express');
const router = express.Router();
const milestoneController = require('../controllers/milestoneController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Milestone routes
router.post(
  '/projects/:projectId/milestones/:milestoneIndex/proof',
  auth,
  authorize('taker'),
  upload.single('file'),
  milestoneController.uploadProof
);

router.post(
  '/projects/:projectId/milestones/:milestoneIndex/verify',
  auth,
  authorize('auditor'),
  milestoneController.verifyMilestone
);

router.post(
  '/projects/:projectId/milestones/:milestoneIndex/release',
  auth,
  milestoneController.releaseFunds
);

router.get(
  '/projects/:projectId/milestones/:milestoneIndex',
  auth,
  milestoneController.getMilestoneDetails
);

module.exports = router;
