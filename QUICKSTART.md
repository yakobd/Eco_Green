# 🚀 Quick Start Guide

Get the Supply Chain Platform running in 5 minutes!

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18+ installed
- ✅ PostgreSQL installed and running
- ✅ npm or yarn package manager

## Step-by-Step Setup

### 1️⃣ Install Dependencies (1 minute)

```bash
npm install
```

### 2️⃣ Configure Database (1 minute)

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/supply_chain_db?schema=public"
JWT_SECRET="change-this-to-a-random-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**Windows Users**: Replace `postgres` and `yourpassword` with your PostgreSQL username and password.

### 3️⃣ Setup Database (2 minutes)

Run these commands one by one:

```bash
# Create database tables
npx prisma migrate dev --name init

# Add sample data
npx prisma db seed
```

### 4️⃣ Start the Application (30 seconds)

```bash
npm run dev
```

### 5️⃣ Open Your Browser

Navigate to: **http://localhost:3000**

## 🎉 You're Ready!

Login with these demo accounts:

### Super Admin
- **Email**: `superadmin@example.com`
- **Password**: `password123`

### Admin
- **Email**: `admin@example.com`
- **Password**: `password123`

### User
- **Email**: `user@example.com`
- **Password**: `password123`

## 🎯 What to Try First

### As Super Admin:
1. Go to "Manage Users" and create a new admin
2. View all orders across the system
3. Check the dashboard analytics

### As Admin:
1. Go to "Manage Products" and add a new product
2. Go to "Orders" and approve/reject pending orders
3. Generate reports (daily/monthly/yearly)

### As User:
1. Browse products and use search/filters
2. Place an order for a product
3. Check your order history
4. View new product announcements

## 🐛 Troubleshooting

### Database Connection Error?

**Check if PostgreSQL is running:**

Windows:
```bash
# Check status
pg_ctl status

# Start PostgreSQL
pg_ctl start
```

Linux/Mac:
```bash
sudo service postgresql status
sudo service postgresql start
```

### Port 3000 Already in Use?

Run on a different port:
```bash
npm run dev -- -p 3001
```

### Prisma Errors?

Reset and try again:
```bash
npx prisma migrate reset
npx prisma generate
npx prisma db seed
```

### Still Having Issues?

1. Check your `.env` file is configured correctly
2. Ensure PostgreSQL is running
3. Verify Node.js version: `node --version` (should be 18+)
4. Delete `node_modules` and run `npm install` again

## 📚 Next Steps

- Read **README.md** for detailed documentation
- Check **SETUP.md** for advanced configuration
- Review **PROJECT_OVERVIEW.md** for architecture details

## 🎨 Features to Explore

✅ Role-based dashboards
✅ Product management with inventory
✅ Order workflow (pending → approved → delivered)
✅ Search and filter products
✅ Generate business reports
✅ Real-time notifications
✅ User management (Super Admin)

## 🔒 Security Notes

For production deployment:
- Change JWT_SECRET to a strong random string
- Use environment-specific DATABASE_URL
- Enable HTTPS
- Review security best practices in README.md

## 💡 Pro Tips

1. **Prisma Studio**: View your database visually
   ```bash
   npx prisma studio
   ```
   Opens at http://localhost:5555

2. **Hot Reload**: Changes auto-refresh in development

3. **TypeScript**: Get autocomplete and type checking in your IDE

4. **Tailwind**: Use utility classes for quick styling

## 🆘 Need Help?

- Check the troubleshooting section above
- Review error messages in the terminal
- Check browser console for frontend errors
- Verify all environment variables are set

---

**Happy Coding! 🎉**

If everything works, you should see the login page at http://localhost:3000
