# 📊 Step-by-Step: View Data in pgAdmin

## Complete Guide to View Tables and Data

### Step 1: Open pgAdmin 4
Launch pgAdmin from Start Menu or Desktop

### Step 2: Create Server Connection

1. **Right-click** on **"Servers"** (left panel)
2. Select **"Create" → "Server..."**

### Step 3: Fill Connection Details

#### General Tab:
- **Name:** `AWS RDS Alumni Portal`

#### Connection Tab:
- **Host name/address:** `alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com`
- **Port:** `5432`
- **Maintenance database:** `alumni_portal`
- **Username:** `postgres`
- **Password:** `*Uvpt1077`
- ✅ Check **"Save password"**

#### SSL Tab (IMPORTANT):
- **SSL mode:**** Select **"Require"**

#### Click **"Save"**

---

### Step 4: Browse Tables

1. **Expand** your server: **"AWS RDS Alumni Portal"**
2. **Expand** **"Databases"**
3. **Expand** **"alumni_portal"**
4. **Expand** **"Schemas"**
5. **Expand** **"public"**
6. **Expand** **"Tables"**

**You'll see all your tables:**
- ✅ `users`
- ✅ `students`
- ✅ `mentors`
- ✅ `events`
- ✅ `connection_requests`
- ✅ `notifications`
- ✅ `lectures`
- ✅ `competitions` (if exists)

---

### Step 5: View Table Data

#### Method A: View All Rows
1. **Right-click** on any table (e.g., `users`)
2. Select **"View/Edit Data" → "All Rows"**
3. Data appears in a spreadsheet-like grid!
4. You can:
   - ✅ Scroll through all rows
   - ✅ Sort by clicking column headers
   - ✅ Filter data
   - ✅ Edit data directly (if you have permissions)

#### Method B: View First 100 Rows
1. **Right-click** on table
2. Select **"View/Edit Data" → "First 100 Rows"**

#### Method C: View Last 100 Rows
1. **Right-click** on table
2. Select **"View/Edit Data" → "Last 100 Rows"**

---

### Step 6: Run SQL Queries

1. **Click** on **"Query Tool"** icon in toolbar (play button)
   - OR right-click database → **"Query Tool"**

2. **Type your SQL:**
   ```sql
   SELECT * FROM users;
   ```

3. **Click** **"Execute"** (F5) or press **F5**

4. **Results appear** in bottom panel

---

### Step 7: Common Queries to Try

#### View All Users
```sql
SELECT * FROM users ORDER BY created_at DESC;
```

#### View Recent Signups
```sql
SELECT id, email, name, role, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
```

#### View Users by Role
```sql
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;
```

#### View Students
```sql
SELECT * FROM students;
```

#### View Events
```sql
SELECT * FROM events ORDER BY date DESC;
```

#### Count Records
```sql
SELECT 
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM students) as students,
    (SELECT COUNT(*) FROM events) as events;
```

---

### Step 8: Edit Data (CRUD Operations)

#### INSERT (Create)
```sql
INSERT INTO users (email, name, password, role) 
VALUES ('newuser@test.com', 'New User', 'hashed_pass', 'student');
```

#### UPDATE (Modify)
```sql
UPDATE users 
SET name = 'Updated Name' 
WHERE email = 'test@example.com';
```

#### DELETE (Remove)
```sql
DELETE FROM users 
WHERE email = 'test@example.com';
```

---

## Visual Features in pgAdmin

### Data Grid Features:
- ✅ **Sort:** Click column header
- ✅ **Filter:** Right-click column → "Filter"
- ✅ **Search:** Use search box
- ✅ **Export:** Right-click → "Export/Import" → "Export"
- ✅ **Refresh:** F5 to reload data

### Query Tool Features:
- ✅ **Syntax highlighting**
- ✅ **Auto-complete**
- ✅ **Query history**
- ✅ **Explain plan** (see how query executes)
- ✅ **Export results** to CSV/Excel

---

## Quick Tips

1. **Refresh Data:** Press **F5** in data grid
2. **New Query:** Click **"Query Tool"** icon
3. **Save Query:** File → Save (or Ctrl+S)
4. **Export Data:** Right-click table → "Export/Import"
5. **View Table Structure:** Right-click table → "Properties"

---

## Troubleshooting

### Can't See Tables?
- Make sure you expanded: Servers → Databases → alumni_portal → Schemas → public → Tables

### Connection Failed?
- Check SSL mode is set to "Require"
- Verify password is correct
- Check if AWS RDS security group allows your IP

### Can't Edit Data?
- You might not have write permissions
- Some tables might be read-only
- Check your user permissions

---

**🎉 Now you can view and manage your database visually!**



