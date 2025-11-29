# 🗄️ PostgreSQL Database Setup - Complete Guide

## Step 1: Install PostgreSQL

### Windows:
1. **Download**: https://www.postgresql.org/download/windows/
2. **Run installer** - Follow the wizard
3. **Remember the password** you set for `postgres` user
4. **Default port**: 5432 (keep this)

### Mac:
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## Step 2: Create Database

### Option A: Using psql (Command Line)

1. **Open Command Prompt or PowerShell**

2. **Connect to PostgreSQL:**
   ```cmd
   psql -U postgres
   ```
   (Enter your password when prompted)

3. **Create database:**
   ```sql
   CREATE DATABASE alumni_portal;
   ```

4. **Verify it was created:**
   ```sql
   \l
   ```
   (You should see `alumni_portal` in the list)

5. **Exit:**
   ```sql
   \q
   ```

### Option B: Using pgAdmin (GUI)

1. **Open pgAdmin** (installed with PostgreSQL)
2. **Right-click "Databases"** → Create → Database
3. **Name**: `alumni_portal`
4. **Click Save**

---

## Step 3: Configure Backend .env File

1. **Navigate to backend folder:**
   ```cmd
   cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
   ```

2. **Create or edit `.env` file:**
   ```cmd
   notepad .env
   ```

3. **Add these lines:**
   ```env
   PORT=5000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=alumni_portal
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password_here
   
   JWT_SECRET=your_super_secret_jwt_key_here
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Replace `your_postgres_password_here`** with the password you set during PostgreSQL installation

5. **Save the file**

---

## Step 4: Initialize Database Tables

1. **Make sure you're in backend folder:**
   ```cmd
   cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
   ```

2. **Run initialization:**
   ```cmd
   npm run init-all
   ```

   This will create all necessary tables:
   - ✅ users
   - ✅ mentors
   - ✅ connection_requests
   - ✅ notifications

3. **You should see:**
   ```
   ✅ Users table created.
   ✅ Mentors table created.
   ✅ Connection requests table created.
   ✅ Notifications table created.
   ✅ All database tables initialized successfully!
   ```

---

## Step 5: Verify Backend is Working

### Test 1: Health Check
Open browser: `http://localhost:5000/health`

**Should show:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "...",
  "port": 5000,
  "env": "development"
}
```

### Test 2: Root Route
Open browser: `http://localhost:5000/`

**Should show:**
```json
{"message":"Hello world"}
```

### Test 3: API Route
Open browser: `http://localhost:5000/api/mentors`

**Should show:**
```json
{
  "success": true,
  "count": 0,
  "mentors": []
}
```

---

## ✅ Verification Checklist

- [ ] PostgreSQL installed
- [ ] Database `alumni_portal` created
- [ ] `.env` file configured with correct password
- [ ] `npm run init-all` completed successfully
- [ ] Backend running on port 5000
- [ ] Health check shows "database: connected"
- [ ] API routes return JSON (not errors)

---

## 🆘 Troubleshooting

### Error: "password authentication failed"
- Check `.env` file - password must match PostgreSQL password
- Try resetting password in PostgreSQL

### Error: "database does not exist"
- Create database: `CREATE DATABASE alumni_portal;`

### Error: "connection refused"
- Make sure PostgreSQL is running
- Check if port 5432 is correct
- Windows: Check Services → PostgreSQL

### Error: "relation does not exist"
- Run `npm run init-all` to create tables

---

## 📝 Quick Reference

**Database Name**: `alumni_portal`  
**Default User**: `postgres`  
**Default Port**: `5432`  
**Backend Port**: `5000`  
**Frontend Port**: `3000`

---

**Once database is set up, your backend will be fully functional!** 🎉




