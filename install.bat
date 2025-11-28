@echo off
echo ============================================
echo  Installing Dependencies
echo ============================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed!
echo.
echo Installing dependencies (this may take 2-5 minutes)...
echo Please wait...
echo.

call npm install

if errorlevel 1 (
    echo.
    echo ERROR: Installation failed!
    pause
    exit /b 1
)

echo.
echo ============================================
echo  Installation Complete!
echo ============================================
echo.
echo You can now run the app using:
echo   1. Double-click start.bat
echo   2. Or type: npm run dev
echo.
pause

