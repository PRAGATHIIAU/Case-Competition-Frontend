# 🚀 How to Start Both Frontend and Backend

## ⚠️ Important: You Need TWO Terminal Windows!

You must run **both** frontend and backend in **separate terminals**.

---

## 📋 Step-by-Step Instructions

### Terminal 1 - Backend (Port 5000)

1. **Open Command Prompt or PowerShell**

2. **Navigate to backend folder:**
   ```cmd
   cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
   ```

3. **Install dependencies (if not done):**
   ```cmd
   npm install
   ```

4. **Start backend server:**
   ```cmd
   npm run dev
   ```

5. **You should see:**
   ```
   🚀 Server is running on port 5000 in development mode
   📊 Health check: http://localhost:5000/health
   🔗 API base: http://localhost:5000/api
   ```

6. **Keep this terminal open!** ⚠️ Don't close it.

---

### Terminal 2 - Frontend (Port 3000)

1. **Open a NEW Command Prompt or PowerShell** (keep backend terminal open!)

2. **Navigate to frontend folder:**
   ```cmd
   cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
   ```

3. **Install dependencies (if not done):**
   ```cmd
   npm install
   ```

4. **Start frontend server:**
   ```cmd
   npm run dev
   ```

5. **You should see:**
   ```
   VITE v5.x.x  ready in xxx ms

   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ```

6. **Browser should automatically open** to `http://localhost:3000`

7. **Keep this terminal open too!** ⚠️ Don't close it.

---

## ✅ Verification Checklist

### Backend (Terminal 1):
- [ ] Running on port 5000
- [ ] Shows "Server is running" message
- [ ] No error messages

### Frontend (Terminal 2):
- [ ] Running on port 3000
- [ ] Shows "VITE ready" message
- [ ] Browser opens automatically
- [ ] No error messages

### Browser:
- [ ] Opens to `http://localhost:3000`
- [ ] Shows landing page or dashboard
- [ ] No blank page
- [ ] No console errors (press F12 to check)

---

## 🐛 Troubleshooting

### Problem: "Nothing loading on localhost:3000"

**Solution 1: Check if frontend is running**
- Look at Terminal 2 - do you see "VITE ready"?
- If not, start it: `npm run dev` in frontend folder

**Solution 2: Check if backend is running**
- Look at Terminal 1 - do you see "Server is running"?
- If not, start it: `npm run dev` in backend folder

**Solution 3: Check browser console**
- Press F12 in browser
- Look for errors in Console tab
- Share any red error messages

**Solution 4: Check if ports are in use**
- Port 3000 might be blocked
- Try: `netstat -ano | findstr :3000`
- Kill process if needed

**Solution 5: Clear browser cache**
- Press Ctrl+Shift+R (hard refresh)
- Or clear browser cache

**Solution 6: Check node_modules**
- Make sure `node_modules` exists in both folders
- If not: run `npm install` in each folder

---

## 📝 Quick Commands Reference

### Backend:
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm install
npm run dev
```

### Frontend:
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
npm install
npm run dev
```

---

## 🎯 What Should Happen

1. **Terminal 1 (Backend)**: Shows server running on port 5000
2. **Terminal 2 (Frontend)**: Shows Vite ready on port 3000
3. **Browser**: Opens automatically to `http://localhost:3000`
4. **Page**: Shows landing page or dashboard (not blank!)

---

## 🆘 Still Not Working?

Share:
1. What you see in Terminal 1 (backend)
2. What you see in Terminal 2 (frontend)
3. What you see in browser (screenshot if possible)
4. Any error messages from browser console (F12)




