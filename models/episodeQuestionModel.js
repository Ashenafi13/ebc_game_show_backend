const { pool } = require("../config/db");
const sql = require("mssql");

const getAllMappings = async () => {
  const result = await pool
    .request()
    .query(`
      SELECT meq.*, 
             e.name as episodeName,
             s.name as seasonName,
             q.question as questionText
      FROM tbls_mapping_episode_question meq
      LEFT JOIN tbls_episodes e ON meq.episodeId = e.id
      LEFT JOIN tbls_seasons s ON meq.seasonId = s.id
      LEFT JOIN tbls_questions q ON meq.questionId = q.id
      ORDER BY meq.id
    `);
  return result.recordset;
};

const getMappingsByEpisodeId = async (episodeId) => {
  const result = await pool
    .request()
    .input("episodeId", sql.BigInt, episodeId)
    .query(`
      SELECT meq.*, 
             q.question as questionText,
             q.type as questionType,
             q.point as questionPoint,
             c.name as categoryName
      FROM tbls_mapping_episode_question meq
      LEFT JOIN tbls_questions q ON meq.questionId = q.id
      LEFT JOIN tbls_questions_categories c ON q.categoryId = c.id
      WHERE meq.episodeId = @episodeId
    `);
  return result.recordset;
};

const getMappingsBySeasonId = async (seasonId) => {
  const result = await pool
    .request()
    .input("seasonId", sql.BigInt, seasonId)
    .query(`
      SELECT meq.*, 
             e.name as episodeName,
             q.question as questionText
      FROM tbls_mapping_episode_question meq
      LEFT JOIN tbls_episodes e ON meq.episodeId = e.id
      LEFT JOIN tbls_questions q ON meq.questionId = q.id
      WHERE meq.seasonId = @seasonId
    `);
  return result.recordset;
};

const createMapping = async (mappingData) => {
  const request = await pool.request();
  request.input("questionId", sql.BigInt, mappingData.questionId);
  request.input("episodeId", sql.BigInt, mappingData.episodeId);
  request.input("seasonId", sql.BigInt, mappingData.seasonId);

  const result = await request.query(`
    INSERT INTO tbls_mapping_episode_question (questionId, episodeId, seasonId) 
    OUTPUT INSERTED.id
    VALUES (@questionId, @episodeId, @seasonId);
  `);

  return result.recordset[0];
};

const deleteMapping = async (id) => {
  const result = await pool
    .request()
    .input("id", sql.BigInt, id)
    .query("DELETE FROM tbls_mapping_episode_question WHERE id = @id");
  return result;
};

const deleteMappingsByEpisodeId = async (episodeId) => {
  const result = await pool
    .request()
    .input("episodeId", sql.BigInt, episodeId)
    .query("DELETE FROM tbls_mapping_episode_question WHERE episodeId = @episodeId");
  return result;
};

module.exports = {
  getAllMappings,
  getMappingsByEpisodeId,
  getMappingsBySeasonId,
  createMapping,
  deleteMapping,
  deleteMappingsByEpisodeId,
};

