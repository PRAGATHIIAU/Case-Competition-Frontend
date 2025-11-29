# 🧪 Backend Route Testing Guide

## ✅ All Routes Are Working!

All routes have been tested and are loading correctly.

## 🚀 How to Test Routes

### 1. Make sure backend is running:
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run dev
```

You should see:
```
🚀 Server is running on port 5000 in development mode
📊 Health check: http://localhost:5000/health
🔗 API base: http://localhost:5000/api
```

### 2. Test Routes in Browser or Postman:

#### ✅ Root Route (Working)
```
GET http://localhost:5000/
Response: {"message":"Hello world"}
```

#### ✅ Health Check
```
GET http://localhost:5000/health
Response: {"status":"healthy","database":"connected",...}
```

#### ✅ Get All Mentors
```
GET http://localhost:5000/api/mentors
Response: {"success":true,"count":0,"mentors":[]}
```

#### ✅ Recommend Mentors
```
POST http://localhost:5000/api/mentors/recommend
Content-Type: application/json
Body: {"skills": ["Python", "SQL", "React"]}
Response: {"success":true,"count":0,"mentors":[]}
```

#### ✅ Get Students
```
GET http://localhost:5000/api/students
Headers: Authorization: Bearer <token>
```

#### ✅ Get Events
```
GET http://localhost:5000/api/events
```

#### ✅ Search
```
GET http://localhost:5000/api/search?q=test
```

## 🔍 Common Issues

### Issue: "Route not found" for `/student`
**Solution:** `/student` is a **frontend route** (React Router), not a backend API route.
- Frontend route: `http://localhost:3000/student` ✅ (handled by React Router)
- Backend API route: `http://localhost:5000/api/students` ✅

### Issue: Getting "Hello world" for all routes
**Solution:** You're hitting the root route `/`. Make sure you're using:
- `/api/mentors` not `/mentors`
- `/api/students` not `/students`
- `/api/events` not `/events`

### Issue: Port conflicts
**Solution:** 
- Backend: Port **5000** ✅
- Frontend: Port **3000** ✅
- Check: `backend/config/server.js` should have `port: 5000`

## 📋 Complete Route List

### Public Routes
- `GET /` - Hello world
- `GET /health` - Health check

### Auth Routes
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user

### Student Routes
- `GET /api/students` - Get all students (requires auth)
- `GET /api/students/:id` - Get student by ID (requires auth)
- `POST /api/students/signup` - Register student
- `POST /api/students/login` - Login student

### Mentor Routes
- `GET /api/mentors` - Get all mentors
- `GET /api/mentors/:id` - Get mentor by ID
- `POST /api/mentors/recommend` - Recommend mentors

### Event Routes
- `GET /api/events` - Get all events
- `POST /api/events` - Create event

### Connection Routes
- `POST /api/send-request` - Send connection request
- `GET /api/my-requests` - Get user's requests
- `GET /api/mentor/requests` - Get mentor's requests
- `PUT /api/requests/:id` - Update request status

### Notification Routes
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

### Search Routes
- `GET /api/search?q=query` - Global search

## 🧪 Quick Test Commands

### Using curl (if installed):
```bash
# Health check
curl http://localhost:5000/health

# Get mentors
curl http://localhost:5000/api/mentors

# Recommend mentors
curl -X POST http://localhost:5000/api/mentors/recommend -H "Content-Type: application/json" -d "{\"skills\":[\"Python\"]}"
```

### Using Browser:
Just open these URLs:
- `http://localhost:5000/health`
- `http://localhost:5000/api/mentors`

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Can access `http://localhost:5000/health`
- [ ] Can access `http://localhost:5000/` (returns "Hello world")
- [ ] Can access `http://localhost:5000/api/mentors`
- [ ] Frontend running on port 3000
- [ ] Frontend can access `http://localhost:3000/student` (React Router)

---

**If you're still getting errors, share:**
1. The exact URL you're trying to access
2. The error message you're seeing
3. What you see in the backend console


