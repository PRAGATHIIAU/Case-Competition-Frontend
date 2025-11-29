const notificationService = require('../services/notification.service');

/**
 * Get user notifications
 */
const getNotifications = async (req, res) => {
  try {
    const { user_id } = req.query;
    const limit = parseInt(req.query.limit) || 50;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id is required',
      });
    }

    const notifications = await notificationService.getUserNotifications(user_id, limit);

    res.json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Mark notification as read
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id);

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};


