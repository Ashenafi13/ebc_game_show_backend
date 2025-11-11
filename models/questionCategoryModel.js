const { pool } = require("../config/db");
const sql = require("mssql");

const getAllCategories = async () => {
  const result = await pool
    .request()
    .query("SELECT * FROM tbls_questions_categories ORDER BY name");
  return result.recordset;
};

const getCategoryById = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("SELECT * FROM tbls_questions_categories WHERE id = @id");
  return result.recordset[0];
};

const createCategory = async (categoryData) => {
  const request = await pool.request();
  request.input("name", sql.NVarChar, categoryData.name);

  const result = await request.query(`
    INSERT INTO tbls_questions_categories (name) 
    OUTPUT INSERTED.id
    VALUES (@name);
  `);

  return result.recordset[0];
};

const updateCategory = async (id, categoryData) => {
  const request = await pool.request();
  request.input("id", sql.BigInt, id);
  request.input("name", sql.NVarChar, categoryData.name);

  const result = await request.query(`
    UPDATE tbls_questions_categories 
    SET name = @name 
    WHERE id = @id;
  `);

  return result;
};

const deleteCategory = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("DELETE FROM tbls_questions_categories WHERE id = @id");
  return result;
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

