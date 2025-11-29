@echo off
echo ========================================
echo Case Competition Platform - Quick Start
echo ========================================
echo.

echo Step 1: Setting up Backend...
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
echo Current directory: %CD%
echo.

echo Installing backend dependencies...
call npm install
echo.

echo Initializing database tables...
call npm run init-all
echo.

echo Running unified identity migration...
call npm run migrate:unified-identity
echo.

echo Seeding database with demo data...
call npm run seed
echo.

echo ========================================
echo Backend setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Open a NEW terminal window
echo 2. Run: cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
echo 3. Run: npm run dev
echo.
echo 4. Open ANOTHER terminal window
echo 5. Run: cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
echo 6. Run: npm install
echo 7. Run: npm run dev
echo.
pause



