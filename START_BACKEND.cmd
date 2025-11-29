@echo off
echo ========================================
echo   Starting Backend Server
echo ========================================
echo.
cd /d "%~dp0backend"
echo Current directory: %CD%
echo.
echo Starting npm...
npm start
pause



