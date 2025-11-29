# Fix PowerShell npm Error

## ❌ Error You're Seeing:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

## ✅ Solution 1: Use Command Prompt (CMD) - EASIEST

**Instead of PowerShell, use Command Prompt:**

1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to backend:
   ```cmd
   cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
   npm start
   ```

**OR use the batch files I created:**
- Double-click `START_BACKEND.cmd` (in root folder)
- Double-click `START_FRONTEND.cmd` (in root folder)

---

## ✅ Solution 2: Fix PowerShell Execution Policy

### Option A: Change for Current Session Only (Temporary)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
npm start
```

### Option B: Change for Current User (Permanent)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then verify:
```powershell
Get-ExecutionPolicy
```

---

## ✅ Solution 3: Use Batch Files (No PowerShell Needed)

I've created these files in the root folder:
- `START_BACKEND.cmd` - Starts backend
- `START_FRONTEND.cmd` - Starts frontend

**Just double-click them!** They use CMD, not PowerShell.

---

## 🚀 Recommended: Use CMD

**Open Command Prompt (not PowerShell):**

1. Press `Win + R`
2. Type `cmd`
3. Run:
   ```cmd
   cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
   npm start
   ```

**For frontend (new CMD window):**
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
npm run dev
```

---

## 📝 Quick Reference

| Task | PowerShell (with fix) | CMD | Batch File |
|------|----------------------|-----|------------|
| Start Backend | `npm start` | `npm start` | `START_BACKEND.cmd` |
| Start Frontend | `npm run dev` | `npm run dev` | `START_FRONTEND.cmd` |

**Easiest: Just use CMD or the batch files!**



