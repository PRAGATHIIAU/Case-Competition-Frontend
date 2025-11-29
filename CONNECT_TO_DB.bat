@echo off
echo ========================================
echo Connecting to Remote PostgreSQL Database
echo ========================================
echo.

"C:\Program Files\PostgreSQL\18\bin\psql.exe" -h alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com -p 5432 -U postgres -d alumni_portal

pause



