# 🗄️ Complete Database Setup - Fixed

## ✅ What Was Fixed

1. **Added students table** to initialization script
2. **Fixed student model** to use SERIAL (not UUID) for compatibility
3. **Added skills column** to students table
4. **Updated all repositories** to handle skills field

---

## 🚀 Run This Command

### Exact Command (Copy-Paste):

```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run init-all
```

---

## 📊 Tables That Will Be Created

After running `npm run init-all`, you'll have:

1. **users** - Alumni, mentors, judges (base table)
2. **students** - Students (separate table)
3. **mentors** - Extends users table
4. **connection_requests** - Student-mentor connections
5. **notifications** - User notifications

---

## ✅ Verify Tables in pgAdmin

1. Open pgAdmin
2. Navigate: Servers → PostgreSQL → Databases → **alumni_portal** → Schemas → public → Tables
3. You should see all 5 tables:
   - ✅ users
   - ✅ students
   - ✅ mentors
   - ✅ connection_requests
   - ✅ notifications

---

## 🧪 Test Data Saving

### Test 1: Create Student via API

```cmd
curl -X POST http://localhost:5000/api/students/signup ^
  -F "name=Test Student" ^
  -F "email=test@tamu.edu" ^
  -F "password=test123" ^
  -F "major=Computer Science" ^
  -F "grad_year=2025"
```

Then check pgAdmin:
```sql
SELECT * FROM students;
```

### Test 2: Create User (Alumni/Mentor) via API

```cmd
curl -X POST http://localhost:5000/api/auth/signup ^
  -F "name=Test Mentor" ^
  -F "email=mentor@company.com" ^
  -F "password=test123" ^
  -F "willing_to_be_mentor=yes" ^
  -F "mentor_capacity=5"
```

Then check pgAdmin:
```sql
SELECT * FROM users;
SELECT * FROM mentors;
```

---

## 🔧 If Tables Still Don't Show Data

### Check 1: Tables Exist?
```sql
-- In pgAdmin Query Tool
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Check 2: Can Insert Data?
```sql
-- Test insert
INSERT INTO users (email, name, password) 
VALUES ('test@test.com', 'Test User', 'hashed_password');

SELECT * FROM users;
```

### Check 3: Backend Logs
Check backend terminal when making API calls - should see:
- Database queries executing
- No errors

---

## 📝 Database Structure

### users table
- Stores: Alumni, Mentors, Judges
- Columns: id, email, name, password, willing_to_be_mentor, etc.

### students table  
- Stores: Students only
- Columns: student_id, name, email, password, major, grad_year, skills

### mentors table
- Extends: users table
- Columns: id (references users.id), company, role, skills, availability

### connection_requests table
- Stores: Student-mentor connection requests
- Columns: id, student_id, mentor_id, message, status

### notifications table
- Stores: User notifications
- Columns: id, user_id, type, title, message, read

---

## ✅ After Running init-all

1. **All 5 tables created** ✅
2. **Data can be saved** ✅
3. **Check pgAdmin** to verify tables exist
4. **Test API** to save data
5. **Verify in pgAdmin** that data appears

---

**Run the command now and check pgAdmin!** 🚀



