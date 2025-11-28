# Connection Request Backend API - Complete Implementation Guide

This document provides **production-ready backend code** for the Connection Request lifecycle system.

---

## 📋 Table of Contents

1. [Database Schema](#database-schema)
2. [Python Flask Implementation](#python-flask-implementation)
3. [Node.js Express Implementation](#nodejs-express-implementation)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Testing](#testing)

---

## 🗄️ Database Schema

### PostgreSQL / MySQL

```sql
CREATE TABLE connection_requests (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    student_major VARCHAR(255),
    mentor_name VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- Foreign keys (assuming you have a users table)
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Prevent duplicate requests
    UNIQUE(sender_id, receiver_id)
);

-- Indexes for performance
CREATE INDEX idx_sender_id ON connection_requests(sender_id);
CREATE INDEX idx_receiver_id ON connection_requests(receiver_id);
CREATE INDEX idx_status ON connection_requests(status);
```

### MongoDB

```javascript
{
  _id: ObjectId,
  sender_id: Number,
  receiver_id: Number,
  student_name: String,
  student_email: String,
  student_major: String,
  mentor_name: String,
  message: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  created_at: { type: Date, default: Date.now },
  updated_at: Date
}

// Create unique compound index
db.connection_requests.createIndex(
  { sender_id: 1, receiver_id: 1 },
  { unique: true }
)
```

---

## 🐍 Python Flask Implementation

### Installation

```bash
pip install flask flask-cors flask-sqlalchemy psycopg2-binary python-dotenv flask-jwt-extended
```

### `app.py` - Complete Backend

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://user:password@localhost/cmis_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')

CORS(app, origins=["http://localhost:3000"])
db = SQLAlchemy(app)
jwt = JWTManager(app)

# ============ MODELS ============

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    role = db.Column(db.String(50), nullable=False)  # 'student', 'mentor', 'faculty'
    major = db.Column(db.String(255))
    
    # Relationships
    sent_requests = db.relationship('ConnectionRequest', foreign_keys='ConnectionRequest.sender_id', backref='sender', lazy=True)
    received_requests = db.relationship('ConnectionRequest', foreign_keys='ConnectionRequest.receiver_id', backref='receiver', lazy=True)


class ConnectionRequest(db.Model):
    __tablename__ = 'connection_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    student_name = db.Column(db.String(255), nullable=False)
    student_email = db.Column(db.String(255), nullable=False)
    student_major = db.Column(db.String(255))
    mentor_name = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, accepted, declined
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)
    
    __table_args__ = (
        db.UniqueConstraint('sender_id', 'receiver_id', name='unique_sender_receiver'),
    )

# ============ API ENDPOINTS ============

@app.route('/api/send-request', methods=['POST'])
@jwt_required()
def send_connection_request():
    """
    CREATE: Student sends a connection request to a mentor
    
    Request Body:
    {
        "mentor_id": 123,
        "message": "Hi, I'd love to connect..."
    }
    
    Returns:
    {
        "success": true,
        "request_id": 456,
        "message": "Connection request sent successfully!"
    }
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        mentor_id = data.get('mentor_id')
        message_text = data.get('message', '')
        
        if not mentor_id:
            return jsonify({"error": "mentor_id is required"}), 400
        
        # Get current student info
        student = User.query.get(current_user_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404
        
        # Get mentor info
        mentor = User.query.get(mentor_id)
        if not mentor:
            return jsonify({"error": "Mentor not found"}), 404
        
        if mentor.role != 'mentor':
            return jsonify({"error": "User is not a mentor"}), 400
        
        # Check if request already exists
        existing = ConnectionRequest.query.filter_by(
            sender_id=current_user_id,
            receiver_id=mentor_id
        ).first()
        
        if existing:
            return jsonify({
                "error": "Connection request already exists",
                "status": existing.status
            }), 409  # Conflict
        
        # Create new request
        new_request = ConnectionRequest(
            sender_id=current_user_id,
            receiver_id=mentor_id,
            student_name=student.name,
            student_email=student.email,
            student_major=student.major or "Not specified",
            mentor_name=mentor.name,
            message=message_text,
            status='pending'
        )
        
        db.session.add(new_request)
        db.session.commit()
        
        # TODO: Send email notification to mentor
        # send_email_notification(mentor.email, student.name)
        
        return jsonify({
            "success": True,
            "request_id": new_request.id,
            "message": "Connection request sent successfully!"
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/my-requests', methods=['GET'])
@jwt_required()
def get_my_connection_requests():
    """
    READ: Get all connection requests sent by current student
    
    Returns:
    {
        "requests": [
            {
                "id": 1,
                "mentor_name": "Sarah Johnson",
                "status": "pending",
                "created_at": "2024-01-15T10:30:00",
                "message": "Hi, I'd love to connect..."
            }
        ]
    }
    """
    try:
        current_user_id = get_jwt_identity()
        
        requests = ConnectionRequest.query.filter_by(sender_id=current_user_id).order_by(ConnectionRequest.created_at.desc()).all()
        
        return jsonify({
            "requests": [
                {
                    "id": req.id,
                    "mentor_id": req.receiver_id,
                    "mentor_name": req.mentor_name,
                    "message": req.message,
                    "status": req.status,
                    "created_at": req.created_at.isoformat(),
                    "updated_at": req.updated_at.isoformat() if req.updated_at else None
                }
                for req in requests
            ]
        }), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/mentor/requests', methods=['GET'])
@jwt_required()
def get_mentor_requests():
    """
    READ: Get all connection requests received by current mentor
    
    Query Params:
    - status: 'pending', 'accepted', 'declined', or 'all' (default: 'pending')
    
    Returns:
    {
        "requests": [...]
    }
    """
    try:
        current_user_id = get_jwt_identity()
        status_filter = request.args.get('status', 'pending')
        
        # Verify user is a mentor
        mentor = User.query.get(current_user_id)
        if not mentor or mentor.role != 'mentor':
            return jsonify({"error": "Unauthorized"}), 403
        
        query = ConnectionRequest.query.filter_by(receiver_id=current_user_id)
        
        if status_filter != 'all':
            query = query.filter_by(status=status_filter)
        
        requests = query.order_by(ConnectionRequest.created_at.desc()).all()
        
        return jsonify({
            "requests": [
                {
                    "id": req.id,
                    "student_id": req.sender_id,
                    "student_name": req.student_name,
                    "student_email": req.student_email,
                    "student_major": req.student_major,
                    "message": req.message,
                    "status": req.status,
                    "created_at": req.created_at.isoformat(),
                    "updated_at": req.updated_at.isoformat() if req.updated_at else None
                }
                for req in requests
            ]
        }), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/requests/<int:request_id>', methods=['PUT'])
@jwt_required()
def update_request_status(request_id):
    """
    UPDATE: Mentor accepts or declines a connection request
    
    Request Body:
    {
        "status": "accepted"  // or "declined"
    }
    
    Returns:
    {
        "success": true,
        "message": "Request accepted successfully!"
    }
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        new_status = data.get('status')
        
        if new_status not in ['accepted', 'declined']:
            return jsonify({"error": "Invalid status. Must be 'accepted' or 'declined'"}), 400
        
        # Get the request
        conn_request = ConnectionRequest.query.get(request_id)
        
        if not conn_request:
            return jsonify({"error": "Request not found"}), 404
        
        # Authorization: Only the receiver (mentor) can update
        if conn_request.receiver_id != current_user_id:
            return jsonify({"error": "Unauthorized: You can only update your own requests"}), 403
        
        # Update status
        conn_request.status = new_status
        conn_request.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # TODO: Send email notification to student
        # send_status_update_email(conn_request.student_email, new_status, conn_request.mentor_name)
        
        return jsonify({
            "success": True,
            "message": f"Request {new_status} successfully!"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/requests/<int:request_id>', methods=['DELETE'])
@jwt_required()
def delete_request(request_id):
    """
    DELETE: Student deletes their own connection request (only if pending)
    """
    try:
        current_user_id = get_jwt_identity()
        
        conn_request = ConnectionRequest.query.get(request_id)
        
        if not conn_request:
            return jsonify({"error": "Request not found"}), 404
        
        # Authorization: Only the sender (student) can delete
        if conn_request.sender_id != current_user_id:
            return jsonify({"error": "Unauthorized"}), 403
        
        if conn_request.status != 'pending':
            return jsonify({"error": "Can only delete pending requests"}), 400
        
        db.session.delete(conn_request)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Request deleted successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# ============ INIT DATABASE ============

@app.before_first_request
def create_tables():
    db.create_all()


if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### `.env` File

```env
DATABASE_URL=postgresql://username:password@localhost:5432/cmis_db
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
```

---

## 🟢 Node.js Express Implementation

### Installation

```bash
npm install express cors pg sequelize dotenv jsonwebtoken bcrypt
```

### `server.js` - Complete Backend

```javascript
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ============ DATABASE CONNECTION ============

const sequelize = new Sequelize(
  process.env.DB_NAME || 'cmis_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  }
);

// ============ MODELS ============

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
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  major: DataTypes.STRING
}, {
  tableName: 'users',
  timestamps: false
});

const ConnectionRequest = sequelize.define('ConnectionRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  student_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  student_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  student_major: DataTypes.STRING,
  mentor_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: DataTypes.TEXT,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: DataTypes.DATE
}, {
  tableName: 'connection_requests',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['sender_id', 'receiver_id']
    }
  ]
});

// Associations
User.hasMany(ConnectionRequest, { foreignKey: 'sender_id', as: 'sentRequests' });
User.hasMany(ConnectionRequest, { foreignKey: 'receiver_id', as: 'receivedRequests' });
ConnectionRequest.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
ConnectionRequest.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

// ============ MIDDLEWARE ============

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

// ============ API ENDPOINTS ============

// CREATE: Send connection request
app.post('/api/send-request', authenticateToken, async (req, res) => {
  try {
    const { mentor_id, message } = req.body;
    const student_id = req.user.id;
    
    if (!mentor_id) {
      return res.status(400).json({ error: 'mentor_id is required' });
    }
    
    // Get student and mentor info
    const student = await User.findByPk(student_id);
    const mentor = await User.findByPk(mentor_id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    
    if (mentor.role !== 'mentor') {
      return res.status(400).json({ error: 'User is not a mentor' });
    }
    
    // Check for existing request
    const existing = await ConnectionRequest.findOne({
      where: {
        sender_id: student_id,
        receiver_id: mentor_id
      }
    });
    
    if (existing) {
      return res.status(409).json({
        error: 'Connection request already exists',
        status: existing.status
      });
    }
    
    // Create new request
    const newRequest = await ConnectionRequest.create({
      sender_id: student_id,
      receiver_id: mentor_id,
      student_name: student.name,
      student_email: student.email,
      student_major: student.major || 'Not specified',
      mentor_name: mentor.name,
      message: message || '',
      status: 'pending',
      created_at: new Date()
    });
    
    // TODO: Send email notification
    
    res.status(201).json({
      success: true,
      request_id: newRequest.id,
      message: 'Connection request sent successfully!'
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// READ: Get student's sent requests
app.get('/api/my-requests', authenticateToken, async (req, res) => {
  try {
    const student_id = req.user.id;
    
    const requests = await ConnectionRequest.findAll({
      where: { sender_id: student_id },
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      requests: requests.map(req => ({
        id: req.id,
        mentor_id: req.receiver_id,
        mentor_name: req.mentor_name,
        message: req.message,
        status: req.status,
        created_at: req.created_at,
        updated_at: req.updated_at
      }))
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// READ: Get mentor's received requests
app.get('/api/mentor/requests', authenticateToken, async (req, res) => {
  try {
    const mentor_id = req.user.id;
    const status = req.query.status || 'pending';
    
    // Verify user is mentor
    const mentor = await User.findByPk(mentor_id);
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const where = { receiver_id: mentor_id };
    if (status !== 'all') {
      where.status = status;
    }
    
    const requests = await ConnectionRequest.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      requests: requests.map(req => ({
        id: req.id,
        student_id: req.sender_id,
        student_name: req.student_name,
        student_email: req.student_email,
        student_major: req.student_major,
        message: req.message,
        status: req.status,
        created_at: req.created_at,
        updated_at: req.updated_at
      }))
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE: Accept/Decline request
app.put('/api/requests/:id', authenticateToken, async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;
    const mentor_id = req.user.id;
    
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status. Must be 'accepted' or 'declined'" 
      });
    }
    
    const connRequest = await ConnectionRequest.findByPk(requestId);
    
    if (!connRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Authorization check
    if (connRequest.receiver_id !== mentor_id) {
      return res.status(403).json({ 
        error: 'Unauthorized: You can only update your own requests' 
      });
    }
    
    // Update
    connRequest.status = status;
    connRequest.updated_at = new Date();
    await connRequest.save();
    
    // TODO: Send email notification to student
    
    res.json({
      success: true,
      message: `Request ${status} successfully!`
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE: Cancel request
app.delete('/api/requests/:id', authenticateToken, async (req, res) => {
  try {
    const requestId = req.params.id;
    const student_id = req.user.id;
    
    const connRequest = await ConnectionRequest.findByPk(requestId);
    
    if (!connRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (connRequest.sender_id !== student_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    if (connRequest.status !== 'pending') {
      return res.status(400).json({ 
        error: 'Can only delete pending requests' 
      });
    }
    
    await connRequest.destroy();
    
    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
    
  } catch (error) {
    console.error('Error:', error);
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

### `.env` File

```env
DB_NAME=cmis_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this
```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/send-request` | ✓ | Student sends connection request |
| GET | `/api/my-requests` | ✓ | Student views their sent requests |
| GET | `/api/mentor/requests` | ✓ | Mentor views received requests |
| PUT | `/api/requests/:id` | ✓ | Mentor accepts/declines request |
| DELETE | `/api/requests/:id` | ✓ | Student cancels pending request |

---

## 🔐 Authentication

Both implementations use **JWT (JSON Web Tokens)** for authentication.

### Frontend Integration

```javascript
// In your React app
const token = localStorage.getItem('authToken');

const response = await fetch('/api/send-request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    mentor_id: 123,
    message: 'Hi, I would love to connect...'
  })
});
```

---

## 🧪 Testing

### Using cURL

```bash
# 1. Send Connection Request
curl -X POST http://localhost:5000/api/send-request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"mentor_id": 1, "message": "Hi, I would love to connect!"}'

# 2. Get Student's Requests
curl -X GET http://localhost:5000/api/my-requests \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Get Mentor's Requests
curl -X GET "http://localhost:5000/api/mentor/requests?status=pending" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 4. Accept Request
curl -X PUT http://localhost:5000/api/requests/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"status": "accepted"}'
```

### Using Postman

1. **Set Base URL:** `http://localhost:5000`
2. **Add Authorization Header:**
   - Key: `Authorization`
   - Value: `Bearer YOUR_JWT_TOKEN`
3. **Test each endpoint with sample data**

---

## 🚀 Deployment Checklist

- [ ] Change `JWT_SECRET_KEY` to a strong random string
- [ ] Use environment variables for database credentials
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Add rate limiting (Flask-Limiter / express-rate-limit)
- [ ] Implement email notifications
- [ ] Add logging (Winston for Node.js, logging module for Python)
- [ ] Set up monitoring (Sentry, New Relic)
- [ ] Create database backups
- [ ] Write integration tests

---

## 📧 Email Notification Template (Optional)

```python
# Python example using SendGrid
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_request_notification(mentor_email, student_name):
    message = Mail(
        from_email='noreply@cmis.tamu.edu',
        to_emails=mentor_email,
        subject=f'New Mentorship Request from {student_name}',
        html_content=f'''
        <h2>New Mentorship Request</h2>
        <p>{student_name} has requested to connect with you as a mentor.</p>
        <p><a href="https://cmis.tamu.edu/mentor/requests">View Request</a></p>
        '''
    )
    
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(f"Email sent: {response.status_code}")
    except Exception as e:
        print(f"Email failed: {str(e)}")
```

---

## ✅ Complete!

You now have **production-ready backend code** for the connection request system!

Choose either **Python Flask** or **Node.js Express** based on your team's expertise, deploy it, and update your frontend to use the real API endpoints.

