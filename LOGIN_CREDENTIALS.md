# 🔑 Login Credentials

## Demo User Credentials

**All passwords:** `123456`

| Role | Email | Password | Dashboard URL |
|------|-------|----------|--------------|
| **Student** | `student@test.com` | `123456` | `/student/dashboard` |
| **Mentor** | `mentor@test.com` | `123456` | `/mentor/dashboard` |
| **Alumni** | `alumni@test.com` | `123456` | `/alumni/dashboard` |
| **Admin** | `admin@test.com` | `123456` | `/admin/dashboard` |
| **Faculty** | `faculty@test.com` | `123456` | `/faculty/dashboard` |

---

## 🚀 How to Set Up (If Not Already Done)

### Step 1: Initialize Database Tables
```bash
cd backend
npm run init-all
```

### Step 2: Seed Database (Create Demo Users)
```bash
npm run seed
```

**This will create all 5 demo users with the credentials above.**

### Step 3: Start Backend
```bash
npm start
```

### Step 4: Start Frontend (new terminal)
```bash
cd frontend
npm run dev
```

---

## 🔐 Quick Login Steps

1. Go to `http://localhost:3000`
2. Click **"Login"** button
3. Enter one of the emails above
4. Enter password: `123456`
5. Click **"Login"**
6. You'll be automatically redirected to your role's dashboard

---

## ✅ Test Each Role

### Student Login:
- Email: `student@test.com`
- Password: `123456`
- Redirects to: `/student/dashboard`

### Mentor Login:
- Email: `mentor@test.com`
- Password: `123456`
- Redirects to: `/mentor/dashboard`

### Alumni Login:
- Email: `alumni@test.com`
- Password: `123456`
- Redirects to: `/alumni/dashboard`

### Admin Login:
- Email: `admin@test.com`
- Password: `123456`
- Redirects to: `/admin/dashboard`

### Faculty Login:
- Email: `faculty@test.com`
- Password: `123456`
- Redirects to: `/faculty/dashboard`

---

## 🆘 If Login Doesn't Work

### Check if users exist in database:
```sql
-- In pgAdmin or psql:
SELECT email, name, role FROM users;
```

### If no users found, run seed script:
```bash
cd backend
npm run seed
```

### If seed script fails:
1. Make sure database tables are created: `npm run init-all`
2. Check `.env` file has correct database credentials
3. Make sure PostgreSQL is running

---

## 📝 Create New Account

You can also create a new account:

1. Go to `http://localhost:3000`
2. Click **"Sign Up"** button
3. Fill in the form:
   - Name
   - Email
   - Select Role (Student, Mentor, Alumni, Faculty)
   - Fill role-specific fields
   - Password (at least 6 characters)
   - Confirm Password
4. Click **"Create Account"**
5. You'll be automatically logged in and redirected

---

## 🔒 Protected Routes

All dashboards are now **protected** - you must be logged in to access them.

If you try to access a dashboard without logging in, you'll be redirected to the home page.

---

**All demo users have the same password: `123456`** 🔑



