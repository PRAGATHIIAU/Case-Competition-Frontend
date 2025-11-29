# 🔐 How to Use Friend's AWS Gateway URLs

## ⚠️ Important: DO NOT Copy Entire .env File

**Why?** Your friend's `.env` file contains:
- ❌ Their database credentials (won't work for you)
- ❌ Their JWT secret (security risk)
- ❌ Their local settings

**What you CAN use:**
- ✅ AWS Gateway URLs (these are shareable)

---

## ✅ Correct Way: Merge Only AWS URLs

### Step 1: Get Your Friend's AWS Gateway URLs

Ask your friend to share ONLY these lines from their `.env`:

```env
API_GATEWAY_UPLOAD_URL=https://xxxxx.execute-api.region.amazonaws.com/prod/upload
API_GATEWAY_DYNAMODB_URL=https://xxxxx.execute-api.region.amazonaws.com/prod/profile
API_GATEWAY_STUDENT_PROFILES_URL=https://xxxxx.execute-api.region.amazonaws.com/prod/student-profiles
```

### Step 2: Create Your Own .env File

```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
copy ENV_TEMPLATE.txt .env
```

### Step 3: Edit Your .env File

Open `backend/.env` and update:

```env
# Database Configuration (YOUR LOCAL DATABASE)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=case_competition_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_SSL=false

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (GENERATE YOUR OWN - keep it secret!)
JWT_SECRET=your-own-unique-secret-key-min-32-characters-long

# CORS
CORS_ORIGIN=http://localhost:3000

# AWS API Gateway URLs (FROM YOUR FRIEND - these are shareable)
API_GATEWAY_UPLOAD_URL=https://xxxxx.execute-api.region.amazonaws.com/prod/upload
API_GATEWAY_DYNAMODB_URL=https://xxxxx.execute-api.region.amazonaws.com/prod/profile
API_GATEWAY_STUDENT_PROFILES_URL=https://xxxxx.execute-api.region.amazonaws.com/prod/student-profiles
```

---

## 📋 Quick Steps

### Option 1: Manual Edit
1. Copy `backend/ENV_TEMPLATE.txt` to `backend/.env`
2. Edit `.env` with your database credentials
3. Add your friend's AWS Gateway URLs at the bottom

### Option 2: Use This Script
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
copy ENV_TEMPLATE.txt .env
notepad .env
```
Then paste your friend's AWS URLs at the bottom.

---

## 🔍 What Each AWS URL Does

| URL | Purpose |
|-----|---------|
| `API_GATEWAY_UPLOAD_URL` | Resume upload to S3 |
| `API_GATEWAY_DYNAMODB_URL` | Extended alumni profiles in DynamoDB |
| `API_GATEWAY_STUDENT_PROFILES_URL` | Extended student profiles in DynamoDB |

**Note:** These are optional. Backend works without them (uses PostgreSQL only).

---

## ✅ Final .env Structure

Your `.env` should have:
- ✅ Your local database credentials
- ✅ Your own JWT_SECRET
- ✅ Your friend's AWS Gateway URLs (if sharing)

---

## 🚨 Security Reminder

- ❌ Never share your `.env` file
- ❌ Never commit `.env` to git
- ✅ AWS Gateway URLs are safe to share
- ✅ Database credentials should be local only
- ✅ JWT_SECRET should be unique per environment

---

## 📝 Example .env File

```env
# Database Configuration (YOUR LOCAL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=case_competition_db
DB_USER=postgres
DB_PASSWORD=mypassword123
DB_SSL=false

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (YOUR OWN - keep secret!)
JWT_SECRET=my-super-secret-jwt-key-12345678901234567890

# CORS
CORS_ORIGIN=http://localhost:3000

# AWS API Gateway URLs (FROM FRIEND - shareable)
API_GATEWAY_UPLOAD_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod/upload
API_GATEWAY_DYNAMODB_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod/profile
API_GATEWAY_STUDENT_PROFILES_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod/student-profiles
```

---

**That's it! You now have your own secure .env with your friend's AWS URLs! 🎉**



