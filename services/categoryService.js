const categoryModel = require("../models/questionCategoryModel");
const { ValidationError, NotFoundError } = require("../utils/errors");

const getAllCategories = async () => {
  return await categoryModel.getAllCategories();
};

const getCategoryById = async (id) => {
  const category = await categoryModel.getCategoryById(id);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  return category;
};

const createCategory = async (categoryData) => {
  if (!categoryData.name) {
    throw new ValidationError("Category name is required");
  }
  return await categoryModel.createCategory(categoryData);
};

const updateCategory = async (id, categoryData) => {
  const category = await categoryModel.getCategoryById(id);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  if (!categoryData.name) {
    throw new ValidationError("Category name is required");
  }
  await categoryModel.updateCategory(id, categoryData);
  return await categoryModel.getCategoryById(id);
};

const deleteCategory = async (id) => {
  const category = await categoryModel.getCategoryById(id);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  return await categoryModel.deleteCategory(id);
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

