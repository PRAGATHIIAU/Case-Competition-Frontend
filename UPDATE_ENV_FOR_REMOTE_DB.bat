@echo off
echo ========================================
echo Updating .env for Remote Database
echo ========================================
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend

echo.
echo Updating PORT to 5000...
powershell -Command "(Get-Content .env) -replace '^PORT=3000', 'PORT=5000' | Set-Content .env"

echo Updating DB_SSL to true...
powershell -Command "(Get-Content .env) -replace '^DB_SSL=false', 'DB_SSL=true' | Set-Content .env"

echo.
echo ✅ .env file updated!
echo.
echo Current database settings:
findstr /B "DB_HOST DB_PORT DB_NAME DB_USER DB_SSL PORT" .env
echo.
pause



