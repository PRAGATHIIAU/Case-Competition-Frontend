# 🚀 Simple Installation Guide

## What You Need (Just 2 Things!)

### 1. PostgreSQL Server ⭐ (REQUIRED)
- **Download**: https://www.postgresql.org/download/windows/
- **Registration**: ❌ NO - completely free, no account needed
- **What it installs**: Database server + tools
- **Size**: ~200-300 MB
- **Time**: 5-10 minutes

### 2. Node.js (You probably already have this)
- Check: `node --version` in command prompt
- If you see a version number, you're good! ✅
- If not: Download from https://nodejs.org/

---

## Installation Process

### PostgreSQL Installation:
1. **Download** from postgresql.org (no registration)
2. **Run installer** - click Next, Next, Next
3. **Set password** for `postgres` user (remember it!)
4. **Keep port 5432** (default)
5. **Finish installation**

**That's it!** No drivers, no registration, no extra software.

---

## After Installation

### Step 1: Install Backend Dependencies
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm install
```
This automatically installs the PostgreSQL driver (`pg` package).

### Step 2: Create Database
```cmd
psql -U postgres
```
(Enter your password)
```sql
CREATE DATABASE alumni_portal;
\q
```

### Step 3: Create .env File
In backend folder, create `.env`:
```env
DB_PASSWORD=your_postgres_password_here
DB_NAME=alumni_portal
DB_USER=postgres
DB_HOST=localhost
DB_PORT=5432
PORT=5000
JWT_SECRET=your_secret
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Initialize Database
```cmd
npm run init-all
```

---

## ✅ Checklist

- [ ] PostgreSQL installed (no registration needed)
- [ ] Password remembered
- [ ] Database `alumni_portal` created
- [ ] `.env` file created
- [ ] `npm install` run in backend folder
- [ ] `npm run init-all` completed

---

## 🎯 Answer to Your Question

**Q: Do I need to install database drivers?**  
A: ❌ NO - The `pg` driver is already in `package.json` and installs automatically with `npm install`

**Q: Do I need separate servers?**  
A: ❌ NO - PostgreSQL installer includes the server

**Q: Registration required?**  
A: ❌ NO - PostgreSQL is free and open source, no registration needed

**Q: What do I actually need?**  
A: ✅ Just PostgreSQL server (one installer, that's it!)

---

**It's simpler than you think! Just install PostgreSQL and you're done.** 🎉




