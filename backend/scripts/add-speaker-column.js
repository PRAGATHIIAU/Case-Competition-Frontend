/**
 * Add willing_to_be_speaker column to users table
 * This is separate from willing_to_be_sponsor (sponsoring is different from speaking)
 */

require('dotenv').config();
const pool = require('../config/db.cjs');

async function addSpeakerColumn() {
  try {
    console.log('📝 Adding willing_to_be_speaker column to users table...');
    
    // Add the column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS willing_to_be_speaker BOOLEAN DEFAULT FALSE
    `);
    
    console.log('✅ Column added successfully');
    
    // Verify it exists
    const result = await pool.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'users' 
      AND column_name IN ('willing_to_be_mentor', 'willing_to_be_judge', 'willing_to_be_sponsor', 'willing_to_be_speaker')
      ORDER BY column_name
    `);
    
    console.log('\n📋 Willing columns in users table:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type}, default: ${row.column_default})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding column:', error.message);
    process.exit(1);
  }
}

addSpeakerColumn();

