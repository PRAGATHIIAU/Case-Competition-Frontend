/**
 * Add is_participant column to users table
 * This column is used to identify faculty (false) vs admin (true)
 */

require('dotenv').config();
const pool = require('../config/db.cjs');

async function addParticipantColumn() {
  try {
    console.log('📝 Adding is_participant column to users table...');
    
    // Add the column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_participant BOOLEAN DEFAULT FALSE
    `);
    
    console.log('✅ Column added successfully');
    
    // Verify it exists
    const result = await pool.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'users' 
      AND column_name = 'is_participant'
    `);
    
    if (result.rows.length > 0) {
      console.log('\n📋 is_participant column in users table:');
      const row = result.rows[0];
      console.log(`  - ${row.column_name} (${row.data_type}, default: ${row.column_default})`);
    } else {
      console.log('\n⚠️ Column not found after creation');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding column:', error.message);
    process.exit(1);
  }
}

addParticipantColumn();
