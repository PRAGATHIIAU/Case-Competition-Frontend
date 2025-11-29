# ✅ Fixed Port Issue

## The Problem
Backend was trying to use port 3000 (frontend's port) instead of port 5000.

## What I Fixed
- Changed default port in `backend/config/server.js` from 3000 to 5000

## Now Start Backend Again

```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run dev
```

**You should now see:**
```
🚀 Server is running on port 5000 in development mode
📊 Health check: http://localhost:5000/health
```

---

## Verify .env File Has Correct Port

Make sure your `backend/.env` file has:
```env
PORT=5000
```

If not, add it or the backend will use the default (now 5000).

---

## Ports Summary
- **Frontend:** Port 3000 (Vite)
- **Backend:** Port 5000 (Express)

---

**Now try starting the backend again!** 🚀



