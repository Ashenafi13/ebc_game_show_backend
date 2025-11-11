const { pool } = require("../config/db");
const sql = require("mssql");

const getAllQuestions = async () => {
  const result = await pool
    .request()
    .query(`
      SELECT q.*, 
             c.name as categoryName,
             r.name as rewardTypeName,
             r.measurement as rewardMeasurement
      FROM tbls_questions q
      LEFT JOIN tbls_questions_categories c ON q.categoryId = c.id
      LEFT JOIN tbls_reward_types r ON q.rewardType = r.id
      ORDER BY q.createdAt DESC
    `);
  return result.recordset;
};

const getQuestionById = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query(`
      SELECT q.*, 
             c.name as categoryName,
             r.name as rewardTypeName,
             r.measurement as rewardMeasurement
      FROM tbls_questions q
      LEFT JOIN tbls_questions_categories c ON q.categoryId = c.id
      LEFT JOIN tbls_reward_types r ON q.rewardType = r.id
      WHERE q.id = @id
    `);
  return result.recordset[0];
};

const getQuestionsByCategory = async (categoryId) => {
  const result = await pool
    .request()
    .input("categoryId", sql.BigInt, categoryId)
    .query(`
      SELECT q.*, 
             c.name as categoryName,
             r.name as rewardTypeName
      FROM tbls_questions q
      LEFT JOIN tbls_questions_categories c ON q.categoryId = c.id
      LEFT JOIN tbls_reward_types r ON q.rewardType = r.id
      WHERE q.categoryId = @categoryId
      ORDER BY q.createdAt DESC
    `);
  return result.recordset;
};

const createQuestion = async (questionData) => {
  const request = await pool.request();
  request.input("question", sql.NVarChar, questionData.question);
  request.input("categoryId", sql.BigInt, questionData.categoryId);
  request.input("type", sql.NVarChar(50), questionData.type);
  request.input("rewardType", sql.BigInt, questionData.rewardType);
  request.input("point", sql.Float, questionData.point);
  request.input("filepath", sql.NVarChar, questionData.filepath || null);
  request.input("createdAt", sql.DateTime, new Date());
  request.input("updatedAt", sql.DateTime, new Date());

  const result = await request.query(`
    INSERT INTO tbls_questions (question, categoryId, type, rewardType, point, filepath, createdAt, updatedAt) 
    OUTPUT INSERTED.id
    VALUES (@question, @categoryId, @type, @rewardType, @point, @filepath, @createdAt, @updatedAt);
  `);

  return result.recordset[0];
};

const updateQuestion = async (id, questionData) => {
  const request = await pool.request();
  request.input("id", sql.BigInt, id);
  request.input("question", sql.NVarChar, questionData.question);
  request.input("categoryId", sql.BigInt, questionData.categoryId);
  request.input("type", sql.NVarChar(50), questionData.type);
  request.input("rewardType", sql.BigInt, questionData.rewardType);
  request.input("point", sql.Float, questionData.point);
  request.input("filepath", sql.NVarChar, questionData.filepath);
  request.input("updatedAt", sql.DateTime, new Date());

  const result = await request.query(`
    UPDATE tbls_questions 
    SET question = @question, categoryId = @categoryId, type = @type, 
        rewardType = @rewardType, point = @point, filepath = @filepath, updatedAt = @updatedAt 
    WHERE id = @id;
  `);

  return result;
};

const deleteQuestion = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("DELETE FROM tbls_questions WHERE id = @id");
  return result;
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  getQuestionsByCategory,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};

