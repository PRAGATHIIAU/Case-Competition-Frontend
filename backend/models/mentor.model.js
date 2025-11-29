/**
 * Mentor model structure
 * Extends user model for mentor-specific data
 */

const CREATE_MENTORS_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS mentors (
    id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(255),
    role VARCHAR(255),
    expertise TEXT,
    skills TEXT[],
    bio TEXT,
    availability VARCHAR(50) DEFAULT 'Available' CHECK (availability IN ('Available', 'Busy', 'Unavailable')),
    linkedin_url TEXT,
    years_of_experience INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_mentors_availability ON mentors(availability);
  CREATE INDEX IF NOT EXISTS idx_mentors_skills ON mentors USING GIN(skills);
`;

const MentorModel = {
  TABLE_NAME: 'mentors',
  COLUMNS: {
    ID: 'id',
    COMPANY: 'company',
    ROLE: 'role',
    EXPERTISE: 'expertise',
    SKILLS: 'skills',
    BIO: 'bio',
    AVAILABILITY: 'availability',
    LINKEDIN_URL: 'linkedin_url',
    YEARS_OF_EXPERIENCE: 'years_of_experience',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
  },
};

module.exports = {
  MentorModel,
  CREATE_MENTORS_TABLE_QUERY,
};




