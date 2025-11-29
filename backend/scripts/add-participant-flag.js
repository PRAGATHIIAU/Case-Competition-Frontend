/**
 * Migration Script: Add is_participant Column
 * Adds is_participant boolean column to users table for student assistants
 */

require('dotenv').config();
const pool = require('../config/db');

async function addParticipantFlag() {
  try {
    console.log('🔄 Adding is_participant column to users table...');

    // Check if column already exists
    const checkColumn = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='users' AND column_name='is_participant'
    `);

    if (checkColumn.rows.length === 0) {
      // Add is_participant column
      await pool.query(`
        ALTER TABLE users
        ADD COLUMN is_participant BOOLEAN DEFAULT FALSE NOT NULL;
      `);
      console.log('✅ Added is_participant column');
    } else {
      console.log('✅ is_participant column already exists');
    }

    // Create index for better query performance
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_users_is_participant ON users(is_participant);
      `);
      console.log('✅ Created index on is_participant');
    } catch (e) {
      console.log('⚠️  Index may already exist');
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n💡 Usage:');
    console.log('   - Set is_participant = true for student assistants (admins who are also participants)');
    console.log('   - Student assistants will have limited access (cannot see judge comments/scores)');
    console.log('   - Full admins (is_participant = false) have full access like faculty');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Ensure the pool is closed
    if (pool) {
      await pool.end();
    }
  }
}

addParticipantFlag();



