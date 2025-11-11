const { pool } = require("../config/db");
const sql = require("mssql");

const getUserByUsername = async (username) => {
  const result = await pool
    .request()
    .input("username", sql.NVarChar, username) // Bind the @username parameter
    .query("SELECT * FROM tbls_users WHERE username = @username");

  return result.recordset[0];
};

const getUserAll = async () => {
  const result = await pool
    .request()
    .query("SELECT * FROM tbls_users");

  return result.recordset;
};

const createUser = async (userData) => {
  const request = await pool.request();
  // Bind each field from userData to the request
  request.input("username", sql.NVarChar, userData.username);
  request.input("fullName", sql.NVarChar, userData.fullName);
  request.input("password", sql.NVarChar, userData.password);
  request.input("createdAt", sql.DateTime, userData.createdAt);
  request.input("updatedAt", sql.DateTime, userData.updatedAt);
  request.input("status", sql.Int, userData.status);

  const result = await request.query(`
          INSERT INTO tbls_users (username,fullName,password,status,createdAt,updatedAt) 
          VALUES (@username,@fullName,@password,@status,@createdAt,@updatedAt);
      `);

  return result;
};

const updateUser = async (userData) => {
  const request = await pool.request();
  // Bind each field from userData to the request
  request.input("username", sql.NVarChar, userData.username);
  request.input("fullName", sql.NVarChar, userData.fullName);
  request.input("password", sql.NVarChar, userData.password);
  request.input("updatedAt", sql.DateTime, userData.updatedAt);
  request.input("status", sql.Int, userData.status);
  request.input("id", sql.Int, userData.id);

  const result = await request.query(`
          UPDATE tbls_users SET username = @username, fullName = @fullName, password = @password, status = @status, updatedAt = @updatedAt WHERE id = @id;
      `);

  return result;
};

const deleteUser = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM tbls_users WHERE id = @id");

  return result;
};

module.exports = {
  getUserByUsername,
  getUserAll,
  createUser,
  updateUser,
  deleteUser,
};
