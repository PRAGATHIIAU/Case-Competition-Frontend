import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pool = require('../config/db');
const { sendRSVPConfirmation } = require('../services/email.service.js');

// Create query helper function
const query = async (text, params) => {
  const result = await pool.query(text, params);
  return result;
};

const router = express.Router();

// GET /api/events - Get all events
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        e.*,
        u.first_name || ' ' || u.last_name as organizer_name,
        COUNT(er.id) as rsvp_count
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      LEFT JOIN event_rsvps er ON e.id = er.event_id AND er.status = 'confirmed'
      GROUP BY e.id, u.first_name, u.last_name
      ORDER BY e.date_time ASC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      events: result.rows
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
});

// POST /api/events - Create new event
router.post('/', async (req, res) => {
  try {
    const { title, description, event_type, date_time, location, capacity, organizer_id, skills_required } = req.body;

    if (!title || !date_time) {
      return res.status(400).json({
        success: false,
        error: 'Title and date_time are required'
      });
    }

    const result = await query(`
      INSERT INTO events (title, description, event_type, date_time, location, capacity, organizer_id, skills_required)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [title, description, event_type, date_time, location, capacity, organizer_id, skills_required || []]);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create event'
    });
  }
});

// POST /api/events/:id/rsvp - RSVP to event
router.post('/:id/rsvp', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id is required'
      });
    }

    // Check if already RSVP'd
    const existing = await query(`
      SELECT id, status FROM event_rsvps
      WHERE event_id = $1 AND user_id = $2
    `, [id, user_id]);

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Already RSVP\'d to this event'
      });
    }

    // Get user details (email and name)
    const userResult = await query(`
      SELECT email, name FROM users WHERE id = $1
      UNION
      SELECT email, name FROM students WHERE student_id = $1
    `, [user_id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = userResult.rows[0];
    const studentEmail = user.email;
    const studentName = user.name || 'Student';

    // Get event details
    const eventResult = await query(`
      SELECT title, date_time, location, description
      FROM events
      WHERE id = $1
    `, [id]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    const event = eventResult.rows[0];

    // Create RSVP
    const result = await query(`
      INSERT INTO event_rsvps (event_id, user_id, status)
      VALUES ($1, $2, 'confirmed')
      RETURNING *
    `, [id, user_id]);

    // Send confirmation email to student
    let emailSent = false;
    let emailError = null;
    try {
      console.log('📧 Attempting to send RSVP confirmation email...');
      console.log('📧 Email details:', {
        to: studentEmail,
        name: studentName,
        event: event.title,
        from: process.env.FROM_EMAIL || 'not set'
      });
      
      // Check if email config is available
      const emailConfig = require('../config/email');
      if (!emailConfig.EMAIL_CONFIG) {
        throw new Error('Email configuration not set. Please configure EMAIL_USER, EMAIL_PASSWORD, and FROM_EMAIL in your .env file.');
      }
      
      await sendRSVPConfirmation({
        studentEmail,
        studentName,
        eventTitle: event.title,
        eventDate: event.date_time,
        eventLocation: event.location,
        eventDescription: event.description || '',
      });
      emailSent = true;
      console.log(`✅ RSVP confirmation email sent successfully to ${studentEmail}`);
    } catch (emailErr) {
      // Log detailed email error but don't fail the RSVP
      emailError = emailErr.message;
      console.error('❌ Failed to send RSVP confirmation email:');
      console.error('   ├─ Error:', emailErr.message);
      console.error('   ├─ Stack:', emailErr.stack);
      console.error('   ├─ Email config check:', {
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPassword: !!process.env.EMAIL_PASSWORD,
        hasFromEmail: !!process.env.FROM_EMAIL,
        emailUser: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***` : 'not set'
      });
      // Continue with RSVP success even if email fails
    }

    // Return response with email status
    const message = emailSent 
      ? `RSVP successful! Confirmation email sent to ${studentEmail}.`
      : `RSVP successful! However, confirmation email could not be sent. ${emailError ? `Error: ${emailError}` : 'Please check your email configuration in .env file (EMAIL_USER, EMAIL_PASSWORD, FROM_EMAIL).'}`;

    res.status(201).json({
      success: true,
      message: message,
      emailSent: emailSent,
      email: studentEmail,
      emailError: emailError || null,
      rsvp: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating RSVP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to RSVP to event'
    });
  }
});

export default router;


