import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// POST /api/send-request - Send connection request
router.post('/send-request', async (req, res) => {
  try {
    const { mentor_id, student_id, message } = req.body;

    if (!mentor_id || !student_id) {
      return res.status(400).json({
        success: false,
        error: 'mentor_id and student_id are required'
      });
    }

    // Check if request already exists
    const existing = await query(`
      SELECT id, status FROM connection_requests
      WHERE student_id = $1 AND mentor_id = $2
    `, [student_id, mentor_id]);

    if (existing.rows.length > 0) {
      const existingRequest = existing.rows[0];
      if (existingRequest.status === 'pending') {
        return res.status(400).json({
          success: false,
          error: 'Connection request already pending'
        });
      }
    }

    // Create new connection request
    const result = await query(`
      INSERT INTO connection_requests (student_id, mentor_id, message, status)
      VALUES ($1, $2, $3, 'pending')
      ON CONFLICT (student_id, mentor_id) 
      DO UPDATE SET 
        message = $3,
        status = 'pending',
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [student_id, mentor_id, message || 'I would love to connect and learn from your experience.']);

    // Create notification for mentor
    await query(`
      INSERT INTO notifications (user_id, type, title, message)
      VALUES ($1, 'connection_request', 'New Connection Request', 
        'You have received a new connection request from a student')
    `, [mentor_id]);

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send connection request'
    });
  }
});

// GET /api/my-requests - Get current user's connection requests
router.get('/my-requests', async (req, res) => {
  try {
    const { user_id, role } = req.query; // Assuming user_id comes from auth middleware

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id is required'
      });
    }

    let result;
    if (role === 'student') {
      // Get requests sent by student
      result = await query(`
        SELECT 
          cr.*,
          u.first_name || ' ' || u.last_name as mentor_name,
          m.company as mentor_company,
          m.role as mentor_role
        FROM connection_requests cr
        JOIN users u ON cr.mentor_id = u.id
        JOIN mentors m ON cr.mentor_id = m.id
        WHERE cr.student_id = $1
        ORDER BY cr.created_at DESC
      `, [user_id]);
    } else if (role === 'mentor') {
      // Get requests received by mentor
      result = await query(`
        SELECT 
          cr.*,
          u.first_name || ' ' || u.last_name as student_name,
          s.major as student_major,
          s.student_id as student_number
        FROM connection_requests cr
        JOIN users u ON cr.student_id = u.id
        LEFT JOIN students s ON cr.student_id = s.id
        WHERE cr.mentor_id = $1
        ORDER BY cr.created_at DESC
      `, [user_id]);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid role'
      });
    }

    res.json({
      success: true,
      count: result.rows.length,
      requests: result.rows
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch connection requests'
    });
  }
});

// GET /api/mentor/requests - Get mentor's connection requests
router.get('/mentor/requests', async (req, res) => {
  try {
    const { mentor_id, status } = req.query;

    if (!mentor_id) {
      return res.status(400).json({
        success: false,
        error: 'mentor_id is required'
      });
    }

    let queryText = `
      SELECT 
        cr.*,
        u.first_name || ' ' || u.last_name as student_name,
        u.email as student_email,
        s.major as student_major,
        s.student_id as student_number,
        s.skills as student_skills
      FROM connection_requests cr
      JOIN users u ON cr.student_id = u.id
      LEFT JOIN students s ON cr.student_id = s.id
      WHERE cr.mentor_id = $1
    `;
    const params = [mentor_id];

    if (status) {
      queryText += ' AND cr.status = $2';
      params.push(status);
    }

    queryText += ' ORDER BY cr.created_at DESC';

    const result = await query(queryText, params);

    res.json({
      success: true,
      count: result.rows.length,
      requests: result.rows
    });
  } catch (error) {
    console.error('Error fetching mentor requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mentor requests'
    });
  }
});

// PUT /api/requests/:id - Update connection request status
router.put('/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['accepted', 'declined', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Valid status (accepted, declined, cancelled) is required'
      });
    }

    const result = await query(`
      UPDATE connection_requests
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Connection request not found'
      });
    }

    const request = result.rows[0];

    // Create notification for student
    await query(`
      INSERT INTO notifications (user_id, type, title, message)
      VALUES ($1, 'connection_response', 
        'Connection Request ${status}', 
        'Your connection request has been ${status}')
    `, [request.student_id]);

    res.json({
      success: true,
      message: `Connection request ${status} successfully`,
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update connection request'
    });
  }
});

export default router;




