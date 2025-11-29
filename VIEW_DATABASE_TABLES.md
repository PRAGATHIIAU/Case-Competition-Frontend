# 📊 How to View Tables and Data in PostgreSQL

## Method 1: Using psql (Command Line)

### Connect to Database
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com -p 5432 -U postgres -d alumni_portal
```

### Useful Commands

#### List All Tables
```sql
\dt
```

#### List All Tables with Details
```sql
\dt+
```

#### View Table Structure
```sql
\d users
\d students
\d mentors
\d events
```

#### View All Data in a Table
```sql
SELECT * FROM users;
SELECT * FROM students;
SELECT * FROM mentors;
SELECT * FROM events;
```

#### Count Records
```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM students;
```

#### View Specific Columns
```sql
SELECT id, email, name, role FROM users;
```

#### View with Limit (First 10 rows)
```sql
SELECT * FROM users LIMIT 10;
```

#### View with Filter
```sql
SELECT * FROM users WHERE role = 'alumni';
SELECT * FROM users WHERE email LIKE '%@tamu.edu';
```

#### Exit psql
```sql
\q
```

---

## Method 2: Using pgAdmin (GUI - Recommended for Viewing Data)

### Step 1: Connect to Database

1. Open **pgAdmin 4**
2. Right-click **"Servers"** → **"Create" → "Server..."**
3. **General Tab:** Name = `AWS RDS Alumni Portal`
4. **Connection Tab:**
   - Host: `alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com`
   - Port: `5432`
   - Database: `alumni_portal`
   - Username: `postgres`
   - Password: `*Uvpt1077`
5. **SSL Tab:** SSL mode = `Require`
6. Click **"Save"**

### Step 2: Browse Tables

1. Expand your server: **"AWS RDS Alumni Portal"**
2. Expand **"Databases"**
3. Expand **"alumni_portal"**
4. Expand **"Schemas"**
5. Expand **"public"**
6. Expand **"Tables"**

You'll see all tables:
- `users`
- `students`
- `mentors`
- `events`
- `connection_requests`
- `notifications`
- `lectures`
- etc.

### Step 3: View Table Data

1. Right-click on any table (e.g., `users`)
2. Select **"View/Edit Data" → "All Rows"**
3. You'll see all data in a spreadsheet-like view!

### Step 4: Run SQL Queries

1. Click on **"Query Tool"** (icon with play button) in toolbar
2. Or right-click database → **"Query Tool"**
3. Type your SQL:
   ```sql
   SELECT * FROM users;
   ```
4. Click **"Execute"** (F5) or press **F5**

---

## Common SQL Queries for CRUD

### CREATE (Insert Data)
```sql
-- Insert new user
INSERT INTO users (email, name, password, role) 
VALUES ('test@example.com', 'Test User', 'hashed_password', 'student');

-- Insert new event
INSERT INTO events (title, date, description, type) 
VALUES ('Tech Workshop', '2024-12-15', 'Learn new tech', 'workshop');
```

### READ (View Data)
```sql
-- View all users
SELECT * FROM users;

-- View users with specific role
SELECT * FROM users WHERE role = 'alumni';

-- View with sorting
SELECT * FROM users ORDER BY created_at DESC;

-- View with join
SELECT u.*, s.major, s.year 
FROM users u 
LEFT JOIN students s ON u.email = s.email;
```

### UPDATE (Modify Data)
```sql
-- Update user email
UPDATE users 
SET email = 'newemail@example.com' 
WHERE id = 1;

-- Update user role
UPDATE users 
SET role = 'alumni' 
WHERE email = 'student@test.com';
```

### DELETE (Remove Data)
```sql
-- Delete specific user
DELETE FROM users WHERE id = 1;

-- Delete all test data (be careful!)
DELETE FROM users WHERE email LIKE '%test%';
```

---

## Quick Reference: psql Commands

| Command | Description |
|---------|-------------|
| `\dt` | List all tables |
| `\d table_name` | Describe table structure |
| `\du` | List all users/roles |
| `\l` | List all databases |
| `\c database_name` | Connect to database |
| `\q` | Quit psql |
| `\?` | Show help |
| `\h` | SQL help |
| `\timing` | Toggle query timing |
| `\x` | Toggle expanded display |

---

## View Live Data After Signup

### Check if new user was created:
```sql
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

### Check students table:
```sql
SELECT * FROM students ORDER BY created_at DESC LIMIT 5;
```

### Check events:
```sql
SELECT * FROM events;
```

### Check connections:
```sql
SELECT * FROM connection_requests;
```

---

## Recommended: Use pgAdmin for Visual Browsing

**pgAdmin is much easier** for:
- ✅ Browsing tables visually
- ✅ Viewing data in spreadsheet format
- ✅ Editing data directly
- ✅ Running queries with syntax highlighting
- ✅ Exporting data to CSV/Excel

**psql is better for:**
- ✅ Quick queries
- ✅ Scripting
- ✅ Command-line automation

---

## Quick Start: View Your Data Now

### Using pgAdmin:
1. Connect (see Method 2 above)
2. Navigate: Servers → Databases → alumni_portal → Schemas → public → Tables
3. Right-click `users` → "View/Edit Data" → "All Rows"
4. See all your data! 🎉

### Using psql:
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com -p 5432 -U postgres -d alumni_portal
```

Then run:
```sql
\dt          -- List tables
SELECT * FROM users;  -- View all users
\q           -- Exit
```

---

**🎯 For viewing data live, pgAdmin is recommended! It's visual and easy to use.**



