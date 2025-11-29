const express = require('express');
const router = express.Router();
const helloController = require('../controllers/helloController');
const authRoutes = require('./auth.routes');
// Use event.routes.js which uses controllers (CommonJS compatible)
const eventRoutes = require('./event.routes');
const competitionRoutes = require('./competition.routes');
const studentRoutes = require('./student.routes');
const mentorRoutes = require('./mentor.routes');
const connectionRoutes = require('./connection.routes');
const notificationRoutes = require('./notification.routes');
const searchRoutes = require('./search.routes');
const adminRoutes = require('./admin.routes');

// Routes
router.get('/', helloController.getHello);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development'
  });
});

// Email configuration check endpoint
router.get('/api/email/check', (req, res) => {
  const emailConfig = require('../config/email');
  const hasConfig = !!emailConfig.EMAIL_CONFIG;
  
  res.json({
    success: true,
    emailConfigured: hasConfig,
    details: {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPassword: !!process.env.EMAIL_PASSWORD,
      hasFromEmail: !!process.env.FROM_EMAIL,
      emailUser: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***` : 'not set',
      fromEmail: process.env.FROM_EMAIL || 'not set',
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com (default)',
      smtpPort: process.env.SMTP_PORT || 587
    },
    message: hasConfig 
      ? 'Email is configured. RSVP emails should work.'
      : 'Email is NOT configured. Please set EMAIL_USER, EMAIL_PASSWORD, and FROM_EMAIL in your .env file. See QUICK_EMAIL_SETUP.md for instructions.'
  });
});

// API Routes
router.use('/api/auth', authRoutes);
router.use('/api/events', eventRoutes);
router.use('/api/competitions', competitionRoutes);
router.use('/api/students', studentRoutes);
router.use('/api/mentors', mentorRoutes);
router.use('/api', connectionRoutes);
router.use('/api', notificationRoutes);
router.use('/api', searchRoutes);

// Admin Routes
router.use('/admin', adminRoutes);

// API Info endpoint
router.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'CMIS Backend API',
    version: '1.0.0',
    availableRoutes: {
      health: 'GET /health',
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login'
      },
      events: {
        getAll: 'GET /api/events',
        create: 'POST /api/events'
      },
      students: {
        getAll: 'GET /api/students',
        getById: 'GET /api/students/:id'
      },
      mentors: {
        getAll: 'GET /api/mentors',
        getById: 'GET /api/mentors/:id',
        recommend: 'POST /api/mentors/recommend'
      },
      connections: {
        sendRequest: 'POST /api/send-request',
        myRequests: 'GET /api/my-requests',
        mentorRequests: 'GET /api/mentor/requests'
      },
      notifications: {
        getAll: 'GET /api/notifications',
        markRead: 'PUT /api/notifications/:id/read'
      },
      search: {
        global: 'GET /api/search?q=query'
      },
      admin: {
        login: 'POST /admin/login',
        profile: 'GET /admin/profile',
        students: 'GET /admin/students',
        alumni: 'GET /admin/alumni',
        events: 'GET /admin/events',
        updateEventStatus: 'PUT /admin/events/:id/status'
      }
    }
  });
});

module.exports = router;

