# Fix: "column is_participant does not exist" Error

## Problem
When signing up as Faculty (or any role), you get the error:
```
column "is_participant" does not exist
```

## Solution

The column **DOES EXIST** in the database (verified), but the backend code needs to be updated and the server needs to be restarted.

### Step 1: Verify Column Exists
```bash
cd backend
node scripts/check-participant-column.js
```

Expected output:
```
✅ Column EXISTS: { column_name: 'is_participant', ... }
```

### Step 2: Restart Backend Server

**IMPORTANT:** The backend server must be restarted to pick up the code changes.

1. **Stop the current backend server** (Ctrl+C in the terminal where it's running)

2. **Start it again:**
   ```bash
   cd backend
   npm run dev
   ```

   Or if using the batch file:
   ```bash
   backend\start-backend.bat
   ```

### Step 3: Try Signup Again

After restarting the backend, try signing up again. The error should be fixed.

## What Was Fixed

1. ✅ Added column existence check in `createUser()` function
2. ✅ Added column existence check in `updateUser()` function  
3. ✅ Made RETURNING clause conditional (only includes `is_participant` if column exists)
4. ✅ Added better error handling and logging

## If Error Persists

If you still get the error after restarting:

1. **Check backend logs** - Look for the message:
   ```
   🔍 is_participant column check: EXISTS
   ```
   or
   ```
   🔍 is_participant column check: DOES NOT EXIST
   ```

2. **If it says "DOES NOT EXIST"**, run the migration:
   ```bash
   cd backend
   node scripts/add-participant-flag.js
   ```

3. **Verify database connection** - Make sure the backend is connecting to the correct database:
   ```bash
   cd backend
   node scripts/check-participant-column.js
   ```

## Code Changes Made

- `backend/repositories/user.repository.js`:
  - Added column check before INSERT
  - Added column check before UPDATE
  - Made RETURNING clause conditional
  - Added logging for debugging



