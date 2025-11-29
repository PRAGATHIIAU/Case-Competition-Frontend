const pool = require('../config/db');
const { UserModel } = require('../models/user.model');

/**
 * Industry User Repository
 * Handles database operations for industry users (users with role 'judge', 'guest_speaker', or industry-related roles)
 * Reuses the users table with role filtering
 */

/**
 * Get all industry users from the users table
 * Industry users are users with roles like 'judge', 'guest_speaker', or those willing to be sponsors
 * @returns {Promise<Array>} Array of industry user objects
 */
const getAllIndustryUsers = async () => {
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
    WHERE role IN ('judge', 'guest_speaker') 
       OR willing_to_be_judge = TRUE 
       OR willing_to_be_sponsor = TRUE
    ORDER BY created_at DESC
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error getting all industry users:', error);
    throw error;
  }
};

/**
 * Get industry user by ID
 * @param {number} id - Industry user ID
 * @returns {Promise<Object|null>} Industry user object or null if not found
 */
const getIndustryUserById = async (id) => {
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
    WHERE id = $1 
      AND (role IN ('judge', 'guest_speaker') 
           OR willing_to_be_judge = TRUE 
           OR willing_to_be_sponsor = TRUE)
  `;

  try {
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting industry user by ID:', error);
    throw error;
  }
};

/**
 * Get industry user by email
 * @param {string} email - Industry user email
 * @returns {Promise<Object|null>} Industry user object or null if not found
 */
const getIndustryUserByEmail = async (email) => {
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
    WHERE email = $1 
      AND (role IN ('judge', 'guest_speaker') 
           OR willing_to_be_judge = TRUE 
           OR willing_to_be_sponsor = TRUE)
  `;

  try {
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting industry user by email:', error);
    throw error;
  }
};

module.exports = {
  getAllIndustryUsers,
  getIndustryUserById,
  getIndustryUserByEmail,
};

