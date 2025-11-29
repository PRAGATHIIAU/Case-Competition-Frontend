-- CMIS Engagement Platform Database Schema
-- PostgreSQL Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (Base table for all user types)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'mentor', 'judge', 'faculty', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) UNIQUE,
    major VARCHAR(100),
    graduation_year INTEGER,
    gpa DECIMAL(3,2),
    skills TEXT[], -- Array of skills
    resume_url TEXT,
    bio TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mentors Table
CREATE TABLE IF NOT EXISTS mentors (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(255),
    role VARCHAR(255),
    expertise TEXT,
    skills TEXT[], -- Array of skills
    bio TEXT,
    availability VARCHAR(50) DEFAULT 'Available' CHECK (availability IN ('Available', 'Busy', 'Unavailable')),
    linkedin_url TEXT,
    years_of_experience INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Judges Table
CREATE TABLE IF NOT EXISTS judges (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(255),
    role VARCHAR(255),
    expertise TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Faculty/Admin Table
CREATE TABLE IF NOT EXISTS faculty (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(100),
    title VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) CHECK (event_type IN ('lecture', 'workshop', 'networking', 'competition')),
    date_time TIMESTAMP NOT NULL,
    location VARCHAR(255),
    capacity INTEGER,
    organizer_id UUID REFERENCES users(id),
    skills_required TEXT[], -- For matching students
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event RSVPs Table
CREATE TABLE IF NOT EXISTS event_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlist', 'cancelled')),
    rsvp_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- Competitions Table
CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    organizer_id UUID REFERENCES users(id),
    max_team_size INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    team_name VARCHAR(255) NOT NULL,
    team_id VARCHAR(50) UNIQUE NOT NULL,
    leader_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, student_id)
);

-- Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'graded'))
);

-- Scores Table
CREATE TABLE IF NOT EXISTS scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    judge_id UUID REFERENCES users(id),
    criteria_1 INTEGER CHECK (criteria_1 >= 0 AND criteria_1 <= 100),
    criteria_2 INTEGER CHECK (criteria_2 >= 0 AND criteria_2 <= 100),
    criteria_3 INTEGER CHECK (criteria_3 >= 0 AND criteria_3 <= 100),
    criteria_4 INTEGER CHECK (criteria_4 >= 0 AND criteria_4 <= 100),
    total_score DECIMAL(5,2),
    feedback TEXT,
    scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(submission_id, judge_id)
);

-- Connection Requests Table
CREATE TABLE IF NOT EXISTS connection_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, mentor_id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table (for direct messaging)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_students_skills ON students USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_mentors_skills ON mentors USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_mentors_availability ON mentors(availability);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date_time);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_event ON event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user ON event_rsvps(user_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_mentor ON connection_requests(mentor_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_student ON connection_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_status ON connection_requests(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentors_updated_at BEFORE UPDATE ON mentors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connection_requests_updated_at BEFORE UPDATE ON connection_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


