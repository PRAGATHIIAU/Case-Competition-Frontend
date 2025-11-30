@echo off
echo ========================================
echo Check Table Structure
echo ========================================
cd /d C:\Users\darsh\Downloads\Case-competition_frontend\backend
echo Current directory: %CD%
echo.
set /p TABLE_NAME="Enter table name (users, students, faculty, etc.): "
echo.
echo Checking structure of table: %TABLE_NAME%
echo.
node -e "const pool = require('./config/db.cjs'); const tableName = process.argv[1]; pool.query(\"SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position\", [tableName], (err, res) => { if (err) { console.error('Error:', err.message); process.exit(1); } else { console.log('=== %TABLE_NAME% TABLE STRUCTURE ==='); console.log(''); res.rows.forEach(r => console.log('  -', r.column_name, ':', r.data_type, r.is_nullable === 'NO' ? '(NOT NULL)' : '(NULLABLE)')); console.log(''); console.log('Total columns:', res.rows.length); } pool.end(); });" %TABLE_NAME%
echo.
pause

