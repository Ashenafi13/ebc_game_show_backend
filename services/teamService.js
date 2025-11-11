const teamModel = require("../models/teamModel");
const teamCompetitorModel = require("../models/teamCompetitorModel");
const competitorModel = require("../models/competitorModel");
const { ValidationError, NotFoundError } = require("../utils/errors");

const getAllTeams = async () => {
  return await teamModel.getAllTeams();
};

const getTeamById = async (id) => {
  const team = await teamModel.getTeamById(id);
  if (!team) {
    throw new NotFoundError("Team not found");
  }
  
  // Get team members
  const members = await teamCompetitorModel.getMappingsByTeamId(id);
  team.members = members;
  
  return team;
};

const createTeam = async (teamData) => {
  if (!teamData.name) {
    throw new ValidationError("Team name is required");
  }
  
  const result = await teamModel.createTeam(teamData);
  
  // Add team members if provided
  if (teamData.competitorIds && Array.isArray(teamData.competitorIds)) {
    for (const competitorId of teamData.competitorIds) {
      // Verify competitor exists
      const competitor = await competitorModel.getCompetitorById(competitorId);
      if (!competitor) {
        throw new NotFoundError(`Competitor with ID ${competitorId} not found`);
      }
      
      await teamCompetitorModel.createMapping({
        teamId: result.id,
        competitorId: competitorId
      });
    }
  }
  
  return await getTeamById(result.id);
};

const updateTeam = async (id, teamData) => {
  const team = await teamModel.getTeamById(id);
  if (!team) {
    throw new NotFoundError("Team not found");
  }
  
  await teamModel.updateTeam(id, teamData);
  
  // Update team members if provided
  if (teamData.competitorIds && Array.isArray(teamData.competitorIds)) {
    // Get current members
    const currentMembers = await teamCompetitorModel.getMappingsByTeamId(id);
    
    // Remove members not in the new list
    for (const member of currentMembers) {
      if (!teamData.competitorIds.includes(member.competitorId)) {
        await teamCompetitorModel.deleteMapping(member.id);
      }
    }
    
    // Add new members
    const currentCompetitorIds = currentMembers.map(m => m.competitorId);
    for (const competitorId of teamData.competitorIds) {
      if (!currentCompetitorIds.includes(competitorId)) {
        // Verify competitor exists
        const competitor = await competitorModel.getCompetitorById(competitorId);
        if (!competitor) {
          throw new NotFoundError(`Competitor with ID ${competitorId} not found`);
        }
        
        await teamCompetitorModel.createMapping({
          teamId: id,
          competitorId: competitorId
        });
      }
    }
  }
  
  return await getTeamById(id);
};

const deleteTeam = async (id) => {
  const team = await teamModel.getTeamById(id);
  if (!team) {
    throw new NotFoundError("Team not found");
  }
  
  // Delete team-competitor mappings first
  const members = await teamCompetitorModel.getMappingsByTeamId(id);
  for (const member of members) {
    await teamCompetitorModel.deleteMapping(member.id);
  }
  
  return await teamModel.deleteTeam(id);
};

const addCompetitorToTeam = async (teamId, competitorId) => {
  const team = await teamModel.getTeamById(teamId);
  if (!team) {
    throw new NotFoundError("Team not found");
  }
  
  const competitor = await competitorModel.getCompetitorById(competitorId);
  if (!competitor) {
    throw new NotFoundError("Competitor not found");
  }
  
  return await teamCompetitorModel.createMapping({ teamId, competitorId });
};

const removeCompetitorFromTeam = async (teamId, competitorId) => {
  const team = await teamModel.getTeamById(teamId);
  if (!team) {
    throw new NotFoundError("Team not found");
  }
  
  return await teamCompetitorModel.deleteMappingByTeamAndCompetitor(teamId, competitorId);
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

