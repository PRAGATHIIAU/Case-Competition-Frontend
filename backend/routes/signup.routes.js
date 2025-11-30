/**
 * Simple Signup Route - Clean Implementation
 * Handles signup for all user types without role column
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db.cjs');

const upload = multer({ storage: multer.memoryStorage() });
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Error handler for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error('Multer error:', err);
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message
    });
  }
  next();
};

/**
 * POST /api/signup
 * Simple signup endpoint - no role column needed
 */
router.post('/', upload.single('resume'), handleMulterError, async (req, res) => {
  // Ensure we always return JSON, even on errors
  try {
    console.log('📝 Signup request received:', {
      body: req.body,
      hasFile: !!req.file,
      contentType: req.headers['content-type']
    });
    const {
      name,
      email,
      password,
      role, // Frontend sends this, but we ignore it - determine by table
      contact,
      major,
      year,
      company,
      expertise,
      isMentor,
      isJudge,
      isSpeaker,
      isParticipant
    } = req.body;

    // Validation
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check if email already exists in students table
    const studentCheck = await pool.query('SELECT student_id FROM students WHERE email = $1', [email.trim()]);
    if (studentCheck.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    // Check if email already exists in users table
    const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email.trim()]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine user type: student (has major/year), faculty/admin (role is faculty/admin), or user (alumni/mentor)
    const isStudent = !!(major || year);
    const isFacultyOrAdmin = role === 'faculty' || role === 'admin';

    if (isStudent) {
      // Insert into students table
      const currentYear = new Date().getFullYear();
      const yearMap = {
        'Freshman': currentYear + 3,
        'Sophomore': currentYear + 2,
        'Junior': currentYear + 1,
        'Senior': currentYear,
      };
      const gradYear = year ? (yearMap[year] || null) : null;

      const result = await pool.query(`
        INSERT INTO students (name, email, password, major, grad_year, contact)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING student_id, name, email, major, grad_year, contact, created_at
      `, [
        name.trim(),
        email.trim(),
        hashedPassword,
        major?.trim() || null,
        gradYear,
        contact?.trim() || null
      ]);

      const student = result.rows[0];
      const token = jwt.sign(
        { userId: student.student_id, email: student.email, userType: 'student' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        data: {
          user: {
            id: student.student_id,
            email: student.email,
            name: student.name,
            userType: 'student',
            major: student.major,
            grad_year: student.grad_year
          },
          token
        }
      });
    } else if (isFacultyOrAdmin) {
      // Insert into users table for faculty/admin (with is_participant flag)
      // Check if is_participant column exists
      let hasParticipantColumn = false;
      try {
        const checkColumn = await pool.query(`
          SELECT column_name FROM information_schema.columns
          WHERE table_name='users' AND column_name='is_participant'
        `);
        hasParticipantColumn = checkColumn.rows.length > 0;
      } catch (e) {
        hasParticipantColumn = false;
      }

      const toBoolean = (val) => {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') return val === 'true' || val === '1' || val === 'on';
        return Boolean(val);
      };

      // For faculty/admin, set is_participant based on the flag
      const participantValue = toBoolean(isParticipant);

      const query = hasParticipantColumn
        ? `
          INSERT INTO users (email, name, password, contact, skills, is_participant)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, email, name, contact, skills, is_participant, created_at
        `
        : `
          INSERT INTO users (email, name, password, contact, skills)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, email, name, contact, skills, created_at
        `;

      const values = hasParticipantColumn
        ? [
            email.trim(),
            name.trim(),
            hashedPassword,
            contact?.trim() || null,
            [],
            participantValue
          ]
        : [
            email.trim(),
            name.trim(),
            hashedPassword,
            contact?.trim() || null,
            []
          ];

      const result = await pool.query(query, values);
      const user = result.rows[0];

      // Determine userType: admin if is_participant is true, otherwise faculty
      // If column doesn't exist, use the isParticipant value from request
      let userType = 'faculty';
      if (hasParticipantColumn) {
        userType = user.is_participant ? 'admin' : 'faculty';
      } else {
        // Column doesn't exist, use the isParticipant value from request
        userType = toBoolean(isParticipant) ? 'admin' : 'faculty';
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, userType: userType },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: `${userType === 'admin' ? 'Admin' : 'Faculty'} registered successfully`,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            userType: userType,
            isParticipant: hasParticipantColumn ? (user.is_participant || false) : false
          },
          token
        }
      });
    } else {
      // Insert into users table (alumni/mentor/judge/speaker)
      // Process expertise/skills
      let skillsArray = [];
      if (expertise) {
        if (Array.isArray(expertise)) {
          skillsArray = expertise;
        } else if (typeof expertise === 'string') {
          try {
            skillsArray = JSON.parse(expertise);
          } catch {
            skillsArray = expertise.split(',').map(e => e.trim()).filter(e => e);
          }
        }
      }

      const toBoolean = (val) => {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') return val === 'true' || val === '1' || val === 'on';
        return Boolean(val);
      };

      // Users table has: willing_to_be_mentor, willing_to_be_judge, willing_to_be_sponsor, willing_to_be_speaker
      // willing_to_be_speaker is separate from willing_to_be_sponsor (sponsoring vs speaking)
      const query = `
        INSERT INTO users (email, name, password, contact, skills, 
                         willing_to_be_mentor, willing_to_be_judge, willing_to_be_sponsor, willing_to_be_speaker)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, email, name, contact, skills, willing_to_be_mentor, 
                  willing_to_be_judge, willing_to_be_sponsor, willing_to_be_speaker, created_at
      `;

      const values = [
        email.trim(),
        name.trim(),
        hashedPassword,
        contact?.trim() || null,
        skillsArray,
        toBoolean(isMentor), // willing_to_be_mentor (boolean)
        toBoolean(isJudge), // willing_to_be_judge (boolean)
        false, // willing_to_be_sponsor (separate from speaker)
        toBoolean(isSpeaker) || false // willing_to_be_speaker (separate column for speakers)
      ];

      const result = await pool.query(query, values);
      const user = result.rows[0];

      const token = jwt.sign(
        { userId: user.id, email: user.email, userType: 'alumni' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            userType: 'alumni',
            isMentor: user.willing_to_be_mentor || false,
            isJudge: user.willing_to_be_judge || false,
            isSpeaker: user.willing_to_be_speaker || false, // Use willing_to_be_speaker column
            skills: user.skills || []
          },
          token
        }
      });
    }
  } catch (error) {
    console.error('❌ Signup error:', error);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    console.error('   Error stack:', error.stack);
    
    // Ensure we always return JSON, never HTML
    if (!res.headersSent) {
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'Email already exists',
          error: 'Email already exists'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'An error occurred during signup',
        error: error.message || 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
});

module.exports = router;

