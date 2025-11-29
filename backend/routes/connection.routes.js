const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connection.controller');

// POST /api/send-request - Send connection request
router.post('/send-request', connectionController.sendRequest);

// GET /api/my-requests - Get user's connection requests
router.get('/my-requests', connectionController.getMyRequests);

// GET /api/mentor/requests - Get mentor's connection requests
router.get('/mentor/requests', connectionController.getMentorRequests);

// PUT /api/requests/:id - Update connection request status
router.put('/requests/:id', connectionController.updateRequestStatus);

module.exports = router;




