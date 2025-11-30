# Step-by-Step CMD Commands

## Step 1: Navigate to Backend Directory
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
```

## Step 2: Check Which Tables Exist in Database
```cmd
node -e "const pool = require('./config/db.cjs'); pool.query(\"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name\", (err, res) => { if (err) { console.error('Error:', err.message); } else { console.log('\n=== EXISTING TABLES ==='); res.rows.forEach(r => console.log('  -', r.table_name)); console.log('\nTotal tables:', res.rows.length); } pool.end(); });"
```

## Step 3: Create Faculty Table (if it doesn't exist)
```cmd
node scripts\create-faculty-table.js
```

## Step 4: Start Backend Server
```cmd
node server.js
```

## Alternative: Check Tables Using Direct SQL Query
```cmd
node -e "const pool = require('./config/db.cjs'); pool.query(\"SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name\", (err, res) => { if (err) { console.error('Error:', err.message); } else { console.log('\n=== ALL TABLES IN DATABASE ==='); res.rows.forEach(r => console.log('  -', r.table_name, '(' + r.table_type + ')')); } pool.end(); });"
```

## Check Specific Table Structure
```cmd
node -e "const pool = require('./config/db.cjs'); pool.query(\"SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position\", (err, res) => { if (err) { console.error('Error:', err.message); } else { console.log('\n=== USERS TABLE STRUCTURE ==='); res.rows.forEach(r => console.log('  -', r.column_name, ':', r.data_type, r.is_nullable === 'NO' ? '(NOT NULL)' : '')); } pool.end(); });"
```

