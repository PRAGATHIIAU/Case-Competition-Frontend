/**
 * Create Faculty/Admin Table Script
 * Creates the faculty table for faculty and admin users
 */

require('dotenv').config();
const pool = require('../config/db.cjs');

const CREATE_FACULTY_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS faculty (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('faculty', 'admin')),
    department VARCHAR(100),
    title VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_faculty_email ON faculty(email);
  CREATE INDEX IF NOT EXISTS idx_faculty_role ON faculty(role);
`;

async function createFacultyTable() {
  try {
    console.log('📋 Creating faculty table...');
    
    await pool.query(CREATE_FACULTY_TABLE_QUERY);
    
    console.log('✅ Faculty table created successfully!');
    
    // Verify table was created
    const checkTable = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'faculty'
    `);
    
    if (checkTable.rows.length > 0) {
      console.log('✅ Verified: faculty table exists');
      
      // Show table structure
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'faculty'
        ORDER BY ordinal_position
      `);
      
      console.log('\n📊 Table structure:');
      columns.rows.forEach(col => {
        console.log(`   ├─ ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
      });
    } else {
      console.error('❌ Table was not created!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating faculty table:', error);
    console.error('   ├─ Error code:', error.code);
    console.error('   ├─ Error message:', error.message);
    process.exit(1);
  }
}

createFacultyTable();

