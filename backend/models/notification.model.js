/**
 * Notification model
 */

const CREATE_NOTIFICATIONS_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
  CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
`;

const NotificationModel = {
  TABLE_NAME: 'notifications',
  COLUMNS: {
    ID: 'id',
    USER_ID: 'user_id',
    TYPE: 'type',
    TITLE: 'title',
    MESSAGE: 'message',
    LINK: 'link',
    READ: 'read',
    CREATED_AT: 'created_at',
  },
};

module.exports = {
  NotificationModel,
  CREATE_NOTIFICATIONS_TABLE_QUERY,
};


