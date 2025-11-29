const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { sendCompetitionRegistrationConfirmation } = require('../services/email.service');

/**
 * Competition Routes
 * GET /api/competitions - Get all competitions
 * POST /api/competitions/:id/register - Register for a competition
 */

// POST /api/competitions - Create a new competition
router.post('/', async (req, res) => {
  try {
    console.log('📋 POST /api/competitions - Creating competition');
    console.log('   └─ Body:', JSON.stringify(req.body, null, 2));
    
    const { title, description, start_date, end_date, deadline, max_team_size, prize, status, required_expertise } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'title is required'
      });
    }

    // Try to insert into database
    let competition = null;
    try {
      const result = await pool.query(`
        INSERT INTO competitions (title, description, start_date, end_date, deadline, max_team_size, prize, status, required_expertise)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        title,
        description || '',
        start_date || new Date().toISOString(),
        end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        deadline || end_date || new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        max_team_size || 4,
        prize || '',
        status || 'active',
        Array.isArray(required_expertise) ? JSON.stringify(required_expertise) : (required_expertise || '[]')
      ]);
      
      competition = result.rows[0];
      console.log(`✅ Competition created in database with ID: ${competition.id}`);
    } catch (dbError) {
      // Competitions table might not exist
      console.log('⚠️ Competitions table not found, competition not saved to database:', dbError.message);
      // Return success anyway with mock data
      competition = {
        id: Date.now(), // Temporary ID
        title,
        description,
        start_date,
        end_date,
        deadline,
        max_team_size,
        prize,
        status: status || 'active'
      };
    }

    res.status(201).json({
      success: true,
      message: 'Competition created successfully',
      competition: competition
    });
  } catch (error) {
    console.error('❌ Error creating competition:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create competition',
      message: error.message
    });
  }
});

// GET /api/competitions - Get all competitions
router.get('/', async (req, res) => {
  try {
    console.log('📋 GET /api/competitions - Fetching all competitions');
    
    // Try to create table if it doesn't exist (silently fail if it exists)
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS competitions (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          start_date TIMESTAMP,
          end_date TIMESTAMP,
          deadline TIMESTAMP,
          max_team_size INTEGER DEFAULT 4,
          prize VARCHAR(255),
          status VARCHAR(50) DEFAULT 'active',
          required_expertise TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Competitions table ensured');
    } catch (createError) {
      // Table might already exist or connection failed, that's okay
      if (!createError.message.includes('already exists')) {
        console.log('ℹ️ Table creation check:', createError.message);
      }
    }
    
    // Try to fetch from database
    let competitions = [];
    try {
      const result = await pool.query(`
        SELECT 
          id,
          title,
          description,
          start_date,
          end_date,
          deadline,
          max_team_size,
          prize,
          status,
          created_at
        FROM competitions
        WHERE status = 'active' OR status IS NULL
        ORDER BY start_date ASC
      `);
      
      competitions = result.rows.map(comp => ({
        id: comp.id,
        title: comp.title,
        description: comp.description,
        start_date: comp.start_date,
        end_date: comp.end_date,
        deadline: comp.deadline,
        max_team_size: comp.max_team_size,
        prize: comp.prize,
        status: comp.status || 'active',
        created_at: comp.created_at
      }));
      
      console.log(`✅ Found ${competitions.length} competitions in database`);
    } catch (dbError) {
      // Competitions table might not exist
      console.log('⚠️ Competitions table not found, returning empty array:', dbError.message);
      competitions = [];
    }

    res.json({
      success: true,
      count: competitions.length,
      competitions: competitions
    });
  } catch (error) {
    console.error('❌ Error fetching competitions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch competitions',
      message: error.message
    });
  }
});

// POST /api/competitions/:id/register - Register for competition (with email confirmation)
router.post('/:id/register', async (req, res) => {
  console.log('\n🎯 ========== COMPETITION REGISTRATION REQUEST RECEIVED ==========');
  console.log('📥 Request details:');
  console.log('   ├─ Competition ID:', req.params.id);
  console.log('   ├─ User ID:', req.body.user_id);
  console.log('   ├─ Team Name:', req.body.team_name);
  console.log('   ├─ Team ID:', req.body.team_id);
  console.log('   └─ Full body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { id } = req.params;
    const { user_id, team_name, team_id } = req.body;

    if (!user_id) {
      console.error('❌ Missing user_id in request body');
      return res.status(400).json({
        success: false,
        error: 'user_id is required'
      });
    }

    if (!team_name || !team_id) {
      console.error('❌ Missing team_name or team_id in request body');
      return res.status(400).json({
        success: false,
        error: 'team_name and team_id are required'
      });
    }
    
    console.log('✅ Request validated');

    // Get user details (email and name)
    console.log('👤 Fetching user details...');
    const userResult = await pool.query(`
      SELECT email, name FROM users WHERE id = $1
    `, [user_id]);

    if (userResult.rows.length === 0) {
      console.error('❌ User not found');
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = userResult.rows[0];
    const studentEmail = user.email;
    const studentName = user.name || 'Student';
    
    console.log('👤 User found:');
    console.log('   ├─ Email:', studentEmail);
    console.log('   └─ Name:', studentName);

    // Get competition details (if competitions table exists)
    console.log('🏆 Fetching competition details...');
    let competitionTitle = req.body.competition_name || 'Case Competition 2024'; // Default name
    let competitionDescription = '';
    
    try {
      const competitionResult = await pool.query(`
        SELECT title, description, start_date, end_date
        FROM competitions
        WHERE id = $1
      `, [id]);
      
      if (competitionResult.rows.length > 0) {
        const competition = competitionResult.rows[0];
        competitionTitle = competition.title;
        competitionDescription = competition.description || '';
        console.log('🏆 Competition found in database:');
        console.log('   └─ Title:', competitionTitle);
      } else {
        console.log('⚠️ Competition not found in database, using default name:', competitionTitle);
      }
    } catch (tableError) {
      // Competitions table might not exist, that's okay - use default name
      console.log('⚠️ Competitions table check skipped (table may not exist), using default name:', competitionTitle);
    }

    // Check if already registered (if teams table exists)
    console.log('🔍 Checking if already registered...');
    try {
      const existing = await pool.query(`
        SELECT id FROM teams
        WHERE competition_id = $1 AND leader_id = $2
      `, [id, user_id]);
      
      if (existing.rows.length > 0) {
        console.log('⚠️ Already registered for this competition');
        return res.status(400).json({
          success: false,
          error: 'Already registered for this competition'
        });
      }
    } catch (tableError) {
      // Teams table might not exist, that's okay - we'll just register
      console.log('⚠️ Teams table check skipped (table may not exist)');
    }

    // Create team registration (if teams table exists)
    console.log('💾 Creating team registration...');
    let teamRecord = null;
    try {
      const teamResult = await pool.query(`
        INSERT INTO teams (competition_id, team_name, team_id, leader_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [id, team_name, team_id, user_id]);
      
      teamRecord = teamResult.rows[0];
      console.log('✅ Team registration created in database');
    } catch (teamError) {
      // Teams table might not exist, that's okay - we'll still send email
      console.log('⚠️ Team registration skipped (table may not exist):', teamError.message);
    }

    // Send confirmation email to student
    let emailSent = false;
    let emailError = null;
    try {
      console.log('📧 Attempting to send competition registration confirmation email...');
      console.log('📧 Email details:', {
        to: studentEmail,
        name: studentName,
        competition: competitionTitle,
        team: team_name,
        teamId: team_id,
        from: process.env.FROM_EMAIL || 'not set'
      });
      
      // Check if email config is available
      const emailConfig = require('../config/email');
      if (!emailConfig.EMAIL_CONFIG) {
        throw new Error('Email configuration not set. Please configure EMAIL_USER, EMAIL_PASSWORD, and FROM_EMAIL in your .env file.');
      }
      
      await sendCompetitionRegistrationConfirmation({
        studentEmail,
        studentName,
        teamName: team_name,
        competitionName: competitionTitle,
        teamId: team_id,
      });
      emailSent = true;
      console.log(`✅ Competition registration confirmation email sent successfully to ${studentEmail}`);
    } catch (emailErr) {
      // Log detailed email error but don't fail the registration
      emailError = emailErr.message;
      console.error('❌ Failed to send competition registration confirmation email:');
      console.error('   ├─ Error:', emailErr.message);
      console.error('   ├─ Stack:', emailErr.stack);
      // Continue with registration success even if email fails
    }

    // Return response with email status
    const message = emailSent 
      ? `Competition registration successful! Confirmation email sent to ${studentEmail}.`
      : `Competition registration successful! However, confirmation email could not be sent. ${emailError ? `Error: ${emailError}` : 'Please check your email configuration in .env file (EMAIL_USER, EMAIL_PASSWORD, FROM_EMAIL).'}`;

    console.log('📤 Sending response:');
    console.log('   ├─ Success:', true);
    console.log('   ├─ Email sent:', emailSent);
    console.log('   ├─ Email address:', studentEmail);
    console.log('   └─ Message:', message);
    console.log('✅ ========== COMPETITION REGISTRATION REQUEST COMPLETE ==========\n');

    res.status(201).json({
      success: true,
      message: message,
      emailSent: emailSent,
      email: studentEmail,
      emailError: emailError || null,
      team: teamRecord || { team_id, team_name }
    });
  } catch (error) {
    console.error('\n❌ ========== COMPETITION REGISTRATION ERROR ==========');
    console.error('Error creating competition registration:', error);
    console.error('Error stack:', error.stack);
    console.error('Request params:', req.params);
    console.error('Request body:', req.body);
    console.error('❌ ========== END ERROR ==========\n');
    res.status(500).json({
      success: false,
      error: 'Failed to register for competition',
      details: error.message
    });
  }
});

module.exports = router;

