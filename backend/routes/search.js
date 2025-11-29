import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// GET /api/search - Global search
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const searchTerm = `%${q.toLowerCase()}%`;

    // Search users
    const usersResult = await query(`
      SELECT 
        u.id,
        u.first_name || ' ' || u.last_name as name,
        u.email,
        u.role,
        'user' as type
      FROM users u
      WHERE LOWER(u.first_name || ' ' || u.last_name) LIKE $1
         OR LOWER(u.email) LIKE $1
      LIMIT 10
    `, [searchTerm]);

    // Search events
    const eventsResult = await query(`
      SELECT 
        id,
        title as name,
        description,
        event_type,
        date_time,
        'event' as type
      FROM events
      WHERE LOWER(title) LIKE $1
         OR LOWER(description) LIKE $1
      LIMIT 10
    `, [searchTerm]);

    // Search competitions
    const competitionsResult = await query(`
      SELECT 
        id,
        title as name,
        description,
        start_date,
        end_date,
        'competition' as type
      FROM competitions
      WHERE LOWER(title) LIKE $1
         OR LOWER(description) LIKE $1
      LIMIT 10
    `, [searchTerm]);

    res.json({
      success: true,
      query: q,
      results: {
        users: usersResult.rows,
        events: eventsResult.rows,
        competitions: competitionsResult.rows
      },
      total: usersResult.rows.length + eventsResult.rows.length + competitionsResult.rows.length
    });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform search'
    });
  }
});

export default router;




