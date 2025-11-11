const seasonService = require("../services/seasonService");

const getAllSeasons = async (req, res, next) => {
  try {
    const data = await seasonService.getAllSeasons();
    res.success(data, "Seasons retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getSeasonById = async (req, res, next) => {
  try {
    const data = await seasonService.getSeasonById(req.params.id);
    res.success(data, "Season retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const createSeason = async (req, res, next) => {
  try {
    const data = await seasonService.createSeason(req.body);
    res.success(data, "Season created successfully");
  } catch (error) {
    next(error);
  }
};

const updateSeason = async (req, res, next) => {
  try {
    const data = await seasonService.updateSeason(req.params.id, req.body);
    res.success(data, "Season updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteSeason = async (req, res, next) => {
  try {
    await seasonService.deleteSeason(req.params.id);
    res.success(null, "Season deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSeasons,
  getSeasonById,
  createSeason,
  updateSeason,
  deleteSeason,
};

