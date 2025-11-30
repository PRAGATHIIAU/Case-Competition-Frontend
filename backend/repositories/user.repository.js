const pool = require('../config/db');
const { UserModel } = require('../models/user.model');

/**
 * User Repository
 * Handles all database operations for users
 */

/**
 * Create a new user in the database
 * @param {Object} userData - User data object
 * @returns {Promise<Object>} Created user object (without password)
 */
const createUser = async (userData) => {
  const {
    email,
    name,
    password,
    // role, // REMOVED - users table doesn't have role column (determined by table, not column)
    contact,
    skills,
    willing_to_be_mentor,
    mentor_capacity,
    willing_to_be_judge,
    willing_to_be_sponsor,
    willing_to_be_speaker, // Separate from willing_to_be_sponsor
    // Unified Identity: Alumni role flags
    isMentor,
    isJudge,
    isSpeaker,
    // Admin/Participant flag
    isParticipant,
  } = userData;

  // Check if is_participant column exists (for backward compatibility)
  let hasParticipantColumn = false;
  try {
    const checkParticipantColumn = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='users' AND column_name='is_participant'
    `);
    hasParticipantColumn = checkParticipantColumn.rows.length > 0;
  } catch (checkError) {
    // If check fails, assume column doesn't exist
    console.warn('⚠️ Could not check for is_participant column:', checkError.message);
    hasParticipantColumn = false;
  }

  // Check if role column exists (for backward compatibility during migration)
  let hasRoleColumn = false;
  try {
    const checkRoleColumn = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='users' AND column_name='role'
    `);
    hasRoleColumn = checkRoleColumn.rows.length > 0;
  } catch (checkError) {
    console.warn('⚠️ Could not check for role column:', checkError.message);
    hasRoleColumn = false;
  }

  // Build query - users table has: willing_to_be_mentor, willing_to_be_judge, willing_to_be_sponsor, willing_to_be_speaker
  // willing_to_be_speaker is separate from willing_to_be_sponsor (sponsoring vs speaking)
  const query = hasParticipantColumn
    ? `
      INSERT INTO ${UserModel.TABLE_NAME} (
        email, name, password, contact, skills,
        willing_to_be_mentor, mentor_capacity,
        willing_to_be_judge, willing_to_be_sponsor, willing_to_be_speaker,
        is_participant
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, email, name, contact, skills, willing_to_be_mentor,
                mentor_capacity, willing_to_be_judge, willing_to_be_sponsor, willing_to_be_speaker,
                is_participant,
                created_at, updated_at
    `
    : `
      INSERT INTO ${UserModel.TABLE_NAME} (
        email, name, password, contact, skills,
        willing_to_be_mentor, mentor_capacity,
        willing_to_be_judge, willing_to_be_sponsor, willing_to_be_speaker
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, email, name, contact, skills, willing_to_be_mentor,
                mentor_capacity, willing_to_be_judge, willing_to_be_sponsor, willing_to_be_speaker,
                created_at, updated_at
    `;

  const baseValues = [
    email,
    name,
    password, // Already hashed in service layer
    // NO role field - users table doesn't have role column
    contact || null,
    Array.isArray(skills) ? skills : (skills ? [skills] : []), // Ensure skills is an array
    // Users table has willing_to_be_* columns, not is_* columns
    // Convert isMentor/isJudge/isSpeaker to willing_to_be_mentor/willing_to_be_judge/willing_to_be_speaker
    (isMentor === true || isMentor === 'true' || isMentor === '1' || willing_to_be_mentor === 'yes' || willing_to_be_mentor === true),
    mentor_capacity || null,
    (isJudge === true || isJudge === 'true' || isJudge === '1' || willing_to_be_judge === 'yes' || willing_to_be_judge === true),
    willing_to_be_sponsor === 'yes' || willing_to_be_sponsor === true || false, // Separate from speaker
    (isSpeaker === true || isSpeaker === 'true' || isSpeaker === '1' || willing_to_be_speaker === 'yes' || willing_to_be_speaker === true), // willing_to_be_speaker
  ];

  const values = hasParticipantColumn
    ? [...baseValues, isParticipant || false]
    : baseValues;

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    // Log the exact query that failed for debugging
    if (error.message && error.message.includes('does not exist')) {
      console.error('❌ SQL Error - Column does not exist:');
      console.error('   Query:', query.substring(0, 200) + '...');
      console.error('   Error:', error.message);
      console.error('   Values count:', values.length);
    }
    // Handle unique constraint violation (duplicate email)
    if (error.code === '23505') {
      const customError = new Error('Email already exists');
      customError.code = 'DUPLICATE_EMAIL';
      throw customError;
    }
    throw error;
  }
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null if not found
 */
const getUserByEmail = async (email) => {
  // Check if is_participant column exists (for backward compatibility)
  let hasParticipantColumn = true;
  try {
    const checkColumn = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='users' AND column_name='is_participant'
    `);
    hasParticipantColumn = checkColumn.rows.length > 0;
  } catch (e) {
    // If check fails, assume column doesn't exist
    hasParticipantColumn = false;
  }

  // Build query - NEVER include role column (users table doesn't have role column)
  // Role column was removed - user type is determined by which table they're in
      // Users table has: willing_to_be_mentor, willing_to_be_judge, willing_to_be_sponsor, willing_to_be_speaker
      const query = hasParticipantColumn
        ? `
          SELECT id, email, name, password, skills, contact, willing_to_be_mentor,
                 mentor_capacity, willing_to_be_judge, willing_to_be_sponsor, willing_to_be_speaker,
                 is_participant,
                 created_at, updated_at
          FROM ${UserModel.TABLE_NAME}
          WHERE email = $1
        `
        : `
          SELECT id, email, name, password, skills, contact, willing_to_be_mentor,
                 mentor_capacity, willing_to_be_judge, willing_to_be_sponsor, willing_to_be_speaker,
                 created_at, updated_at
          FROM ${UserModel.TABLE_NAME}
          WHERE email = $1
        `;

  try {
    const result = await pool.query(query, [email]);
    const user = result.rows[0] || null;
    // Add is_participant as false if column doesn't exist
    if (user && !hasParticipantColumn) {
      user.is_participant = false;
    }
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user by ID (for future use)
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
const getUserById = async (id) => {
  // Check if is_participant column exists (for backward compatibility)
  let hasParticipantColumn = true;
  try {
    const checkColumn = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='users' AND column_name='is_participant'
    `);
    hasParticipantColumn = checkColumn.rows.length > 0;
  } catch (e) {
    hasParticipantColumn = false;
  }

  // Build query - Users table has: willing_to_be_mentor, willing_to_be_judge, willing_to_be_sponsor, willing_to_be_speaker
  const query = hasParticipantColumn
    ? `
      SELECT id, email, name, skills, contact, willing_to_be_mentor,
             mentor_capacity, willing_to_be_judge, willing_to_be_sponsor, willing_to_be_speaker,
             is_participant,
             created_at, updated_at
      FROM ${UserModel.TABLE_NAME}
      WHERE id = $1
    `
    : `
      SELECT id, email, name, skills, contact, willing_to_be_mentor,
             mentor_capacity, willing_to_be_judge, willing_to_be_sponsor, willing_to_be_speaker,
             created_at, updated_at
      FROM ${UserModel.TABLE_NAME}
      WHERE id = $1
    `;

  try {
    const result = await pool.query(query, [id]);
    const user = result.rows[0] || null;
    // Add is_participant as false if column doesn't exist
    if (user && !hasParticipantColumn) {
      user.is_participant = false;
    }
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user information
 * @param {number} id - User ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} Updated user object (without password)
 */
const updateUser = async (id, updateData) => {
  const {
    name,
    contact,
    willing_to_be_mentor,
    mentor_capacity,
    willing_to_be_judge,
    willing_to_be_sponsor,
    willing_to_be_speaker, // Separate from willing_to_be_sponsor
    isMentor, // Frontend sends this, we convert to willing_to_be_mentor
    isJudge, // Frontend sends this, we convert to willing_to_be_judge
    isSpeaker, // Frontend sends this, we convert to willing_to_be_speaker
    isParticipant,
  } = updateData;

  // Check if is_participant column exists (for backward compatibility)
  let hasParticipantColumn = false;
  try {
    const checkParticipantColumn = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='users' AND column_name='is_participant'
    `);
    hasParticipantColumn = checkParticipantColumn.rows.length > 0;
  } catch (checkError) {
    // If check fails, assume column doesn't exist
    console.warn('⚠️ Could not check for is_participant column:', checkError.message);
    hasParticipantColumn = false;
  }

  // Build dynamic update query
  const updates = [];
  const values = [];
  let paramIndex = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramIndex++}`);
    values.push(name.trim());
  }

  if (contact !== undefined) {
    updates.push(`contact = $${paramIndex++}`);
    values.push(contact ? contact.trim() : null);
  }

  if (willing_to_be_mentor !== undefined) {
    updates.push(`willing_to_be_mentor = $${paramIndex++}`);
    values.push(willing_to_be_mentor === 'yes' || willing_to_be_mentor === true);
  }

  if (mentor_capacity !== undefined) {
    updates.push(`mentor_capacity = $${paramIndex++}`);
    values.push(mentor_capacity ? parseInt(mentor_capacity) : null);
  }

  if (willing_to_be_judge !== undefined) {
    updates.push(`willing_to_be_judge = $${paramIndex++}`);
    values.push(willing_to_be_judge === 'yes' || willing_to_be_judge === true);
  }

  if (willing_to_be_sponsor !== undefined) {
    updates.push(`willing_to_be_sponsor = $${paramIndex++}`);
    values.push(willing_to_be_sponsor === 'yes' || willing_to_be_sponsor === true);
  }

  // Convert isMentor/isJudge to willing_to_be_mentor/willing_to_be_judge
  // Users table doesn't have is_mentor/is_judge/is_speaker columns
  if (isMentor !== undefined) {
    updates.push(`willing_to_be_mentor = $${paramIndex++}`);
    // Handle both boolean and string values
    const boolValue = typeof isMentor === 'boolean' ? isMentor : (isMentor === 'true' || isMentor === true || isMentor === '1' || isMentor === 'on');
    values.push(boolValue);
  }

  if (isJudge !== undefined) {
    updates.push(`willing_to_be_judge = $${paramIndex++}`);
    // Handle both boolean and string values
    const boolValue = typeof isJudge === 'boolean' ? isJudge : (isJudge === 'true' || isJudge === true || isJudge === '1' || isJudge === 'on');
    values.push(boolValue);
  }

  // Convert isSpeaker to willing_to_be_speaker
  if (isSpeaker !== undefined) {
    updates.push(`willing_to_be_speaker = $${paramIndex++}`);
    const boolValue = typeof isSpeaker === 'boolean' ? isSpeaker : (isSpeaker === 'true' || isSpeaker === true || isSpeaker === '1' || isSpeaker === 'on');
    values.push(boolValue);
  } else if (willing_to_be_speaker !== undefined) {
    updates.push(`willing_to_be_speaker = $${paramIndex++}`);
    values.push(willing_to_be_speaker === 'yes' || willing_to_be_speaker === true);
  }
  // }

  // Admin/Participant flag (only if column exists)
  if (isParticipant !== undefined && hasParticipantColumn) {
    updates.push(`is_participant = $${paramIndex++}`);
    // Handle both boolean and string values
    const boolValue = typeof isParticipant === 'boolean' ? isParticipant : (isParticipant === 'true' || isParticipant === true || isParticipant === '1' || isParticipant === 'on');
    values.push(boolValue);
  } else if (isParticipant !== undefined && !hasParticipantColumn) {
    console.warn('⚠️ isParticipant update requested but column does not exist. Skipping...');
  }

  if (updates.length === 0) {
    throw new Error('No fields to update');
  }

  // Add updated_at timestamp
  updates.push(`updated_at = CURRENT_TIMESTAMP`);

  // Add user ID to values
  values.push(id);

  // Build RETURNING clause conditionally
  // Note: bio, linkedinUrl, portfolioUrl, coursework are stored in DynamoDB, not RDS
  // But we return them from the merged user data in the service layer
  // Users table does NOT have: role, is_mentor, is_judge, is_speaker columns
  const returningFields = [
    'id', 'email', 'name', 'contact', 'skills', 'willing_to_be_mentor',
    'mentor_capacity', 'willing_to_be_judge', 'willing_to_be_sponsor', 'willing_to_be_speaker'
  ];
  if (hasParticipantColumn) {
    returningFields.push('is_participant');
  }
  returningFields.push('created_at', 'updated_at');

  const query = `
    UPDATE ${UserModel.TABLE_NAME}
    SET ${updates.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING ${returningFields.join(', ')}
  `;

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return null; // User not found
    }
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

/**
 * Update user password
 * @param {number} id - User ID
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<Object>} Updated user object (without password)
 */
const updateUserPassword = async (id, hashedPassword) => {
  const query = `
    UPDATE ${UserModel.TABLE_NAME}
    SET password = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, email, name, contact, willing_to_be_mentor,
              mentor_capacity, willing_to_be_judge, willing_to_be_sponsor,
              created_at, updated_at
  `;

  try {
    const result = await pool.query(query, [hashedPassword, id]);
    if (result.rows.length === 0) {
      return null; // User not found
    }
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

/**
 * Get all users
 * @returns {Promise<Array>} Array of user objects (without passwords)
 */
const getAllUsers = async () => {
  const query = `
    SELECT id, email, name, contact, willing_to_be_mentor,
           mentor_capacity, willing_to_be_judge, willing_to_be_sponsor,
           created_at, updated_at
    FROM ${UserModel.TABLE_NAME}
    ORDER BY created_at DESC
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all users willing to be mentors
 * @returns {Promise<Array>} Array of mentor user objects (without passwords)
 */
const getMentorUsers = async () => {
  const query = `
    SELECT id, email, name, contact, willing_to_be_mentor,
           mentor_capacity, willing_to_be_judge, willing_to_be_sponsor,
           created_at, updated_at, last_login
    FROM ${UserModel.TABLE_NAME}
    WHERE willing_to_be_mentor = TRUE
    ORDER BY created_at DESC
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete user by ID
 * @param {number} id - User ID
 * @returns {Promise<boolean>} True if user was deleted, false if not found
 */
const deleteUser = async (id) => {
  const query = `
    DELETE FROM ${UserModel.TABLE_NAME}
    WHERE id = $1
    RETURNING id
  `;

  try {
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user's last_login timestamp to current time.
 * @param {string|number} id - User ID
 * @returns {Promise<void>}
 */
const updateLastLogin = async (id) => {
  // Check if last_login column exists
  try {
    const columnCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = $1
          AND column_name = 'last_login'
      ) AS exists
    `, [UserModel.TABLE_NAME]);

    const hasLastLoginColumn = !!columnCheck.rows[0]?.exists;

    if (hasLastLoginColumn) {
      const query = `
        UPDATE ${UserModel.TABLE_NAME}
        SET last_login = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `;
      await pool.query(query, [id]);
    } else {
      // Column doesn't exist, silently skip (for backward compatibility)
      console.warn(`⚠️ last_login column does not exist in ${UserModel.TABLE_NAME}. Skipping update.`);
    }
  } catch (error) {
    // If update fails, log but don't throw (for backward compatibility)
    console.warn('⚠️ Could not update last_login:', error.message);
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  getMentorUsers,
  updateUser,
  updateUserPassword,
  deleteUser,
  updateLastLogin,
};

