const episodeModel = require("../models/episodeModel");
const seasonModel = require("../models/seasonModel");
const { ValidationError, NotFoundError } = require("../utils/errors");

const getAllEpisodes = async () => {
  return await episodeModel.getAllEpisodes();
};

const getEpisodeById = async (id) => {
  const episode = await episodeModel.getEpisodeById(id);
  if (!episode) {
    throw new NotFoundError("Episode not found");
  }
  return episode;
};

const getEpisodesBySeasonId = async (seasonId) => {
  const season = await seasonModel.getSeasonById(seasonId);
  if (!season) {
    throw new NotFoundError("Season not found");
  }
  return await episodeModel.getEpisodesBySeasonId(seasonId);
};

const createEpisode = async (episodeData) => {
  if (!episodeData.name) {
    throw new ValidationError("Episode name is required");
  }
  if (!episodeData.seasonId) {
    throw new ValidationError("Season ID is required");
  }
  
  const season = await seasonModel.getSeasonById(episodeData.seasonId);
  if (!season) {
    throw new NotFoundError("Season not found");
  }
  
  return await episodeModel.createEpisode(episodeData);
};

const updateEpisode = async (id, episodeData) => {
  const episode = await episodeModel.getEpisodeById(id);
  if (!episode) {
    throw new NotFoundError("Episode not found");
  }
  
  if (episodeData.seasonId) {
    const season = await seasonModel.getSeasonById(episodeData.seasonId);
    if (!season) {
      throw new NotFoundError("Season not found");
    }
  }
  
  await episodeModel.updateEpisode(id, episodeData);
  return await episodeModel.getEpisodeById(id);
};

const deleteEpisode = async (id) => {
  const episode = await episodeModel.getEpisodeById(id);
  if (!episode) {
    throw new NotFoundError("Episode not found");
  }
  return await episodeModel.deleteEpisode(id);
};

module.exports = {
  getAllEpisodes,
  getEpisodeById,
  getEpisodesBySeasonId,
  createEpisode,
  updateEpisode,
  deleteEpisode,
};

