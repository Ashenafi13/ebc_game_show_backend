const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.post('/', teamController.createTeam);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

// Team-Competitor management
router.post('/:teamId/competitors', teamController.addCompetitorToTeam);
router.delete('/:teamId/competitors/:competitorId', teamController.removeCompetitorFromTeam);

module.exports = router;

