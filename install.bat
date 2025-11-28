@echo off
echo ========================================
echo Supply Chain Platform - Installation
echo ========================================
echo.

echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [2/5] Checking for .env file...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please edit .env file with your database credentials
    echo    - Update DATABASE_URL with your PostgreSQL connection string
    echo    - Change JWT_SECRET to a random secret key
    echo.
    echo Press any key after updating .env file...
    pause >nul
)
echo ✓ .env file exists
echo.

echo [3/5] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma Client
    pause
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

echo [4/5] Running database migrations...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo ERROR: Failed to run migrations
    echo Make sure PostgreSQL is running and .env is configured correctly
    pause
    exit /b 1
)
echo ✓ Database migrations completed
echo.

echo [5/5] Seeding database with sample data...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo ERROR: Failed to seed database
    pause
    exit /b 1
)
echo ✓ Database seeded
echo.

echo ========================================
echo ✓ Installation Complete!
echo ========================================
echo.
echo Demo Accounts:
echo   Super Admin: superadmin@example.com / password123
echo   Admin:       admin@example.com / password123
echo   User:        user@example.com / password123
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
pause
