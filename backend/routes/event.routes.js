const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');

/**
 * Event Routes
 * GET /api/events - Get all events
 * GET /api/events/:id - Get event by ID
 * POST /api/events - Create a new event
 * PUT /api/events/:id - Update an event
 * DELETE /api/events/:id - Delete an event
 * POST /api/events/:id/register - Register alumni as judge
 * GET /api/events/:eventId/teams - Get teams with total scores
 * GET /api/events/:eventId/rubrics - Get rubrics
 * POST /api/events/:eventId/score - Submit scores
 * GET /api/events/:eventId/leaderboard - Get leaderboard
 */

// GET /api/events
router.get('/', eventController.getAllEvents);

// POST /api/events
router.post('/', eventController.createEvent);

// Specific routes must come before generic :id route to avoid conflicts
// GET /api/events/:eventId/teams
router.get('/:eventId/teams', eventController.getTeams);

// GET /api/events/:eventId/rubrics
router.get('/:eventId/rubrics', eventController.getRubrics);

// GET /api/events/:eventId/leaderboard
router.get('/:eventId/leaderboard', eventController.getLeaderboard);

// POST /api/events/:eventId/score
router.post('/:eventId/score', eventController.submitScores);

// POST /api/events/:id/register
router.post('/:id/register', eventController.registerAlumniAsJudge);

// POST /api/events/:id/rsvp - RSVP to event (with email confirmation)
router.post('/:id/rsvp', async (req, res) => {
  console.log('\n🎯 ========== RSVP REQUEST RECEIVED ==========');
  console.log('📥 Request details:');
  console.log('   ├─ Event ID:', req.params.id);
  console.log('   ├─ User ID:', req.body.user_id);
  console.log('   ├─ Full body:', JSON.stringify(req.body, null, 2));
  console.log('   └─ Headers:', JSON.stringify(req.headers, null, 2));
  
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      console.error('❌ Missing user_id in request body');
      return res.status(400).json({
        success: false,
        error: 'user_id is required'
      });
    }
    
    console.log('✅ user_id validated:', user_id);

    const pool = require('../config/db');
    const { sendRSVPConfirmation } = require('../services/email.service');

    console.log('🔍 Checking if already RSVP\'d...');
    // Check if already RSVP'd
    const existing = await pool.query(`
      SELECT id, status FROM event_rsvps
      WHERE event_id = $1 AND user_id = $2
    `, [id, user_id]);
    
    console.log('   └─ Existing RSVP check result:', existing.rows.length > 0 ? 'Already RSVP\'d' : 'Not RSVP\'d yet');

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Already RSVP\'d to this event'
      });
    }

    // Get user details (email and name)
    // Check both students table and users table (table-based identification, no role column)
    let user = null;
    let studentEmail = null;
    let studentName = null;
    
    // First check students table
    const studentResult = await pool.query(`
      SELECT email, name FROM students WHERE student_id = $1
    `, [user_id]);
    
    if (studentResult.rows.length > 0) {
      user = studentResult.rows[0];
      studentEmail = user.email;
      studentName = user.name || 'Student';
      console.log('👤 User found in students table');
    } else {
      // If not in students table, check users table (alumni/mentors)
      const userResult = await pool.query(`
        SELECT email, name FROM users WHERE id = $1
      `, [user_id]);
      
      if (userResult.rows.length > 0) {
        user = userResult.rows[0];
        studentEmail = user.email;
        studentName = user.name || 'User';
        console.log('👤 User found in users table');
      }
    }

    if (!user) {
      console.error('❌ User not found in students or users table');
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    console.log('👤 User found:');
    console.log('   ├─ Email:', studentEmail);
    console.log('   └─ Name:', studentName);

    console.log('📅 Fetching event details...');
    // Get event details
    const eventResult = await pool.query(`
      SELECT title, date, location, description
      FROM events
      WHERE id = $1
    `, [id]);
    
    console.log('   └─ Event found:', eventResult.rows.length > 0 ? 'Yes' : 'No');

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    const event = eventResult.rows[0];
    
    console.log('📋 Event details:');
    console.log('   ├─ Title:', event.title);
    console.log('   ├─ Date:', event.date_time);
    console.log('   └─ Location:', event.location);

    console.log('💾 Creating RSVP in database...');
    // Create RSVP
    const result = await pool.query(`
      INSERT INTO event_rsvps (event_id, user_id, status)
      VALUES ($1, $2, 'confirmed')
      RETURNING *
    `, [id, user_id]);
    
    console.log('✅ RSVP created in database:', result.rows[0].id);

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
        eventDate: event.date,
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

    console.log('📤 Sending response:');
    console.log('   ├─ Success:', true);
    console.log('   ├─ Email sent:', emailSent);
    console.log('   ├─ Email address:', studentEmail);
    console.log('   └─ Message:', message);
    console.log('✅ ========== RSVP REQUEST COMPLETE ==========\n');

    res.status(201).json({
      success: true,
      message: message,
      emailSent: emailSent,
      email: studentEmail,
      emailError: emailError || null,
      rsvp: result.rows[0]
    });
  } catch (error) {
    console.error('\n❌ ========== RSVP ERROR ==========');
    console.error('Error creating RSVP:', error);
    console.error('Error stack:', error.stack);
    console.error('Request params:', req.params);
    console.error('Request body:', req.body);
    console.error('❌ ========== END ERROR ==========\n');
    res.status(500).json({
      success: false,
      error: 'Failed to RSVP to event',
      details: error.message
    });
  }
});

// Generic routes (must come after specific routes)
// GET /api/events/:id
router.get('/:id', eventController.getEventById);

// PUT /api/events/:id
router.put('/:id', eventController.updateEvent);

// DELETE /api/events/:id
router.delete('/:id', eventController.deleteEvent);

module.exports = router;

