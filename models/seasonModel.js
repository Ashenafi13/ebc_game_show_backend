const { pool } = require("../config/db");
const sql = require("mssql");

const getAllSeasons = async () => {
  const result = await pool
    .request()
    .query("SELECT * FROM tbls_seasons ORDER BY createdAt DESC");
  return result.recordset;
};

const updateStatus = async () => {
  const request = await pool.request();
  request.input("status", sql.NVarChar(50), 'inactive');
  const result = await request.query(`
    UPDATE tbls_seasons 
    SET status = @status 
    WHERE status = 'active';
  `);

  return result;
};


const getSeasonById = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("SELECT * FROM tbls_seasons WHERE id = @id");
  return result.recordset[0];
};

const createSeason = async (seasonData) => {
  const request = await pool.request();
  request.input("name", sql.NVarChar, seasonData.name);
  request.input("status", sql.NVarChar(50), seasonData.status || 'inactive');
  request.input("createdAt", sql.DateTime, new Date());
  request.input("updatedAt", sql.DateTime, new Date());

  const result = await request.query(`
    INSERT INTO tbls_seasons (name, status, createdAt, updatedAt) 
    OUTPUT INSERTED.id
    VALUES (@name, @status, @createdAt, @updatedAt);
  `);

  return result.recordset[0];
};

const updateSeason = async (id, seasonData) => {
  const request = await pool.request();
  request.input("id", sql.BigInt, id);
  request.input("name", sql.NVarChar, seasonData.name);
  request.input("status", sql.NVarChar(50), seasonData.status);
  request.input("updatedAt", sql.DateTime, new Date());

  const result = await request.query(`
    UPDATE tbls_seasons 
    SET name = @name, status = @status, updatedAt = @updatedAt 
    WHERE id = @id;
  `);

  return result;
};

const deleteSeason = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("DELETE FROM tbls_seasons WHERE id = @id");
  return result;
};

module.exports = {
  getAllSeasons,
  getSeasonById,
  createSeason,
  updateSeason,
  deleteSeason,
  updateStatus 
};

