const notificationRepository = require('../repositories/notification.repository');

/**
 * Get user notifications
 */
const getUserNotifications = async (userId, limit = 50) => {
  return await notificationRepository.getNotificationsByUser(userId, limit);
};

/**
 * Mark notification as read
 */
const markAsRead = async (notificationId) => {
  const notification = await notificationRepository.markAsRead(notificationId);
  if (!notification) {
    throw new Error('Notification not found');
  }
  return notification;
};

module.exports = {
  getUserNotifications,
  markAsRead,
};




