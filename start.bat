@echo off
echo ============================================
echo  CMIS Engagement Platform - Quick Start
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

echo Node.js found!
echo.

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing dependencies (this may take a few minutes)...
    call npm install
    if errorlevel 1 (
        echo ERROR: Installation failed!
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
    echo.
)

echo Starting the development server...
echo.
echo The app will open in your browser automatically.
echo To stop the server, press Ctrl+C
echo.
echo ============================================
echo.

call npm run dev

pause

