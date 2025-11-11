const { pool } = require("../config/db");
const sql = require("mssql");

const getAllCompetitors = async () => {
  const result = await pool
    .request()
    .query("SELECT * FROM tbls_competitors ORDER BY createdAt DESC");
  return result.recordset;
};

const getCompetitorById = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("SELECT * FROM tbls_competitors WHERE id = @id");
  return result.recordset[0];
};

const getCompetitorByCode = async (code) => {
  const result = await pool
    .request()
    .input("code", sql.NVarChar, code)
    .query("SELECT * FROM tbls_competitors WHERE code = @code");
  return result.recordset[0];
};

const createCompetitor = async (competitorData) => {
  const request = await pool.request();
  request.input("name", sql.NVarChar, competitorData.name);
  request.input("code", sql.NVarChar, competitorData.code);
  request.input("createdAt", sql.DateTime, new Date());
  request.input("updatedAt", sql.DateTime, new Date());

  const result = await request.query(`
    INSERT INTO tbls_competitors (name, code, createdAt, updatedAt) 
    OUTPUT INSERTED.id
    VALUES (@name, @code, @createdAt, @updatedAt);
  `);

  return result.recordset[0];
};

const updateCompetitor = async (id, competitorData) => {
  const request = await pool.request();
  request.input("id", sql.BigInt, id);
  request.input("name", sql.NVarChar, competitorData.name);
  request.input("code", sql.NVarChar, competitorData.code);
  request.input("updatedAt", sql.DateTime, new Date());

  const result = await request.query(`
    UPDATE tbls_competitors 
    SET name = @name, code = @code, updatedAt = @updatedAt 
    WHERE id = @id;
  `);

  return result;
};

const deleteCompetitor = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("DELETE FROM tbls_competitors WHERE id = @id");
  return result;
};

module.exports = {
  getAllCompetitors,
  getCompetitorById,
  getCompetitorByCode,
  createCompetitor,
  updateCompetitor,
  deleteCompetitor,
};

