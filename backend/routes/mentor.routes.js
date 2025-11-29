const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentor.controller');

// POST /api/mentors/recommend - Recommend mentors based on skills (MUST come before /:id)
router.post('/recommend', mentorController.recommendMentors);

// GET /api/mentors - Get all mentors
router.get('/', mentorController.getAllMentors);

// GET /api/mentors/:id - Get mentor by ID (MUST come last)
router.get('/:id', mentorController.getMentorById);

module.exports = router;

