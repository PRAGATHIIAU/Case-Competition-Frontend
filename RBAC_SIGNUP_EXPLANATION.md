# How the System Distinguishes Between 3 Admin Types at Signup

## Overview

The system distinguishes between **3 types** of administrative users based on their **role** and **participant status**:

1. **Faculty** - Full access to everything
2. **Admin (Full)** - Full access (not a participant)
3. **Admin (Student Assistant)** - Limited access (is a participant)

## How It Works at Signup

### Step 1: User Selects Role

In the signup form, the user selects their role from a dropdown:

```
I am a:
├─ Student
├─ Alumni / Industry Partner
├─ Faculty          ← Select this for Faculty
└─ Admin            ← Select this for Admin (Full or Student Assistant)
```

### Step 2: If "Admin" is Selected

When the user selects **"Admin"**, an additional checkbox appears:

```
☐ I am also a participant in competitions
```

**This checkbox determines the distinction:**

- **Unchecked** (default) = **Admin (Full)**
  - `role = 'admin'`
  - `isParticipant = false`
  - ✅ Full access (can see judge comments, scores, leaderboards)

- **Checked** = **Admin (Student Assistant)**
  - `role = 'admin'`
  - `isParticipant = true`
  - ❌ Limited access (cannot see judge comments, scores, leaderboards)

### Step 3: If "Faculty" is Selected

When the user selects **"Faculty"**, no additional checkbox appears:

- `role = 'faculty'`
- `isParticipant = false` (not used for faculty)
- ✅ Full access (can see everything)

## Visual Flow

```
Signup Form
│
├─ Select Role: "Faculty"
│  └─→ Faculty Account Created
│      └─→ Full Access ✅
│
└─ Select Role: "Admin"
   │
   ├─ Checkbox UNCHECKED: "I am also a participant"
   │  └─→ Admin (Full) Account Created
   │      └─→ Full Access ✅
   │
   └─ Checkbox CHECKED: "I am also a participant"
      └─→ Admin (Student Assistant) Account Created
          └─→ Limited Access ❌ (no judge comments/scores)
```

## Database Storage

### Faculty
```sql
INSERT INTO users (role, is_participant, ...)
VALUES ('faculty', false, ...)
```

### Admin (Full)
```sql
INSERT INTO users (role, is_participant, ...)
VALUES ('admin', false, ...)
```

### Admin (Student Assistant)
```sql
INSERT INTO users (role, is_participant, ...)
VALUES ('admin', true, ...)
```

## Permission Logic

The system uses this logic to determine access:

```javascript
if (role === 'faculty') {
  // Full access
  permissions = ALL_PERMISSIONS
} else if (role === 'admin') {
  if (isParticipant === true) {
    // Student Assistant - Limited access
    permissions = ADMIN_LIMITED_PERMISSIONS  // No judge comments/scores
  } else {
    // Full Admin - Full access
    permissions = ALL_PERMISSIONS
  }
}
```

## Example Signup Scenarios

### Scenario 1: Faculty Member
1. User selects: **"Faculty"**
2. No checkbox appears
3. Account created: `role='faculty'`, `is_participant=false`
4. Result: **Full Access** ✅

### Scenario 2: Full-Time Admin (Not a Participant)
1. User selects: **"Admin"**
2. Checkbox appears: **"I am also a participant"**
3. User leaves checkbox **UNCHECKED**
4. Account created: `role='admin'`, `is_participant=false`
5. Result: **Full Access** ✅

### Scenario 3: Student Assistant (Admin Who is a Participant)
1. User selects: **"Admin"**
2. Checkbox appears: **"I am also a participant"**
3. User **CHECKS** the checkbox
4. Account created: `role='admin'`, `is_participant=true`
5. Result: **Limited Access** ❌ (no judge comments/scores)

## UI Indicators

### During Signup
- **Faculty**: No additional options shown
- **Admin (Full)**: Checkbox shown but unchecked
- **Admin (Student Assistant)**: Checkbox shown and checked, with warning message

### After Login
- **Faculty Dashboard**: Shows "Full Faculty Access" badge
- **Admin Dashboard (Full)**: Shows "Full Admin Access" badge
- **Admin Dashboard (Student Assistant)**: Shows "Student Assistant (Limited Access)" badge + warning banner

## Why This Matters

**Student Assistants** who are also **participants** in competitions should **NOT** be able to see:
- Judge comments on their own or other teams' submissions
- Competition scores before they're officially announced
- Leaderboards that could influence their participation

This prevents **conflicts of interest** and ensures **fair competition**.

## Summary Table

| User Type | Role | isParticipant | Access Level |
|-----------|------|---------------|--------------|
| **Faculty** | `faculty` | `false` | ✅ Full Access |
| **Admin (Full)** | `admin` | `false` | ✅ Full Access |
| **Admin (Student Assistant)** | `admin` | `true` | ❌ Limited Access |

## Code Reference

- **Signup Form**: `frontend/src/components/SignupForm.jsx`
- **Permissions System**: `frontend/src/utils/permissions.js`
- **Database Schema**: `backend/models/user.model.js`
- **Migration Script**: `backend/scripts/add-participant-flag.js`



