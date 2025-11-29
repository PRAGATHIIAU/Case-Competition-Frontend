@echo off
echo Killing process on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Killing process %%a
    taskkill /F /PID %%a >nul 2>&1
)
echo Port 5000 is now free!
timeout /t 1 >nul



