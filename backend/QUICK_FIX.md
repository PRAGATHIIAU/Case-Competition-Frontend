# 🔧 Quick Fix for "Route not found" Error

## Problem
- Backend was running on port 3000 (conflicts with frontend)
- Frontend route `/student` was being sent to backend (should be handled by React Router)

## ✅ Fixed
1. **Port changed to 5000** in `backend/config/server.js`
2. **404 handler updated** to ignore frontend routes

## 🚀 Restart Backend

```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run dev
```

You should now see:
```
🚀 Server is running on port 5000 in development mode
```

## ✅ Test

1. **Health check:**
   ```
   http://localhost:5000/health
   ```

2. **Frontend route (should work in browser):**
   ```
   http://localhost:3000/student
   ```
   (This is handled by React Router, not backend)

3. **API route (should work):**
   ```
   http://localhost:5000/api/mentors
   ```

## 📝 Important Notes

- **Frontend routes** (like `/student`, `/industry`) are handled by React Router
- **Backend API routes** must start with `/api` (like `/api/mentors`, `/api/students`)
- Frontend runs on **port 3000**
- Backend runs on **port 5000**
- Vite proxy forwards `/api/*` requests to backend automatically




