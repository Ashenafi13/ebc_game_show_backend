const express = require('express');
const router = express.Router();
const competitorController = require('../controllers/competitorController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', competitorController.getAllCompetitors);
router.get('/:id', competitorController.getCompetitorById);
router.post('/', competitorController.createCompetitor);
router.put('/:id', competitorController.updateCompetitor);
router.delete('/:id', competitorController.deleteCompetitor);

module.exports = router;

