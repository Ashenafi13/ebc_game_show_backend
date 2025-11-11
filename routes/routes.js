const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Import route modules
const seasonRoutes = require('./seasonRoutes');
const episodeRoutes = require('./episodeRoutes');
const questionRoutes = require('./questionRoutes');
const categoryRoutes = require('./categoryRoutes');
const rewardTypeRoutes = require('./rewardTypeRoutes');
const competitorRoutes = require('./competitorRoutes');
const teamRoutes = require('./teamRoutes');
const episodeQuestionRoutes = require('./episodeQuestionRoutes');

// Auth routes (public)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Control Panel API routes (protected)
router.use('/seasons', seasonRoutes);
router.use('/episodes', episodeRoutes);
router.use('/questions', questionRoutes);
router.use('/categories', categoryRoutes);
router.use('/reward-types', rewardTypeRoutes);
router.use('/competitors', competitorRoutes);
router.use('/teams', teamRoutes);
router.use('/episode-questions', episodeQuestionRoutes);

module.exports = router;