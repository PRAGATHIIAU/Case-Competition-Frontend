@echo off
echo ========================================
echo Checking Database Tables
echo ========================================
cd /d C:\Users\darsh\Downloads\Case-competition_frontend\backend
echo Current directory: %CD%
echo.
node -e "const pool = require('./config/db.cjs'); pool.query(\"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name\", (err, res) => { if (err) { console.error('Error:', err.message); process.exit(1); } else { console.log('\n=== EXISTING TABLES IN DATABASE ==='); console.log(''); res.rows.forEach(r => console.log('  -', r.table_name)); console.log(''); console.log('Total tables:', res.rows.length); } pool.end(); });"
echo.
pause

