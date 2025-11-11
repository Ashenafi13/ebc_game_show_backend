const express = require('express');
const router = express.Router();
const episodeController = require('../controllers/episodeController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', episodeController.getAllEpisodes);
router.get('/:id', episodeController.getEpisodeById);
router.get('/season/:seasonId', episodeController.getEpisodesBySeasonId);
router.post('/', episodeController.createEpisode);
router.put('/:id', episodeController.updateEpisode);
router.delete('/:id', episodeController.deleteEpisode);

module.exports = router;

