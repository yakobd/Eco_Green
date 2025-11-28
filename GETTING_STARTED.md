# 🚀 Getting Started - Supply Chain Management Platform

Welcome! This guide will help you get the platform running quickly.

## 📋 What You're Getting

A complete, production-ready web platform with:

✅ **Authentication System** - JWT-based with role management
✅ **3 User Roles** - Super Admin, Admin, User with different permissions
✅ **Product Management** - Full CRUD with inventory tracking
✅ **Order System** - Complete workflow from order to delivery
✅ **Reporting** - Daily, monthly, yearly business reports
✅ **Notifications** - Automatic announcements for new products
✅ **Responsive UI** - Works on desktop, tablet, and mobile
✅ **Type Safety** - Full TypeScript implementation
✅ **Database** - PostgreSQL with Prisma ORM

## 🎯 Choose Your Installation Method

### Option 1: Automated Installation (Recommended)

**Windows Users:**
```bash
install.bat
```

**Linux/Mac Users:**
```bash
chmod +x install.sh
./install.sh
```

This will automatically:
1. Install all dependencies
2. Create .env file
3. Generate Prisma Client
4. Run database migrations
5. Seed sample data

### Option 2: Manual Installation

Follow the **QUICKSTART.md** guide for step-by-step instructions.

### Option 3: Detailed Setup

Read **SETUP.md** for comprehensive setup instructions with troubleshooting.

## ⚡ Quick Commands

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev --name init
npx prisma db seed

# Start development server
npm run dev

# View database
npx prisma studio

# Build for production
npm run build

# Start production server
npm start
```

## 🔑 Demo Accounts

After installation, login with:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@example.com | password123 |
| Admin | admin@example.com | password123 |
| User | user@example.com | password123 |

## 📱 What Each Role Can Do

### 👑 Super Admin
- Create and delete users (Admin/User)
- View all system analytics
- Access all orders
- Full product management
- Generate reports
- View all features

### 🛠️ Admin
- Add/Edit/Delete products
- Manage inventory
- Approve/Reject orders
- Mark orders as delivered
- Generate reports
- View all orders

### 👤 User (Purchasing Organization)
- Browse all products
- Search and filter products
- Place orders
- View order history
- Track order status
- See new product announcements

## 🎨 Key Features to Try

### 1. Product Management (Admin)
- Navigate to "Manage Products"
- Click "Add Product"
- Fill in product details
- Notice automatic announcement creation

### 2. Order Workflow (User → Admin)
- Login as User
- Browse products
- Place an order
- Logout and login as Admin
- Approve the order
- Mark as delivered

### 3. Reporting (Admin)
- Go to "Reports"
- Select period (daily/monthly/yearly)
- View revenue and order statistics

### 4. User Management (Super Admin)
- Go to "Manage Users"
- Create new Admin or User
- Assign roles

## 📂 Project Structure

```
├── app/
│   ├── api/              # Backend API routes
│   ├── dashboard/        # Protected dashboard pages
│   └── login/            # Authentication page
├── components/           # Reusable React components
├── lib/                  # Utility functions
├── prisma/              # Database schema & seed
└── Documentation files
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# Database connection
DATABASE_URL="postgresql://user:password@localhost:5432/supply_chain_db"

# JWT secret (change in production!)
JWT_SECRET="your-super-secret-jwt-key"

# API URL
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Database Schema

- **Users**: Authentication and role management
- **Products**: Inventory with details
- **Orders**: Order tracking and status
- **Advertisements**: Product announcements

## 🌐 API Endpoints

All endpoints are documented in **PROJECT_OVERVIEW.md**

Key endpoints:
- `POST /api/auth/login` - Login
- `GET /api/products` - List products
- `POST /api/orders` - Create order
- `GET /api/reports` - Generate reports

## 🎓 Learning Path

1. **Start Here**: QUICKSTART.md (5 minutes)
2. **Understand**: PROJECT_OVERVIEW.md (15 minutes)
3. **Deep Dive**: SETUP.md (when needed)
4. **Reference**: FILE_STRUCTURE.md (as needed)

## 🐛 Common Issues & Solutions

### Issue: Database connection error
**Solution**: 
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

### Issue: Port 3000 in use
**Solution**: 
```bash
npm run dev -- -p 3001
```

### Issue: Prisma errors
**Solution**: 
```bash
npx prisma generate
npx prisma migrate reset
```

### Issue: Module not found
**Solution**: 
```bash
rm -rf node_modules
npm install
```

## 🚀 Deployment

### Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure production DATABASE_URL
- [ ] Update NEXT_PUBLIC_API_URL
- [ ] Run `npm run build`
- [ ] Test all features
- [ ] Set up database backups

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms

1. Build: `npm run build`
2. Set environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Start: `npm start`

## 📊 Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | Next.js 14, React, TailwindCSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT with httpOnly cookies |
| Language | TypeScript |
| Styling | TailwindCSS |
| Notifications | React Hot Toast |

## 🔐 Security Features

✅ Password hashing with bcrypt
✅ JWT tokens in httpOnly cookies
✅ Role-based access control
✅ SQL injection prevention (Prisma)
✅ XSS protection
✅ CSRF protection

## 📈 Performance

- Server-side rendering with Next.js
- Database indexing on key fields
- Efficient Prisma queries
- Pagination for large datasets
- Optimized bundle size

## 🛠️ Development Tools

```bash
# View database GUI
npx prisma studio

# Format code
npm run lint

# Type checking
npx tsc --noEmit

# Database migrations
npx prisma migrate dev
```

## 📚 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **TailwindCSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

## 💡 Pro Tips

1. **Use Prisma Studio** to visualize your database
2. **Check browser console** for frontend errors
3. **Check terminal** for backend errors
4. **Use TypeScript** autocomplete in your IDE
5. **Read error messages** carefully - they're helpful!

## 🎯 Next Steps

1. ✅ Complete installation
2. ✅ Login with demo accounts
3. ✅ Try each role's features
4. ✅ Create your own products
5. ✅ Test the order workflow
6. ✅ Generate reports
7. ✅ Customize for your needs

## 🤝 Support

If you encounter issues:

1. Check **SETUP.md** troubleshooting section
2. Review error messages
3. Verify environment variables
4. Check PostgreSQL is running
5. Try resetting the database

## 📝 Documentation Files

| File | Purpose |
|------|---------|
| **GETTING_STARTED.md** | This file - Quick overview |
| **QUICKSTART.md** | 5-minute setup guide |
| **SETUP.md** | Detailed setup instructions |
| **README.md** | Main project documentation |
| **PROJECT_OVERVIEW.md** | Architecture and features |
| **FILE_STRUCTURE.md** | Complete file listing |

## 🎉 You're Ready!

Everything is set up and ready to go. Start the development server and begin exploring:

```bash
npm run dev
```

Open http://localhost:3000 and login with any demo account.

**Happy coding!** 🚀

---

**Need help?** Check the documentation files or review the troubleshooting sections.
