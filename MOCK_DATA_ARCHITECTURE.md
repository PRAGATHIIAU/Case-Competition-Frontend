# Mock Data Architecture - CMIS Engagement Platform

## Overview

The application now uses a **centralized MockDataProvider** context that enables real-time data synchronization across all dashboards. This architecture ensures that actions in one dashboard (e.g., student uploads a file) are immediately reflected in other dashboards (e.g., judge sees the file).

---

## Architecture Components

### 1. MockDataContext (`src/contexts/MockDataContext.jsx`)

**Purpose:** Centralized state management for the entire application.

**Key State:**
- `currentUser`: Role switcher ('student', 'industry', 'faculty')
- `teams`: Array of team objects with submission and scoring data
- `events`: Array of events with RSVP status
- `mentors`: Array of mentors with match scores
- `studentSkills`: Student's parsed resume skills
- `resumeParsed`: Boolean flag for resume parsing status
- `mentorshipRequests`: Pending/accepted/declined requests
- `kpis`: Faculty dashboard metrics

**Key Actions:**
- `submitTeamFile(teamId, fileName)`: Mark team file as submitted
- `scoreTeam(teamId, scores, feedback)`: Update team score and feedback
- `toggleEventRSVP(eventId)`: Toggle event registration
- `updateStudentSkills(newSkills)`: Update skills from resume parsing
- `handleMentorshipRequest(requestId, action)`: Accept/decline mentorship

---

## Data Flow Examples

### Example 1: Student Uploads File → Judge Sees It

**Student Dashboard:**
```javascript
const { submitTeamFile } = useMockData()

const handleFileUpload = () => {
  submitTeamFile(myTeam.id, 'TeamSolution.pdf')
}
```

**Industry Dashboard (Judge View):**
```javascript
const { teams } = useMockData()

// Automatically shows "File Ready" icon when team.fileSubmitted === true
{teams.map(team => (
  <div>
    {team.fileSubmitted && <FileCheck className="text-green-600" />}
    {team.fileName}
  </div>
))}
```

---

### Example 2: Judge Scores Team → Leaderboard Updates

**Industry Dashboard (Scoring):**
```javascript
const { scoreTeam } = useMockData()

const handleSaveScore = (scores) => {
  scoreTeam(selectedTeam.id, scores, feedback)
  // Leaderboard automatically updates via context
}
```

**Leaderboard Component:**
```javascript
const { teams } = useMockData()

// Automatically sorts teams by score
const sortedTeams = [...teams].sort((a, b) => b.score - a.score)
```

---

### Example 3: Resume Upload → Mentor Match Updates

**Student Dashboard (Profile):**
```javascript
const { updateStudentSkills } = useMockData()

const handleResumeUpload = async () => {
  // AI scanning simulation
  const extractedSkills = ['Python', 'SQL', 'Tableau']
  updateStudentSkills(extractedSkills)
  // Mentor match scores automatically recalculate
}
```

**Mentor Match Component:**
```javascript
const { studentSkills, mentors } = useMockData()

// Mentors automatically re-sort by match score
const matchedMentors = mentors.map(mentor => ({
  ...mentor,
  matchScore: calculateMatch(studentSkills, mentor.skills)
})).sort((a, b) => b.matchScore - a.matchScore)
```

---

## Component Integration

### App.jsx Structure

```javascript
<MockDataProvider>
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/industry" element={<IndustryDashboard />} />
      <Route path="/faculty" element={<FacultyDashboard />} />
    </Routes>
  </Router>
</MockDataProvider>
```

### Using the Context in Components

```javascript
import { useMockData } from '../contexts/MockDataContext'

export default function MyComponent() {
  const { 
    teams,           // Read state
    scoreTeam,       // Update state
    currentUser 
  } = useMockData()
  
  // Component logic...
}
```

---

## State Management Best Practices

### 1. Read-Only Access
```javascript
const { teams, events } = useMockData()
// Don't mutate directly: teams[0].score = 100 ❌
```

### 2. Use Action Functions
```javascript
const { scoreTeam } = useMockData()
// Do this: scoreTeam(teamId, scores, feedback) ✅
```

### 3. Automatic Re-renders
Components using `useMockData()` automatically re-render when state changes.

---

## Data Schema

### Team Object
```javascript
{
  id: 1,
  name: "Data Warriors",
  members: ["Alice", "Bob", "Charlie"],
  fileSubmitted: boolean,
  fileName: string | null,
  submittedAt: ISO timestamp | null,
  score: number (0-50),
  scores: {
    presentation: number (0-10),
    feasibility: number (0-10),
    innovation: number (0-10),
    analysis: number (0-10),
    recommendations: number (0-10)
  } | null,
  feedback: string
}
```

### Event Object
```javascript
{
  id: 1,
  title: string,
  date: string,
  time: string,
  location: string,
  type: string,
  rsvpCount: number,
  isRegistered: boolean
}
```

### Mentor Object
```javascript
{
  id: 1,
  name: string,
  company: string,
  role: string,
  expertise: string,
  matchScore: number (0-100),
  skills: string[],
  bio: string,
  availability: "Available" | "Busy"
}
```

---

## Benefits of This Architecture

1. **Real-time Synchronization**: Changes propagate instantly across all dashboards
2. **Single Source of Truth**: All components read from the same state
3. **Easy Testing**: Mock data is centralized and easy to modify
4. **Scalable**: Easy to add new actions and state
5. **Type-Safe**: Can be enhanced with TypeScript
6. **Demo-Ready**: Works without backend, perfect for prototypes

---

## Future Enhancements

1. **LocalStorage Persistence**: Save state to localStorage
2. **Undo/Redo**: Add action history
3. **Real API Integration**: Replace context with API calls
4. **WebSocket Support**: Add real-time server updates
5. **Optimistic UI**: Update UI before server confirmation

---

## Usage Examples

### Student Dashboard
```javascript
const { teams, submitTeamFile, toggleEventRSVP, updateStudentSkills } = useMockData()
```

### Industry Dashboard
```javascript
const { teams, scoreTeam, mentorshipRequests, handleMentorshipRequest } = useMockData()
```

### Faculty Dashboard
```javascript
const { teams, events, kpis, mentors } = useMockData()
```

---

## Testing the Architecture

1. **Upload File Test:**
   - Go to Student Dashboard → Upload file
   - Go to Industry Dashboard → See file marked as submitted

2. **Scoring Test:**
   - Go to Industry Dashboard → Score a team
   - Go to Leaderboard → See updated rankings

3. **RSVP Test:**
   - Go to Student Dashboard → RSVP to event
   - Check event.rsvpCount increases by 1
   - Button changes to "Registered"

4. **Resume Parsing Test:**
   - Upload resume → See skills extracted
   - Go to Mentor Match → See match scores update

---

All components now share the same data source, creating a cohesive, interactive prototype experience!

