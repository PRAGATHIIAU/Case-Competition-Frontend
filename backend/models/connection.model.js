/**
 * Connection Request model
 */

const CREATE_CONNECTIONS_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS connection_requests (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    mentor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, mentor_id)
  );

  CREATE INDEX IF NOT EXISTS idx_connection_requests_mentor ON connection_requests(mentor_id);
  CREATE INDEX IF NOT EXISTS idx_connection_requests_student ON connection_requests(student_id);
  CREATE INDEX IF NOT EXISTS idx_connection_requests_status ON connection_requests(status);
`;

const ConnectionModel = {
  TABLE_NAME: 'connection_requests',
  COLUMNS: {
    ID: 'id',
    STUDENT_ID: 'student_id',
    MENTOR_ID: 'mentor_id',
    MESSAGE: 'message',
    STATUS: 'status',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
  },
};

module.exports = {
  ConnectionModel,
  CREATE_CONNECTIONS_TABLE_QUERY,
};




