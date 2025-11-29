# 📊 Database Schema Documentation

## Complete Table Structure for PostgreSQL

---

## 🗂️ Table Overview

| Table Name | Purpose | Key Fields |
|------------|---------|------------|
| `users` | Main user table (alumni, mentors, faculty, admin) | id, email, name, password, **role**, skills |
| `students` | Student-specific data (separate table) | student_id, email, name, password, major, year, skills |
| `mentors` | Mentor-specific data (extends users) | id (FK to users), company, expertise, skills |
| `events` | All events (workshops, meetups, competitions) | id, title, date, description, type |
| `lectures` | Faculty lectures | id, title, topic, date, professor_id (FK to users) |
| `connection_requests` | Mentor-student connection requests | id, student_id, mentor_id, status |
| `notifications` | User notifications | id, user_id, type, title, message, read |

---

## 📋 Detailed Table Schemas

### 1. `users` Table
**Purpose:** Stores alumni, mentors, faculty, admin, judges, guest speakers

**Columns:**
- `id` (SERIAL PRIMARY KEY) - Unique user ID
- `email` (VARCHAR(255) UNIQUE) - User email
- `name` (VARCHAR(255)) - Full name
- `password` (VARCHAR(255)) - Hashed password
- **`role` (VARCHAR(50))** - **REQUIRED**: 'student', 'mentor', 'alumni', 'faculty', 'admin', 'judge', 'guest_speaker'
- **`skills` (TEXT[])** - Array of skills
- `contact` (VARCHAR(255)) - Contact info
- `willing_to_be_mentor` (BOOLEAN) - Willing to mentor
- `mentor_capacity` (INTEGER) - Max mentees
- `willing_to_be_judge` (BOOLEAN) - Willing to judge
- `willing_to_be_sponsor` (BOOLEAN) - Willing to sponsor
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Indexes:**
- `idx_users_email` - On email (for fast lookups)
- `idx_users_role` - On role (for role-based queries)
- `idx_users_skills` - GIN index on skills array (for skill searches)

---

### 2. `students` Table
**Purpose:** Stores student-specific data (separate from users table)

**Columns:**
- `student_id` (SERIAL PRIMARY KEY) - Unique student ID
- `name` (VARCHAR(255)) - Student name
- `email` (VARCHAR(255) UNIQUE) - Student email
- `password` (VARCHAR(255)) - Hashed password
- `contact` (VARCHAR(255)) - Contact info
- `linkedin_url` (TEXT) - LinkedIn profile
- `major` (VARCHAR(255)) - Major field of study
- `grad_year` (INTEGER) - Graduation year (e.g., 2025)
- `year` (VARCHAR(50)) - Year level ('Freshman', 'Sophomore', 'Junior', 'Senior')
- **`skills` (TEXT[])** - Array of skills
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Indexes:**
- `idx_students_email` - On email
- `idx_students_student_id` - On student_id
- `idx_students_skills` - GIN index on skills array

**Note:** Students have their own table because they have different fields than users (major, year, etc.)

---

### 3. `mentors` Table
**Purpose:** Stores mentor-specific data (extends users table)

**Columns:**
- `id` (INTEGER PRIMARY KEY, FK to users.id) - References users table
- `company` (VARCHAR(255)) - Company name
- `role` (VARCHAR(255)) - Job title/role
- `expertise` (TEXT) - Areas of expertise
- `skills` (TEXT[]) - Array of skills
- `bio` (TEXT) - Biography
- `availability` (VARCHAR(50)) - 'Available', 'Busy', 'Unavailable'
- `linkedin_url` (TEXT) - LinkedIn profile
- `years_of_experience` (INTEGER) - Years of experience
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Indexes:**
- `idx_mentors_availability` - On availability
- `idx_mentors_skills` - GIN index on skills array

**Relationship:** `mentors.id` → `users.id` (One-to-One)

---

### 4. `events` Table
**Purpose:** Stores all events (workshops, meetups, competitions, etc.)

**Columns:**
- `id` (SERIAL PRIMARY KEY) - Unique event ID
- `title` (VARCHAR(255)) - Event title
- `date` (TIMESTAMP) - Event date/time
- `description` (TEXT) - Event description
- `type` (VARCHAR(50)) - Event type: 'workshop', 'meetup', 'seminar', 'competition', 'networking'
- `location` (VARCHAR(255)) - Event location
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Indexes:**
- `idx_events_date` - On date (for date-based queries)
- `idx_events_type` - On type (for filtering by type)

---

### 5. `lectures` Table
**Purpose:** Stores faculty lectures

**Columns:**
- `id` (SERIAL PRIMARY KEY) - Unique lecture ID
- `title` (VARCHAR(255)) - Lecture title
- `topic` (VARCHAR(255)) - Lecture topic
- `date` (TIMESTAMP) - Lecture date/time
- `professor_id` (INTEGER, FK to users.id) - References users table (faculty)
- `description` (TEXT) - Lecture description
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Indexes:**
- `idx_lectures_date` - On date
- `idx_lectures_professor_id` - On professor_id

**Relationship:** `lectures.professor_id` → `users.id` (Many-to-One)

---

### 6. `connection_requests` Table
**Purpose:** Stores mentor-student connection requests

**Columns:**
- `id` (SERIAL PRIMARY KEY) - Unique request ID
- `student_id` (INTEGER, FK to users.id) - Student who sent request
- `mentor_id` (INTEGER, FK to users.id) - Mentor receiving request
- `message` (TEXT) - Request message
- `status` (VARCHAR(50)) - 'pending', 'accepted', 'declined', 'cancelled'
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Constraints:**
- UNIQUE(student_id, mentor_id) - One request per student-mentor pair

**Indexes:**
- `idx_connection_requests_mentor` - On mentor_id
- `idx_connection_requests_student` - On student_id
- `idx_connection_requests_status` - On status

---

### 7. `notifications` Table
**Purpose:** Stores user notifications

**Columns:**
- `id` (SERIAL PRIMARY KEY) - Unique notification ID
- `user_id` (INTEGER, FK to users.id) - User receiving notification
- `type` (VARCHAR(50)) - Notification type
- `title` (VARCHAR(255)) - Notification title
- `message` (TEXT) - Notification message
- `link` (TEXT) - Optional link
- `read` (BOOLEAN) - Read status
- `created_at` (TIMESTAMP) - Creation timestamp

**Indexes:**
- `idx_notifications_user` - On user_id
- `idx_notifications_read` - On (user_id, read) - Composite index

---

## 🔄 Data Flow

### User Registration Flow:
1. **Student signs up** → Creates record in `students` table
2. **Mentor/Alumni/Faculty signs up** → Creates record in `users` table
3. **If mentor** → Also creates record in `mentors` table (linked to users.id)

### Login Flow:
1. Check `users` table OR `students` table based on email
2. Verify password
3. Return user with `role` field
4. Frontend redirects based on role

### Profile Update Flow:
- **Student** → Updates `students` table
- **Mentor** → Updates `users` table AND `mentors` table
- **Alumni/Faculty** → Updates `users` table only

---

## 📝 Important Notes

1. **Role Field is CRITICAL**: The `role` field in `users` table determines:
   - Which dashboard to show
   - Which profile form to display
   - Which data to save

2. **Students vs Users**: 
   - Students have separate table (`students`)
   - All other roles use `users` table
   - This is why student login might show different data

3. **Skills Storage**:
   - Stored as PostgreSQL ARRAY type (TEXT[])
   - Can be queried efficiently with GIN indexes
   - Example: `['Python', 'JavaScript', 'React']`

4. **Events vs Competitions**:
   - Both stored in `events` table
   - Distinguished by `type` field
   - `type='competition'` for competitions

5. **Lectures**:
   - Stored in separate `lectures` table
   - Linked to faculty via `professor_id`

---

## ✅ Verification Queries

```sql
-- Check all users with roles
SELECT id, email, name, role, skills FROM users;

-- Check all students
SELECT student_id, email, name, major, year, skills FROM students;

-- Check all mentors
SELECT m.id, u.name, u.email, m.company, m.expertise, m.skills 
FROM mentors m 
JOIN users u ON m.id = u.id;

-- Check all events
SELECT id, title, date, type, description FROM events ORDER BY date;

-- Check all lectures
SELECT l.id, l.title, l.topic, l.date, u.name as professor
FROM lectures l
JOIN users u ON l.professor_id = u.id;
```

---

## 🎯 Summary

- **Users Table**: Alumni, mentors, faculty, admin (with role field)
- **Students Table**: Students (separate table)
- **Mentors Table**: Extends users for mentor-specific data
- **Events Table**: All events including competitions (type='competition')
- **Lectures Table**: Faculty lectures (linked to users via professor_id)
- **Connection Requests**: Mentor-student connections
- **Notifications**: User notifications

**All tables are properly indexed and ready for production!** ✅



