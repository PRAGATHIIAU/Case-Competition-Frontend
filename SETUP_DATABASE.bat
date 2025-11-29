@echo off
echo ========================================
echo Database Setup Script
echo ========================================
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
echo Current directory: %CD%
echo.

echo Step 1: Initializing all database tables...
call npm run init-all
echo.

echo Step 2: Running unified identity migration...
call npm run migrate:unified-identity
echo.

echo Step 3: Seeding database with demo data...
call npm run seed
echo.

echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo Demo users created:
echo - Student: student@tamu.edu / 123456
echo - Mentor: mentor@tamu.edu / 123456
echo - Alumni: alumni@tamu.edu / 123456
echo - Admin: admin@tamu.edu / 123456
echo - Faculty: faculty@tamu.edu / 123456
echo.
pause



