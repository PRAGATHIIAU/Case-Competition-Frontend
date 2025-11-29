# ⚠️ Backend Not Running!

## The Problem
Your backend server is not running, which is why you're getting "Server returned invalid response."

## Quick Fix

### Step 1: Start Backend (Open CMD)
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run dev
```

**You should see:**
```
Server running on port 5000
Connected to PostgreSQL database
✅ Backend ready at http://localhost:5000
```

### Step 2: Keep Backend Running
**Keep this terminal open!** The backend must stay running.

### Step 3: Try Signup Again
Go back to your browser and try creating the account again.

---

## Verify Backend is Running

Open browser and go to:
- http://localhost:5000/health

You should see:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

If you see this, backend is running! ✅

---

## Full Setup (If Needed)

### Terminal 1: Backend
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run dev
```

### Terminal 2: Frontend
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
npm run dev
```

---

**Once backend is running, try signup again!** 🚀



