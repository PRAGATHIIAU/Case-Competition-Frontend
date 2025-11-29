# Role-Based Access Control (RBAC) & Permissions Guide

## Overview

This system implements granular permissions to separate **Faculty** from **Admin** roles, with special handling for **Student Assistants** (admins who are also participants in competitions).

## User Roles & Access Levels

### 1. **Faculty** (Full Access)
- **Role**: `faculty`
- **Access**: Full access to all features
- **Can See**:
  - ✅ All analytics and overview data
  - ✅ Judge comments and feedback
  - ✅ Competition scores and leaderboards
  - ✅ All event/lecture/competition management features
  - ✅ Judge invitation management
  - ✅ Communication center
  - ✅ Inactive alumni management

### 2. **Admin (Full)** - Not a Participant
- **Role**: `admin`
- **Flag**: `is_participant = false` (or not set)
- **Access**: Full access (same as faculty)
- **Can See**: Everything faculty can see

### 3. **Admin (Student Assistant)** - Is a Participant
- **Role**: `admin`
- **Flag**: `is_participant = true`
- **Access**: Limited access (cannot see sensitive competition data)
- **Can See**:
  - ✅ Analytics and overview
  - ✅ Event/lecture/competition creation
  - ✅ Attendance management
  - ✅ Judge invitation management
  - ✅ Communication center
  - ✅ Inactive alumni management
- **Cannot See**:
  - ❌ Judge comments
  - ❌ Competition scores
  - ❌ Leaderboards
  - ❌ Judge feedback

## Database Schema

### Users Table
```sql
ALTER TABLE users
ADD COLUMN is_participant BOOLEAN DEFAULT FALSE NOT NULL;
```

### Migration Script
Run the migration script to add the column:
```bash
cd backend
node scripts/add-participant-flag.js
```

## Permission System

### Location
`frontend/src/utils/permissions.js`

### Key Functions

#### `hasPermission(permission, user)`
Check if a user has a specific permission.

```javascript
import { hasPermission, PERMISSIONS } from '../utils/permissions'

// Check if user can view judge comments
if (hasPermission(PERMISSIONS.VIEW_JUDGE_COMMENTS, currentUser)) {
  // Show judge comments
}
```

#### `isStudentAssistant(user)`
Check if user is a student assistant (admin who is also a participant).

```javascript
import { isStudentAssistant } from '../utils/permissions'

if (isStudentAssistant(currentUser)) {
  // Show limited access warning
}
```

#### `getAccessLevelDescription(user)`
Get human-readable access level description.

```javascript
import { getAccessLevelDescription } from '../utils/permissions'

const description = getAccessLevelDescription(currentUser)
// Returns: "Full Faculty Access", "Student Assistant (Limited Access)", or "Full Admin Access"
```

## Available Permissions

All permissions are defined in `PERMISSIONS` object:

- `VIEW_ANALYTICS` - View analytics dashboard
- `VIEW_OVERVIEW` - View overview dashboard
- `VIEW_INACTIVE_ALUMNI` - View inactive alumni list
- `CREATE_EVENT` - Create events
- `MANAGE_EVENTS` - Manage events
- `CREATE_LECTURE` - Create lectures
- `MANAGE_ATTENDANCE` - Manage lecture attendance
- `CREATE_COMPETITION` - Create competitions
- `MANAGE_COMPETITIONS` - Manage competitions
- `VIEW_JUDGE_COMMENTS` - ⚠️ SENSITIVE: View judge comments (faculty/full admin only)
- `VIEW_COMPETITION_SCORES` - ⚠️ SENSITIVE: View competition scores (faculty/full admin only)
- `VIEW_LEADERBOARD` - ⚠️ SENSITIVE: View leaderboard (faculty/full admin only)
- `MANAGE_JUDGE_INVITATIONS` - Manage judge invitations
- `VIEW_JUDGE_FEEDBACK` - ⚠️ SENSITIVE: View judge feedback (faculty/full admin only)
- `ACCESS_COMMUNICATION_CENTER` - Access communication center
- `SEND_REENGAGEMENT_EMAILS` - Send re-engagement emails
- `CREATE_TEAMS` - Create teams
- `MANAGE_TEAMS` - Manage teams
- `UPLOAD_CASE_FILES` - Upload case files

## Implementation in Components

### Admin Dashboard
The Admin Dashboard automatically filters navigation items based on permissions:

```javascript
import { hasPermission } from '../utils/permissions'

const navItems = [
  { id: 'judge-comments', label: 'Judge Comments', permission: 'view_judge_comments' },
  // ... other items
].filter(item => hasPermission(item.permission, currentUser))
```

### Faculty Dashboard
Faculty Dashboard shows all features (full access).

### Protecting Sensitive Data
When displaying judge comments, scores, or leaderboards, always check permissions:

```javascript
import { hasPermission, PERMISSIONS } from '../utils/permissions'

{hasPermission(PERMISSIONS.VIEW_JUDGE_COMMENTS, currentUser) && (
  <JudgeCommentsList />
)}
```

## Setting User as Student Assistant

### During Signup
When creating an admin account that is also a participant:

```javascript
const signupData = {
  name: "John Doe",
  email: "john@tamu.edu",
  password: "password123",
  role: "admin",
  isParticipant: true  // Set this flag
}
```

### After Signup (Update)
Update an existing admin to be a participant:

```javascript
// Via API
PUT /api/auth/user/:id
{
  isParticipant: true
}
```

### Direct Database Update
```sql
UPDATE users
SET is_participant = true
WHERE id = <user_id> AND role = 'admin';
```

## UI Indicators

### Access Level Badge
Both dashboards show an access level badge in the header:
- "Full Faculty Access" (faculty)
- "Full Admin Access" (admin, not participant)
- "Student Assistant (Limited Access)" (admin, participant)

### Warning Banner
Student assistants see a warning banner:
> ⚠️ Limited Access: You are a participant and cannot view judge comments or competition scores.

## Best Practices

1. **Always Check Permissions**: Never assume a user has access. Always use `hasPermission()`.

2. **Hide, Don't Disable**: If a user doesn't have permission, hide the feature entirely rather than showing it disabled.

3. **Clear Messaging**: If access is denied, provide a clear explanation.

4. **Backend Validation**: Always validate permissions on the backend as well. Frontend checks are for UX only.

5. **Audit Trail**: Consider logging permission checks for security auditing.

## Example: Competition Management

```javascript
// ✅ Student Assistant CAN create competitions
{hasPermission(PERMISSIONS.CREATE_COMPETITION, currentUser) && (
  <CompetitionForm />
)}

// ❌ Student Assistant CANNOT see judge comments
{hasPermission(PERMISSIONS.VIEW_JUDGE_COMMENTS, currentUser) && (
  <JudgeCommentsList competitionId={competitionId} />
)}

// ❌ Student Assistant CANNOT see scores
{hasPermission(PERMISSIONS.VIEW_COMPETITION_SCORES, currentUser) && (
  <Leaderboard teams={teams} />
)}
```

## Testing

### Test Cases

1. **Faculty Login**: Should see all features
2. **Full Admin Login** (not participant): Should see all features
3. **Student Assistant Login** (participant): Should see limited features, no judge comments/scores

### Manual Testing

1. Create an admin user with `is_participant = false`
2. Login and verify all features are visible
3. Update user to `is_participant = true`
4. Refresh and verify sensitive features are hidden
5. Check that warning banner appears

## Migration

To add the `is_participant` column to existing databases:

```bash
cd backend
node scripts/add-participant-flag.js
```

This script:
- Adds `is_participant` column (defaults to `false`)
- Creates an index for performance
- Provides usage instructions

## Future Enhancements

Potential improvements:
- More granular permissions (e.g., view-only vs. edit)
- Permission groups/roles
- Time-based permissions
- IP-based restrictions
- Audit logging for permission checks



