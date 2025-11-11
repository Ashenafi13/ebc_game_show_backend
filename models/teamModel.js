const { pool } = require("../config/db");
const sql = require("mssql");

const getAllTeams = async () => {
  const result = await pool
    .request()
    .query("SELECT * FROM tbls_teams ORDER BY createdAt DESC");
  return result.recordset;
};

const getTeamById = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("SELECT * FROM tbls_teams WHERE id = @id");
  return result.recordset[0];
};

const getTeamWithCompetitors = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query(`
      SELECT t.*, 
             c.id as competitorId, 
             c.name as competitorName, 
             c.code as competitorCode
      FROM tbls_teams t
      LEFT JOIN tbls_mapping_team_competitor mtc ON t.id = mtc.teamId
      LEFT JOIN tbls_competitors c ON mtc.competitorId = c.id
      WHERE t.id = @id
    `);
  return result.recordset;
};

const createTeam = async (teamData) => {
  const request = await pool.request();
  request.input("name", sql.NVarChar, teamData.name);
  request.input("createdAt", sql.DateTime, new Date());
  request.input("updatedAt", sql.DateTime, new Date());

  const result = await request.query(`
    INSERT INTO tbls_teams (name, createdAt, updatedAt) 
    OUTPUT INSERTED.id
    VALUES (@name, @createdAt, @updatedAt);
  `);

  return result.recordset[0];
};

const updateTeam = async (id, teamData) => {
  const request = await pool.request();
  request.input("id", sql.BigInt, id);
  request.input("name", sql.NVarChar, teamData.name);
  request.input("updatedAt", sql.DateTime, new Date());

  const result = await request.query(`
    UPDATE tbls_teams 
    SET name = @name, updatedAt = @updatedAt 
    WHERE id = @id;
  `);

  return result;
};

const deleteTeam = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("DELETE FROM tbls_teams WHERE id = @id");
  return result;
};

module.exports = {
  getAllTeams,
  getTeamById,
  getTeamWithCompetitors,
  createTeam,
  updateTeam,
  deleteTeam,
};

