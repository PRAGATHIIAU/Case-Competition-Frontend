const pool = require('../config/db');
const { UserModel } = require('../models/user.model');

/**
 * Alumni Repository
 * Handles database operations for alumni (users with role 'alumni' or 'mentor')
 * Reuses the users table with role filtering
 */

/**
 * Get all alumni from the users table
 * Alumni are users with role 'alumni' or 'mentor'
 * @returns {Promise<Array>} Array of alumni objects
 */
const getAllAlumni = async () => {
  const query = `
    SELECT 
      id, 
      email, 
      name, 
      contact, 
      role,
      willing_to_be_mentor,
      mentor_capacity,
      willing_to_be_judge,
      willing_to_be_sponsor,
      created_at, 
      updated_at
    FROM ${UserModel.TABLE_NAME}
    WHERE role IN ('alumni', 'mentor')
    ORDER BY created_at DESC
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error getting all alumni:', error);
    throw error;
  }
};

/**
 * Get alumni by ID
 * @param {number} id - Alumni ID
 * @returns {Promise<Object|null>} Alumni object or null if not found
 */
const getAlumniById = async (id) => {
  const query = `
    SELECT 
      id, 
      email, 
      name, 
      contact, 
      role,
      willing_to_be_mentor,
      mentor_capacity,
      willing_to_be_judge,
      willing_to_be_sponsor,
      created_at, 
      updated_at
    FROM ${UserModel.TABLE_NAME}
    WHERE id = $1 AND role IN ('alumni', 'mentor')
  `;

  try {
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting alumni by ID:', error);
    throw error;
  }
};

/**
 * Get alumni by email
 * @param {string} email - Alumni email
 * @returns {Promise<Object|null>} Alumni object or null if not found
 */
const getAlumniByEmail = async (email) => {
  const query = `
    SELECT 
      id, 
      email, 
      name, 
      contact, 
      role,
      willing_to_be_mentor,
      mentor_capacity,
      willing_to_be_judge,
      willing_to_be_sponsor,
      created_at, 
      updated_at
    FROM ${UserModel.TABLE_NAME}
    WHERE email = $1 AND role IN ('alumni', 'mentor')
  `;

  try {
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting alumni by email:', error);
    throw error;
  }
};

module.exports = {
  getAllAlumni,
  getAlumniById,
  getAlumniByEmail,
};

