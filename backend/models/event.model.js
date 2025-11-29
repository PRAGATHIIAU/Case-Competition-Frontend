/**
 * Event Model for PostgreSQL
 * Defines the schema for the events table
 */

const CREATE_EVENTS_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'workshop' CHECK (type IN ('workshop', 'meetup', 'seminar', 'competition', 'networking')),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
  CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
`;

const EventModel = {
  TABLE_NAME: 'events',
  COLUMNS: {
    ID: 'id',
    TITLE: 'title',
    DATE: 'date',
    DESCRIPTION: 'description',
    TYPE: 'type',
    LOCATION: 'location',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
  },
};

module.exports = {
  EventModel,
  CREATE_EVENTS_TABLE_QUERY,
};
