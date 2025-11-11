const episodeQuestionService = require("../services/episodeQuestionService");

const getAllMappings = async (req, res, next) => {
  try {
    const data = await episodeQuestionService.getAllMappings();
    res.success(data, "Episode-Question mappings retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getMappingsByEpisodeId = async (req, res, next) => {
  try {
    const data = await episodeQuestionService.getMappingsByEpisodeId(req.params.episodeId);
    res.success(data, "Episode questions retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getMappingsBySeasonId = async (req, res, next) => {
  try {
    const data = await episodeQuestionService.getMappingsBySeasonId(req.params.seasonId);
    res.success(data, "Season questions retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const createMapping = async (req, res, next) => {
  try {
    const data = await episodeQuestionService.createMapping(req.body);
    res.success(data, "Question assigned to episode successfully");
  } catch (error) {
    next(error);
  }
};

const deleteMapping = async (req, res, next) => {
  try {
    await episodeQuestionService.deleteMapping(req.params.id);
    res.success(null, "Question removed from episode successfully");
  } catch (error) {
    next(error);
  }
};

const assignQuestionsToEpisode = async (req, res, next) => {
  try {
    const data = await episodeQuestionService.assignQuestionsToEpisode(
      req.params.episodeId,
      req.body.questionIds
    );
    res.success(data, "Questions assigned to episode successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMappings,
  getMappingsByEpisodeId,
  getMappingsBySeasonId,
  createMapping,
  deleteMapping,
  assignQuestionsToEpisode,
};

