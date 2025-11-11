const competitorModel = require("../models/competitorModel");
const { ValidationError, NotFoundError, ConflictError } = require("../utils/errors");

const getAllCompetitors = async () => {
  return await competitorModel.getAllCompetitors();
};

const getCompetitorById = async (id) => {
  const competitor = await competitorModel.getCompetitorById(id);
  if (!competitor) {
    throw new NotFoundError("Competitor not found");
  }
  return competitor;
};

const createCompetitor = async (competitorData) => {
  if (!competitorData.name) {
    throw new ValidationError("Competitor name is required");
  }
  if (!competitorData.code) {
    throw new ValidationError("Competitor code is required");
  }
  
  // Check if code already exists
  const existingCompetitor = await competitorModel.getCompetitorByCode(competitorData.code);
  if (existingCompetitor) {
    throw new ConflictError("Competitor with this code already exists");
  }
  
  return await competitorModel.createCompetitor(competitorData);
};

const updateCompetitor = async (id, competitorData) => {
  const competitor = await competitorModel.getCompetitorById(id);
  if (!competitor) {
    throw new NotFoundError("Competitor not found");
  }
  
  // Check if code is being changed and if new code already exists
  if (competitorData.code && competitorData.code !== competitor.code) {
    const existingCompetitor = await competitorModel.getCompetitorByCode(competitorData.code);
    if (existingCompetitor) {
      throw new ConflictError("Competitor with this code already exists");
    }
  }
  
  await competitorModel.updateCompetitor(id, competitorData);
  return await competitorModel.getCompetitorById(id);
};

const deleteCompetitor = async (id) => {
  const competitor = await competitorModel.getCompetitorById(id);
  if (!competitor) {
    throw new NotFoundError("Competitor not found");
  }
  return await competitorModel.deleteCompetitor(id);
};

module.exports = {
  getAllCompetitors,
  getCompetitorById,
  createCompetitor,
  updateCompetitor,
  deleteCompetitor,
};

