# 📥 PostgreSQL Installation - What You Need

## ✅ What You Need to Install

### 1. PostgreSQL Server (REQUIRED)
- **What it is**: The database server itself
- **Download**: https://www.postgresql.org/download/windows/
- **Size**: ~200-300 MB
- **Registration**: ❌ NO registration required (completely free)
- **What it includes**:
  - PostgreSQL database server
  - pgAdmin (GUI tool - optional but useful)
  - Command line tools (psql)
  - All necessary drivers

### 2. Node.js PostgreSQL Driver (ALREADY INSTALLED)
- **What it is**: `pg` package - allows Node.js to connect to PostgreSQL
- **Status**: ✅ Already in your `backend/package.json`
- **Installation**: Automatically installed when you run `npm install` in backend folder
- **No separate installation needed!**

---

## 📋 Installation Steps (Windows)

### Step 1: Download PostgreSQL
1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Choose latest version (15 or 16 recommended)
4. **NO registration required** - just download

### Step 2: Run Installer
1. Run the downloaded `.exe` file
2. Click "Next" through the wizard
3. **Important**: When it asks for password:
   - Set a password for `postgres` user
   - **Remember this password!** (you'll need it for `.env` file)
4. **Port**: Keep default `5432` (unless you have a conflict)
5. **Locale**: Keep default (usually fine)
6. Click "Next" → "Next" → "Install"

### Step 3: What Gets Installed
- ✅ PostgreSQL Server (the database)
- ✅ pgAdmin 4 (GUI tool - optional, you can skip if you want)
- ✅ Command line tools (psql)
- ✅ Stack Builder (optional - you can skip)

### Step 4: Verify Installation
Open Command Prompt:
```cmd
psql --version
```
Should show version number (e.g., `psql (PostgreSQL) 15.x`)

---

## ❌ What You DON'T Need

### ❌ Separate Database Drivers
- The `pg` package (Node.js driver) is already in your `package.json`
- It will be installed automatically with `npm install`
- **No separate driver installation needed!**

### ❌ Separate Server Software
- PostgreSQL installer includes the server
- **No additional server software needed!**

### ❌ Registration or Account
- PostgreSQL is completely free and open source
- **No registration required!**
- **No account creation needed!**
- **No license key needed!**

### ❌ Additional Tools (Optional)
- pgAdmin is included but optional
- You can use command line (psql) if you prefer
- **Not required for the backend to work**

---

## 🔧 After Installation

### 1. Install Backend Dependencies
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm install
```
This installs the `pg` driver automatically.

### 2. Create Database
```cmd
psql -U postgres
```
(Enter password you set during installation)
```sql
CREATE DATABASE alumni_portal;
\q
```

### 3. Configure .env
Create `.env` file in backend folder with your PostgreSQL password.

### 4. Initialize Tables
```cmd
npm run init-all
```

---

## 📦 What's Already in Your Project

✅ **Backend `package.json`** already includes:
- `pg` - PostgreSQL driver for Node.js
- All other dependencies

**You just need to:**
1. Install PostgreSQL server (one-time)
2. Run `npm install` in backend folder (installs the `pg` driver)
3. Create database
4. Configure `.env` file

---

## 🎯 Summary

**What to Install:**
- ✅ PostgreSQL Server (from postgresql.org)
- ❌ NO separate drivers (already in package.json)
- ❌ NO registration required
- ❌ NO additional servers

**After Installation:**
- Run `npm install` in backend folder (installs `pg` driver)
- Create database
- Configure `.env`
- Run `npm run init-all`

---

## 🆘 Troubleshooting

### "psql is not recognized"
- PostgreSQL not installed or not in PATH
- Reinstall PostgreSQL and check "Add to PATH" option

### "npm install" fails
- Check internet connection
- Try: `npm install --verbose` to see errors

### Can't connect to database
- Check PostgreSQL service is running
- Check password in `.env` file
- Check database exists

---

**TL;DR: Just install PostgreSQL server, everything else is automatic!** 🚀




