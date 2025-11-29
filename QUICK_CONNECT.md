# ✅ Quick Fix: Connect to Database

## Found psql at:
`C:\Program Files\PostgreSQL\18\bin\psql.exe`

---

## Option 1: Use Full Path (Immediate)

Run this command in PowerShell:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com -p 5432 -U postgres -d alumni_portal
```

**Password:** `*Uvpt1077` (enter when prompted)

---

## Option 2: Use Batch File (Easiest)

**Double-click:** `CONNECT_TO_DB.bat`

This will connect you automatically!

---

## Option 3: Add to PATH (Permanent)

### Method A: Using Batch File
1. **Right-click** `ADD_PSQL_TO_PATH.bat`
2. Select **"Run as Administrator"**
3. Close and reopen PowerShell

### Method B: Manual (PowerShell as Admin)
```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\PostgreSQL\18\bin", [EnvironmentVariableTarget]::Machine)
```

**Then restart PowerShell** and `psql` will work!

---

## Option 4: Use pgAdmin (Recommended for Beginners)

1. Open **pgAdmin 4**
2. Right-click **"Servers"** → **"Create" → "Server..."**
3. **General Tab:** Name = `AWS RDS Alumni Portal`
4. **Connection Tab:**
   - Host: `alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com`
   - Port: `5432`
   - Database: `alumni_portal`
   - Username: `postgres`
   - Password: `*Uvpt1077`
5. **SSL Tab:** SSL mode = `Require`
6. Click **"Save"**

---

## Test Connection

After adding to PATH, test with:
```powershell
psql --version
```

Should show: `psql (PostgreSQL) 18.x`

---

## Quick Connection String

```
postgresql://postgres:*Uvpt1077@alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com:5432/alumni_portal?sslmode=require
```

---

**🎯 Recommended: Use Option 2 (Batch File) for quick access, or Option 4 (pgAdmin) for visual management!**



