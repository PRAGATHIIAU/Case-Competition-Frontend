const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

// GET /api/notifications - Get user's notifications
router.get('/', notificationController.getNotifications);

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;


