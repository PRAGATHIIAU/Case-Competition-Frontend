const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db.cjs');

const router = express.Router();

// Helper function for queries
const query = async (text, params) => {
  const result = await pool.query(text, params);
  return result;
};

// POST /api/auth/login - Login user (checks students, users, and faculty tables)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    let user = null;
    let role = null;
    let userId = null;
    let firstName = null;
    let lastName = null;

    // 1. Check students table first
    try {
      const studentResult = await query(`
        SELECT student_id, email, password, name
        FROM students
        WHERE email = $1
      `, [email]);

      if (studentResult.rows.length > 0) {
        const student = studentResult.rows[0];
        // Verify password (students table uses 'password' column)
        const isValid = await bcrypt.compare(password, student.password);
        if (isValid) {
          user = student;
          role = 'student';
          userId = student.student_id;
          // Split name into first_name and last_name if needed
          const nameParts = (student.name || '').split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }
      }
    } catch (err) {
      console.warn('Error checking students table:', err.message);
    }

    // 2. If not found in students, check users table (for alumni/mentors)
    if (!user) {
      try {
        // Check if users table has 'role' column
        const columnCheck = await query(`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'role'
        `);

        if (columnCheck.rows.length > 0) {
          // Users table has role column
          const userResult = await query(`
            SELECT id, email, password, name, role
            FROM users
            WHERE email = $1
          `, [email]);

          if (userResult.rows.length > 0) {
            const userData = userResult.rows[0];
            // Check password (users table might use 'password' or 'password_hash')
            let isValid = false;
            if (userData.password) {
              isValid = await bcrypt.compare(password, userData.password);
            } else if (userData.password_hash) {
              isValid = await bcrypt.compare(password, userData.password_hash);
            }

            if (isValid) {
              user = userData;
              role = userData.role || 'alumni';
              userId = userData.id;
              // Split name into first_name and last_name if needed
              const nameParts = (userData.name || '').split(' ');
              firstName = nameParts[0] || '';
              lastName = nameParts.slice(1).join(' ') || '';
            }
          }
        } else {
          // Users table doesn't have role column - check with name/email only
          const userResult = await query(`
            SELECT id, email, password, name
            FROM users
            WHERE email = $1
          `, [email]);

          if (userResult.rows.length > 0) {
            const userData = userResult.rows[0];
            let isValid = false;
            if (userData.password) {
              isValid = await bcrypt.compare(password, userData.password);
            } else if (userData.password_hash) {
              isValid = await bcrypt.compare(password, userData.password_hash);
            }

            if (isValid) {
              user = userData;
              role = 'alumni'; // Default role for users table
              userId = userData.id;
              const nameParts = (userData.name || '').split(' ');
              firstName = nameParts[0] || '';
              lastName = nameParts.slice(1).join(' ') || '';
            }
          }
        }
      } catch (err) {
        console.warn('Error checking users table:', err.message);
      }
    }

    // 3. If still not found, check faculty table (for faculty/admin)
    if (!user) {
      try {
        const facultyResult = await query(`
          SELECT id, email, password, first_name, last_name, role
          FROM faculty
          WHERE email = $1
        `, [email]);

        if (facultyResult.rows.length > 0) {
          const faculty = facultyResult.rows[0];
          // Verify password
          const isValid = await bcrypt.compare(password, faculty.password);
          if (isValid) {
            user = faculty;
            role = faculty.role || 'faculty';
            userId = faculty.id;
            firstName = faculty.first_name || '';
            lastName = faculty.last_name || '';
          }
        }
      } catch (err) {
        console.warn('Error checking faculty table:', err.message);
      }
    }

    // If no user found in any table
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: userId, 
        email: user.email, 
        role: role,
        ...(role === 'student' && { studentId: userId, type: 'student' })
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: userId,
        email: user.email,
        first_name: firstName,
        last_name: lastName,
        name: firstName && lastName ? `${firstName} ${lastName}` : (user.name || ''),
        role: role
      },
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login',
      details: error.message
    });
  }
});

// POST /api/auth/register - Register new user (kept for backward compatibility)
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, role, ...roleSpecificData } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Determine which table to insert into based on role
    if (role === 'student') {
      // Insert into students table
      const name = first_name && last_name ? `${first_name} ${last_name}` : (first_name || last_name || '');
      const result = await query(`
        INSERT INTO students (email, password, name, major, grad_year)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING student_id, email, name, created_at
      `, [email, password_hash, name, roleSpecificData.major || null, roleSpecificData.grad_year || null]);

      const student = result.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        { studentId: student.student_id, email: student.email, type: 'student' },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        user: {
          id: student.student_id,
          email: student.email,
          name: student.name,
          role: 'student'
        },
        token
      });
    } else if (role === 'faculty' || role === 'admin') {
      // Insert into faculty table
      const result = await query(`
        INSERT INTO faculty (email, password, first_name, last_name, role, department, title)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, email, first_name, last_name, role, created_at
      `, [
        email,
        password_hash,
        first_name || '',
        last_name || '',
        role,
        roleSpecificData.department || null,
        roleSpecificData.title || null
      ]);

      const faculty = result.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        { id: faculty.id, email: faculty.email, role: faculty.role },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Faculty/Admin registered successfully',
        user: {
          id: faculty.id,
          email: faculty.email,
          first_name: faculty.first_name,
          last_name: faculty.last_name,
          role: faculty.role
        },
        token
      });
    } else {
      // Insert into users table (for alumni/mentors)
      const name = first_name && last_name ? `${first_name} ${last_name}` : (first_name || last_name || '');
      
      // Check if users table has role column
      const columnCheck = await query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'role'
      `);

      let result;
      if (columnCheck.rows.length > 0) {
        // Users table has role column
        result = await query(`
          INSERT INTO users (email, password, name, role)
          VALUES ($1, $2, $3, $4)
          RETURNING id, email, name, role, created_at
        `, [email, password_hash, name, role || 'alumni']);
      } else {
        // Users table doesn't have role column
        result = await query(`
          INSERT INTO users (email, password, name)
          VALUES ($1, $2, $3)
          RETURNING id, email, name, created_at
        `, [email, password_hash, name]);
      }

      const user = result.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role || 'alumni' },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'alumni'
        },
        token
      });
    }
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user',
      details: error.message
    });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

module.exports = router;
module.exports.authenticateToken = authenticateToken;
