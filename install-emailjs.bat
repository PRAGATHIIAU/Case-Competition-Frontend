@echo off
echo.
echo ==========================================
echo Installing EmailJS Package
echo ==========================================
echo.

cd /d "%~dp0"

echo Installing @emailjs/browser...
call npm install

echo.
echo ==========================================
echo Installation Complete!
echo ==========================================
echo.
echo You can now run: start.bat
echo.
pause

