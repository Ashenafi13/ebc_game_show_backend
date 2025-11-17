const seasonModel = require("../models/seasonModel");
const { ValidationError, NotFoundError } = require("../utils/errors");

const getAllSeasons = async () => {
  return await seasonModel.getAllSeasons();
};

const getSeasonById = async (id) => {
  const season = await seasonModel.getSeasonById(id);
  if (!season) {
    throw new NotFoundError("Season not found");
  }
  return season;
};

const createSeason = async (seasonData) => {
  if (!seasonData.name) {
    throw new ValidationError("Season name is required");
  }
  await seasonModel.updateStatus();
  return await seasonModel.createSeason(seasonData);
};

const updateSeason = async (id, seasonData) => {
  const season = await seasonModel.getSeasonById(id);
  if (!season) {
    throw new NotFoundError("Season not found");
  }
  if (!seasonData.name) {
    throw new ValidationError("Season name is required");
  }
  if (seasonData.status === 'active') {
    await seasonModel.updateStatus();
  }
  await seasonModel.updateSeason(id, seasonData);
  return await seasonModel.getSeasonById(id);
};

const deleteSeason = async (id) => {
  const season = await seasonModel.getSeasonById(id);
  if (!season) {
    throw new NotFoundError("Season not found");
  }
  return await seasonModel.deleteSeason(id);
};

module.exports = {
  getAllSeasons,
  getSeasonById,
  createSeason,
  updateSeason,
  deleteSeason,
};

