@echo off
echo Stopping any Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Cleaning Prisma temp files...
del /F /Q node_modules\.prisma\client\*.tmp* 2>nul
echo Regenerating Prisma client...
npx prisma generate
echo Done!
pause
