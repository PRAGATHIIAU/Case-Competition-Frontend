/**
 * Add role and skills columns to existing users table
 * Run this if your users table doesn't have role/skills columns
 */
require('dotenv').config();
const pool = require('../config/db');

async function addRoleColumn() {
  try {
    console.log('🔄 Adding role and skills columns to users table...');
    
    // Check if role column exists
    const checkRole = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='role'
    `);
    
    if (checkRole.rows.length === 0) {
      console.log('   Adding role column...');
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN role VARCHAR(50) DEFAULT 'student' 
        CHECK (role IN ('student', 'mentor', 'alumni', 'faculty', 'admin', 'judge', 'guest_speaker'))
      `);
      console.log('   ✅ Role column added.');
    } else {
      console.log('   ✅ Role column already exists.');
    }
    
    // Check if skills column exists
    const checkSkills = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='skills'
    `);
    
    if (checkSkills.rows.length === 0) {
      console.log('   Adding skills column...');
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN skills TEXT[] DEFAULT ARRAY[]::TEXT[]
      `);
      console.log('   ✅ Skills column added.');
    } else {
      console.log('   ✅ Skills column already exists.');
    }
    
    // Create indexes if they don't exist
    console.log('   Creating indexes...');
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)
      `);
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_users_skills ON users USING GIN(skills)
      `);
      console.log('   ✅ Indexes created.');
    } catch (e) {
      console.log('   ⚠️  Indexes may already exist.');
    }
    
    console.log('\n✅ Users table updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error updating users table:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    process.exit(1);
  }
}

addRoleColumn();
