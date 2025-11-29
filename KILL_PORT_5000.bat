@echo off
echo Finding process on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process %%a...
    taskkill /F /PID %%a >nul 2>&1
    if errorlevel 1 (
        echo Failed to kill process. Try running as Administrator.
    ) else (
        echo Process killed successfully!
    )
)
echo.
echo You can now start the backend with: npm start
pause



