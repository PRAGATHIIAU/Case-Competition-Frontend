/**
 * PostgreSQL Database Connection Pool
 * CommonJS wrapper for use in CommonJS modules
 */

require('dotenv').config();
const { Pool } = require('pg');

// Create PostgreSQL connection pool
// AWS RDS requires SSL - check if host contains 'rds.amazonaws.com' or 'amazonaws.com'
const isAWSRDS = process.env.DB_HOST && (
  process.env.DB_HOST.includes('rds.amazonaws.com') || 
  process.env.DB_HOST.includes('amazonaws.com')
);

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'case_competition_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  // AWS RDS requires SSL - enable it for RDS connections
  ssl: isAWSRDS || process.env.DB_SSL === 'true' 
    ? { rejectUnauthorized: false } 
    : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
});

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected successfully');
  }
});

module.exports = pool;

