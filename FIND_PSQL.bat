@echo off
echo ========================================
echo Finding PostgreSQL Installation
echo ========================================
echo.

echo Searching for psql.exe...
echo.

dir /s /b "C:\Program Files\PostgreSQL\psql.exe" 2>nul
if %errorlevel% neq 0 (
    dir /s /b "C:\Program Files (x86)\PostgreSQL\psql.exe" 2>nul
)

echo.
echo ========================================
echo If found, copy the path and use it like:
echo "C:\Program Files\PostgreSQL\15\bin\psql.exe" -h host -p 5432 -U postgres -d database
echo ========================================
pause



