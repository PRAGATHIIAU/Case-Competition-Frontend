# 🧪 Test Student Data Saving

## Step 1: Check Backend Logs

When you save a profile in the frontend, **watch the backend terminal**. You should see:
```
📥 CREATE-OR-UPDATE REQUEST RECEIVED
   Body: { ... }
   Parsed fields:
   - email: ...
   - name: ...
```

**If you DON'T see this**, the frontend is NOT calling the API.

---

## Step 2: Check Browser Console

1. Open frontend in browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try to save profile
5. Look for:
   - ✅ `Profile saved to PostgreSQL:` (success)
   - ❌ `API save failed:` (error)
   - ❌ Any red error messages

---

## Step 3: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Try to save profile
3. Look for request to `/api/students/create-or-update`
4. Click on it to see:
   - **Status**: Should be 200 or 201
   - **Request Payload**: Should show form-data
   - **Response**: Should show success message

---

## Step 4: Test Endpoint Directly

### Option A: Use Postman or Insomnia
- POST to `http://localhost:5000/api/students/create-or-update`
- Use form-data:
  - name: Test Student
  - email: test@tamu.edu
  - major: Computer Science
  - grad_year: 2025

### Option B: Use Browser Console
Open browser console (F12) and run:
```javascript
const formData = new FormData();
formData.append('name', 'Test Student');
formData.append('email', 'test@tamu.edu');
formData.append('major', 'Computer Science');
formData.append('grad_year', '2025');

fetch('/api/students/create-or-update', {
  method: 'POST',
  body: formData
})
.then(r => r.json())
.then(data => console.log('Result:', data))
.catch(err => console.error('Error:', err));
```

---

## Step 5: Check Database

In pgAdmin, run:
```sql
SELECT * FROM students;
```

**If still 0 rows:**
1. Check backend terminal for errors
2. Check if endpoint is being called (see Step 1)
3. Check browser console for errors

---

## Common Issues:

### Issue 1: Frontend not calling API
- Check browser console for errors
- Check if `api.student.updateProfile` is being called
- Verify frontend code is using the new endpoint

### Issue 2: Backend not receiving request
- Check if backend is running on port 5000
- Check CORS settings
- Check if route is registered

### Issue 3: Database not saving
- Check backend logs for database errors
- Verify database connection in `.env`
- Check if tables exist

---

**Start with Step 1 - watch the backend terminal when you save!**



