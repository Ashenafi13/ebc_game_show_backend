const { pool } = require("../config/db");
const sql = require("mssql");

const getAllMappings = async () => {
  const result = await pool
    .request()
    .query(`
      SELECT mtc.*, 
             t.name as teamName,
             c.name as competitorName,
             c.code as competitorCode
      FROM tbls_mapping_team_competitor mtc
      LEFT JOIN tbls_teams t ON mtc.teamId = t.id
      LEFT JOIN tbls_competitors c ON mtc.competitorId = c.id
      ORDER BY mtc.createdAt DESC
    `);
  return result.recordset;
};

const getMappingsByTeamId = async (teamId) => {
  const result = await pool
    .request()
    .input("teamId", sql.BigInt, teamId)
    .query(`
      SELECT mtc.*, 
             c.name as competitorName,
             c.code as competitorCode
      FROM tbls_mapping_team_competitor mtc
      LEFT JOIN tbls_competitors c ON mtc.competitorId = c.id
      WHERE mtc.teamId = @teamId
    `);
  return result.recordset;
};

const getMappingsByCompetitorId = async (competitorId) => {
  const result = await pool
    .request()
    .input("competitorId", sql.BigInt, competitorId)
    .query(`
      SELECT mtc.*, 
             t.name as teamName
      FROM tbls_mapping_team_competitor mtc
      LEFT JOIN tbls_teams t ON mtc.teamId = t.id
      WHERE mtc.competitorId = @competitorId
    `);
  return result.recordset;
};

const createMapping = async (mappingData) => {
  const request = await pool.request();
  request.input("teamId", sql.BigInt, mappingData.teamId);
  request.input("competitorId", sql.BigInt, mappingData.competitorId);
  request.input("createdAt", sql.DateTime, new Date());
  request.input("updatetime", sql.DateTime, new Date());

  const result = await request.query(`
    INSERT INTO tbls_mapping_team_competitor (teamId, competitorId, createdAt, updatetime) 
    OUTPUT INSERTED.id
    VALUES (@teamId, @competitorId, @createdAt, @updatetime);
  `);

  return result.recordset[0];
};

const deleteMapping = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("DELETE FROM tbls_mapping_team_competitor WHERE id = @id");
  return result;
};

const deleteMappingByTeamAndCompetitor = async (teamId, competitorId) => {
  const result = await pool
    .request()
    .input("teamId", sql.BigInt, teamId)
    .input("competitorId", sql.BigInt, competitorId)
    .query("DELETE FROM tbls_mapping_team_competitor WHERE teamId = @teamId AND competitorId = @competitorId");
  return result;
};

module.exports = {
  getAllMappings,
  getMappingsByTeamId,
  getMappingsByCompetitorId,
  createMapping,
  deleteMapping,
  deleteMappingByTeamAndCompetitor,
};

