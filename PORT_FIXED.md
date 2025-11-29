# ✅ Port Issue Fixed!

## What Was Wrong
Your `.env` file had `PORT=3000`, but backend should use port 5000.

## What I Fixed
1. ✅ Changed default port in `backend/config/server.js` from 3000 → 5000
2. ✅ Updated your `.env` file: `PORT=3000` → `PORT=5000`

## Now Start Backend

```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run dev
```

**You should now see:**
```
🚀 Server is running on port 5000 in development mode
📊 Health check: http://localhost:5000/health
✅ Backend ready!
```

---

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 5000 | http://localhost:5000 |

---

## Verify It Works

1. **Backend Health Check:**
   - Open: http://localhost:5000/health
   - Should show: `{"status":"healthy","database":"connected"}`

2. **Try Signup Again:**
   - Go to: http://localhost:3000
   - Try creating account with: `judge123456@gmail.com`

---

**Backend should now start without errors!** 🎉



