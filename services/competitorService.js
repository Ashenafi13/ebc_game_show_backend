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

const generateContestantCode = async () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `CT-${randomNumber}`;
};




const createCompetitor = async (competitorData) => {
   competitorData.code = await generateContestantCode();
  if (!competitorData.name) {
    throw new ValidationError("Competitor name is required");
  }
  if (!competitorData.code) {
    throw new ValidationError("Something went wrong!");
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

