const pool = require('../config/db');

/**
 * Get all mentors (users who are willing to be mentors)
 * Note: This works with the existing users table structure
 * For full mentor features, create the mentors table using init-all-tables.js
 */
const getAllMentors = async () => {
  // Try to use mentors table if it exists, otherwise fall back to users table
  let query;
  try {
    // Check if mentors table exists by trying a query
    query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        COALESCE(m.company, '') as company,
        COALESCE(m.role, '') as role,
        COALESCE(m.expertise, '') as expertise,
        COALESCE(m.skills, ARRAY[]::TEXT[]) as skills,
        COALESCE(m.bio, '') as bio,
        COALESCE(m.availability, 'Available') as availability,
        COALESCE(m.linkedin_url, '') as linkedin_url,
        COALESCE(m.years_of_experience, 0) as years_of_experience
      FROM users u
      LEFT JOIN mentors m ON u.id = m.id
      WHERE u.willing_to_be_mentor = TRUE
      ORDER BY u.name
    `;
  } catch (error) {
    // Fallback to users table only
    query = `
      SELECT 
        id,
        name,
        email,
        '' as company,
        '' as role,
        '' as expertise,
        ARRAY[]::TEXT[] as skills,
        '' as bio,
        'Available' as availability,
        '' as linkedin_url,
        0 as years_of_experience
      FROM users
      WHERE willing_to_be_mentor = TRUE
      ORDER BY name
    `;
  }

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    // If mentors table doesn't exist, use fallback
    const fallbackQuery = `
      SELECT 
        id,
        name,
        email,
        '' as company,
        '' as role,
        '' as expertise,
        ARRAY[]::TEXT[] as skills,
        '' as bio,
        'Available' as availability,
        '' as linkedin_url,
        0 as years_of_experience
      FROM users
      WHERE willing_to_be_mentor = TRUE
      ORDER BY name
    `;
    const result = await pool.query(fallbackQuery);
    return result.rows;
  }
};

/**
 * Get mentor by ID
 */
const getMentorById = async (id) => {
  let query;
  try {
    query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        COALESCE(m.company, '') as company,
        COALESCE(m.role, '') as role,
        COALESCE(m.expertise, '') as expertise,
        COALESCE(m.skills, ARRAY[]::TEXT[]) as skills,
        COALESCE(m.bio, '') as bio,
        COALESCE(m.availability, 'Available') as availability,
        COALESCE(m.linkedin_url, '') as linkedin_url,
        COALESCE(m.years_of_experience, 0) as years_of_experience
      FROM users u
      LEFT JOIN mentors m ON u.id = m.id
      WHERE u.id = $1 AND u.willing_to_be_mentor = TRUE
    `;
  } catch (error) {
    query = `
      SELECT 
        id,
        name,
        email,
        '' as company,
        '' as role,
        '' as expertise,
        ARRAY[]::TEXT[] as skills,
        '' as bio,
        'Available' as availability,
        '' as linkedin_url,
        0 as years_of_experience
      FROM users
      WHERE id = $1 AND willing_to_be_mentor = TRUE
    `;
  }

  try {
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    // Fallback
    const fallbackQuery = `
      SELECT 
        id,
        name,
        email,
        '' as company,
        '' as role,
        '' as expertise,
        ARRAY[]::TEXT[] as skills,
        '' as bio,
        'Available' as availability,
        '' as linkedin_url,
        0 as years_of_experience
      FROM users
      WHERE id = $1 AND willing_to_be_mentor = TRUE
    `;
    const result = await pool.query(fallbackQuery, [id]);
    return result.rows[0] || null;
  }
};

/**
 * Get mentor by user_id (from users table)
 * This is used to find a mentor record by the user's ID
 * Note: mentors.id references users.id (not a separate user_id column)
 */
const getMentorByUserId = async (userId) => {
  try {
    // Query mentors table - id column references users.id
    const query = `
      SELECT 
        m.id,
        m.company,
        m.role,
        m.expertise,
        m.skills,
        m.bio,
        m.availability,
        m.linkedin_url,
        m.years_of_experience,
        m.created_at,
        m.updated_at,
        u.name,
        u.email
      FROM mentors m
      INNER JOIN users u ON m.id = u.id
      WHERE m.id = $1
    `;
    const result = await pool.query(query, [userId]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    // If mentors table doesn't exist or query fails, return null
    console.warn('⚠️ Could not query mentors table:', error.message);
    return null;
  }
};

/**
 * Create a new mentor record
 * Note: mentors.id references users.id (not a separate user_id column)
 */
const createMentor = async (mentorData) => {
  const { user_id, company, expertise, role, bio, availability, linkedin_url, years_of_experience } = mentorData;
  
  try {
    // mentors.id is the same as users.id (foreign key reference)
    const query = `
      INSERT INTO mentors (id, company, expertise, role, bio, availability, linkedin_url, years_of_experience)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, company, expertise, role, bio, availability, linkedin_url, years_of_experience
    `;
    
    // Expertise is stored as TEXT (not array), so convert array to comma-separated string
    const expertiseStr = Array.isArray(expertise) 
      ? expertise.join(', ') 
      : (expertise || null);
    
    const result = await pool.query(query, [
      user_id, // This becomes mentors.id (which references users.id)
      company || null,
      expertiseStr,
      role || null,
      bio || null,
      availability || 'Available',
      linkedin_url || null,
      years_of_experience || 0
    ]);
    
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error creating mentor:', error);
    throw error;
  }
};

/**
 * Update mentor record
 */
const updateMentor = async (mentorId, updateData) => {
  const { company, expertise, role, bio, availability, linkedin_url, years_of_experience } = updateData;
  
  const updates = [];
  const values = [];
  let paramIndex = 1;
  
  if (company !== undefined) {
    updates.push(`company = $${paramIndex++}`);
    values.push(company || null);
  }
  
  if (expertise !== undefined) {
    updates.push(`expertise = $${paramIndex++}`);
    // Expertise is stored as TEXT (not array), so convert array to comma-separated string
    const expertiseStr = Array.isArray(expertise) 
      ? expertise.join(', ') 
      : (expertise || null);
    values.push(expertiseStr);
  }
  
  if (role !== undefined) {
    updates.push(`role = $${paramIndex++}`);
    values.push(role || null);
  }
  
  if (bio !== undefined) {
    updates.push(`bio = $${paramIndex++}`);
    values.push(bio || null);
  }
  
  if (availability !== undefined) {
    updates.push(`availability = $${paramIndex++}`);
    values.push(availability || null);
  }
  
  if (linkedin_url !== undefined) {
    updates.push(`linkedin_url = $${paramIndex++}`);
    values.push(linkedin_url || null);
  }
  
  if (years_of_experience !== undefined) {
    updates.push(`years_of_experience = $${paramIndex++}`);
    values.push(years_of_experience || 0);
  }
  
  if (updates.length === 0) {
    throw new Error('No fields to update');
  }
  
  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(mentorId);
  
  try {
    const query = `
      UPDATE mentors
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, user_id, company, expertise, role, bio, availability, linkedin_url, years_of_experience
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error('❌ Error updating mentor:', error);
    throw error;
  }
};

/**
 * Get available mentors
 */
const getAvailableMentors = async () => {
  let query;
  try {
    query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        COALESCE(m.company, '') as company,
        COALESCE(m.role, '') as role,
        COALESCE(m.expertise, '') as expertise,
        COALESCE(m.skills, ARRAY[]::TEXT[]) as skills,
        COALESCE(m.bio, '') as bio,
        COALESCE(m.availability, 'Available') as availability,
        COALESCE(m.linkedin_url, '') as linkedin_url,
        COALESCE(m.years_of_experience, 0) as years_of_experience
      FROM users u
      LEFT JOIN mentors m ON u.id = m.id
      WHERE u.willing_to_be_mentor = TRUE 
        AND (m.availability = 'Available' OR m.availability IS NULL)
      ORDER BY u.name
    `;
  } catch (error) {
    query = `
      SELECT 
        id,
        name,
        email,
        '' as company,
        '' as role,
        '' as expertise,
        ARRAY[]::TEXT[] as skills,
        '' as bio,
        'Available' as availability,
        '' as linkedin_url,
        0 as years_of_experience
      FROM users
      WHERE willing_to_be_mentor = TRUE
      ORDER BY name
    `;
  }

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    const fallbackQuery = `
      SELECT 
        id,
        name,
        email,
        '' as company,
        '' as role,
        '' as expertise,
        ARRAY[]::TEXT[] as skills,
        '' as bio,
        'Available' as availability,
        '' as linkedin_url,
        0 as years_of_experience
      FROM users
      WHERE willing_to_be_mentor = TRUE
      ORDER BY name
    `;
    const result = await pool.query(fallbackQuery);
    return result.rows;
  }
};

module.exports = {
  getAllMentors,
  getMentorById,
  getMentorByUserId,
  getAvailableMentors,
  createMentor,
  updateMentor,
};

