@echo off
echo ========================================
echo Merge Friend's AWS Gateway URLs
echo ========================================
echo.

cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
echo Current directory: %CD%
echo.

if not exist .env (
    echo Creating .env from template...
    copy ENV_TEMPLATE.txt .env
    echo.
)

echo ========================================
echo Your .env file is ready to edit!
echo ========================================
echo.
echo Instructions:
echo 1. Open backend\.env in notepad
echo 2. Update database credentials (DB_PASSWORD, etc.)
echo 3. Add your friend's AWS Gateway URLs at the bottom:
echo    - API_GATEWAY_UPLOAD_URL
echo    - API_GATEWAY_DYNAMODB_URL
echo    - API_GATEWAY_STUDENT_PROFILES_URL
echo.
echo Opening .env file now...
echo.
notepad .env
echo.
echo ========================================
echo Done! Your .env file is configured.
echo ========================================
pause

