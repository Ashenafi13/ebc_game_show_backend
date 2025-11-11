const express = require('express');
const router = express.Router();
const rewardTypeController = require('../controllers/rewardTypeController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', rewardTypeController.getAllRewardTypes);
router.get('/:id', rewardTypeController.getRewardTypeById);
router.post('/', rewardTypeController.createRewardType);
router.put('/:id', rewardTypeController.updateRewardType);
router.delete('/:id', rewardTypeController.deleteRewardType);

module.exports = router;

