const { pool } = require("../config/db");
const sql = require("mssql");

const getAllCompetitions = async () => {
  const result = await pool
    .request()
    .query(`
      SELECT c.*, 
             e.name as episodeName,
             s.name as seasonName
      FROM tbls_competitions c
      LEFT JOIN tbls_episodes e ON c.episodeId = e.id
      LEFT JOIN tbls_seasons s ON c.seasonId = s.id
      ORDER BY c.createdAt DESC
    `);
  return result.recordset;
};

const getCompetitionById = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query(`
      SELECT c.*, 
             e.name as episodeName,
             s.name as seasonName
      FROM tbls_competitions c
      LEFT JOIN tbls_episodes e ON c.episodeId = e.id
      LEFT JOIN tbls_seasons s ON c.seasonId = s.id
      WHERE c.id = @id
    `);
  return result.recordset[0];
};

const getCompetitionsByEpisodeId = async (episodeId) => {
  const result = await pool
    .request()
    .input("episodeId", sql.BigInt, episodeId)
    .query(`
      SELECT c.*, 
             s.name as seasonName
      FROM tbls_competitions c
      LEFT JOIN tbls_seasons s ON c.seasonId = s.id
      WHERE c.episodeId = @episodeId
      ORDER BY c.createdAt DESC
    `);
  return result.recordset;
};

const getCompetitionsBySeasonId = async (seasonId) => {
  const result = await pool
    .request()
    .input("seasonId", sql.BigInt, seasonId)
    .query(`
      SELECT c.*, 
             e.name as episodeName
      FROM tbls_competitions c
      LEFT JOIN tbls_episodes e ON c.episodeId = e.id
      WHERE c.seasonId = @seasonId
      ORDER BY c.createdAt DESC
    `);
  return result.recordset;
};

const createCompetition = async (competitionData) => {
  // Check if competition already exists with same seasonId and episodeId
  const checkRequest = pool.request();
  checkRequest.input("episodeId", sql.BigInt, competitionData.episodeId);
  checkRequest.input("seasonId", sql.BigInt, competitionData.seasonId);

  const existingCompetition = await checkRequest.query(`
    SELECT id FROM tbls_competitions
    WHERE episodeId = @episodeId AND seasonId = @seasonId
  `);

  if (existingCompetition.recordset.length > 0) {
    throw new Error('Competition with this seasonId and episodeId already exists');
  }

  const request = pool.request();
  request.input("episodeId", sql.BigInt, competitionData.episodeId);
  request.input("seasonId", sql.BigInt, competitionData.seasonId);
  request.input("teams", sql.NVarChar(sql.MAX), JSON.stringify(competitionData.teams));
  request.input("createdAt", sql.DateTime, new Date());
  request.input("updatedAt", sql.DateTime, new Date());

  const result = await request.query(`
    INSERT INTO tbls_competitions (episodeId, seasonId, teams, createdAt, updatedAt)
    OUTPUT INSERTED.id
    VALUES (@episodeId, @seasonId, @teams, @createdAt, @updatedAt);
  `);

  return result.recordset[0];
};

const updateCompetition = async (id, competitionData) => {
  // Check if another competition exists with same seasonId and episodeId (excluding current record)
  const checkRequest = pool.request();
  checkRequest.input("id", sql.BigInt, id);
  checkRequest.input("episodeId", sql.BigInt, competitionData.episodeId);
  checkRequest.input("seasonId", sql.BigInt, competitionData.seasonId);

  const existingCompetition = await checkRequest.query(`
    SELECT id FROM tbls_competitions
    WHERE episodeId = @episodeId AND seasonId = @seasonId AND id != @id
  `);

  if (existingCompetition.recordset.length > 0) {
    throw new Error('Another competition with this seasonId and episodeId already exists');
  }

  const request = pool.request();
  request.input("id", sql.BigInt, id);
  request.input("episodeId", sql.BigInt, competitionData.episodeId);
  request.input("seasonId", sql.BigInt, competitionData.seasonId);
  request.input("teams", sql.NVarChar(sql.MAX), JSON.stringify(competitionData.teams));
  request.input("updatedAt", sql.DateTime, new Date());

  const result = await request.query(`
    UPDATE tbls_competitions
    SET episodeId = @episodeId, seasonId = @seasonId, teams = @teams, updatedAt = @updatedAt
    WHERE id = @id;
  `);

  return result;
};

const deleteCompetition = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("DELETE FROM tbls_competitions WHERE id = @id");
  return result;
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

