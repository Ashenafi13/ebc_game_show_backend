const categoryService = require("../services/categoryService");

const getAllCategories = async (req, res, next) => {
  try {
    const data = await categoryService.getAllCategories();
    res.success(data, "Categories retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const data = await categoryService.getCategoryById(req.params.id);
    res.success(data, "Category retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const data = await categoryService.createCategory(req.body);
    res.success(data, "Category created successfully");
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const data = await categoryService.updateCategory(req.params.id, req.body);
    res.success(data, "Category updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.success(null, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

