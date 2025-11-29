# 🚀 Quick Start for Presentation

## ⚡ Fast Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

This installs:
- `sequelize` - ORM for PostgreSQL
- `bcryptjs` - Password hashing

### Step 2: Seed Database
```bash
npm run seed
```

**What this does:**
- Drops all existing tables
- Creates fresh tables using Sequelize
- Creates 5 demo users (password: `123456`)
- Creates 2 events
- Creates 1 competition
- Creates 1 lecture

**Output:** "Database Seeded Successfully"

### Step 3: Start Backend
```bash
npm start
```

Backend runs on `http://localhost:5000`

### Step 4: Start Frontend (new terminal)
```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Redirects To |
|------|-------|----------|-------------|
| **Student** | `student@test.com` | `123456` | `/student/dashboard` |
| **Mentor** | `mentor@test.com` | `123456` | `/mentor/dashboard` |
| **Alumni** | `alumni@test.com` | `123456` | `/alumni/dashboard` |
| **Admin** | `admin@test.com` | `123456` | `/admin/dashboard` |
| **Faculty** | `faculty@test.com` | `123456` | `/faculty/dashboard` |

---

## ✅ What's Fixed

1. **Database Seeding** ✅
   - Seed script creates all demo users
   - Creates events and competitions
   - Uses Sequelize with `force: true` to reset database

2. **Sequelize Models** ✅
   - User model with name, email, password, role, skills
   - Event model with title, date, description, type
   - Lecture model with title, topic, date, professorId

3. **Authentication Routing** ✅
   - Login saves token and user to localStorage
   - Exact switch statement for role-based redirects
   - Protected routes check localStorage
   - Unauthenticated users redirected to home

---

## 🎯 Testing Checklist

- [ ] Run `npm install` in backend
- [ ] Run `npm run seed` - should see "Database Seeded Successfully"
- [ ] Start backend - should see "Server is running on port 5000"
- [ ] Start frontend - should see login page
- [ ] Login with `student@test.com` / `123456`
- [ ] Should redirect to `/student/dashboard`
- [ ] Try logging out and accessing `/student/dashboard` directly
- [ ] Should redirect to `/` (protected route working)

---

## 🐛 If Something Goes Wrong

### Port 5000 in use?
```bash
# Windows
backend\KILL_PORT_5000.bat

# Or manually
netstat -ano | findstr :5000
taskkill /F /PID <PID>
```

### Database connection error?
- Check `.env` file has correct DB credentials
- Make sure PostgreSQL is running
- Verify database `alumni_portal` exists

### Sequelize errors?
- Make sure `npm install` completed successfully
- Check that `sequelize` and `bcryptjs` are in `node_modules`

---

## 📝 Files Created/Modified

### Backend
- ✅ `backend/config/database.js` - Sequelize config
- ✅ `backend/models/User.js` - User Sequelize model
- ✅ `backend/models/Event.js` - Event Sequelize model
- ✅ `backend/models/Lecture.js` - Lecture Sequelize model
- ✅ `backend/models/Competition.js` - Competition Sequelize model
- ✅ `backend/seed.js` - Database seeding script
- ✅ `backend/package.json` - Added sequelize, bcryptjs, seed script

### Frontend
- ✅ `frontend/src/components/LoginForm.jsx` - Fixed redirect logic
- ✅ `frontend/src/components/ProtectedRoute.jsx` - New protected route component
- ✅ `frontend/src/App.jsx` - Added protected routes

---

## 🎉 You're Ready!

Everything is set up and ready for your presentation. The system is stable with:
- Working database seeding
- Correct Sequelize models
- Proper authentication routing
- Protected routes

**Good luck!** 🚀

