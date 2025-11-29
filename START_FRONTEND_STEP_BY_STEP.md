# 🚀 Start Frontend - Step by Step

## ⚠️ IMPORTANT: You Need TWO Terminal Windows!

### Terminal 1: Backend (Already Running ✅)
- Should show: "Server is running on port 5000"
- **Keep this running!**

### Terminal 2: Frontend (Need to Start ❌)
- **Open a NEW terminal window**
- Follow steps below

---

## Step-by-Step Instructions

### Step 1: Open New Terminal
- Press `Win + X` → Click "Windows PowerShell" or "Terminal"
- **OR** Press `Win + R` → type `cmd` → Enter

### Step 2: Navigate to Frontend Folder
Copy and paste this EXACT command:
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
```

Press Enter.

### Step 3: Check if Dependencies Installed
```cmd
dir node_modules
```

**If you see "Directory of node_modules"** → Dependencies installed ✅  
**If you see "File Not Found"** → Need to install:
```cmd
npm install
```
(Wait for it to finish - takes 1-2 minutes)

### Step 4: Start Frontend Server
```cmd
npm run dev
```

### Step 5: Wait for This Message
You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Step 6: Open Browser
- Browser should open automatically
- **OR** manually go to: `http://localhost:3000`

---

## ✅ Success Indicators

**Terminal 2 should show:**
- ✅ "VITE ready"
- ✅ "Local: http://localhost:3000/"
- ✅ No red error messages

**Browser should show:**
- ✅ Landing page (not blank)
- ✅ Not "ERR_CONNECTION_REFUSED"
- ✅ Not JSON response

---

## 🆘 Troubleshooting

### Problem: "npm is not recognized"
**Solution:** Node.js not installed or not in PATH
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### Problem: "Cannot find module"
**Solution:** Dependencies not installed
```cmd
cd frontend
npm install
```

### Problem: "Port 3000 already in use"
**Solution:** Something else is using port 3000
```cmd
netstat -ano | findstr ":3000"
taskkill /F /PID <process_id>
```

### Problem: Still shows connection refused
**Solution:** 
1. Check Terminal 2 - is Vite running?
2. Check for errors in Terminal 2
3. Try hard refresh: Ctrl+Shift+R
4. Try different browser

---

## 📋 Checklist

- [ ] Terminal 1: Backend running (port 5000) ✅
- [ ] Terminal 2: Frontend running (port 3000) ❌
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `npm run dev` shows "VITE ready"
- [ ] Browser opens to `http://localhost:3000`
- [ ] Page loads (not connection refused)

---

**Follow these steps exactly and frontend should start!** 🚀



