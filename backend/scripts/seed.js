import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Hash password for test users
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create test users
    const users = [
      {
        email: 'student@tamu.edu',
        password_hash: passwordHash,
        first_name: 'John',
        last_name: 'Student',
        role: 'student'
      },
      {
        email: 'mentor@exxon.com',
        password_hash: passwordHash,
        first_name: 'Sarah',
        last_name: 'Johnson',
        role: 'mentor'
      },
      {
        email: 'judge@company.com',
        password_hash: passwordHash,
        first_name: 'Michael',
        last_name: 'Judge',
        role: 'judge'
      }
    ];

    for (const user of users) {
      const userResult = await pool.query(`
        INSERT INTO users (email, password_hash, first_name, last_name, role)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `, [user.email, user.password_hash, user.first_name, user.last_name, user.role]);

      if (userResult.rows.length > 0) {
        const userId = userResult.rows[0].id;

        if (user.role === 'student') {
          await pool.query(`
            INSERT INTO students (id, student_id, major, graduation_year, skills)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (id) DO NOTHING
          `, [userId, 'STU001', 'Computer Science', 2025, ['Python', 'SQL', 'React']]);
        } else if (user.role === 'mentor') {
          await pool.query(`
            INSERT INTO mentors (id, company, role, expertise, skills, availability)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO NOTHING
          `, [userId, 'ExxonMobil', 'Senior Data Scientist', 'Cyber Security', ['Python', 'Data Analytics', 'ML'], 'Available']);
        }
      }
    }

    console.log('✅ Database seeded successfully!');
    console.log('📝 Test credentials:');
    console.log('   Email: student@tamu.edu, mentor@exxon.com, judge@company.com');
    console.log('   Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();


