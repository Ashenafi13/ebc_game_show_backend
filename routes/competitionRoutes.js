const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', competitionController.getAllCompetitions);
router.get('/:id', competitionController.getCompetitionById);
router.get('/episode/:episodeId', competitionController.getCompetitionsByEpisodeId);
router.get('/season/:seasonId', competitionController.getCompetitionsBySeasonId);
router.post('/', competitionController.createCompetition);
router.put('/:id', competitionController.updateCompetition);
router.delete('/:id', competitionController.deleteCompetition);

module.exports = router;

