# 🔧 Fix psql Command Not Recognized

## Problem
`psql` command is not recognized because PostgreSQL bin folder is not in your PATH.

## Solution Options

### Option 1: Use Full Path (Quick Fix)

Find where PostgreSQL is installed, then use the full path:

**Common locations:**
- `C:\Program Files\PostgreSQL\15\bin\psql.exe`
- `C:\Program Files\PostgreSQL\14\bin\psql.exe`
- `C:\Program Files\PostgreSQL\13\bin\psql.exe`

**Example:**
```powershell
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -h alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com -p 5432 -U postgres -d alumni_portal
```

---

### Option 2: Add PostgreSQL to PATH (Permanent Fix)

#### Step 1: Find PostgreSQL Installation
```powershell
Get-ChildItem -Path "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" | Select-Object -First 1 FullName
```

This will show you the path, e.g.: `C:\Program Files\PostgreSQL\15\bin\psql.exe`

#### Step 2: Add to PATH (Current Session)
```powershell
$postgresPath = "C:\Program Files\PostgreSQL\15\bin"
$env:Path += ";$postgresPath"
```

#### Step 3: Add to PATH Permanently
```powershell
# Run PowerShell as Administrator, then:
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\PostgreSQL\15\bin", [EnvironmentVariableTarget]::Machine)
```

**Replace `15` with your PostgreSQL version number!**

#### Step 4: Restart PowerShell
Close and reopen PowerShell for changes to take effect.

---

### Option 3: Use pgAdmin (Easier - GUI)

1. Open **pgAdmin 4**
2. Right-click **"Servers"** → **"Create" → "Server..."**
3. Fill in connection details:
   - **Host:** `alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com`
   - **Port:** `5432`
   - **Database:** `alumni_portal`
   - **Username:** `postgres`
   - **Password:** `*Uvpt1077`
   - **SSL mode:** `Require`
4. Click **"Save"**

---

### Option 4: Create a Batch File (Easiest)

Create a file `connect-db.bat`:

```batch
@echo off
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -h alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com -p 5432 -U postgres -d alumni_portal
```

**Replace `15` with your PostgreSQL version!**

Then just double-click the file to connect.

---

## Quick Test

After adding to PATH, test with:
```powershell
psql --version
```

You should see the PostgreSQL version number.

---

## Recommended: Use pgAdmin

For most users, **pgAdmin is easier** than command line. It's a visual tool that makes database management simple.

---

**Choose the option that works best for you!**



