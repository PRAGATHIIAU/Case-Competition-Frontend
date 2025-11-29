/**
 * Fix Students Table - Add missing columns
 * Adds skills and year columns if they don't exist
 */
require('dotenv').config();
const pool = require('../config/db');

async function fixStudentsTable() {
  try {
    console.log('🔄 Fixing students table...');
    
    // Check if skills column exists
    const checkSkills = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='students' AND column_name='skills'
    `);
    
    if (checkSkills.rows.length === 0) {
      console.log('   Adding skills column...');
      await pool.query(`
        ALTER TABLE students 
        ADD COLUMN skills TEXT[] DEFAULT ARRAY[]::TEXT[]
      `);
      console.log('   ✅ Skills column added.');
    } else {
      console.log('   ✅ Skills column already exists.');
    }
    
    // Check if year column exists
    const checkYear = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='students' AND column_name='year'
    `);
    
    if (checkYear.rows.length === 0) {
      console.log('   Adding year column...');
      await pool.query(`
        ALTER TABLE students 
        ADD COLUMN year VARCHAR(50)
      `);
      console.log('   ✅ Year column added.');
    } else {
      console.log('   ✅ Year column already exists.');
    }
    
    // Create indexes if they don't exist
    console.log('   Creating indexes...');
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_students_skills ON students USING GIN(skills)
      `);
      console.log('   ✅ Indexes created.');
    } catch (e) {
      console.log('   ⚠️  Indexes may already exist.');
    }
    
    console.log('\n✅ Students table fixed successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error fixing students table:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    await pool.end();
    process.exit(1);
  }
}

fixStudentsTable();



