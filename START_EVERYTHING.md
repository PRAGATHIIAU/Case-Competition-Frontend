# 🚀 Quick Start - All Commands

## ⚡ Fastest Way (3 Steps)

### Step 1: Setup Database (One Time)
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm install
npm run init-all
npm run migrate:unified-identity
npm run seed
```

### Step 2: Start Backend (Terminal 1)
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run dev
```

### Step 3: Start Frontend (Terminal 2)
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
npm install
npm run dev
```

---

## 📋 Or Use Batch Files (Double-Click)

1. **SETUP_DATABASE.bat** - Setup database (run once)
2. **START_BACKEND.bat** - Start backend server
3. **START_FRONTEND.bat** - Start frontend server

---

## 🔑 Login Credentials (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Student | student@tamu.edu | 123456 |
| Mentor | mentor@tamu.edu | 123456 |
| Alumni | alumni@tamu.edu | 123456 |
| Admin | admin@tamu.edu | 123456 |
| Faculty | faculty@tamu.edu | 123456 |

---

## ✅ Test All Features

1. **Open:** http://localhost:3000
2. **Login** with any credential above
3. **Test:**
   - ✅ Student Dashboard
   - ✅ Mentor Recommendations
   - ✅ Alumni Role Switcher
   - ✅ Admin Analytics
   - ✅ Industry Portal
   - ✅ Events CRUD
   - ✅ Connections
   - ✅ Search

---

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health
- **API Routes:** http://localhost:5000/api

---

## 📝 Before Starting

1. **Create `.env` file** in `backend/` folder:
   - Copy `backend/.env.example` to `backend/.env`
   - Update database credentials

2. **PostgreSQL must be running**
   - Check pgAdmin or services

3. **Create database:**
   ```sql
   CREATE DATABASE case_competition_db;
   ```

---

**That's it! You're ready to test everything! 🎉**



