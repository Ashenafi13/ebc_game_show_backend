const episodeService = require("../services/episodeService");

const getAllEpisodes = async (req, res, next) => {
  try {
    const data = await episodeService.getAllEpisodes();
    res.success(data, "Episodes retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getEpisodeById = async (req, res, next) => {
  try {
    const data = await episodeService.getEpisodeById(req.params.id);
    res.success(data, "Episode retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getEpisodesBySeasonId = async (req, res, next) => {
  try {
    const data = await episodeService.getEpisodesBySeasonId(req.params.seasonId);
    res.success(data, "Episodes retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const createEpisode = async (req, res, next) => {
  try {
    const data = await episodeService.createEpisode(req.body);
    res.success(data, "Episode created successfully");
  } catch (error) {
    next(error);
  }
};

const updateEpisode = async (req, res, next) => {
  try {
    const data = await episodeService.updateEpisode(req.params.id, req.body);
    res.success(data, "Episode updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteEpisode = async (req, res, next) => {
  try {
    await episodeService.deleteEpisode(req.params.id);
    res.success(null, "Episode deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEpisodes,
  getEpisodeById,
  getEpisodesBySeasonId,
  createEpisode,
  updateEpisode,
  deleteEpisode,
};

