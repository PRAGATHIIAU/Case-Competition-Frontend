const pool = require('../config/db');
const { ConnectionModel } = require('../models/connection.model');

/**
 * Create connection request
 */
const createConnectionRequest = async (studentId, mentorId, message) => {
  const query = `
    INSERT INTO ${ConnectionModel.TABLE_NAME} (student_id, mentor_id, message, status)
    VALUES ($1, $2, $3, 'pending')
    ON CONFLICT (student_id, mentor_id) 
    DO UPDATE SET 
      message = $3,
      status = 'pending',
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;

  try {
    const result = await pool.query(query, [studentId, mentorId, message]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

/**
 * Get connection requests by student ID
 */
const getRequestsByStudent = async (studentId) => {
  const query = `
    SELECT 
      cr.*,
      u.name as mentor_name,
      u.email as mentor_email
    FROM ${ConnectionModel.TABLE_NAME} cr
    JOIN users u ON cr.mentor_id = u.id
    WHERE cr.student_id = $1
    ORDER BY cr.created_at DESC
  `;

  try {
    const result = await pool.query(query, [studentId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Get connection requests by mentor ID
 */
const getRequestsByMentor = async (mentorId, status = null) => {
  let query = `
    SELECT 
      cr.*,
      u.name as student_name,
      u.email as student_email
    FROM ${ConnectionModel.TABLE_NAME} cr
    JOIN users u ON cr.student_id = u.id
    WHERE cr.mentor_id = $1
  `;
  const params = [mentorId];

  if (status) {
    query += ' AND cr.status = $2';
    params.push(status);
  }

  query += ' ORDER BY cr.created_at DESC';

  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Update connection request status
 */
const updateRequestStatus = async (requestId, status) => {
  const query = `
    UPDATE ${ConnectionModel.TABLE_NAME}
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;

  try {
    const result = await pool.query(query, [status, requestId]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createConnectionRequest,
  getRequestsByStudent,
  getRequestsByMentor,
  updateRequestStatus,
};




