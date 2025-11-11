const express = require('express');
const router = express.Router();
const seasonController = require('../controllers/seasonController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', seasonController.getAllSeasons);
router.get('/:id', seasonController.getSeasonById);
router.post('/', seasonController.createSeason);
router.put('/:id', seasonController.updateSeason);
router.delete('/:id', seasonController.deleteSeason);

module.exports = router;

