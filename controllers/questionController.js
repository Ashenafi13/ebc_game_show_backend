const questionService = require("../services/questionService");

const getAllQuestions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await questionService.getAllQuestions(page, limit);
    res.success(data, "Questions retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getQuestionById = async (req, res, next) => {
  try {
    const data = await questionService.getQuestionById(req.params.id);
    res.success(data, "Question retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getQuestionsByCategory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await questionService.getQuestionsByCategory(req.params.categoryId, page, limit);
    res.success(data, "Questions retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const createQuestion = async (req, res, next) => {
  try {
    const data = await questionService.createQuestion(req.body);
    res.success(data, "Question created successfully");
  } catch (error) {
    next(error);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const data = await questionService.updateQuestion(req.params.id, req.body);
    res.success(data, "Question updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    await questionService.deleteQuestion(req.params.id);
    res.success(null, "Question deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  getQuestionsByCategory,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};

