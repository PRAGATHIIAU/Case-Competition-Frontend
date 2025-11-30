/**
 * Script to remove role-based logic from database
 * 1. Drops faculty table
 * 2. Removes role column from users table (if exists)
 * 3. Updates any constraints/indexes
 */

require('dotenv').config();
const pool = require('../config/db.cjs');

async function removeRoleBasedLogic() {
  try {
    console.log('🔄 Starting removal of role-based logic...\n');

    // Step 1: Drop faculty table
    console.log('📋 Step 1: Dropping faculty table...');
    try {
      await pool.query('DROP TABLE IF EXISTS faculty CASCADE');
      console.log('✅ Faculty table dropped successfully');
    } catch (err) {
      console.warn('⚠️  Warning dropping faculty table:', err.message);
    }

    // Step 2: Check if role column exists in users table
    console.log('\n📋 Step 2: Checking users table structure...');
    const columnCheck = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('Current users table columns:');
    columnCheck.rows.forEach(col => {
      console.log(`   ├─ ${col.column_name}: ${col.data_type}`);
    });

    // Step 3: Remove role column if it exists
    const hasRoleColumn = columnCheck.rows.some(col => col.column_name === 'role');
    if (hasRoleColumn) {
      console.log('\n📋 Step 3: Removing role column from users table...');
      try {
        // Drop any indexes on role column first
        await pool.query('DROP INDEX IF EXISTS idx_users_role');
        
        // Remove role column
        await pool.query('ALTER TABLE users DROP COLUMN IF EXISTS role');
        console.log('✅ Role column removed from users table');
      } catch (err) {
        console.error('❌ Error removing role column:', err.message);
        throw err;
      }
    } else {
      console.log('\n✅ Role column does not exist in users table (already removed)');
    }

    // Step 4: Verify final structure
    console.log('\n📋 Step 4: Verifying final users table structure...');
    const finalCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('\n✅ Final users table structure:');
    finalCheck.rows.forEach(col => {
      console.log(`   ├─ ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });

    console.log('\n✅ Role-based logic removal complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Update all controllers to use table-based identification');
    console.log('   2. Remove role checks from middleware');
    console.log('   3. Update frontend to not send role field');
    console.log('   4. Test signup and login for all user types');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error removing role-based logic:', error);
    console.error('   ├─ Error code:', error.code);
    console.error('   ├─ Error message:', error.message);
    process.exit(1);
  }
}

removeRoleBasedLogic();

