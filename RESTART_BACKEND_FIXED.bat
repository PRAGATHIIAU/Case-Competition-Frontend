@echo off
echo ========================================
echo Restarting Backend Server
echo ========================================
cd /d C:\Users\darsh\Downloads\Case-competition_frontend\backend
echo Current directory: %CD%
echo.
echo Killing any process on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo Found process ID: %%a
    taskkill /F /PID %%a >nul 2>&1
    echo Process killed!
)
echo.
timeout /t 2 /nobreak >nul
echo Starting server...
node server.js
pause

