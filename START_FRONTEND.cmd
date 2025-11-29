@echo off
echo ========================================
echo   Starting Frontend Server
echo ========================================
echo.
cd /d "%~dp0frontend"
echo Current directory: %CD%
echo.
echo Starting npm...
npm run dev
pause



