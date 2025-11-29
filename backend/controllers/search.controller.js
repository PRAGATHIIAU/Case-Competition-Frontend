const pool = require('../config/db');

/**
 * Global search
 */
const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const searchTerm = `%${q.toLowerCase()}%`;

    // Search users
    const usersResult = await pool.query(`
      SELECT 
        id,
        name,
        email,
        'user' as type
      FROM users
      WHERE LOWER(name) LIKE $1
         OR LOWER(email) LIKE $1
      LIMIT 10
    `, [searchTerm]);

    // Note: Events are stored in DynamoDB, so we'd need to search via API Gateway
    // For now, return users only
    res.json({
      success: true,
      query: q,
      results: {
        users: usersResult.rows,
        events: [],
        competitions: [],
      },
      total: usersResult.rows.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to perform search',
      error: error.message,
    });
  }
};

module.exports = {
  globalSearch,
};


