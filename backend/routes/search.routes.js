const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

// GET /api/search - Global search
router.get('/', searchController.globalSearch);

module.exports = router;


