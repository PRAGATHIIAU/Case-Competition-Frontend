const eventService = require('../services/event.service');
const pool = require('../config/db'); // Import pool at top level

/**
 * Event Controller
 * Handles HTTP requests and responses for event endpoints
 */

/**
 * GET /events
 * Get all events
 */
const getAllEvents = async (req, res) => {
  try {
    // Import pool fresh to avoid any caching issues
    const pgPool = require('../config/db');
    
    // Verify pool is the pg Pool, not Sequelize
    if (!pgPool || typeof pgPool.query !== 'function') {
      console.error('❌ Pool is not a valid pg Pool:', typeof pgPool, pgPool?.constructor?.name);
      throw new Error('Database pool is not properly initialized');
    }
    
    // Verify it's a pg Pool instance
    if (pgPool.constructor.name !== 'Pool') {
      console.error('❌ Pool is not a pg Pool instance:', pgPool.constructor.name);
      throw new Error('Database pool is not a pg Pool instance');
    }
    
    console.log('📋 Fetching events from database...');
    const result = await pgPool.query(`
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

    console.log(`✅ Found ${result.rows ? result.rows.length : 0} events`);

    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      count: result.rows ? result.rows.length : 0,
      events: result.rows || [],
      data: result.rows || [], // Also include 'data' for compatibility
    });
  } catch (error) {
    console.error('❌ Get all events error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack?.substring(0, 500), // Limit stack trace
      code: error.code
    });
    
    // Return empty array on database errors (fallback to mock data on frontend)
    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      count: 0,
      events: [],
      data: [],
      warning: 'Database connection issue - returning empty array'
    });
  }
};

/**
 * GET /events/:id
 * Get event by ID
 */
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await eventService.getEventById(id);

    res.status(200).json({
      success: true,
      message: 'Event retrieved successfully',
      data: event,
    });
  } catch (error) {
    if (error.message === 'Event not found') {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: error.message,
      });
    }

    console.error('Get event by ID error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve event',
      error: error.message || 'An error occurred while retrieving event',
    });
  }
};

/**
 * POST /events
 * Create a new event
 */
const createEvent = async (req, res) => {
  try {
    const { title, description, event_type, date_time, location, capacity, organizer_id, skills_required } = req.body;

    console.log('📝 Creating event:', { title, event_type, date_time, organizer_id });

    if (!title || !date_time) {
      return res.status(400).json({
        success: false,
        message: 'Title and date_time are required',
        error: 'Title and date_time are required'
      });
    }

    // Import pool fresh to avoid any caching issues
    const pgPool = require('../config/db');
    
    // Verify pool is the pg Pool, not Sequelize
    if (!pgPool || typeof pgPool.query !== 'function') {
      console.error('❌ Pool is not a valid pg Pool:', typeof pgPool, pgPool?.constructor?.name);
      throw new Error('Database pool is not properly initialized');
    }

    // Insert event directly into PostgreSQL
    const result = await pgPool.query(`
      INSERT INTO events (title, description, event_type, date_time, location, capacity, organizer_id, skills_required)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      title,
      description || null,
      event_type || 'Workshop',
      date_time,
      location || null,
      capacity || null,
      organizer_id || null,
      skills_required || []
    ]);

    const newEvent = result.rows[0];
    console.log('✅ Event created in database:', newEvent.id);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: newEvent, // Also include 'event' for frontend compatibility
      data: newEvent,
    });
  } catch (error) {
    console.error('❌ Create event error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack?.substring(0, 500),
      code: error.code
    });
    
    res.status(400).json({
      success: false,
      message: 'Failed to create event',
      error: error.message || 'An error occurred while creating event',
    });
  }
};

/**
 * PUT /events/:id
 * Update an existing event
 */
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedEvent = await eventService.updateEvent(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent,
    });
  } catch (error) {
    if (error.message === 'Event not found') {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: error.message,
      });
    }

    console.error('Update event error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update event',
      error: error.message || 'An error occurred while updating event',
    });
  }
};

/**
 * DELETE /events/:id
 * Delete an event
 */
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await eventService.deleteEvent(id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    if (error.message === 'Event not found') {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: error.message,
      });
    }

    console.error('Delete event error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message || 'An error occurred while deleting event',
    });
  }
};

/**
 * POST /events/:id/register
 * Register alumni as judge for an event
 */
const registerAlumniAsJudge = async (req, res) => {
  try {
    const { id } = req.params;
    const { alumniEmail, alumniName, preferredDateTime, preferredLocation } = req.body;

    const result = await eventService.registerAlumniAsJudge(id, {
      alumniEmail,
      alumniName,
      preferredDateTime,
      preferredLocation,
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        eventId: result.eventId,
        eventTitle: result.eventTitle,
      },
    });
  } catch (error) {
    if (error.message === 'Event not found') {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: error.message,
      });
    }

    console.error('Register alumni as judge error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to register alumni as judge',
      error: error.message || 'An error occurred while registering',
    });
  }
};

/**
 * GET /events/:eventId/teams
 * Get teams for an event with total scores
 */
const getTeams = async (req, res) => {
  try {
    const { eventId } = req.params;

    const teams = await eventService.getTeams(eventId);

    res.status(200).json({
      success: true,
      message: 'Teams retrieved successfully',
      data: teams,
      count: teams.length,
    });
  } catch (error) {
    if (error.message === 'Event not found') {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: error.message,
      });
    }

    console.error('Get teams error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve teams',
      error: error.message || 'An error occurred while retrieving teams',
    });
  }
};

/**
 * GET /events/:eventId/rubrics
 * Get rubrics for an event
 */
const getRubrics = async (req, res) => {
  try {
    const { eventId } = req.params;

    const rubrics = await eventService.getRubrics(eventId);

    res.status(200).json({
      success: true,
      message: 'Rubrics retrieved successfully',
      data: rubrics,
      count: rubrics.length,
    });
  } catch (error) {
    if (error.message === 'Event not found') {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: error.message,
      });
    }

    console.error('Get rubrics error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve rubrics',
      error: error.message || 'An error occurred while retrieving rubrics',
    });
  }
};

/**
 * POST /events/:eventId/score
 * Submit scores for a team
 */
const submitScores = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { judgeId, teamId, scores } = req.body;

    if (!judgeId || !teamId || !scores) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        error: 'judgeId, teamId, and scores are required',
      });
    }

    const updatedEvent = await eventService.submitScores(eventId, judgeId, teamId, scores);

    res.status(200).json({
      success: true,
      message: 'Scores submitted successfully',
      data: updatedEvent,
    });
  } catch (error) {
    if (error.message === 'Event not found') {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: error.message,
      });
    }

    if (
      error.message.includes('Judge not found') ||
      error.message.includes('Judge is not approved') ||
      error.message.includes('Team not found') ||
      error.message.includes('Rubric') ||
      error.message.includes('exceeds maximum score')
    ) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: error.message,
      });
    }

    console.error('Submit scores error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to submit scores',
      error: error.message || 'An error occurred while submitting scores',
    });
  }
};

/**
 * GET /events/:eventId/leaderboard
 * Get leaderboard for an event
 */
const getLeaderboard = async (req, res) => {
  try {
    const { eventId } = req.params;

    const leaderboard = await eventService.getLeaderboard(eventId);

    res.status(200).json({
      success: true,
      message: 'Leaderboard retrieved successfully',
      data: leaderboard,
      count: leaderboard.length,
    });
  } catch (error) {
    if (error.message === 'Event not found') {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: error.message,
      });
    }

    console.error('Get leaderboard error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve leaderboard',
      error: error.message || 'An error occurred while retrieving leaderboard',
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerAlumniAsJudge,
  getTeams,
  getRubrics,
  submitScores,
  getLeaderboard,
};

