# ⚡ Quick Start - Both Servers

## 🎯 Copy-Paste These Commands

### Step 1: Open TWO Terminal Windows

**Terminal 1 - Backend:**
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm install
npm run dev
```

**Terminal 2 - Frontend (NEW WINDOW):**
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
npm install
npm run dev
```

---

## ✅ What You Should See

### Terminal 1 (Backend):
```
🚀 Server is running on port 5000 in development mode
📊 Health check: http://localhost:5000/health
🔗 API base: http://localhost:5000/api
```

### Terminal 2 (Frontend):
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### Browser:
- Automatically opens to `http://localhost:3000`
- Shows your landing page or dashboard

---

## ⚠️ Common Mistakes

1. **Only running one server** → Need BOTH running!
2. **Closing terminal** → Keep both terminals open!
3. **Wrong folder** → Make sure you're in `backend` or `frontend` folder
4. **Port already in use** → Kill other processes using ports 3000/5000

---

## 🆘 If Frontend Shows Blank Page

1. **Check Terminal 2** - Is Vite running?
2. **Check Browser Console** (F12) - Any errors?
3. **Try hard refresh** - Ctrl+Shift+R
4. **Check if index.html exists** in frontend folder

---

**Need help?** Check `START_BOTH_SERVERS.md` for detailed troubleshooting.




