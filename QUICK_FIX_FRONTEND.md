# 🔧 Fix: Frontend Not Loading

## Problem
`localhost:3000` shows "ERR_CONNECTION_REFUSED" - Frontend server is not running.

## Solution: Start Frontend Server

### Step 1: Open a NEW Terminal Window
(Keep backend terminal running!)

### Step 2: Navigate to Frontend Folder
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
```

### Step 3: Start Frontend Server
```cmd
npm run dev
```

### Step 4: Wait for This Message
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### Step 5: Browser Should Open Automatically
Or manually go to: `http://localhost:3000`

---

## ✅ You Need BOTH Servers Running

**Terminal 1 - Backend:**
- Running on port 5000 ✅
- Shows: "Server is running on port 5000"

**Terminal 2 - Frontend:**
- Must be running on port 3000
- Shows: "VITE ready"
- Browser opens to `http://localhost:3000`

---

## 🆘 If Frontend Still Won't Start

1. **Check if port 3000 is blocked:**
   ```cmd
   netstat -ano | findstr ":3000"
   ```
   If something is using it, kill it or use a different port.

2. **Check node_modules:**
   ```cmd
   cd frontend
   npm install
   ```

3. **Check for errors in terminal** when running `npm run dev`

---

**Start the frontend server and it should work!** 🚀



