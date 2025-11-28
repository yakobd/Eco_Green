#!/bin/bash

echo "========================================"
echo "Supply Chain Platform - Installation"
echo "========================================"
echo ""

echo "[1/5] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed"
echo ""

echo "[2/5] Checking for .env file..."
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file with your database credentials"
    echo "   - Update DATABASE_URL with your PostgreSQL connection string"
    echo "   - Change JWT_SECRET to a random secret key"
    echo ""
    echo "Press Enter after updating .env file..."
    read
fi
echo "✓ .env file exists"
echo ""

echo "[3/5] Generating Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to generate Prisma Client"
    exit 1
fi
echo "✓ Prisma Client generated"
echo ""

echo "[4/5] Running database migrations..."
npx prisma migrate dev --name init
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to run migrations"
    echo "Make sure PostgreSQL is running and .env is configured correctly"
    exit 1
fi
echo "✓ Database migrations completed"
echo ""

echo "[5/5] Seeding database with sample data..."
npx prisma db seed
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to seed database"
    exit 1
fi
echo "✓ Database seeded"
echo ""

echo "========================================"
echo "✓ Installation Complete!"
echo "========================================"
echo ""
echo "Demo Accounts:"
echo "  Super Admin: superadmin@example.com / password123"
echo "  Admin:       admin@example.com / password123"
echo "  User:        user@example.com / password123"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
