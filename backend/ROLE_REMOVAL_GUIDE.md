# Role-Based Logic Removal Guide

This document tracks the removal of role-based logic from the entire system.

## Database Changes

### Step 1: Run the removal script
```bash
cd backend
node scripts/remove-role-based-logic.js
```

This will:
- Drop the `faculty` table
- Remove the `role` column from `users` table (if it exists)
- Remove role-related indexes

## System Architecture After Changes

### Table-Based Identification (No Role Column)
- **`students` table** = Students
- **`users` table** = Alumni/Mentors/Judges/Speakers (no role column, use flags: isMentor, isJudge, isSpeaker)
- **No `faculty` table** = Removed

### User Type Determination
User type is determined by **which table they exist in**, not by a role column:
- If user exists in `students` table → Student
- If user exists in `users` table → Alumni/Mentor/Judge/Speaker (determined by flags)

## Files Modified

### ✅ Completed
1. `backend/scripts/remove-role-based-logic.js` - Script to drop faculty table and remove role column
2. `backend/controllers/auth.controller.js` - Removed role-based signup logic, removed faculty table references
3. `backend/repositories/user.repository.js` - Removed role column from INSERT/SELECT queries
4. `backend/services/auth.service.js` - Removed role validation and role field from RDS data

### 🔄 In Progress / TODO
1. `backend/routes/auth.js` - Update login to not use role, determine user type by table
2. `backend/services/auth.service.js` - Update login function to not use role
3. `backend/middleware/auth.js` - Remove role checks
4. `backend/middleware/adminAuth.js` - Update to use table-based checks
5. `backend/controllers/event.controller.js` - Remove role checks from RSVP
6. `backend/routes/event.routes.js` - Remove role-based route protection
7. All other controllers/services that check `user.role` or `req.user.role`

## Login Logic (After Changes)

Login should check tables in this order:
1. Check `students` table → If found, user is a student
2. Check `users` table → If found, user is alumni/mentor/judge/speaker (determined by flags)
3. Return error if not found in either table

JWT token should include:
- `id` - User ID
- `email` - User email
- `userType` - 'student' or 'alumni' (determined by which table)
- `isMentor`, `isJudge`, `isSpeaker` - Flags from users table (if applicable)

## Signup Logic (After Changes)

1. If `userType === 'student'` → Insert into `students` table
2. Otherwise → Insert into `users` table (with flags: isMentor, isJudge, isSpeaker)
3. NO role field in either table

## Testing Checklist

- [ ] Run removal script successfully
- [ ] Student signup works
- [ ] Alumni/Mentor signup works (no role column error)
- [ ] Student login works
- [ ] Alumni/Mentor login works
- [ ] RSVP for events works (no "user not found" error)
- [ ] All existing features work without role checks

