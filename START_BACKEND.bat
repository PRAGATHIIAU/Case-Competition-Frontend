@echo off
echo ========================================
echo Starting Backend Server
echo ========================================
cd /d C:\Users\darsh\Downloads\Case-competition_frontend\backend
echo Current directory: %CD%
echo.
echo Checking database connection...
node -e "const pool = require('./config/db.cjs'); pool.query('SELECT NOW()', (err, res) => { if (err) { console.error('Database connection error:', err.message); process.exit(1); } else { console.log('Database connected successfully'); pool.end(); } });"
echo.
echo Starting server...
node server.js
pause
