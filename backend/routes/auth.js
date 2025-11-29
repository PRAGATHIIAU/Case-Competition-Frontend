import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

const router = express.Router();

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, role, ...roleSpecificData } = req.body;

    if (!email || !password || !first_name || !last_name || !role) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, first_name, last_name, and role are required'
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Start transaction (in a real app, use proper transaction handling)
    // Create user
    const userResult = await query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, first_name, last_name, role, created_at
    `, [email, password_hash, first_name, last_name, role]);

    const user = userResult.rows[0];

    // Create role-specific record
    if (role === 'student') {
      await query(`
        INSERT INTO students (id, student_id, major, graduation_year, skills)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        user.id,
        roleSpecificData.student_id,
        roleSpecificData.major,
        roleSpecificData.graduation_year,
        roleSpecificData.skills || []
      ]);
    } else if (role === 'mentor') {
      await query(`
        INSERT INTO mentors (id, company, role, expertise, skills, availability)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        user.id,
        roleSpecificData.company,
        roleSpecificData.role,
        roleSpecificData.expertise,
        roleSpecificData.skills || [],
        roleSpecificData.availability || 'Available'
      ]);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      },
      token
    });
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
      error: 'Failed to register user'
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const result = await query(`
      SELECT id, email, password_hash, first_name, last_name, role
      FROM users
      WHERE email = $1
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login'
    });
  }
});

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
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

export default router;


