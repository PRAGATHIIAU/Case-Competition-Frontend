/**
 * Check if is_participant column exists
 */
require('dotenv').config();
const pool = require('../config/db');

async function checkColumn() {
  try {
    console.log('🔍 Checking if is_participant column exists...');
    const result = await pool.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name='users' AND column_name='is_participant'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Column EXISTS:', result.rows[0]);
    } else {
      console.log('❌ Column DOES NOT EXIST');
      console.log('💡 Run: node scripts/add-participant-flag.js');
    }
    
    // Also check all columns in users table
    const allColumns = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name='users'
      ORDER BY ordinal_position
    `);
    console.log('\n📋 All columns in users table:');
    allColumns.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

checkColumn();
