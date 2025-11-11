const { pool } = require("../config/db");
const sql = require("mssql");

const getAllChooses = async () => {
  const result = await pool
    .request()
    .query(`
      SELECT c.*, q.question as questionText
      FROM tbls_chooses c
      LEFT JOIN tbls_questions q ON c.questionId = q.id
      ORDER BY c.questionId, c.id
    `);
  return result.recordset;
};

const getChooseById = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query(`
      SELECT c.*, q.question as questionText
      FROM tbls_chooses c
      LEFT JOIN tbls_questions q ON c.questionId = q.id
      WHERE c.id = @id
    `);
  return result.recordset[0];
};

const getChoosesByQuestionId = async (questionId) => {
  const result = await pool
    .request()
    .input("questionId", sql.BigInt, questionId)
    .query(`
      SELECT * FROM tbls_chooses 
      WHERE questionId = @questionId
      ORDER BY id
    `);
  return result.recordset;
};

const createChoose = async (chooseData) => {
  const request = await pool.request();
  request.input("choose", sql.NVarChar, chooseData.choose);
  request.input("questionId", sql.BigInt, chooseData.questionId);
  request.input("isAnswer", sql.Bit, chooseData.isAnswer || 0);

  const result = await request.query(`
    INSERT INTO tbls_chooses (choose, questionId, isAnswer) 
    OUTPUT INSERTED.id
    VALUES (@choose, @questionId, @isAnswer);
  `);

  return result.recordset[0];
};

const updateChoose = async (id, chooseData) => {
  const request = await pool.request();
  request.input("id", sql.BigInt, id);
  request.input("choose", sql.NVarChar, chooseData.choose);
  request.input("questionId", sql.BigInt, chooseData.questionId);
  request.input("isAnswer", sql.Bit, chooseData.isAnswer);

  const result = await request.query(`
    UPDATE tbls_chooses 
    SET choose = @choose, questionId = @questionId, isAnswer = @isAnswer 
    WHERE id = @id;
  `);

  return result;
};

const deleteChoose = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("DELETE FROM tbls_chooses WHERE id = @id");
  return result;
};

const deleteChoosesByQuestionId = async (questionId) => {
  const result = await pool
    .request()
    .input("questionId", sql.BigInt, questionId)
    .query("DELETE FROM tbls_chooses WHERE questionId = @questionId");
  return result;
};

module.exports = {
  getAllChooses,
  getChooseById,
  getChoosesByQuestionId,
  createChoose,
  updateChoose,
  deleteChoose,
  deleteChoosesByQuestionId,
};

