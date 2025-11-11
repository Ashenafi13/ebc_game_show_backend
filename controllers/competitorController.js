const competitorService = require("../services/competitorService");

const getAllCompetitors = async (req, res, next) => {
  try {
    const data = await competitorService.getAllCompetitors();
    res.success(data, "Competitors retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getCompetitorById = async (req, res, next) => {
  try {
    const data = await competitorService.getCompetitorById(req.params.id);
    res.success(data, "Competitor retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const createCompetitor = async (req, res, next) => {
  try {
    const data = await competitorService.createCompetitor(req.body);
    res.success(data, "Competitor created successfully");
  } catch (error) {
    next(error);
  }
};

const updateCompetitor = async (req, res, next) => {
  try {
    const data = await competitorService.updateCompetitor(req.params.id, req.body);
    res.success(data, "Competitor updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteCompetitor = async (req, res, next) => {
  try {
    await competitorService.deleteCompetitor(req.params.id);
    res.success(null, "Competitor deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCompetitors,
  getCompetitorById,
  createCompetitor,
  updateCompetitor,
  deleteCompetitor,
};

