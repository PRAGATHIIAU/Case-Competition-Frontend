# PowerShell Commands Guide

## ⚠️ Important: PowerShell Syntax

PowerShell **does NOT support `&&`** like bash/CMD. Use these instead:

---

## ✅ Correct PowerShell Commands

### Start Backend
```powershell
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm start
```

**OR (single line):**
```powershell
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend; npm start
```

### Start Frontend
```powershell
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
npm run dev
```

**OR (single line):**
```powershell
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend; npm run dev
```

### Initialize Database Tables
```powershell
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
node scripts/init-all-tables.js
```

---

## 🔄 PowerShell Alternatives to `&&`

### Option 1: Use Semicolon `;`
```powershell
cd backend; npm start
```

### Option 2: Use Separate Commands
```powershell
cd backend
npm start
```

### Option 3: Use `-and` (for conditional)
```powershell
if (Test-Path backend) { cd backend; npm start }
```

---

## 🚀 Quick Start Commands

### Terminal 1 - Backend:
```powershell
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm start
```

### Terminal 2 - Frontend:
```powershell
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
npm run dev
```

---

## 📝 Batch Files (Easier Alternative)

I've created batch files you can double-click:

- `backend/start-backend.bat` - Starts backend
- `frontend/start-frontend.bat` - Starts frontend

Just double-click these files instead of using terminal!

---

**The backend should now be starting!** Check `http://localhost:5000/health` to verify it's running.



