# Setup Guide - Supply Chain Management Platform

## Quick Start

Follow these steps to get the application running:

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL Database

Make sure you have PostgreSQL installed and running. Create a new database:

```sql
CREATE DATABASE supply_chain_db;
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/supply_chain_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

Replace:
- `username` with your PostgreSQL username
- `password` with your PostgreSQL password
- `supply_chain_db` with your database name (if different)

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create all necessary tables
- Generate Prisma Client

### 5. Seed the Database

```bash
npx prisma db seed
```

This creates:
- 3 demo users (Super Admin, Admin, User)
- 5 sample products
- 3 sample orders
- 2 advertisements

### 6. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Demo Accounts

After seeding, login with these credentials:

### Super Admin Account
- **Email**: superadmin@example.com
- **Password**: password123
- **Access**: Full system control

### Admin Account
- **Email**: admin@example.com
- **Password**: password123
- **Access**: Product & order management

### User Account
- **Email**: user@example.com
- **Password**: password123
- **Access**: Browse products & place orders

## Troubleshooting

### Database Connection Issues

If you get a database connection error:

1. Verify PostgreSQL is running:
```bash
# Windows
pg_ctl status

# Linux/Mac
sudo service postgresql status
```

2. Check your DATABASE_URL in `.env`
3. Ensure the database exists
4. Verify credentials are correct

### Prisma Issues

If Prisma commands fail:

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Port Already in Use

If port 3000 is already in use:

```bash
# Run on a different port
npm run dev -- -p 3001
```

## Production Deployment

### 1. Build the Application

```bash
npm run build
```

### 2. Set Production Environment Variables

Update `.env` with production values:
- Use a strong JWT_SECRET
- Update DATABASE_URL to production database
- Set NEXT_PUBLIC_API_URL to your domain

### 3. Run Migrations on Production Database

```bash
npx prisma migrate deploy
```

### 4. Start Production Server

```bash
npm start
```

## Database Management

### View Database in Prisma Studio

```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555` to view and edit data.

### Create a New Migration

After modifying `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name description_of_changes
```

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

This will:
- Drop the database
- Create a new database
- Run all migrations
- Run seed script

## Features Overview

### Super Admin Features
- ✅ Create and manage users (Admin/User)
- ✅ View all orders and analytics
- ✅ Full product management
- ✅ Access to all reports

### Admin Features
- ✅ Add/Edit/Delete products
- ✅ Manage inventory
- ✅ Approve/Reject orders
- ✅ Mark orders as delivered
- ✅ Generate reports (daily/monthly/yearly)

### User Features
- ✅ Browse products with filters
- ✅ Search products
- ✅ Place orders
- ✅ View order history
- ✅ See new product announcements

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT with httpOnly cookies
- **Language**: TypeScript

## Project Structure

```
├── app/
│   ├── api/                    # API endpoints
│   │   ├── auth/              # Authentication
│   │   ├── users/             # User management
│   │   ├── products/          # Product CRUD
│   │   ├── orders/            # Order management
│   │   ├── reports/           # Reporting
│   │   └── advertisements/    # Announcements
│   ├── dashboard/             # Protected pages
│   │   ├── products/          # Product listing
│   │   ├── orders/            # Order management
│   │   ├── manage-products/   # Admin product management
│   │   ├── users/             # User management (Super Admin)
│   │   ├── reports/           # Reports (Admin)
│   │   └── advertisements/    # Announcements
│   ├── login/                 # Login page
│   └── layout.tsx             # Root layout
├── components/                # React components
├── lib/                       # Utilities
├── prisma/                    # Database schema & seed
└── public/                    # Static files
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the README.md
3. Check Prisma documentation: https://www.prisma.io/docs
4. Check Next.js documentation: https://nextjs.org/docs
