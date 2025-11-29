/**
 * Migration Script: Add is_participant Column
 * Adds is_participant boolean column to users table
 */

require('dotenv').config();
const pool = require('../config/db');

async function addParticipantColumn() {
  try {
    console.log('🔄 Adding is_participant column to users table...');
    console.log('📊 Database:', process.env.DB_NAME || 'alumni_portal');
    console.log('📊 Host:', process.env.DB_HOST || 'localhost');

    // Check if column already exists
    const checkResult = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='users' AND column_name='is_participant'
    `);

    if (checkResult.rows.length > 0) {
      console.log('✅ Column is_participant already exists!');
      process.exit(0);
    }

    // Add the column
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN is_participant BOOLEAN DEFAULT FALSE NOT NULL;
    `);

    console.log('✅ Successfully added is_participant column!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('   Code:', error.code);
    if (error.detail) {
      console.error('   Detail:', error.detail);
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

addParticipantColumn();

