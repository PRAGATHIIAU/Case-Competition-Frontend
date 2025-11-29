/**
 * User model structure
 * Defines the schema for the users table in PostgreSQL
 */

/**
 * SQL query to create users table
 * Run this query in your PostgreSQL database to create the table
 */
const CREATE_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'mentor', 'alumni', 'faculty', 'admin', 'judge', 'guest_speaker')),
    contact VARCHAR(255),
    skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    willing_to_be_mentor BOOLEAN DEFAULT FALSE,
    mentor_capacity INTEGER,
    willing_to_be_judge BOOLEAN DEFAULT FALSE,
    willing_to_be_sponsor BOOLEAN DEFAULT FALSE,
    -- Unified Identity: Alumni role flags
    is_mentor BOOLEAN DEFAULT FALSE NOT NULL,
    is_judge BOOLEAN DEFAULT FALSE NOT NULL,
    is_speaker BOOLEAN DEFAULT FALSE NOT NULL,
    -- Admin/Participant flag: If admin is also a participant (student assistant)
    is_participant BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  CREATE INDEX IF NOT EXISTS idx_users_skills ON users USING GIN(skills);
`;

/**
 * User data structure
 */
const UserModel = {
  // Table name
  TABLE_NAME: 'users',

  // Column names
  COLUMNS: {
    ID: 'id',
    EMAIL: 'email',
    NAME: 'name',
    PASSWORD: 'password',
    ROLE: 'role',
    CONTACT: 'contact',
    SKILLS: 'skills',
    WILLING_TO_BE_MENTOR: 'willing_to_be_mentor',
    MENTOR_CAPACITY: 'mentor_capacity',
    WILLING_TO_BE_JUDGE: 'willing_to_be_judge',
    WILLING_TO_BE_SPONSOR: 'willing_to_be_sponsor',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
  },
};

module.exports = {
  UserModel,
  CREATE_TABLE_QUERY,
};

