@echo off
echo ========================================
echo Killing Process on Port 5000
echo ========================================
echo.
echo Finding process on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo Found process ID: %%a
    echo Killing process...
    taskkill /F /PID %%a
    echo Process killed!
)
echo.
echo Port 5000 should now be free.
echo.
pause
