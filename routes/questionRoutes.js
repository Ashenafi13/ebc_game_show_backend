const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadQuestionFile, parseQuestionData } = require('../middlewares/uploadMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.get('/category/:categoryId', questionController.getQuestionsByCategory);

// Create and update routes support file upload
router.post('/', uploadQuestionFile, parseQuestionData, questionController.createQuestion);
router.put('/:id', uploadQuestionFile, parseQuestionData, questionController.updateQuestion);

router.delete('/:id', questionController.deleteQuestion);

module.exports = router;

