const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { auth, authorize } = require('../middleware/auth');

// Project routes
router.post('/projects', auth, authorize('giver'), projectController.createProject);
router.get('/projects', auth, projectController.getAllProjects);
router.get('/projects/:id', auth, projectController.getProjectById);
router.post('/projects/:id/cancel', auth, authorize('giver'), projectController.cancelProject);

module.exports = router;
