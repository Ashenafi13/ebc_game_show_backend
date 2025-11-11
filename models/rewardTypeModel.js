const { pool } = require("../config/db");
const sql = require("mssql");

const getAllRewardTypes = async () => {
  const result = await pool
    .request()
    .query("SELECT * FROM tbls_reward_types ORDER BY name");
  return result.recordset;
};

const getRewardTypeById = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("SELECT * FROM tbls_reward_types WHERE id = @id");
  return result.recordset[0];
};

const createRewardType = async (rewardTypeData) => {
  const request = await pool.request();
  request.input("name", sql.NVarChar, rewardTypeData.name);
  request.input("measurement", sql.NVarChar, rewardTypeData.measurement);

  const result = await request.query(`
    INSERT INTO tbls_reward_types (name, measurement) 
    OUTPUT INSERTED.id
    VALUES (@name, @measurement);
  `);

  return result.recordset[0];
};

const updateRewardType = async (id, rewardTypeData) => {
  const request = await pool.request();
  request.input("id", sql.BigInt, id);
  request.input("name", sql.NVarChar, rewardTypeData.name);
  request.input("measurement", sql.NVarChar, rewardTypeData.measurement);

  const result = await request.query(`
    UPDATE tbls_reward_types 
    SET name = @name, measurement = @measurement 
    WHERE id = @id;
  `);

  return result;
};

const deleteRewardType = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("DELETE FROM tbls_reward_types WHERE id = @id");
  return result;
};

module.exports = {
  getAllRewardTypes,
  getRewardTypeById,
  createRewardType,
  updateRewardType,
  deleteRewardType,
};

