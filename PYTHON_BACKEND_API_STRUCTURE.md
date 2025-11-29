# Python Backend API Structure

## Expected API Endpoints

Based on the requirements, the Python backend should expose the following endpoints:

### Base URL: `http://localhost:5000` (or configured port)

---

## 1. Dashboard Statistics

**Endpoint:** `GET /api/stats` or `GET /api/dashboard/stats`

**Purpose:** Get dashboard statistics (Active Students, Alumni Engagement %, Partner NPS, Active Events)

**Response Format:**
```json
{
  "success": true,
  "data": {
    "activeStudents": 245,
    "alumniEngagement": 78,
    "partnerNPS": 65,
    "activeEvents": 12
  }
}
```

**Expected Fields:**
- `activeStudents` (integer): Number of active students
- `alumniEngagement` (integer): Alumni engagement percentage (0-100)
- `partnerNPS` (integer): Partner Net Promoter Score
- `activeEvents` (integer): Number of active events

---

## 2. Inactive Alumni List

**Endpoint:** `GET /api/alumni/inactive` or `GET /api/inactive-alumni`

**Purpose:** Get list of alumni who haven't been active in the last 6 months

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "company": "Tech Corp",
      "title": "Senior Engineer",
      "lastActiveAt": "2024-05-15T10:30:00Z",
      "monthsInactive": 7
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "company": "Finance Inc",
      "title": "Manager",
      "lastActiveAt": "2024-04-20T14:20:00Z",
      "monthsInactive": 8
    }
  ]
}
```

**Expected Fields:**
- `id` (integer): Alumni ID
- `name` (string): Full name
- `email` (string): Email address
- `company` (string): Current company
- `title` (string): Job title
- `lastActiveAt` (string, ISO 8601): Last activity timestamp
- `monthsInactive` (integer): Number of months since last activity

---

## 3. Generate Re-engagement Email (AI)

**Endpoint:** `POST /api/alumni/generate-email` or `POST /api/generate-email`

**Purpose:** Generate AI-powered re-engagement email draft for an inactive alumni

**Request Format:**
```json
{
  "alumni_id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "company": "Tech Corp",
  "industry": "Technology",
  "lastActiveAt": "2024-05-15T10:30:00Z"
}
```

**Alternative (if only name/industry needed):**
```json
{
  "name": "John Doe",
  "industry": "Technology",
  "company": "Tech Corp"
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "email_draft": "Subject: Reconnecting with CMIS - Exciting Opportunities Await\n\nHi John,\n\nWe noticed it's been a while since we last connected, and we wanted to reach out with some exciting opportunities that align with your expertise in Technology at Tech Corp.\n\n...",
    "subject": "Reconnecting with CMIS - Exciting Opportunities Await",
    "personalized_content": "..."
  }
}
```

**Expected Fields:**
- `email_draft` (string): Full email draft with subject and body
- `subject` (string, optional): Email subject line
- `personalized_content` (string, optional): Main email body

---

## 4. Send Re-engagement Email

**Endpoint:** `POST /api/alumni/send-email` or `POST /api/send-reengagement-email`

**Purpose:** Send the generated re-engagement email to an alumni

**Request Format:**
```json
{
  "alumni_id": 1,
  "email": "john.doe@example.com",
  "email_draft": "Subject: ...\n\nHi John,\n\n..."
}
```

**Response Format:**
```json
{
  "success": true,
  "message": "Re-engagement email sent successfully",
  "data": {
    "alumni_id": 1,
    "email": "john.doe@example.com",
    "sent_at": "2024-12-28T15:30:00Z"
  }
}
```

---

## Error Response Format

All endpoints should return errors in this format:

```json
{
  "success": false,
  "error": "Error message here",
  "message": "Human-readable error message"
}
```

**HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

---

## CORS Configuration

The Python backend should allow CORS from:
- `http://localhost:3000` (frontend dev server)
- `http://localhost:5173` (alternative Vite port)

---

## Notes

1. **Port Configuration:** The Python backend should run on port 5000 (or configure via environment variable)
2. **Authentication:** If authentication is required, use JWT tokens in `Authorization: Bearer <token>` header
3. **Content-Type:** All requests/responses should use `application/json`
4. **Date Format:** Use ISO 8601 format for all timestamps

---

## Example Python Flask Implementation Structure

```python
# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from dashboard_stats import get_dashboard_stats
from alumni_engagement import get_inactive_alumni, generate_reengagement_email

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])

@app.route('/api/stats', methods=['GET'])
def dashboard_stats():
    stats = get_dashboard_stats()
    return jsonify({"success": True, "data": stats})

@app.route('/api/alumni/inactive', methods=['GET'])
def inactive_alumni():
    alumni = get_inactive_alumni()
    return jsonify({"success": True, "data": alumni})

@app.route('/api/alumni/generate-email', methods=['POST'])
def generate_email():
    data = request.json
    email_draft = generate_reengagement_email(
        name=data.get('name'),
        industry=data.get('industry'),
        company=data.get('company')
    )
    return jsonify({"success": True, "data": {"email_draft": email_draft}})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```



