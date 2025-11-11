const { pool } = require("../config/db");
const sql = require("mssql");

const getAllEpisodes = async () => {
  const result = await pool
    .request()
    .query(`
      SELECT e.*, s.name as seasonName 
      FROM tbls_episodes e
      LEFT JOIN tbls_seasons s ON e.seasonId = s.id
      ORDER BY e.createdAt DESC
    `);
  return result.recordset;
};

const getEpisodeById = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query(`
      SELECT e.*, s.name as seasonName 
      FROM tbls_episodes e
      LEFT JOIN tbls_seasons s ON e.seasonId = s.id
      WHERE e.id = @id
    `);
  return result.recordset[0];
};

const getEpisodesBySeasonId = async (seasonId) => {
  const result = await pool
    .request()
    .input("seasonId", sql.BigInt, seasonId)
    .query(`
      SELECT * FROM tbls_episodes 
      WHERE seasonId = @seasonId
      ORDER BY createdAt DESC
    `);
  return result.recordset;
};

const createEpisode = async (episodeData) => {
  const request = await pool.request();
  request.input("name", sql.NVarChar, episodeData.name);
  request.input("seasonId", sql.BigInt, episodeData.seasonId);
  request.input("status", sql.NVarChar(50), episodeData.status || 'inactive');
  request.input("createdAt", sql.DateTime, new Date());
  request.input("updatedtime", sql.DateTime, new Date());

  const result = await request.query(`
    INSERT INTO tbls_episodes (name, seasonId, status, createdAt, updatedtime) 
    OUTPUT INSERTED.id
    VALUES (@name, @seasonId, @status, @createdAt, @updatedtime);
  `);

  return result.recordset[0];
};

const updateEpisode = async (id, episodeData) => {
  const request = await pool.request();
  request.input("id", sql.BigInt, id);
  request.input("name", sql.NVarChar, episodeData.name);
  request.input("seasonId", sql.BigInt, episodeData.seasonId);
  request.input("status", sql.NVarChar(50), episodeData.status);
  request.input("updatedtime", sql.DateTime, new Date());

  const result = await request.query(`
    UPDATE tbls_episodes 
    SET name = @name, seasonId = @seasonId, status = @status, updatedtime = @updatedtime 
    WHERE id = @id;
  `);

  return result;
};

const deleteEpisode = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("DELETE FROM tbls_episodes WHERE id = @id");
  return result;
};

module.exports = {
  getAllEpisodes,
  getEpisodeById,
  getEpisodesBySeasonId,
  createEpisode,
  updateEpisode,
  deleteEpisode,
};

