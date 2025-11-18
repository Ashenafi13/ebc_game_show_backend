const competitionService = require("../services/competitionService");

const getAllCompetitions = async (req, res, next) => {
  try {
    const data = await competitionService.getAllCompetitions();
    res.success(data, "Competitions retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getCompetitionById = async (req, res, next) => {
  try {
    const data = await competitionService.getCompetitionById(req.params.id);
    res.success(data, "Competition retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getCompetitionsByEpisodeId = async (req, res, next) => {
  try {
    const data = await competitionService.getCompetitionsByEpisodeId(req.params.episodeId);
    res.success(data, "Episode competitions retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getCompetitionsBySeasonId = async (req, res, next) => {
  try {
    const data = await competitionService.getCompetitionsBySeasonId(req.params.seasonId);
    res.success(data, "Season competitions retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const createCompetition = async (req, res, next) => {
  try {
    const data = await competitionService.createCompetition(req.body);
    res.success(data, "Competition created successfully");
  } catch (error) {
    next(error);
  }
};

const updateCompetition = async (req, res, next) => {
  try {
    const data = await competitionService.updateCompetition(req.params.id, req.body);
    res.success(data, "Competition updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteCompetition = async (req, res, next) => {
  try {
    await competitionService.deleteCompetition(req.params.id);
    res.success(null, "Competition deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCompetitions,
  getCompetitionById,
  getCompetitionsByEpisodeId,
  getCompetitionsBySeasonId,
  createCompetition,
  updateCompetition,
  deleteCompetition,
};

