# Event Notification System - Complete Backend API

## 🎯 Overview

This document provides **production-ready backend code** for the Event Notification System with automatic student matching based on skills/interests.

---

## 📋 Table of Contents

1. [Database Schemas](#database-schemas)
2. [Python Flask Implementation](#python-flask-implementation)
3. [Node.js Express Implementation](#nodejs-express-implementation)
4. [API Endpoints](#api-endpoints)
5. [Matching Algorithm](#matching-algorithm)
6. [Testing](#testing)

---

## 🗄️ Database Schemas

### PostgreSQL / MySQL

```sql
-- Events Table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time VARCHAR(50),
    location VARCHAR(255) NOT NULL,
    type VARCHAR(100) DEFAULT 'Event',
    related_skills TEXT[], -- Array of skills
    rsvp_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) DEFAULT 'event', -- 'event', 'match', 'reminder', etc.
    message TEXT NOT NULL,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- Update Users table to include interests
ALTER TABLE users ADD COLUMN interests TEXT[]; -- Array of skills/interests

-- Example: Adding interests to existing user
UPDATE users 
SET interests = ARRAY['Python', 'SQL', 'Data Analytics', 'Machine Learning']
WHERE id = 101;
```

### MongoDB

```javascript
// Events Collection
{
  _id: ObjectId,
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  type: { type: String, default: 'Event' },
  related_skills: [String],
  rsvp_link: String,
  created_at: { type: Date, default: Date.now },
  created_by: ObjectId
}

// Notifications Collection
{
  _id: ObjectId,
  user_id: ObjectId,
  type: { type: String, default: 'event' },
  message: String,
  link: String,
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
}

// Users Collection (with interests)
{
  _id: ObjectId,
  name: String,
  email: String,
  major: String,
  interests: [String], // Skills/interests for matching
  // ... other fields
}

// Create indexes
db.notifications.createIndex({ user_id: 1, created_at: -1 })
db.notifications.createIndex({ is_read: 1 })
db.events.createIndex({ created_at: -1 })
```

---

## 🐍 Python Flask Implementation

### Installation

```bash
pip install flask flask-cors flask-sqlalchemy psycopg2-binary python-dotenv flask-jwt-extended
```

### `models.py` - Database Models

```python
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    major = db.Column(db.String(255))
    interests = db.Column(db.ARRAY(db.String), default=[])  # Array of skills
    
    # Relationships
    notifications = db.relationship('Notification', backref='user', lazy=True, cascade='all, delete-orphan')


class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(50))
    location = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(100), default='Event')
    related_skills = db.Column(db.ARRAY(db.String), default=[])  # Skills for matching
    rsvp_link = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))


class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    type = db.Column(db.String(50), default='event')
    message = db.Column(db.Text, nullable=False)
    link = db.Column(db.String(500))
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

### `app.py` - Complete Backend

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from models import db, User, Event, Notification
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

CORS(app, origins=["http://localhost:3000"])
db.init_app(app)
jwt = JWTManager(app)


# ============ MATCHING ALGORITHM ============

def find_matching_students(event_skills):
    """
    Find all students whose interests intersect with event skills
    Returns list of (student, matched_skills)
    """
    if not event_skills:
        return []
    
    # Get all students
    all_students = User.query.filter(User.interests.isnot(None)).all()
    
    matched_students = []
    
    for student in all_students:
        if not student.interests:
            continue
        
        # Calculate intersection (case-insensitive)
        student_interests_lower = [interest.lower() for interest in student.interests]
        event_skills_lower = [skill.lower() for skill in event_skills]
        
        intersection = [
            skill for skill in event_skills
            if skill.lower() in student_interests_lower
        ]
        
        if intersection:
            matched_students.append({
                'student': student,
                'matched_skills': intersection
            })
    
    return matched_students


# ============ API ENDPOINTS ============

@app.route('/api/events', methods=['POST'])
@jwt_required()
def create_event():
    """
    CREATE EVENT with automatic notification matching
    
    Request Body:
    {
        "title": "Python Workshop",
        "description": "Learn Python basics...",
        "date": "2024-02-15",
        "time": "2:00 PM",
        "location": "Mays Business School",
        "type": "Workshop",
        "related_skills": ["Python", "SQL"]
    }
    
    Returns:
    {
        "success": true,
        "event_id": 123,
        "notifications_created": 5,
        "matched_students": [...]
    }
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        print(f"📝 CREATE EVENT - User {current_user_id}")
        print(f"   Title: {data.get('title')}")
        print(f"   Related Skills: {data.get('related_skills')}")
        
        # 1. Validate required fields
        required_fields = ['title', 'date', 'location']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # 2. Create the event
        new_event = Event(
            title=data['title'],
            description=data.get('description', ''),
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            time=data.get('time', ''),
            location=data['location'],
            type=data.get('type', 'Event'),
            related_skills=data.get('related_skills', []),
            rsvp_link=data.get('rsvp_link', f'/events/{data.get("title", "event").replace(" ", "-").lower()}/rsvp'),
            created_by=current_user_id
        )
        
        db.session.add(new_event)
        db.session.flush()  # Get the event ID before committing
        
        print(f"💾 Event created with ID: {new_event.id}")
        
        # 3. MATCHING LOGIC: Find students with matching interests
        matched_data = find_matching_students(new_event.related_skills)
        
        print(f"🔍 Found {len(matched_data)} matching students")
        
        # 4. Create notifications for matched students
        notifications_created = 0
        matched_students_info = []
        
        for match in matched_data:
            student = match['student']
            matched_skills = match['matched_skills']
            primary_skill = matched_skills[0]  # Use first matched skill in message
            
            notification = Notification(
                user_id=student.id,
                type='event',
                message=f"New Event: {new_event.title} matches your interest in {primary_skill}!",
                link=new_event.rsvp_link,
                is_read=False
            )
            
            db.session.add(notification)
            notifications_created += 1
            
            matched_students_info.append({
                'student_id': student.id,
                'student_name': student.name,
                'student_email': student.email,
                'matched_skills': matched_skills
            })
            
            print(f"   ✅ Notification created for {student.name} ({', '.join(matched_skills)})")
        
        # 5. Commit all changes
        db.session.commit()
        
        print(f"✨ Total: {notifications_created} notifications created")
        
        return jsonify({
            "success": True,
            "event_id": new_event.id,
            "notifications_created": notifications_created,
            "matched_students": matched_students_info
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


@app.route('/api/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """
    GET user's notifications
    
    Query Params:
    - unread_only: true/false (default: false)
    
    Returns:
    {
        "notifications": [...],
        "unread_count": 3
    }
    """
    try:
        current_user_id = get_jwt_identity()
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        
        query = Notification.query.filter_by(user_id=current_user_id)
        
        if unread_only:
            query = query.filter_by(is_read=False)
        
        notifications = query.order_by(Notification.created_at.desc()).all()
        
        unread_count = Notification.query.filter_by(
            user_id=current_user_id,
            is_read=False
        ).count()
        
        return jsonify({
            "notifications": [
                {
                    "id": notif.id,
                    "type": notif.type,
                    "message": notif.message,
                    "link": notif.link,
                    "is_read": notif.is_read,
                    "created_at": notif.created_at.isoformat()
                }
                for notif in notifications
            ],
            "unread_count": unread_count
        }), 200
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/notifications/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_as_read(notification_id):
    """
    MARK notification as read
    """
    try:
        current_user_id = get_jwt_identity()
        
        notification = Notification.query.filter_by(
            id=notification_id,
            user_id=current_user_id
        ).first()
        
        if not notification:
            return jsonify({"error": "Notification not found"}), 404
        
        notification.is_read = True
        db.session.commit()
        
        return jsonify({"success": True}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/notifications/read-all', methods=['PUT'])
@jwt_required()
def mark_all_notifications_as_read():
    """
    MARK all notifications as read
    """
    try:
        current_user_id = get_jwt_identity()
        
        Notification.query.filter_by(
            user_id=current_user_id,
            is_read=False
        ).update({"is_read": True})
        
        db.session.commit()
        
        return jsonify({"success": True}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/events', methods=['GET'])
def get_events():
    """
    GET all events
    """
    try:
        events = Event.query.order_by(Event.created_at.desc()).all()
        
        return jsonify({
            "events": [
                {
                    "id": event.id,
                    "title": event.title,
                    "description": event.description,
                    "date": event.date.isoformat(),
                    "time": event.time,
                    "location": event.location,
                    "type": event.type,
                    "related_skills": event.related_skills,
                    "rsvp_link": event.rsvp_link,
                    "created_at": event.created_at.isoformat()
                }
                for event in events
            ]
        }), 200
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# ============ INIT DATABASE ============

@app.before_first_request
def create_tables():
    db.create_all()
    print("✅ Database tables created")


if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

---

## 🟢 Node.js Express Implementation

### Installation

```bash
npm install express cors pg sequelize dotenv jsonwebtoken bcrypt
```

### `models.js` - Database Models

```javascript
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  }
);

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  major: DataTypes.STRING,
  interests: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  tableName: 'users',
  timestamps: false
});

// Event Model
const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  date: {
    type: DataTypes.DATE NOT,
    allowNull: false
  },
  time: DataTypes.STRING,
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'Event'
  },
  related_skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  rsvp_link: DataTypes.STRING,
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'events',
  timestamps: false
});

// Notification Model
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'event'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  link: DataTypes.STRING,
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'notifications',
  timestamps: false
});

// Associations
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Event.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = { sequelize, User, Event, Notification };
```

### `server.js` - Complete Backend

```javascript
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { sequelize, User, Event, Notification } = require('./models');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// ============ MATCHING ALGORITHM ============

async function findMatchingStudents(eventSkills) {
  if (!eventSkills || eventSkills.length === 0) {
    return [];
  }
  
  const allStudents = await User.findAll({
    where: {
      interests: {
        [Sequelize.Op.ne]: null
      }
    }
  });
  
  const matchedStudents = [];
  const eventSkillsLower = eventSkills.map(s => s.toLowerCase());
  
  for (const student of allStudents) {
    if (!student.interests || student.interests.length === 0) {
      continue;
    }
    
    const studentInterestsLower = student.interests.map(i => i.toLowerCase());
    const intersection = eventSkills.filter(skill =>
      studentInterestsLower.includes(skill.toLowerCase())
    );
    
    if (intersection.length > 0) {
      matchedStudents.push({
        student,
        matchedSkills: intersection
      });
    }
  }
  
  return matchedStudents;
}

// ============ API ENDPOINTS ============

// CREATE EVENT
app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, date, time, location, type, related_skills } = req.body;
    
    console.log('📝 CREATE EVENT - User', userId);
    console.log('   Title:', title);
    console.log('   Related Skills:', related_skills);
    
    // Create event
    const newEvent = await Event.create({
      title,
      description: description || '',
      date: new Date(date),
      time: time || '',
      location,
      type: type || 'Event',
      related_skills: related_skills || [],
      rsvp_link: req.body.rsvp_link || `/events/${title.toLowerCase().replace(/\s+/g, '-')}/rsvp`,
      created_by: userId
    });
    
    console.log('💾 Event created with ID:', newEvent.id);
    
    // Find matching students
    const matched = await findMatchingStudents(newEvent.related_skills);
    
    console.log('🔍 Found', matched.length, 'matching students');
    
    // Create notifications
    const notificationPromises = matched.map(match => {
      const primarySkill = match.matchedSkills[0];
      return Notification.create({
        user_id: match.student.id,
        type: 'event',
        message: `New Event: ${newEvent.title} matches your interest in ${primarySkill}!`,
        link: newEvent.rsvp_link,
        is_read: false
      });
    });
    
    await Promise.all(notificationPromises);
    
    console.log('✨ Total:', matched.length, 'notifications created');
    
    res.status(201).json({
      success: true,
      event_id: newEvent.id,
      notifications_created: matched.length,
      matched_students: matched.map(m => ({
        student_id: m.student.id,
        student_name: m.student.name,
        student_email: m.student.email,
        matched_skills: m.matchedSkills
      }))
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET NOTIFICATIONS
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const unreadOnly = req.query.unread_only === 'true';
    
    const where = { user_id: userId };
    if (unreadOnly) {
      where.is_read = false;
    }
    
    const notifications = await Notification.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
    
    const unreadCount = await Notification.count({
      where: {
        user_id: userId,
        is_read: false
      }
    });
    
    res.json({
      notifications,
      unread_count: unreadCount
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MARK AS READ
app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        user_id: userId
      }
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    notification.is_read = true;
    await notification.save();
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ START SERVER ============

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Database connection failed:', err);
});
```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/events` | ✓ | Create event + auto-notify students |
| GET | `/api/events` | - | Get all events |
| GET | `/api/notifications` | ✓ | Get user's notifications |
| PUT | `/api/notifications/:id/read` | ✓ | Mark notification as read |
| PUT | `/api/notifications/read-all` | ✓ | Mark all as read |

---

## 🎯 Matching Algorithm

### Logic:

```python
for each student in database:
    intersection = student.interests ∩ event.related_skills
    
    if intersection.length > 0:
        create_notification(
            user_id=student.id,
            message=f"New Event: {event.title} matches your interest in {intersection[0]}!"
        )
```

### Example:

```
Event: "Python Workshop"
Skills: ["Python", "Data Analytics"]

Student A: ["Python", "SQL", "Java"]
  → Match: ["Python"]
  → Notification: "Python Workshop matches your interest in Python!"

Student B: ["JavaScript", "React"]
  → No match
  → No notification

Student C: ["Python", "Data Analytics"]
  → Match: ["Python", "Data Analytics"]
  → Notification: "Python Workshop matches your interest in Python!"
```

---

## 🧪 Testing

### Using cURL

```bash
# 1. Create Event (with JWT token)
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Python Workshop",
    "description": "Learn Python basics",
    "date": "2024-02-15",
    "time": "2:00 PM",
    "location": "Mays Business School",
    "type": "Workshop",
    "related_skills": ["Python", "SQL"]
  }'

# 2. Get Notifications
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Mark as Read
curl -X PUT http://localhost:5000/api/notifications/1/read \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## ✅ Complete!

You now have **production-ready backend code** for the Event Notification System!

Choose either **Python Flask** or **Node.js Express**, deploy it, and watch the automatic student matching work!

