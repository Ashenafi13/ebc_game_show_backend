const rewardTypeService = require("../services/rewardTypeService");

const getAllRewardTypes = async (req, res, next) => {
  try {
    const data = await rewardTypeService.getAllRewardTypes();
    res.success(data, "Reward types retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getRewardTypeById = async (req, res, next) => {
  try {
    const data = await rewardTypeService.getRewardTypeById(req.params.id);
    res.success(data, "Reward type retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const createRewardType = async (req, res, next) => {
  try {
    const data = await rewardTypeService.createRewardType(req.body);
    res.success(data, "Reward type created successfully");
  } catch (error) {
    next(error);
  }
};

const updateRewardType = async (req, res, next) => {
  try {
    const data = await rewardTypeService.updateRewardType(req.params.id, req.body);
    res.success(data, "Reward type updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteRewardType = async (req, res, next) => {
  try {
    await rewardTypeService.deleteRewardType(req.params.id);
    res.success(null, "Reward type deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRewardTypes,
  getRewardTypeById,
  createRewardType,
  updateRewardType,
  deleteRewardType,
};

