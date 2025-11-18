const questionModel = require("../models/questionModel");
const chooseModel = require("../models/chooseModel");
const categoryModel = require("../models/questionCategoryModel");
const rewardTypeModel = require("../models/rewardTypeModel");
const { ValidationError, NotFoundError } = require("../utils/errors");

const getAllQuestions = async (page = 1, limit = 10) => {
  const result = await questionModel.getAllQuestions(page, limit);

  // Get choices for each question
  for (const question of result.data) {
    const choices = await chooseModel.getChoosesByQuestionId(question.id);
    question.choices = choices;
  }

  return result;
};

const getQuestionById = async (id) => {
  const question = await questionModel.getQuestionById(id);
  if (!question) {
    throw new NotFoundError("Question not found");
  }
  
  // Get choices for this question
  const choices = await chooseModel.getChoosesByQuestionId(id);
  question.choices = choices;
  
  return question;
};

const getQuestionsByCategory = async (categoryId, page = 1, limit = 10) => {
  const category = await categoryModel.getCategoryById(categoryId);
  if (!category) {
    throw new NotFoundError("Category not found");
  }

  const result = await questionModel.getQuestionsByCategory(categoryId, page, limit);

  // Get choices for each question
  for (const question of result.data) {
    const choices = await chooseModel.getChoosesByQuestionId(question.id);
    question.choices = choices;
  }

  return result;
};

const createQuestion = async (questionData) => {
  if (!questionData.question) {
    throw new ValidationError("Question text is required");
  }
  if (!questionData.categoryId) {
    throw new ValidationError("Category ID is required");
  }
  if (!questionData.type) {
    throw new ValidationError("Question type is required");
  }
  
  // Validate category exists
  const category = await categoryModel.getCategoryById(questionData.categoryId);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  
  // Validate reward type if provided
  if (questionData.rewardType) {
    const rewardType = await rewardTypeModel.getRewardTypeById(questionData.rewardType);
    if (!rewardType) {
      throw new NotFoundError("Reward type not found");
    }
  }
  
  const result = await questionModel.createQuestion(questionData);
  
  // Create choices if provided
  if (questionData.choices && Array.isArray(questionData.choices)) {
    for (const choice of questionData.choices) {
      await chooseModel.createChoose({
        choose: choice.choose,
        questionId: result.id,
        isAnswer: choice.isAnswer || 0
      });
    }
  }
  
  return await getQuestionById(result.id);
};

const updateQuestion = async (id, questionData) => {
  const question = await questionModel.getQuestionById(id);
  if (!question) {
    throw new NotFoundError("Question not found");
  }
  
  // Validate category if provided
  if (questionData.categoryId) {
    const category = await categoryModel.getCategoryById(questionData.categoryId);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
  }
  
  // Validate reward type if provided
  if (questionData.rewardType) {
    const rewardType = await rewardTypeModel.getRewardTypeById(questionData.rewardType);
    if (!rewardType) {
      throw new NotFoundError("Reward type not found");
    }
  }
  
  await questionModel.updateQuestion(id, questionData);
  
  // Update choices if provided
  if (questionData.choices && Array.isArray(questionData.choices)) {
    // Delete existing choices
    await chooseModel.deleteChoosesByQuestionId(id);
    
    // Create new choices
    for (const choice of questionData.choices) {
      await chooseModel.createChoose({
        choose: choice.choose,
        questionId: id,
        isAnswer: choice.isAnswer || 0
      });
    }
  }
  
  return await getQuestionById(id);
};

const deleteQuestion = async (id) => {
  const question = await questionModel.getQuestionById(id);
  if (!question) {
    throw new NotFoundError("Question not found");
  }
  
  // Delete associated choices first
  await chooseModel.deleteChoosesByQuestionId(id);
  
  return await questionModel.deleteQuestion(id);
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  getQuestionsByCategory,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};

