/**
 * Database Seeding Script for PostgreSQL
 * Populates database with demo users, events, and competitions
 * 
 * Usage: node seed.js
 */
require('dotenv').config();
const pool = require('./config/db');
const bcrypt = require('bcrypt');

async function seed() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    console.log('📊 Database:', process.env.DB_NAME || 'alumni_portal');
    console.log('');
    
    // Start transaction
    await client.query('BEGIN');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await client.query('DELETE FROM lectures');
    await client.query('DELETE FROM events');
    await client.query('DELETE FROM connection_requests');
    await client.query('DELETE FROM notifications');
    await client.query('DELETE FROM mentors');
    await client.query('DELETE FROM students');
    await client.query('DELETE FROM users');
    console.log('   ✅ All tables cleared');
    
    // Hash password for all users
    const hashedPassword = await bcrypt.hash('123456', 10);
    console.log('🔐 Password hashed for all users');
    console.log('');
    
    // Create Users
    console.log('👥 Creating users...');
    
    // 1. Student
    const studentResult = await client.query(`
      INSERT INTO users (name, email, password, role, skills, contact)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, name, role
    `, ['Jane Doe', 'student@test.com', hashedPassword, 'student', ['JavaScript', 'Python', 'React'], '123-456-7890']);
    const student = studentResult.rows[0];
    console.log('   ✅ Created Student:', student.email, '(ID:', student.id + ')');
    
    // Create student record
    await client.query(`
      INSERT INTO students (name, email, password, major, grad_year, skills)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, ['Jane Doe', 'student@test.com', hashedPassword, 'CS', 2025, ['JavaScript', 'Python', 'React']]);
    
    // 2. Mentor
    const mentorResult = await client.query(`
      INSERT INTO users (name, email, password, role, skills, contact)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, name, role
    `, ['Dr. Smith', 'mentor@test.com', hashedPassword, 'mentor', ['Machine Learning', 'Data Science', 'Leadership'], '234-567-8901']);
    const mentor = mentorResult.rows[0];
    console.log('   ✅ Created Mentor:', mentor.email, '(ID:', mentor.id + ')');
    
    // Create mentor record
    await client.query(`
      INSERT INTO mentors (id, company, role, expertise, skills, availability)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [mentor.id, 'Google', 'Senior Engineer', 'AI, Cloud Computing', ['Machine Learning', 'Data Science', 'Leadership'], 'Available']);
    
    // 3. Alumni
    const alumniResult = await client.query(`
      INSERT INTO users (name, email, password, role, skills, contact)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, name, role
    `, ['Alice Alum', 'alumni@test.com', hashedPassword, 'alumni', ['Software Engineering', 'System Design'], '345-678-9012']);
    const alumni = alumniResult.rows[0];
    console.log('   ✅ Created Alumni:', alumni.email, '(ID:', alumni.id + ')');
    
    // 4. Admin
    const adminResult = await client.query(`
      INSERT INTO users (name, email, password, role, skills)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, name, role
    `, ['Super Admin', 'admin@test.com', hashedPassword, 'admin', ['Administration', 'Management']]);
    const admin = adminResult.rows[0];
    console.log('   ✅ Created Admin:', admin.email, '(ID:', admin.id + ')');
    
    // 5. Faculty
    const facultyResult = await client.query(`
      INSERT INTO users (name, email, password, role, skills, contact)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, name, role
    `, ['Prof. X', 'faculty@test.com', hashedPassword, 'faculty', ['Teaching', 'Research', 'Academic Writing'], '456-789-0123']);
    const faculty = facultyResult.rows[0];
    console.log('   ✅ Created Faculty:', faculty.email, '(ID:', faculty.id + ')');
    
    console.log('');
    
    // Create Events
    console.log('📅 Creating events...');
    
    const event1Result = await client.query(`
      INSERT INTO events (title, date, description, type, location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title
    `, [
      'Tech Innovation Workshop',
      new Date('2024-12-30T10:00:00Z'),
      'Join us for an exciting workshop on the latest tech innovations and trends in software development.',
      'workshop',
      'Main Hall, Building A'
    ]);
    console.log('   ✅ Created Event 1:', event1Result.rows[0].title);
    
    const event2Result = await client.query(`
      INSERT INTO events (title, date, description, type, location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title
    `, [
      'Alumni Networking Meetup',
      new Date('2025-01-15T18:00:00Z'),
      'Network with fellow alumni and industry professionals. Great opportunity to expand your professional network.',
      'meetup',
      'Conference Center'
    ]);
    console.log('   ✅ Created Event 2:', event2Result.rows[0].title);
    
    console.log('');
    
    // Create Competition (stored as event with type='competition')
    console.log('🏆 Creating competition...');
    
    const competitionResult = await client.query(`
      INSERT INTO events (title, date, description, type, location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title
    `, [
      'Annual Case Competition 2024',
      new Date('2025-02-01T09:00:00Z'),
      'Test your problem-solving skills in our annual case competition. Open to all students.',
      'competition',
      'Main Auditorium'
    ]);
    console.log('   ✅ Created Competition:', competitionResult.rows[0].title);
    
    console.log('');
    
    // Create Lecture
    console.log('📚 Creating lecture...');
    
    const lectureResult = await client.query(`
      INSERT INTO lectures (title, topic, date, professor_id, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title
    `, [
      'Introduction to Machine Learning',
      'Machine Learning Fundamentals',
      new Date('2025-01-20T14:00:00Z'),
      faculty.id,
      'Learn the basics of machine learning algorithms and applications.'
    ]);
    console.log('   ✅ Created Lecture:', lectureResult.rows[0].title);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('');
    console.log('🎉 Database Seeded Successfully!');
    console.log('');
    console.log('📝 Demo Credentials (Password: 123456):');
    console.log('   Student:  student@test.com  → /student/dashboard');
    console.log('   Mentor:   mentor@test.com   → /mentor/dashboard');
    console.log('   Alumni:   alumni@test.com    → /alumni/dashboard');
    console.log('   Admin:    admin@test.com     → /admin/dashboard');
    console.log('   Faculty:  faculty@test.com   → /faculty/dashboard');
    console.log('');
    console.log('✅ All users, events, and competitions created!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
}

// Run seed
seed().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
