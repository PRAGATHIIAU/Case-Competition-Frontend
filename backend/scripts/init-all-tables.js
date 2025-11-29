/**
 * Initialize all database tables
 * Run this script once to create all tables in your PostgreSQL database
 * 
 * Usage: node scripts/init-all-tables.js
 */

require('dotenv').config();
const pool = require('../config/db');
const { CREATE_TABLE_QUERY } = require('../models/user.model');
const { CREATE_TABLE_QUERY: CREATE_STUDENTS_TABLE_QUERY } = require('../models/student.model');
const { CREATE_MENTORS_TABLE_QUERY } = require('../models/mentor.model');
const { CREATE_CONNECTIONS_TABLE_QUERY } = require('../models/connection.model');
const { CREATE_NOTIFICATIONS_TABLE_QUERY } = require('../models/notification.model');
const { CREATE_EVENTS_TABLE_QUERY } = require('../models/event.model');
const { CREATE_LECTURES_TABLE_QUERY } = require('../models/lecture.model');

async function initializeAllTables() {
  try {
    console.log('🔄 Initializing all database tables...');
    console.log('📊 Database:', process.env.DB_NAME || 'alumni_portal');
    console.log('');
    
    // Create users table (for alumni, mentors, judges)
    console.log('1️⃣ Creating users table...');
    await pool.query(CREATE_TABLE_QUERY);
    console.log('   ✅ Users table created.');
    
    // Create students table (for students - separate table)
    console.log('2️⃣ Creating students table...');
    await pool.query(CREATE_STUDENTS_TABLE_QUERY);
    console.log('   ✅ Students table created.');
    
    // Create mentors table (extends users)
    console.log('3️⃣ Creating mentors table...');
    await pool.query(CREATE_MENTORS_TABLE_QUERY);
    console.log('   ✅ Mentors table created.');
    
    // Create connection_requests table
    console.log('4️⃣ Creating connection_requests table...');
    await pool.query(CREATE_CONNECTIONS_TABLE_QUERY);
    console.log('   ✅ Connection requests table created.');
    
    // Create notifications table
    console.log('5️⃣ Creating notifications table...');
    await pool.query(CREATE_NOTIFICATIONS_TABLE_QUERY);
    console.log('   ✅ Notifications table created.');
    
    // Create events table
    console.log('6️⃣ Creating events table...');
    await pool.query(CREATE_EVENTS_TABLE_QUERY);
    console.log('   ✅ Events table created.');
    
    // Create lectures table
    console.log('7️⃣ Creating lectures table...');
    await pool.query(CREATE_LECTURES_TABLE_QUERY);
    console.log('   ✅ Lectures table created.');
    
    console.log('\n✅ All database tables initialized successfully!');
    console.log('\n📊 Tables created:');
    console.log('   ✓ users (alumni, mentors, judges, faculty, admin) - with role field');
    console.log('   ✓ students (students) - separate table');
    console.log('   ✓ mentors (extends users)');
    console.log('   ✓ connection_requests');
    console.log('   ✓ notifications');
    console.log('   ✓ events');
    console.log('   ✓ lectures');
    console.log('\n💡 You can now add data and it will be saved to PostgreSQL!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error initializing database:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    if (error.detail) {
      console.error('   Detail:', error.detail);
    }
    console.error('\n💡 Make sure:');
    console.error('   1. PostgreSQL is running');
    console.error('   2. Database "alumni_portal" exists');
    console.error('   3. .env file has correct credentials');
    process.exit(1);
  }
}

// Run initialization
initializeAllTables();


