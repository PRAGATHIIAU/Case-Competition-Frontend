const pool = require('../config/db');
const { NotificationModel } = require('../models/notification.model');

/**
 * Create notification
 */
const createNotification = async (userId, type, title, message, link = null) => {
  const query = `
    INSERT INTO ${NotificationModel.TABLE_NAME} (user_id, type, title, message, link)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  try {
    const result = await pool.query(query, [userId, type, title, message, link]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

/**
 * Get notifications by user ID
 */
const getNotificationsByUser = async (userId, limit = 50) => {
  const query = `
    SELECT *
    FROM ${NotificationModel.TABLE_NAME}
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2
  `;

  try {
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark notification as read
 */
const markAsRead = async (notificationId) => {
  const query = `
    UPDATE ${NotificationModel.TABLE_NAME}
    SET read = TRUE
    WHERE id = $1
    RETURNING *
  `;

  try {
    const result = await pool.query(query, [notificationId]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNotification,
  getNotificationsByUser,
  markAsRead,
};




