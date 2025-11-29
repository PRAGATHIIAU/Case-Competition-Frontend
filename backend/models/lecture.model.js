/**
 * Lecture Model for PostgreSQL
 * Defines the schema for the lectures table
 */

const CREATE_LECTURES_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS lectures (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    professor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_lectures_date ON lectures(date);
  CREATE INDEX IF NOT EXISTS idx_lectures_professor_id ON lectures(professor_id);
`;

const LectureModel = {
  TABLE_NAME: 'lectures',
  COLUMNS: {
    ID: 'id',
    TITLE: 'title',
    TOPIC: 'topic',
    DATE: 'date',
    PROFESSOR_ID: 'professor_id',
    DESCRIPTION: 'description',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
  },
};

module.exports = {
  LectureModel,
  CREATE_LECTURES_TABLE_QUERY,
};



