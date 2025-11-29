/**
 * Create event_rsvps table
 * This script creates the event_rsvps table for storing RSVPs
 */

require('dotenv').config();
const pool = require('../config/db');

const CREATE_EVENT_RSVPS_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS event_rsvps (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlist', 'cancelled')),
    rsvp_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
  );

  CREATE INDEX IF NOT EXISTS idx_event_rsvps_event ON event_rsvps(event_id);
  CREATE INDEX IF NOT EXISTS idx_event_rsvps_user ON event_rsvps(user_id);
`;

async function createEventRSVPsTable() {
  try {
    console.log('📋 Creating event_rsvps table...');
    
    await pool.query(CREATE_EVENT_RSVPS_TABLE_QUERY);
    
    console.log('✅ event_rsvps table created successfully!');
    
    // Verify table was created
    const checkTable = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'event_rsvps'
    `);
    
    if (checkTable.rows.length > 0) {
      console.log('✅ Verified: event_rsvps table exists');
      
      // Show table structure
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'event_rsvps'
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
    console.error('❌ Error creating event_rsvps table:', error);
    console.error('   ├─ Error code:', error.code);
    console.error('   ├─ Error message:', error.message);
    console.error('   └─ Full error:', error);
    process.exit(1);
  }
}

createEventRSVPsTable();

