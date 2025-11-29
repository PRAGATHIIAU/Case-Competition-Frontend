/**
 * Migration Script: Add Unified Identity Columns
 * Adds isMentor, isJudge, isSpeaker boolean columns to users table
 */

const pool = require('../config/db.js');

async function addUnifiedIdentityColumns() {
  try {
    console.log('🔄 Adding unified identity columns to users table...');

    // Add isMentor column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_mentor BOOLEAN DEFAULT false NOT NULL;
    `);
    console.log('✅ Added is_mentor column');

    // Add isJudge column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_judge BOOLEAN DEFAULT false NOT NULL;
    `);
    console.log('✅ Added is_judge column');

    // Add isSpeaker column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_speaker BOOLEAN DEFAULT false NOT NULL;
    `);
    console.log('✅ Added is_speaker column');

    console.log('✅ Migration completed successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

addUnifiedIdentityColumns();

