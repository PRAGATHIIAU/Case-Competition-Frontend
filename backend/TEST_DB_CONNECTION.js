/**
 * Test Database Connection Script
 * Run this to verify your database connection is working
 * 
 * Usage: node TEST_DB_CONNECTION.js
 */

require('dotenv').config();
const pool = require('./config/db');

async function testConnection() {
  console.log('\n🔍 Testing Database Connection...\n');
  console.log('Connection Details:');
  console.log('  ├─ Host:', process.env.DB_HOST);
  console.log('  ├─ Port:', process.env.DB_PORT);
  console.log('  ├─ Database:', process.env.DB_NAME);
  console.log('  ├─ User:', process.env.DB_USER);
  console.log('  └─ Password:', process.env.DB_PASSWORD ? '***SET***' : 'NOT SET');
  console.log('');

  try {
    // Test basic connection
    console.log('📡 Attempting to connect...');
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('✅ Connection successful!');
    console.log('  ├─ Current time:', result.rows[0].current_time);
    console.log('  └─ PostgreSQL version:', result.rows[0].pg_version.split(',')[0]);
    
    // Check if events table exists
    console.log('\n📋 Checking tables...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`✅ Found ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach(row => {
      console.log(`  ├─ ${row.table_name}`);
    });
    
    // Check if competitions table exists
    const hasCompetitions = tablesResult.rows.some(row => row.table_name === 'competitions');
    if (!hasCompetitions) {
      console.log('\n⚠️  Competitions table does not exist. Creating it...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS competitions (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          start_date TIMESTAMP,
          end_date TIMESTAMP,
          deadline TIMESTAMP,
          max_team_size INTEGER DEFAULT 4,
          prize VARCHAR(255),
          status VARCHAR(50) DEFAULT 'active',
          required_expertise TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Competitions table created!');
    } else {
      console.log('\n✅ Competitions table exists');
    }
    
    // Check if events table exists
    const hasEvents = tablesResult.rows.some(row => row.table_name === 'events');
    if (hasEvents) {
      const eventsCount = await pool.query('SELECT COUNT(*) as count FROM events');
      console.log(`✅ Events table exists with ${eventsCount.rows[0].count} events`);
    } else {
      console.log('⚠️  Events table does not exist');
    }
    
    console.log('\n✅ All checks passed!');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === '28000') {
      console.error('\n💡 This is a password authentication error.');
      console.error('   Check your DB_PASSWORD in .env file');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.error('\n💡 This is a connection timeout error.');
      console.error('   Possible causes:');
      console.error('   1. RDS Security Group is blocking your IP');
      console.error('   2. Database host/port is incorrect');
      console.error('   3. Firewall is blocking the connection');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Could not resolve hostname.');
      console.error('   Check your DB_HOST in .env file');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
    console.log('\n🔌 Connection closed\n');
  }
}

// Run the test
testConnection();

