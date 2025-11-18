const competitionModel = require("../models/competitionModel");
const episodeModel = require("../models/episodeModel");
const seasonModel = require("../models/seasonModel");
const teamModel = require("../models/teamModel");
const teamCompetitorModel = require("../models/teamCompetitorModel");
const { ValidationError, NotFoundError } = require("../utils/errors");

// Helper function to populate team details with members
const populateTeamDetails = async (teamIds) => {
  const teams = [];

  for (const teamId of teamIds) {
    const team = await teamModel.getTeamById(teamId);
    if (team) {
      // Get team members
      const members = await teamCompetitorModel.getMappingsByTeamId(teamId);
      team.members = members.map(m => ({
        id: m.competitorId,
        name: m.competitorName,
        code: m.competitorCode
      }));
      teams.push(team);
    }
  }

  return teams;
};

const getAllCompetitions = async () => {
  const competitions = await competitionModel.getAllCompetitions();

  // Populate team details for each competition
  for (const competition of competitions) {
    if (competition.teams) {
      const teamIds = JSON.parse(competition.teams);
      competition.teams = await populateTeamDetails(teamIds);
    }
  }

  return competitions;
};

const getCompetitionById = async (id) => {
  const competition = await competitionModel.getCompetitionById(id);
  if (!competition) {
    throw new NotFoundError("Competition not found");
  }

  // Parse teams JSON string and populate with details
  if (competition.teams) {
    const teamIds = JSON.parse(competition.teams);
    competition.teams = await populateTeamDetails(teamIds);
  }

  return competition;
};

const getCompetitionsByEpisodeId = async (episodeId) => {
  const episode = await episodeModel.getEpisodeById(episodeId);
  if (!episode) {
    throw new NotFoundError("Episode not found");
  }

  const competitions = await competitionModel.getCompetitionsByEpisodeId(episodeId);

  // Parse teams JSON and populate with details for each competition
  for (const competition of competitions) {
    if (competition.teams) {
      const teamIds = JSON.parse(competition.teams);
      competition.teams = await populateTeamDetails(teamIds);
    }
  }

  return competitions;
};

const getCompetitionsBySeasonId = async (seasonId) => {
  const season = await seasonModel.getSeasonById(seasonId);
  if (!season) {
    throw new NotFoundError("Season not found");
  }

  const competitions = await competitionModel.getCompetitionsBySeasonId(seasonId);

  // Parse teams JSON and populate with details for each competition
  for (const competition of competitions) {
    if (competition.teams) {
      const teamIds = JSON.parse(competition.teams);
      competition.teams = await populateTeamDetails(teamIds);
    }
  }

  return competitions;
};

const createCompetition = async (competitionData) => {
  // Validate required fields
  if (!competitionData.episodeId) {
    throw new ValidationError("Episode ID is required");
  }
  if (!competitionData.seasonId) {
    throw new ValidationError("Season ID is required");
  }
  if (!competitionData.teams || !Array.isArray(competitionData.teams)) {
    throw new ValidationError("Teams must be an array");
  }
  if (competitionData.teams.length === 0) {
    throw new ValidationError("At least one team is required");
  }
  
  // Validate episode exists
  const episode = await episodeModel.getEpisodeById(competitionData.episodeId);
  if (!episode) {
    throw new NotFoundError("Episode not found");
  }
  
  // Validate season exists
  const season = await seasonModel.getSeasonById(competitionData.seasonId);
  if (!season) {
    throw new NotFoundError("Season not found");
  }
  
  // Validate all teams exist
  for (const teamId of competitionData.teams) {
    const team = await teamModel.getTeamById(teamId);
    if (!team) {
      throw new NotFoundError(`Team with ID ${teamId} not found`);
    }
  }
  
  return await competitionModel.createCompetition(competitionData);
};

const updateCompetition = async (id, competitionData) => {
  const competition = await competitionModel.getCompetitionById(id);
  if (!competition) {
    throw new NotFoundError("Competition not found");
  }
  
  // Validate teams if provided
  if (competitionData.teams) {
    if (!Array.isArray(competitionData.teams)) {
      throw new ValidationError("Teams must be an array");
    }
    if (competitionData.teams.length === 0) {
      throw new ValidationError("At least one team is required");
    }
    
    // Validate all teams exist
    for (const teamId of competitionData.teams) {
      const team = await teamModel.getTeamById(teamId);
      if (!team) {
        throw new NotFoundError(`Team with ID ${teamId} not found`);
      }
    }
  }
  
  // Validate episode if provided
  if (competitionData.episodeId) {
    const episode = await episodeModel.getEpisodeById(competitionData.episodeId);
    if (!episode) {
      throw new NotFoundError("Episode not found");
    }
  }
  
  // Validate season if provided
  if (competitionData.seasonId) {
    const season = await seasonModel.getSeasonById(competitionData.seasonId);
    if (!season) {
      throw new NotFoundError("Season not found");
    }
  }
  
  await competitionModel.updateCompetition(id, competitionData);
  return await getCompetitionById(id);
};

const deleteCompetition = async (id) => {
  const competition = await competitionModel.getCompetitionById(id);
  if (!competition) {
    throw new NotFoundError("Competition not found");
  }
  return await competitionModel.deleteCompetition(id);
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

