@echo off
echo ========================================
echo Complete Setup from Scratch
echo ========================================
echo.

cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
echo Current directory: %CD%
echo.

echo Step 1: Creating .env file...
if not exist .env (
    copy ENV_TEMPLATE.txt .env
    echo .env file created!
) else (
    echo .env file already exists!
)
echo.

echo ========================================
echo IMPORTANT: Edit .env file now!
echo ========================================
echo.
echo You need to:
echo 1. Change DB_PASSWORD to your PostgreSQL password
echo 2. Keep DB_HOST=localhost (NOT remote RDS)
echo 3. Add your friend's AWS Gateway URLs
echo 4. Add your friend's email configuration
echo.
echo Opening .env file in notepad...
echo.
notepad .env
echo.
echo Press any key after you've saved .env file...
pause
echo.

echo Step 2: Installing backend dependencies...
call npm install
echo.

echo Step 3: Initializing database tables...
call npm run init-all
echo.

echo Step 4: Running unified identity migration...
call npm run migrate:unified-identity
echo.

echo Step 5: Seeding database with demo data...
call npm run seed
echo.

echo ========================================
echo Backend setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Keep this terminal open
echo 2. Run: npm run dev
echo 3. Open a NEW terminal for frontend
echo 4. Run: cd C:\Users\darsh\Downloads\Case-competition_frontend\frontend
echo 5. Run: npm install
echo 6. Run: npm run dev
echo.
pause



