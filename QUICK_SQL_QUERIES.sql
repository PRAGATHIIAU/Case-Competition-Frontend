-- ========================================
-- Quick SQL Queries for Database
-- ========================================

-- View All Tables
\dt

-- View All Users
SELECT * FROM users ORDER BY created_at DESC;

-- View All Students
SELECT * FROM students ORDER BY created_at DESC;

-- View All Mentors
SELECT * FROM mentors;

-- View All Events
SELECT * FROM events ORDER BY date DESC;

-- View Users with Roles
SELECT id, email, name, role, created_at FROM users;

-- Count Records
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM students) as total_students,
    (SELECT COUNT(*) FROM mentors) as total_mentors,
    (SELECT COUNT(*) FROM events) as total_events;

-- View Recent Signups (Last 10)
SELECT id, email, name, role, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;

-- View Alumni with Unified Identity Flags
SELECT id, email, name, role, is_mentor, is_judge, is_speaker 
FROM users 
WHERE role = 'alumni';

-- View Connection Requests
SELECT * FROM connection_requests ORDER BY created_at DESC;

-- View Notifications
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20;

-- Search Users by Email
SELECT * FROM users WHERE email LIKE '%test%';

-- View Users by Role
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;

-- View Table Structure
\d users
\d students
\d mentors
\d events



