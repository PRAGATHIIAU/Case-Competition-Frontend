# Backend API Specification - Smart Matching Feature

## Overview

This document specifies the backend API endpoint needed to support the Smart Matching feature that connects resume parsing to mentor recommendations.

---

## Endpoint: Recommend Mentors

### `POST /api/recommend-mentors`

**Purpose:** Accepts extracted skills from a resume and returns recommended mentors ranked by match score.

### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token} (optional)
```

**Body:**
```json
{
  "skills": ["Python", "SQL", "Tableau", "Machine Learning", "React"]
}
```

**Parameters:**
- `skills` (array of strings, required): List of skills extracted from student's resume

### Response

**Success (200 OK):**
```json
{
  "success": true,
  "count": 4,
  "mentors": [
    {
      "id": 1,
      "name": "Sarah Johnson",
      "company": "ExxonMobil",
      "role": "Senior Data Scientist",
      "expertise": "Cyber Security at Exxon",
      "skills": ["Python", "Data Analytics", "ML"],
      "bio": "10+ years in data science...",
      "matchScore": 98,
      "skillOverlap": 3,
      "matchingSkills": ["Python", "Machine Learning", "Data Analytics"],
      "availability": "Available"
    },
    {
      "id": 4,
      "name": "David Park",
      "company": "Lockheed Martin",
      "role": "Cybersecurity Architect",
      "skills": ["Cyber Security", "Python", "Network Security"],
      "matchScore": 85,
      "skillOverlap": 1,
      "matchingSkills": ["Python"],
      "availability": "Available"
    }
  ]
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "error": "Skills array is required"
}
```

**Error (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Database query failed"
}
```

---

## Database Schema

### Mentors Table/Collection

```sql
CREATE TABLE mentors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  company VARCHAR(255),
  role VARCHAR(255),
  expertise TEXT,
  skills JSON, -- Array of skill strings
  bio TEXT,
  availability ENUM('Available', 'Busy', 'Unavailable') DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Example Document (MongoDB):**
```json
{
  "_id": ObjectId("..."),
  "name": "Sarah Johnson",
  "email": "sarah.johnson@exxonmobil.com",
  "company": "ExxonMobil",
  "role": "Senior Data Scientist",
  "expertise": "Cyber Security at Exxon",
  "skills": ["Python", "Data Analytics", "ML", "TensorFlow"],
  "bio": "10+ years in data science, specializing in cybersecurity applications.",
  "availability": "Available",
  "createdAt": ISODate("2024-01-15T00:00:00Z")
}
```

---

## Backend Implementation Logic

### Algorithm Steps

1. **Receive Skills Array**
   ```python
   skills = request.json.get('skills', [])
   if not skills:
       return {"error": "Skills array is required"}, 400
   ```

2. **Query Mentors**
   ```python
   # SQL Example
   mentors = db.execute(
       "SELECT * FROM mentors WHERE availability = 'Available'"
   ).fetchall()
   
   # MongoDB Example
   mentors = db.mentors.find({"availability": "Available"})
   ```

3. **Calculate Match Score for Each Mentor**
   ```python
   def calculate_match_score(student_skills, mentor_skills):
       # Convert to lowercase for case-insensitive matching
       student_set = set(s.lower() for s in student_skills)
       mentor_set = set(s.lower() for s in mentor_skills)
       
       # Count overlapping skills
       overlap = len(student_set & mentor_set)
       
       if overlap == 0:
           return 0, 0, []
       
       # Calculate percentage
       max_possible = max(len(student_set), len(mentor_set))
       base_score = (overlap / max_possible) * 100
       
       # Add bonus for multiple matches
       bonus = 10 if overlap >= 3 else 5 if overlap >= 2 else 0
       
       match_score = min(100, int(base_score + bonus))
       matching_skills = list(student_set & mentor_set)
       
       return match_score, overlap, matching_skills
   ```

4. **Rank and Sort Results**
   ```python
   results = []
   for mentor in mentors:
       score, overlap, matching = calculate_match_score(
           skills, 
           mentor['skills']
       )
       
       if score > 0:  # Only include mentors with at least 1 match
           results.append({
               **mentor,
               'matchScore': score,
               'skillOverlap': overlap,
               'matchingSkills': matching
           })
   
   # Sort by match score (descending), then by overlap
   results.sort(key=lambda x: (x['matchScore'], x['skillOverlap']), reverse=True)
   ```

5. **Return Response**
   ```python
   return {
       "success": True,
       "count": len(results),
       "mentors": results
   }, 200
   ```

---

## Example Backend Code

### Python/Flask

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/recommend-mentors', methods=['POST'])
def recommend_mentors():
    data = request.get_json()
    skills = data.get('skills', [])
    
    if not skills or not isinstance(skills, list):
        return jsonify({"success": False, "error": "Skills array is required"}), 400
    
    try:
        # Query database (example with SQLAlchemy)
        mentors = Mentor.query.filter_by(availability='Available').all()
        
        results = []
        for mentor in mentors:
            score, overlap, matching = calculate_match_score(skills, mentor.skills)
            
            if score > 0:
                results.append({
                    'id': mentor.id,
                    'name': mentor.name,
                    'company': mentor.company,
                    'role': mentor.role,
                    'skills': mentor.skills,
                    'bio': mentor.bio,
                    'matchScore': score,
                    'skillOverlap': overlap,
                    'matchingSkills': matching,
                    'availability': mentor.availability
                })
        
        # Sort by match score
        results.sort(key=lambda x: (x['matchScore'], x['skillOverlap']), reverse=True)
        
        return jsonify({
            "success": True,
            "count": len(results),
            "mentors": results
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

def calculate_match_score(student_skills, mentor_skills):
    student_set = set(s.lower() for s in student_skills)
    mentor_set = set(s.lower() for s in mentor_skills)
    
    overlap = len(student_set & mentor_set)
    if overlap == 0:
        return 0, 0, []
    
    max_possible = max(len(student_set), len(mentor_set))
    base_score = (overlap / max_possible) * 100
    bonus = 10 if overlap >= 3 else 5 if overlap >= 2 else 0
    
    match_score = min(100, int(base_score + bonus))
    matching_skills = list(student_set & mentor_set)
    
    return match_score, overlap, matching_skills
```

### Node.js/Express

```javascript
const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/recommend-mentors', async (req, res) => {
  const { skills } = req.body;
  
  if (!skills || !Array.isArray(skills)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Skills array is required' 
    });
  }
  
  try {
    // Query database
    const mentors = await Mentor.find({ availability: 'Available' });
    
    const results = mentors.map(mentor => {
      const { matchScore, skillOverlap, matchingSkills } = calculateMatchScore(
        skills, 
        mentor.skills
      );
      
      if (matchScore === 0) return null;
      
      return {
        id: mentor._id,
        name: mentor.name,
        company: mentor.company,
        role: mentor.role,
        skills: mentor.skills,
        bio: mentor.bio,
        matchScore,
        skillOverlap,
        matchingSkills,
        availability: mentor.availability
      };
    }).filter(Boolean); // Remove null entries
    
    // Sort by match score
    results.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return b.skillOverlap - a.skillOverlap;
    });
    
    res.json({
      success: true,
      count: results.length,
      mentors: results
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

function calculateMatchScore(studentSkills, mentorSkills) {
  const studentSet = new Set(studentSkills.map(s => s.toLowerCase()));
  const mentorSet = new Set(mentorSkills.map(s => s.toLowerCase()));
  
  const matching = [...studentSet].filter(s => mentorSet.has(s));
  const overlap = matching.length;
  
  if (overlap === 0) {
    return { matchScore: 0, skillOverlap: 0, matchingSkills: [] };
  }
  
  const maxPossible = Math.max(studentSet.size, mentorSet.size);
  const baseScore = (overlap / maxPossible) * 100;
  const bonus = overlap >= 3 ? 10 : overlap >= 2 ? 5 : 0;
  
  return {
    matchScore: Math.min(100, Math.round(baseScore + bonus)),
    skillOverlap: overlap,
    matchingSkills: matching
  };
}
```

---

## Frontend Integration

### Current Implementation (Mock Data)

```javascript
// In ProfileSection.jsx
const recommendations = getRecommendedMentors(result.skills, allMentors)
setRecommendedMentors(recommendations)
```

### Switch to Real API

```javascript
// Uncomment this block in ProfileSection.jsx
try {
  const response = await fetch('/api/recommend-mentors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills: result.skills })
  })
  const data = await response.json()
  setRecommendedMentors(data.mentors)
} catch (apiError) {
  console.error('Error fetching mentors:', apiError)
}
```

---

## Testing

### Test Cases

1. **Valid Skills Array**
   ```bash
   curl -X POST http://localhost:5000/api/recommend-mentors \
     -H "Content-Type: application/json" \
     -d '{"skills": ["Python", "SQL", "React"]}'
   ```

2. **Empty Skills Array**
   ```bash
   curl -X POST http://localhost:5000/api/recommend-mentors \
     -H "Content-Type: application/json" \
     -d '{"skills": []}'
   ```

3. **Case Insensitive Matching**
   ```bash
   curl -X POST http://localhost:5000/api/recommend-mentors \
     -H "Content-Type: application/json" \
     -d '{"skills": ["python", "SQL", "react"]}'
   ```

---

## Performance Considerations

1. **Database Indexing**: Create index on `skills` field
   ```sql
   CREATE INDEX idx_mentor_skills ON mentors ((skills));
   ```

2. **Caching**: Cache mentor list for 5-10 minutes
   ```python
   @cache.memoize(timeout=600)
   def get_available_mentors():
       return Mentor.query.filter_by(availability='Available').all()
   ```

3. **Pagination**: Limit results to top 10-20 mentors
   ```python
   results = results[:20]
   ```

---

This specification provides everything needed to implement the backend matching logic!

