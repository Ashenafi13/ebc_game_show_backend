const episodeQuestionModel = require("../models/episodeQuestionModel");
const episodeModel = require("../models/episodeModel");
const questionModel = require("../models/questionModel");
const seasonModel = require("../models/seasonModel");
const { ValidationError, NotFoundError } = require("../utils/errors");

const getAllMappings = async () => {
  return await episodeQuestionModel.getAllMappings();
};

const getMappingsByEpisodeId = async (episodeId) => {
  const episode = await episodeModel.getEpisodeById(episodeId);
  if (!episode) {
    throw new NotFoundError("Episode not found");
  }
  return await episodeQuestionModel.getMappingsByEpisodeId(episodeId);
};

const getMappingsBySeasonId = async (seasonId) => {
  const season = await seasonModel.getSeasonById(seasonId);
  if (!season) {
    throw new NotFoundError("Season not found");
  }
  return await episodeQuestionModel.getMappingsBySeasonId(seasonId);
};

const createMapping = async (mappingData) => {
  if (!mappingData.questionId) {
    throw new ValidationError("Question ID is required");
  }
  if (!mappingData.episodeId) {
    throw new ValidationError("Episode ID is required");
  }
  if (!mappingData.seasonId) {
    throw new ValidationError("Season ID is required");
  }
  
  // Validate question exists
  const question = await questionModel.getQuestionById(mappingData.questionId);
  if (!question) {
    throw new NotFoundError("Question not found");
  }
  
  // Validate episode exists
  const episode = await episodeModel.getEpisodeById(mappingData.episodeId);
  if (!episode) {
    throw new NotFoundError("Episode not found");
  }
  
  // Validate season exists
  const season = await seasonModel.getSeasonById(mappingData.seasonId);
  if (!season) {
    throw new NotFoundError("Season not found");
  }
  
  // Validate episode belongs to season
  if (episode.seasonId !== mappingData.seasonId) {
    throw new ValidationError("Episode does not belong to the specified season");
  }
  
  return await episodeQuestionModel.createMapping(mappingData);
};

const deleteMapping = async (id) => {
  return await episodeQuestionModel.deleteMapping(id);
};

const assignQuestionsToEpisode = async (episodeId, questionIds) => {
  const episode = await episodeModel.getEpisodeById(episodeId);
  if (!episode) {
    throw new NotFoundError("Episode not found");
  }
  
  // Delete existing mappings for this episode
  await episodeQuestionModel.deleteMappingsByEpisodeId(episodeId);
  
  // Create new mappings
  const results = [];
  for (const questionId of questionIds) {
    const question = await questionModel.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundError(`Question with ID ${questionId} not found`);
    }
    
    const result = await episodeQuestionModel.createMapping({
      questionId: questionId,
      episodeId: episodeId,
      seasonId: episode.seasonId
    });
    results.push(result);
  }
  
  return results;
};

module.exports = {
  getAllMappings,
  getMappingsByEpisodeId,
  getMappingsBySeasonId,
  createMapping,
  deleteMapping,
  assignQuestionsToEpisode,
};

