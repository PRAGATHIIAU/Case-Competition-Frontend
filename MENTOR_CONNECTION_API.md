# Mentor Connection Request API - Implementation Guide

## Overview

This document provides complete backend implementation for the mentor connection request system, including database schema, API endpoints, and code examples.

---

## Database Schema

### Table: `connection_requests` (or `mentorship_requests`)

**SQL (PostgreSQL/MySQL):**
```sql
CREATE TABLE connection_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,           -- Student ID
    receiver_id INT NOT NULL,         -- Mentor ID
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    message TEXT,                     -- Optional connection message
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Prevent duplicate requests
    UNIQUE KEY unique_request (sender_id, receiver_id)
);

-- Index for faster queries
CREATE INDEX idx_receiver_status ON connection_requests(receiver_id, status);
CREATE INDEX idx_sender_status ON connection_requests(sender_id, status);
```

**MongoDB Schema:**
```javascript
{
  _id: ObjectId,
  sender_id: ObjectId,     // Reference to Student
  receiver_id: ObjectId,   // Reference to Mentor
  status: String,          // 'pending', 'accepted', 'declined'
  message: String,
  created_at: Date,
  updated_at: Date
}

// Indexes
db.connection_requests.createIndex({ receiver_id: 1, status: 1 })
db.connection_requests.createIndex({ sender_id: 1, receiver_id: 1 }, { unique: true })
```

---

## API Endpoints

### 1. Send Connection Request

**Endpoint:** `POST /api/send-request`

**Purpose:** Student sends a connection request to a mentor

**Request:**
```json
{
  "mentor_id": 1,
  "student_id": 101,
  "message": "I would love to connect and learn from your experience in data science."
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Connection request sent successfully",
  "request_id": 42,
  "data": {
    "id": 42,
    "sender_id": 101,
    "receiver_id": 1,
    "status": "pending",
    "created_at": "2024-01-25T10:30:00Z"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "You have already sent a request to this mentor"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": "Mentor not found"
}
```

---

### 2. Get Mentor's Pending Requests

**Endpoint:** `GET /api/mentor/requests?status=pending`

**Purpose:** Mentor views all pending connection requests

**Query Parameters:**
- `status` (optional): Filter by status ('pending', 'accepted', 'declined')

**Response Success (200):**
```json
{
  "success": true,
  "count": 3,
  "requests": [
    {
      "id": 42,
      "student": {
        "id": 101,
        "name": "John Doe",
        "email": "john.doe@tamu.edu",
        "major": "Computer Information Systems",
        "year": "Junior"
      },
      "message": "I would love to connect...",
      "status": "pending",
      "created_at": "2024-01-25T10:30:00Z"
    },
    {
      "id": 43,
      "student": {
        "id": 102,
        "name": "Sarah Chen",
        "email": "sarah.chen@tamu.edu",
        "major": "Business Analytics",
        "year": "Senior"
      },
      "message": "Looking for guidance...",
      "status": "pending",
      "created_at": "2024-01-24T14:20:00Z"
    }
  ]
}
```

---

### 3. Update Request Status

**Endpoint:** `PUT /api/request/:id/status`

**Purpose:** Mentor accepts or declines a connection request

**Request:**
```json
{
  "status": "accepted"  // or "declined"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Request accepted successfully",
  "data": {
    "id": 42,
    "status": "accepted",
    "updated_at": "2024-01-25T11:00:00Z"
  }
}
```

---

### 4. Get Student's Sent Requests

**Endpoint:** `GET /api/student/my-requests`

**Purpose:** Student views all their sent requests

**Response Success (200):**
```json
{
  "success": true,
  "count": 2,
  "requests": [
    {
      "id": 42,
      "mentor": {
        "id": 1,
        "name": "Sarah Johnson",
        "company": "ExxonMobil",
        "role": "Senior Data Scientist"
      },
      "status": "pending",
      "created_at": "2024-01-25T10:30:00Z"
    }
  ]
}
```

---

## Backend Implementation

### Python/Flask

```python
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
db = SQLAlchemy(app)

# Model
class ConnectionRequest(db.Model):
    __tablename__ = 'connection_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.Enum('pending', 'accepted', 'declined'), default='pending')
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sender = db.relationship('User', foreign_keys=[sender_id])
    receiver = db.relationship('User', foreign_keys=[receiver_id])
    
    __table_args__ = (
        db.UniqueConstraint('sender_id', 'receiver_id', name='unique_request'),
    )

# 1. Send Connection Request
@app.route('/api/send-request', methods=['POST'])
def send_request():
    data = request.get_json()
    
    mentor_id = data.get('mentor_id')
    student_id = data.get('student_id')
    message = data.get('message', '')
    
    # Validation
    if not mentor_id or not student_id:
        return jsonify({"success": False, "error": "Missing required fields"}), 400
    
    # Check if mentor exists
    mentor = User.query.get(mentor_id)
    if not mentor:
        return jsonify({"success": False, "error": "Mentor not found"}), 404
    
    # Check for duplicate request
    existing = ConnectionRequest.query.filter_by(
        sender_id=student_id,
        receiver_id=mentor_id
    ).first()
    
    if existing:
        return jsonify({
            "success": False, 
            "error": "You have already sent a request to this mentor"
        }), 400
    
    # Create new request
    new_request = ConnectionRequest(
        sender_id=student_id,
        receiver_id=mentor_id,
        message=message
    )
    
    db.session.add(new_request)
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": "Connection request sent successfully",
        "request_id": new_request.id,
        "data": {
            "id": new_request.id,
            "sender_id": new_request.sender_id,
            "receiver_id": new_request.receiver_id,
            "status": new_request.status,
            "created_at": new_request.created_at.isoformat()
        }
    }), 201

# 2. Get Mentor's Pending Requests
@app.route('/api/mentor/requests', methods=['GET'])
def get_mentor_requests():
    mentor_id = request.args.get('mentor_id')  # Or get from auth token
    status_filter = request.args.get('status', 'pending')
    
    if not mentor_id:
        return jsonify({"success": False, "error": "Mentor ID required"}), 400
    
    # Query requests
    requests = ConnectionRequest.query.filter_by(
        receiver_id=mentor_id,
        status=status_filter
    ).order_by(ConnectionRequest.created_at.desc()).all()
    
    # Format response
    result = []
    for req in requests:
        student = req.sender
        result.append({
            "id": req.id,
            "student": {
                "id": student.id,
                "name": student.name,
                "email": student.email,
                "major": student.major,
                "year": student.year
            },
            "message": req.message,
            "status": req.status,
            "created_at": req.created_at.isoformat()
        })
    
    return jsonify({
        "success": True,
        "count": len(result),
        "requests": result
    }), 200

# 3. Update Request Status
@app.route('/api/request/<int:request_id>/status', methods=['PUT'])
def update_request_status(request_id):
    data = request.get_json()
    new_status = data.get('status')
    
    if new_status not in ['accepted', 'declined']:
        return jsonify({"success": False, "error": "Invalid status"}), 400
    
    # Get request
    conn_request = ConnectionRequest.query.get(request_id)
    if not conn_request:
        return jsonify({"success": False, "error": "Request not found"}), 404
    
    # Update status
    conn_request.status = new_status
    conn_request.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": f"Request {new_status} successfully",
        "data": {
            "id": conn_request.id,
            "status": conn_request.status,
            "updated_at": conn_request.updated_at.isoformat()
        }
    }), 200

# 4. Get Student's Sent Requests
@app.route('/api/student/my-requests', methods=['GET'])
def get_student_requests():
    student_id = request.args.get('student_id')  # Or get from auth token
    
    if not student_id:
        return jsonify({"success": False, "error": "Student ID required"}), 400
    
    requests = ConnectionRequest.query.filter_by(
        sender_id=student_id
    ).order_by(ConnectionRequest.created_at.desc()).all()
    
    result = []
    for req in requests:
        mentor = req.receiver
        result.append({
            "id": req.id,
            "mentor": {
                "id": mentor.id,
                "name": mentor.name,
                "company": mentor.company,
                "role": mentor.role
            },
            "status": req.status,
            "created_at": req.created_at.isoformat()
        })
    
    return jsonify({
        "success": True,
        "count": len(result),
        "requests": result
    }), 200
```

---

### Node.js/Express

```javascript
const express = require('express');
const router = express.Router();

// Assuming Mongoose models
const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/User');

// 1. Send Connection Request
router.post('/send-request', async (req, res) => {
  try {
    const { mentor_id, student_id, message } = req.body;
    
    // Validation
    if (!mentor_id || !student_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Check if mentor exists
    const mentor = await User.findById(mentor_id);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        error: 'Mentor not found'
      });
    }
    
    // Check for duplicate request
    const existing = await ConnectionRequest.findOne({
      sender_id: student_id,
      receiver_id: mentor_id
    });
    
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'You have already sent a request to this mentor'
      });
    }
    
    // Create new request
    const newRequest = new ConnectionRequest({
      sender_id: student_id,
      receiver_id: mentor_id,
      message: message || '',
      status: 'pending'
    });
    
    await newRequest.save();
    
    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      request_id: newRequest._id,
      data: {
        id: newRequest._id,
        sender_id: newRequest.sender_id,
        receiver_id: newRequest.receiver_id,
        status: newRequest.status,
        created_at: newRequest.created_at
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 2. Get Mentor's Pending Requests
router.get('/mentor/requests', async (req, res) => {
  try {
    const { mentor_id, status = 'pending' } = req.query;
    
    if (!mentor_id) {
      return res.status(400).json({
        success: false,
        error: 'Mentor ID required'
      });
    }
    
    const requests = await ConnectionRequest.find({
      receiver_id: mentor_id,
      status: status
    })
    .populate('sender_id', 'name email major year')
    .sort({ created_at: -1 });
    
    const result = requests.map(req => ({
      id: req._id,
      student: {
        id: req.sender_id._id,
        name: req.sender_id.name,
        email: req.sender_id.email,
        major: req.sender_id.major,
        year: req.sender_id.year
      },
      message: req.message,
      status: req.status,
      created_at: req.created_at
    }));
    
    res.json({
      success: true,
      count: result.length,
      requests: result
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 3. Update Request Status
router.put('/request/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }
    
    const request = await ConnectionRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }
    
    request.status = status;
    request.updated_at = new Date();
    await request.save();
    
    res.json({
      success: true,
      message: `Request ${status} successfully`,
      data: {
        id: request._id,
        status: request.status,
        updated_at: request.updated_at
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
```

---

## Frontend Integration

### Replace Mock with Real API

In `MentorCardActions.jsx`, replace the mock function with real API call:

```javascript
const handleRequestConnection = async () => {
  setIsRequesting(true)

  try {
    const response = await fetch('/api/send-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}` // Add auth token
      },
      body: JSON.stringify({
        mentor_id: mentor.id,
        student_id: getCurrentStudentId(), // Get from auth context
        message: 'I would love to connect and learn from your experience.'
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send request')
    }
    
    const data = await response.json()
    setRequestSent(true)
    
    if (onRequestSent) {
      onRequestSent()
    }
  } catch (error) {
    console.error('Error:', error)
    alert(error.message)
  } finally {
    setIsRequesting(false)
  }
}
```

---

## Testing

### Test Send Request
```bash
curl -X POST http://localhost:5000/api/send-request \
  -H "Content-Type: application/json" \
  -d '{
    "mentor_id": 1,
    "student_id": 101,
    "message": "I would love to connect"
  }'
```

### Test Get Mentor Requests
```bash
curl http://localhost:5000/api/mentor/requests?mentor_id=1&status=pending
```

### Test Update Status
```bash
curl -X PUT http://localhost:5000/api/request/42/status \
  -H "Content-Type: application/json" \
  -d '{"status": "accepted"}'
```

---

Complete implementation ready for deployment!

