const rewardTypeModel = require("../models/rewardTypeModel");
const { ValidationError, NotFoundError } = require("../utils/errors");

const getAllRewardTypes = async () => {
  return await rewardTypeModel.getAllRewardTypes();
};

const getRewardTypeById = async (id) => {
  const rewardType = await rewardTypeModel.getRewardTypeById(id);
  if (!rewardType) {
    throw new NotFoundError("Reward type not found");
  }
  return rewardType;
};

const createRewardType = async (rewardTypeData) => {
  if (!rewardTypeData.name) {
    throw new ValidationError("Reward type name is required");
  }
  return await rewardTypeModel.createRewardType(rewardTypeData);
};

const updateRewardType = async (id, rewardTypeData) => {
  const rewardType = await rewardTypeModel.getRewardTypeById(id);
  if (!rewardType) {
    throw new NotFoundError("Reward type not found");
  }
  if (!rewardTypeData.name) {
    throw new ValidationError("Reward type name is required");
  }
  await rewardTypeModel.updateRewardType(id, rewardTypeData);
  return await rewardTypeModel.getRewardTypeById(id);
};

const deleteRewardType = async (id) => {
  const rewardType = await rewardTypeModel.getRewardTypeById(id);
  if (!rewardType) {
    throw new NotFoundError("Reward type not found");
  }
  return await rewardTypeModel.deleteRewardType(id);
};

module.exports = {
  getAllRewardTypes,
  getRewardTypeById,
  createRewardType,
  updateRewardType,
  deleteRewardType,
};

