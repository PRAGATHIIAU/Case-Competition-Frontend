# 🚀 Complete Setup from Scratch - Step by Step

## ⚠️ Important: Use Local Database, Not Remote RDS

Your friend's `.env` uses a remote AWS RDS database. **You should use your LOCAL PostgreSQL** instead.

---

## Step 1: Create Local PostgreSQL Database

### Open pgAdmin or psql and run:

```sql
CREATE DATABASE case_competition_db;
```

**OR** if you want to use the same name as your friend:

```sql
CREATE DATABASE alumni_portal;
```

---

## Step 2: Create Your .env File

### Open CMD and run:

```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
copy ENV_TEMPLATE.txt .env
notepad .env
```

### Copy this into your `.env` file:

```env
# Database Configuration (YOUR LOCAL - NOT REMOTE)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=case_competition_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_SSL=false

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (YOUR OWN - keep it secret!)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2

# AWS Configuration for Events (DynamoDB and SES)
AWS_REGION=us-east-1

# API Gateway URLs (FROM YOUR FRIEND - these are shareable)
API_GATEWAY_UPLOAD_URL=https://zyvoa629f8.execute-api.us-east-1.amazonaws.com/dev/upload
API_GATEWAY_DYNAMODB_URL=https://uesvq6c260.execute-api.us-east-1.amazonaws.com/dev/events
API_GATEWAY_STUDENT_PROFILES_URL=https://934mmrcmpj.execute-api.us-east-1.amazonaws.com/dev/profiles

# Configuration for Lambda functions (used by Lambda, not directly by backend)
S3_BUCKET_NAME=cmis-portal-resumes
EVENTS_TABLE_NAME=Events

# Email Configuration (FROM YOUR FRIEND - using Gmail)
EMAIL_USER=aupragathii@gmail.com
EMAIL_PASSWORD=wbka fydp pioz lmtj
FROM_EMAIL=aupragathii@gmail.com
ADMIN_EMAIL=aupragathii@gmail.com
```

**IMPORTANT:** 
- Change `DB_PASSWORD` to YOUR PostgreSQL password
- Keep `DB_HOST=localhost` (NOT the remote RDS)
- Keep all AWS URLs and email config from your friend

---

## Step 3: Install Backend Dependencies

```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm install
```

---

## Step 4: Initialize Database Tables

```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run init-all
```

**Expected Output:**
```
✅ Created users table
✅ Created students table
✅ Created mentors table
✅ Created events table
... (all tables created)
```

---

## Step 5: Run Unified Identity Migration

```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run migrate:unified-identity
```

**Expected Output:**
```
✅ Added is_mentor column
✅ Added is_judge column
✅ Added is_speaker column
```

---

## Step 6: Seed Database with Demo Data

```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run seed
```

**Expected Output:**
```
✅ Created demo users
✅ Created demo events
✅ Created demo competitions
Database Seeded Successfully!
```

---

## Step 7: Start Backend Server

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

**Keep this terminal open!**

---

## Step 8: Setup Frontend (New Terminal)

### Open a NEW CMD window and run:

```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
npm install
```

---

## Step 9: Start Frontend Server

```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:3000/
```

**Frontend will open automatically!**

---

## Step 10: Test Everything

### Open Browser:
- **Frontend:** http://localhost:3000
- **Backend Health:** http://localhost:5000/health
- **API Routes:** http://localhost:5000/api

### Login Credentials (from seed):
- **Student:** student@tamu.edu / 123456
- **Mentor:** mentor@tamu.edu / 123456
- **Alumni:** alumni@tamu.edu / 123456
- **Admin:** admin@tamu.edu / 123456
- **Faculty:** faculty@tamu.edu / 123456

---

## ✅ Complete Command Sequence (Copy-Paste)

### Terminal 1: Backend Setup
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
copy ENV_TEMPLATE.txt .env
notepad .env
(Edit .env with your database password and friend's AWS URLs)
npm install
npm run init-all
npm run migrate:unified-identity
npm run seed
npm run dev
```

### Terminal 2: Frontend Setup
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
npm install
npm run dev
```

---

## 🔍 What Changed from Friend's .env

| Setting | Friend's Value | Your Value | Why? |
|---------|---------------|------------|------|
| `DB_HOST` | `alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com` | `localhost` | Use local PostgreSQL |
| `DB_NAME` | `alumni_portal` | `case_competition_db` | Your local database name |
| `DB_PASSWORD` | `*Uvpt1077` | `your_postgres_password` | Your local password |
| `PORT` | `3000` | `5000` | Backend port (frontend uses 3000) |
| AWS URLs | ✅ | ✅ | **Keep these - they're shareable** |
| Email Config | ✅ | ✅ | **Keep these - they're shareable** |

---

## 🎯 Quick Checklist

- [ ] Created local PostgreSQL database
- [ ] Created `.env` file with local DB credentials
- [ ] Added friend's AWS Gateway URLs
- [ ] Added friend's email configuration
- [ ] Installed backend dependencies
- [ ] Initialized database tables
- [ ] Ran unified identity migration
- [ ] Seeded database
- [ ] Started backend server (port 5000)
- [ ] Installed frontend dependencies
- [ ] Started frontend server (port 3000)
- [ ] Tested login with seeded credentials

---

## 🚨 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify `.env` has correct `DB_PASSWORD`
- Test: `psql -U postgres -d case_competition_db`

### Port 5000 Already in Use
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
.\KILL_PORT_5000.bat
```

### Tables Not Created
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run init-all
```

---

**🎉 You're all set! Everything should work now!**



