@echo off
echo ========================================
echo Adding PostgreSQL to PATH
echo ========================================
echo.
echo This will add PostgreSQL bin folder to your system PATH.
echo You may need to run as Administrator.
echo.

setx PATH "%PATH%;C:\Program Files\PostgreSQL\18\bin" /M

echo.
echo ✅ PostgreSQL added to PATH!
echo.
echo IMPORTANT: Close and reopen PowerShell/CMD for changes to take effect.
echo.
pause



