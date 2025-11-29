# 🚀 Complete Setup Guide - Case Competition Platform

## 📋 Prerequisites
- Node.js (v18 or higher)
- PostgreSQL installed and running
- npm or yarn

---

## Step 1: Database Setup (PostgreSQL)

### 1.1 Create Database
Open **pgAdmin** or **psql** and run:

```sql
-- Create database
CREATE DATABASE case_competition_db;

-- Create user (optional)
CREATE USER case_competition_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE case_competition_db TO case_competition_user;
```

### 1.2 Initialize Database Tables
Open **CMD** and run:

```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run init-all
```

This creates all tables (users, students, mentors, events, competitions, etc.)

### 1.3 Run Migration (Unified Identity)
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run migrate:unified-identity
```

### 1.4 Seed Database (Demo Data)
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run seed
```

This creates:
- 5 demo users (Student, Mentor, Alumni, Admin, Faculty)
- 2 dummy events
- 1 dummy competition
- Password for all: `123456`

---

## Step 2: Backend Setup

### 2.1 Navigate to Backend
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
```

### 2.2 Install Dependencies
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm install
```

### 2.3 Create .env File
Create `backend/.env` file with:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=case_competition_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_SSL=false

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CORS
CORS_ORIGIN=http://localhost:3000

# AWS API Gateway URLs (Optional - for Lambda/S3/DynamoDB)
API_GATEWAY_UPLOAD_URL=
API_GATEWAY_DYNAMODB_URL=
API_GATEWAY_STUDENT_PROFILES_URL=
```

### 2.4 Start Backend Server
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run dev
```

**Expected Output:**
```
Server running on port 5000
Connected to PostgreSQL database
✅ Backend ready at http://localhost:5000
```

**Test Backend:**
Open browser: `http://localhost:5000/health`
Should return: `{"status":"healthy","database":"connected"}`

---

## Step 3: Frontend Setup

### 3.1 Navigate to Frontend
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
```

### 3.2 Install Dependencies
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
npm install
```

### 3.3 Start Frontend Server
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**Frontend will open automatically at:** `http://localhost:3000`

---

## Step 4: Test All Features

### 4.1 Login Credentials (From Seed Data)

| Role | Email | Password |
|------|-------|----------|
| Student | student@tamu.edu | 123456 |
| Mentor | mentor@tamu.edu | 123456 |
| Alumni | alumni@tamu.edu | 123456 |
| Admin | admin@tamu.edu | 123456 |
| Faculty | faculty@tamu.edu | 123456 |

### 4.2 Test Features Checklist

#### ✅ Authentication
- [ ] Sign up new user
- [ ] Login with seeded credentials
- [ ] Role-based redirect (Student → `/student/dashboard`)
- [ ] Logout functionality

#### ✅ Student Portal
- [ ] View student dashboard
- [ ] Update profile (skills, major, year)
- [ ] Upload resume
- [ ] Get mentor recommendations (`POST /api/mentors/recommend`)
- [ ] Send connection request to mentor
- [ ] View notifications

#### ✅ Industry Partner Portal (Alumni/Mentor/Judge/Speaker)
- [ ] Login as Alumni
- [ ] Role switcher (Mentor View, Judge View, Speaker View)
- [ ] View mentorship requests
- [ ] Accept/Decline mentorship
- [ ] View engagement history
- [ ] Judge competitions (if isJudge = true)
- [ ] Speaker sessions (if isSpeaker = true)

#### ✅ Mentor Mapping
- [ ] Upload resume → Get mentor recommendations
- [ ] Skills-based matching
- [ ] Match score calculation
- [ ] View recommended mentors with scores

#### ✅ Admin Dashboard
- [ ] Login as Admin
- [ ] View dashboard statistics
- [ ] View all students
- [ ] View all alumni
- [ ] View all events
- [ ] Update event status
- [ ] View inactive alumni
- [ ] Generate re-engagement draft (AI)
- [ ] Send re-engagement email

#### ✅ Events
- [ ] View all events (`GET /api/events`)
- [ ] Create event (`POST /api/events`)
- [ ] Filter by type (workshop/meetup)

#### ✅ Connections
- [ ] Send connection request (`POST /api/send-request`)
- [ ] View my requests (`GET /api/my-requests`)
- [ ] View mentor requests (`GET /api/mentor/requests`)

#### ✅ Search
- [ ] Global search (`GET /api/search?q=query`)
- [ ] Search students, mentors, events

---

## Step 5: API Endpoints Testing

### 5.1 Health Check
```cmd
curl http://localhost:5000/health
```

### 5.2 Get All API Routes
```cmd
curl http://localhost:5000/api
```

### 5.3 Test Login
```cmd
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"student@tamu.edu\",\"password\":\"123456\"}"
```

### 5.4 Test Mentor Recommendations
```cmd
curl -X POST http://localhost:5000/api/mentors/recommend -H "Content-Type: application/json" -d "{\"skills\":[\"JavaScript\",\"React\",\"Node.js\"]}"
```

### 5.5 Test Events
```cmd
curl http://localhost:5000/api/events
```

---

## Step 6: Complete CMD Commands (Copy-Paste Ready)

### Open CMD and run these commands in order:

#### Terminal 1: Backend
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm install
npm run init-all
npm run migrate:unified-identity
npm run seed
npm run dev
```

#### Terminal 2: Frontend
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
npm install
npm run dev
```

---

## Step 7: Verify Integration

### 7.1 Check Backend Routes
Visit: `http://localhost:5000/api`
Should show all available routes

### 7.2 Check Frontend Proxy
Frontend should proxy `/api/*` to `http://localhost:5000`

### 7.3 Test Full Flow
1. Open `http://localhost:3000`
2. Click "Sign Up"
3. Create Alumni account with contribution checkboxes
4. Login
5. Test role switcher
6. Test mentor recommendations
7. Test all dashboard features

---

## Step 8: Optional - AWS Lambda/S3/DynamoDB Setup

### 8.1 Lambda Functions
Location: `backend/lambda/`
- `s3-upload-handler.js` - Resume upload to S3
- `dynamodb-handler.js` - Extended profiles
- `alumni-profiles-handler.js` - Alumni profiles
- `student-profiles-handler.js` - Student profiles
- `ses-email-handler.js` - Email sending

### 8.2 Configure API Gateway URLs
Add to `backend/.env`:
```env
API_GATEWAY_UPLOAD_URL=https://xxxxx.execute-api.region.amazonaws.com/prod/upload
API_GATEWAY_DYNAMODB_URL=https://xxxxx.execute-api.region.amazonaws.com/prod/profile
API_GATEWAY_STUDENT_PROFILES_URL=https://xxxxx.execute-api.region.amazonaws.com/prod/student-profiles
```

**Note:** These are optional. Backend works without them (uses PostgreSQL only).

---

## Troubleshooting

### Backend won't start
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm install
npm run dev
```

### Database connection error
- Check PostgreSQL is running
- Verify `.env` file has correct DB credentials
- Test connection: `psql -U postgres -d case_competition_db`

### Port 5000 already in use
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
.\KILL_PORT_5000.bat
```

### Frontend won't connect to backend
- Check backend is running on port 5000
- Check `frontend/vite.config.js` proxy configuration
- Verify backend health: `http://localhost:5000/health`

### Tables not created
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run init-all
```

---

## Quick Start (All Commands)

### Backend Setup (Terminal 1):
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm install
npm run init-all
npm run migrate:unified-identity
npm run seed
npm run dev
```

### Frontend Setup (Terminal 2):
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
npm install
npm run dev
```

### Access:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health
- **API Routes:** http://localhost:5000/api

---

## ✅ Success Indicators

1. ✅ Backend shows: "Server running on port 5000"
2. ✅ Frontend shows: "VITE ready" and opens browser
3. ✅ Health check returns: `{"status":"healthy"}`
4. ✅ Can login with seeded credentials
5. ✅ All dashboards load correctly
6. ✅ Mentor recommendations work
7. ✅ All API endpoints respond

---

## 📝 Notes

- **Database:** PostgreSQL (required)
- **Backend Port:** 5000
- **Frontend Port:** 3000
- **Default Password:** 123456 (for all seeded users)
- **AWS Services:** Optional (backend works without them)

---

**🎉 You're all set! Start testing all features now!**



