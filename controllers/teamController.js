const teamService = require("../services/teamService");

const getAllTeams = async (req, res, next) => {
  try {
    const data = await teamService.getAllTeams();
    res.success(data, "Teams retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getTeamById = async (req, res, next) => {
  try {
    const data = await teamService.getTeamById(req.params.id);
    res.success(data, "Team retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const createTeam = async (req, res, next) => {
  try {
    const data = await teamService.createTeam(req.body);
    res.success(data, "Team created successfully");
  } catch (error) {
    next(error);
  }
};

const updateTeam = async (req, res, next) => {
  try {
    const data = await teamService.updateTeam(req.params.id, req.body);
    res.success(data, "Team updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteTeam = async (req, res, next) => {
  try {
    await teamService.deleteTeam(req.params.id);
    res.success(null, "Team deleted successfully");
  } catch (error) {
    next(error);
  }
};

const addCompetitorToTeam = async (req, res, next) => {
  try {
    const data = await teamService.addCompetitorToTeam(req.params.teamId, req.body.competitorId);
    res.success(data, "Competitor added to team successfully");
  } catch (error) {
    next(error);
  }
};

const removeCompetitorFromTeam = async (req, res, next) => {
  try {
    await teamService.removeCompetitorFromTeam(req.params.teamId, req.params.competitorId);
    res.success(null, "Competitor removed from team successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addCompetitorToTeam,
  removeCompetitorFromTeam,
};

