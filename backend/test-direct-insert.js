/**
 * Direct database test - bypasses all middleware
 * Run: node test-direct-insert.js
 */

require('dotenv').config();
const pool = require('./config/db');

async function testDirectInsert() {
  try {
    console.log('🧪 Testing direct database insert...\n');
    
    // Test 1: Check connection
    console.log('1️⃣ Testing database connection...');
    const connectionTest = await pool.query('SELECT NOW()');
    console.log('   ✅ Connected:', connectionTest.rows[0].now);
    
    // Test 2: Check if students table exists
    console.log('\n2️⃣ Checking if students table exists...');
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'students'
      );
    `);
    console.log('   Table exists:', tableCheck.rows[0].exists);
    
    if (!tableCheck.rows[0].exists) {
      console.log('   ❌ Students table does not exist!');
      return;
    }
    
    // Test 3: Check current row count
    console.log('\n3️⃣ Checking current row count...');
    const countResult = await pool.query('SELECT COUNT(*) FROM students');
    console.log('   Current rows:', countResult.rows[0].count);
    
    // Test 4: Try direct insert
    console.log('\n4️⃣ Attempting direct insert...');
    const insertResult = await pool.query(`
      INSERT INTO students (name, email, password, major, grad_year)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING student_id, name, email, major
    `, [
      'Direct Test Student',
      'directtest@tamu.edu',
      'hashed_password_123',
      'Computer Science',
      2025
    ]);
    
    console.log('   ✅ Insert successful!');
    console.log('   Inserted student:', insertResult.rows[0]);
    
    // Test 5: Verify it was saved
    console.log('\n5️⃣ Verifying data was saved...');
    const verifyResult = await pool.query('SELECT * FROM students WHERE email = $1', ['directtest@tamu.edu']);
    console.log('   Found rows:', verifyResult.rows.length);
    if (verifyResult.rows.length > 0) {
      console.log('   ✅ Data verified:', verifyResult.rows[0]);
    } else {
      console.log('   ❌ Data not found!');
    }
    
    // Test 6: Check all students
    console.log('\n6️⃣ All students in database:');
    const allStudents = await pool.query('SELECT student_id, name, email, major FROM students');
    console.log('   Total students:', allStudents.rows.length);
    allStudents.rows.forEach((student, index) => {
      console.log(`   ${index + 1}. ${student.name} (${student.email}) - ${student.major}`);
    });
    
    console.log('\n✅ All tests completed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('   Code:', error.code);
    console.error('   Detail:', error.detail);
    console.error('   Stack:', error.stack);
    process.exit(1);
  }
}

testDirectInsert();

