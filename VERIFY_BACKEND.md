# ✅ How to Verify Backend is Working

## Quick Tests (Open in Browser)

### 1. Health Check
```
http://localhost:5000/health
```
**✅ Working**: Shows `{"status":"healthy","database":"connected",...}`  
**❌ Not Working**: Connection error or timeout

### 2. Root Route
```
http://localhost:5000/
```
**✅ Working**: Shows `{"message":"Hello world"}`  
**❌ Not Working**: Connection error

### 3. Get Mentors API
```
http://localhost:5000/api/mentors
```
**✅ Working**: Shows `{"success":true,"count":0,"mentors":[]}`  
**❌ Not Working**: Error message or connection error

### 4. Recommend Mentors API (POST - Use Postman or curl)
```
POST http://localhost:5000/api/mentors/recommend
Body: {"skills": ["Python", "SQL"]}
```
**✅ Working**: Returns mentors list  
**❌ Not Working**: Error message

---

## Check Backend Terminal

Look at the terminal where `npm run dev` is running for backend:

**✅ Working**: Should show:
```
🚀 Server is running on port 5000 in development mode
📊 Health check: http://localhost:5000/health
🔗 API base: http://localhost:5000/api
```

**❌ Not Working**: 
- Error messages
- "Port already in use"
- Database connection errors

---

## Check Database Connection

### If Health Check Shows "database: disconnected":

1. **Check PostgreSQL is running:**
   - Windows: Services → Look for "postgresql"
   - Or: `pg_isready` command

2. **Check .env file:**
   - Make sure `DB_PASSWORD` is correct
   - Make sure `DB_NAME=alumni_portal` exists

3. **Test connection manually:**
   ```cmd
   psql -U postgres -d alumni_portal
   ```
   (Enter password - if it connects, database is OK)

---

## Common Issues

### Backend not starting?
- Check if port 5000 is in use
- Check `.env` file exists
- Check `node_modules` installed (`npm install`)

### Database connection error?
- PostgreSQL not running
- Wrong password in `.env`
- Database doesn't exist (create it first)

### API returns errors?
- Check backend terminal for error messages
- Check database tables exist (`npm run init-all`)
- Check browser console (F12) for CORS errors

---

## ✅ Success Indicators

1. **Backend terminal**: Shows "Server is running on port 5000"
2. **Health check**: Shows `"database": "connected"`
3. **API routes**: Return JSON (not HTML error pages)
4. **No errors**: In backend terminal or browser console

---

**If all tests pass, your backend is working!** 🎉




