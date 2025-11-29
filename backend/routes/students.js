import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// GET /api/students/:id - Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        s.student_id,
        s.major,
        s.graduation_year,
        s.gpa,
        s.skills,
        s.resume_url,
        s.bio,
        s.linkedin_url
      FROM users u
      JOIN students s ON u.id = s.id
      WHERE u.id = $1 AND u.role = 'student'
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.json({
      success: true,
      student: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch student'
    });
  }
});

export default router;




