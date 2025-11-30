// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const config = require('./config/server');
const routes = require('./routes');

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:3000', 'http://localhost:3003'];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API route not found',
    method: req.method,
    path: req.originalUrl,
    availableRoutes: [
      'GET /',
      'GET /health',
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'GET /api/events',
      'POST /api/events',
      'GET /api/students',
      'GET /api/mentors',
      'POST /api/mentors/recommend',
      'POST /api/send-request',
      'GET /api/my-requests',
      'GET /api/notifications',
      'GET /api/search',
      'POST /admin/login',
      'GET /admin/profile',
      'GET /admin/students',
      'GET /admin/alumni',
      'GET /admin/events'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server is running on port ${config.port} in ${config.env} mode`);
  console.log(`📊 Health check: http://localhost:${config.port}/health`);
  console.log(`📚 API info: http://localhost:${config.port}/api`);
});

