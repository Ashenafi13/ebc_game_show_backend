const express = require('express');
const router = express.Router();
const episodeQuestionController = require('../controllers/episodeQuestionController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', episodeQuestionController.getAllMappings);
router.get('/episode/:episodeId', episodeQuestionController.getMappingsByEpisodeId);
router.get('/season/:seasonId', episodeQuestionController.getMappingsBySeasonId);
router.post('/', episodeQuestionController.createMapping);
router.post('/episode/:episodeId/assign', episodeQuestionController.assignQuestionsToEpisode);
router.delete('/:id', episodeQuestionController.deleteMapping);

module.exports = router;

