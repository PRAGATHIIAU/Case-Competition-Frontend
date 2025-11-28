# Smart Matching Implementation - Complete Guide

## Overview

The Smart Matching feature connects resume parsing directly to mentor recommendations, creating a seamless flow from skill extraction to mentor discovery.

---

## Flow Diagram

```
Student uploads resume
        ↓
AI parses resume (2 seconds)
        ↓
Skills extracted: ['Python', 'SQL', 'Tableau']
        ↓
Immediately calls recommendation engine
        ↓
POST /api/recommend-mentors { skills: [...] }
        ↓
Backend ranks mentors by skill overlap
        ↓
Returns sorted mentor list
        ↓
Frontend displays recommended mentors
        ↓
Student clicks "Request Connection"
        ↓
POST /api/send-request { mentor_id, student_id }
        ↓
Stores in ConnectionRequests table
        ↓
Button changes to "Request Sent" ✓
        ↓
Mentor sees request in their dashboard
        ↓
GET /api/mentor/requests?mentor_id=X
        ↓
Mentor accepts/declines
```

---

## Implementation Details

### 1. Resume Parsing → Mentor Matching

**File:** `src/components/student/ProfileSection.jsx`

**Function:** `handleResumeUpload()`

```javascript
const handleResumeUpload = async () => {
  setIsParsing(true)
  setParsingProgress('Scanning resume...')
  
  // Stage 1: Parse resume
  setTimeout(() => setParsingProgress('Extracting skills...'), 700)
  setTimeout(() => setParsingProgress('Analyzing experience...'), 1400)
  setTimeout(() => setParsingProgress('Finding mentor matches...'), 2100)
  
  // Step 1: Extract skills
  const result = await parseResume(null)
  setSkills(result.skills)
  setParsed(true)
  setIsParsing(false)
  
  // Step 2: Immediately fetch mentor recommendations
  setIsLoadingMentors(true)
  
  // CURRENT: Use mock data
  const recommendations = getRecommendedMentors(result.skills, allMentors)
  setRecommendedMentors(recommendations)
  setIsLoadingMentors(false)
  
  /* REAL API: Uncomment when backend is ready
  const response = await fetch('/api/recommend-mentors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills: result.skills })
  })
  const data = await response.json()
  setRecommendedMentors(data.mentors)
  */
}
```

**Result:** Recommended mentors appear automatically below extracted skills.

---

### 2. Connection Request Flow

**File:** `src/components/student/MentorCardActions.jsx`

**Function:** `handleRequestConnection()`

```javascript
const handleRequestConnection = async () => {
  setIsRequesting(true)

  try {
    // CURRENT: Mock simulation
    await sendConnectionRequestMock(mentor.id)
    
    /* REAL API: Uncomment when backend is ready
    const response = await fetch('/api/send-request', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        mentor_id: mentor.id,
        student_id: currentStudentId,
        message: 'I would love to connect...'
      })
    })
    
    if (!response.ok) throw new Error('Request failed')
    */
    
    setRequestSent(true)
    onRequestSent() // Triggers toast notification
  } catch (error) {
    alert('Failed to send request')
  } finally {
    setIsRequesting(false)
  }
}
```

**UI States:**
- Initial: "Request Connection" button (tamu-maroon)
- Loading: "Sending..." with spinner (gray)
- Success: "Request Sent" with checkmark (green, disabled)

---

### 3. LinkedIn Integration

**Conditional Rendering:**
```javascript
{mentor.linkedin_url && (
  <motion.button
    onClick={() => window.open(mentor.linkedin_url, '_blank')}
    className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg"
  >
    <Linkedin className="w-5 h-5" />
  </motion.button>
)}
```

**Only displays if:** `mentor.linkedin_url` exists in mentor object

---

## Backend Database Schema

### ConnectionRequests Table

```sql
CREATE TABLE connection_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,           -- Student who sent request
    receiver_id INT NOT NULL,         -- Mentor who receives request
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    message TEXT,                     -- Optional connection message
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    
    -- Prevent duplicate requests from same student to same mentor
    UNIQUE KEY unique_request (sender_id, receiver_id)
);

-- Indexes for fast queries
CREATE INDEX idx_receiver_status ON connection_requests(receiver_id, status);
CREATE INDEX idx_sender_status ON connection_requests(sender_id, status);
```

---

## Backend API Endpoints

### POST /api/send-request

**Receives:**
```json
{
  "mentor_id": 1,
  "student_id": 101,
  "message": "I would love to connect..."
}
```

**Logic:**
1. Validate mentor exists
2. Check for duplicate request (unique constraint)
3. Create new ConnectionRequest with status='pending'
4. Return success response

**Returns:**
```json
{
  "success": true,
  "request_id": 42,
  "message": "Connection request sent successfully"
}
```

---

### GET /api/mentor/requests

**Query Parameters:**
- `mentor_id`: ID of the mentor
- `status`: Filter by status (default: 'pending')

**SQL Query:**
```sql
SELECT 
    cr.*,
    s.name as student_name,
    s.email as student_email,
    s.major,
    s.year
FROM connection_requests cr
JOIN users s ON cr.sender_id = s.id
WHERE cr.receiver_id = ? 
  AND cr.status = ?
ORDER BY cr.created_at DESC;
```

**Returns:**
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
        "email": "john.doe@tamu.edu"
      },
      "message": "I would love to connect...",
      "status": "pending",
      "created_at": "2024-01-25T10:30:00Z"
    }
  ]
}
```

---

## Mentor Dashboard Integration

**File:** `src/components/IndustryDashboard.jsx` (already exists)

**Update Mentorship Tab to use real data:**

```javascript
import { useMockData } from '../contexts/MockDataContext'

export default function IndustryDashboard() {
  const { connectionRequests, handleMentorshipRequest } = useMockData()
  
  // Get current mentor's ID (from auth)
  const currentMentorId = 1 // Example
  
  // Filter requests for this mentor
  const myRequests = connectionRequests.filter(req => 
    req.receiver_id === currentMentorId && 
    req.status === 'pending'
  )
  
  return (
    // ... existing code ...
    {myRequests.map(request => (
      <div key={request.id}>
        <p>{request.studentName} requested to connect</p>
        <button onClick={() => handleMentorshipRequest(request.id, 'accepted')}>
          Accept
        </button>
        <button onClick={() => handleMentorshipRequest(request.id, 'declined')}>
          Decline
        </button>
      </div>
    ))}
  )
}
```

---

## Testing the Feature

### Test Flow:

1. **Student Side:**
   - Go to `/student` → Profile tab
   - Upload resume
   - See extracted skills
   - See recommended mentors appear
   - Click "Request Connection" on a mentor
   - See button change to "Request Sent"
   - If mentor has LinkedIn, see LinkedIn button
   - Click LinkedIn button → Opens in new tab

2. **Mentor Side:**
   - Go to `/industry` → Mentorship tab
   - See pending connection requests
   - Click Accept/Decline
   - Request status updates

---

## Mock Data vs Real API

### Current (Mock):
```javascript
// In MentorCardActions.jsx
await sendConnectionRequestMock(mentor.id)
```

### Switch to Real:
```javascript
// Uncomment lines in MentorCardActions.jsx
const response = await fetch('/api/send-request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mentor_id: mentor.id,
    student_id: getCurrentStudentId(),
    message: 'I would love to connect...'
  })
})
```

---

## Files Modified

1. ✅ `src/components/student/MentorCardActions.jsx` - NEW component for action buttons
2. ✅ `src/components/student/ProfileSection.jsx` - Integrated MentorCardActions
3. ✅ `src/components/student/MentorRecommendations.jsx` - Uses MentorCardActions
4. ✅ `src/contexts/MockDataContext.jsx` - Added connection request logic
5. ✅ `src/data/mockData.js` - Added linkedin_url to mentors
6. ✅ `MENTOR_CONNECTION_API.md` - Complete backend specification

---

All existing parsing and matching logic remains unchanged! ✅

