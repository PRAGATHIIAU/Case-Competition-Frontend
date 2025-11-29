/**
 * Create Competitions Table Script
 * Creates the competitions table if it doesn't exist
 * Compatible with both UUID and SERIAL ID systems
 */

const pool = require('../config/db');
require('dotenv').config();

async function createCompetitionsTable() {
  try {
    console.log('📋 Creating competitions table...');
    
    // Check if table exists
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'competitions'
      );
    `);
    
    if (checkTable.rows[0].exists) {
      console.log('✅ Competitions table already exists');
      return;
    }
    
    // Create table with SERIAL ID (compatible with existing routes)
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
    
    console.log('✅ Competitions table created successfully');
    
    // Create index
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_competitions_status ON competitions(status);
      CREATE INDEX IF NOT EXISTS idx_competitions_start_date ON competitions(start_date);
    `);
    
    console.log('✅ Indexes created');
    
  } catch (error) {
    console.error('❌ Error creating competitions table:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  createCompetitionsTable()
    .then(() => {
      console.log('✅ Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = createCompetitionsTable;

