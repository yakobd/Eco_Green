# Supply Chain Management Platform

A complete web platform for managing bulk goods supply chain operations with role-based access control.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Three user roles: Super Admin, Admin, and User
- Role-based access control for all features

### 👥 User Roles

**Super Admin**
- Full system control
- Create and manage Admins and Users
- View all orders, reports, and analytics
- Manage all products
- Access to comprehensive dashboards

**Admin**
- Add, edit, delete products
- Manage inventory
- Generate daily, monthly, and yearly reports
- Handle incoming orders (approve, reject, mark as delivered)

**User (Purchasing Organization)**
- View all products with filters
- Place orders
- View order history and status
- Receive notifications for new products

### 📦 Core Features
- Product listing with search, filters, and pagination
- Order management system
- Real-time inventory tracking
- Reporting and analytics
- Advertisement system for new products
- Responsive UI with TailwindCSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with httpOnly cookies
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

## Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure your database connection:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/supply_chain_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
```

5. Seed the database with sample data:
```bash
npx prisma db seed
```

6. Start the development server:
```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:3000`

## Demo Accounts

After seeding, you can login with these accounts:

**Super Admin**
- Email: `superadmin@example.com`
- Password: `password123`

**Admin**
- Email: `admin@example.com`
- Password: `password123`

**User**
- Email: `user@example.com`
- Password: `password123`

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── users/        # User management
│   │   ├── products/     # Product management
│   │   ├── orders/       # Order management
│   │   ├── reports/      # Reporting
│   │   └── advertisements/
│   ├── dashboard/        # Dashboard pages
│   │   ├── products/     # Product listing
│   │   ├── orders/       # Order management
│   │   ├── manage-products/
│   │   ├── users/        # User management
│   │   ├── reports/      # Reports
│   │   └── advertisements/
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   ├── Navbar.tsx
│   └── Sidebar.tsx
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication helpers
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
└── public/               # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users (Super Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `DELETE /api/users/[id]` - Delete user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/[id]` - Get product details
- `POST /api/products/manage` - Create product (Admin)
- `PUT /api/products/[id]` - Update product (Admin)
- `DELETE /api/products/[id]` - Delete product (Admin)

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/[id]` - Update order status (Admin)

### Reports (Admin only)
- `GET /api/reports?period=daily|monthly|yearly` - Generate reports

### Advertisements
- `GET /api/advertisements` - List announcements

## Database Schema

### User
- id, name, email, password, role, timestamps

### Product
- id, name, type, price, quantity, location, description, timestamps

### Order
- id, userId, productId, quantity, totalPrice, status, timestamps

### Advertisement
- id, message, productId, timestamp

## Features in Detail

### Product Management
- Add/Edit/Delete products
- Upload product details (name, type, price, quantity, location)
- Real-time inventory tracking
- Search and filter functionality

### Order Management
- Place orders with quantity selection
- Order status tracking (Pending, Approved, Rejected, Delivered)
- Admin approval workflow
- Automatic inventory deduction on approval

### Reporting
- Daily, monthly, and yearly reports
- Total revenue tracking
- Order statistics
- Detailed order history

### Notifications
- Automatic advertisements when new products are added
- Announcement feed for users

## Production Deployment

1. Set up a PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build the application:
```bash
npm run build
```
5. Start the production server:
```bash
npm start
```

## Security Features

- Password hashing with bcrypt
- JWT tokens stored in httpOnly cookies
- Role-based middleware protection
- SQL injection prevention with Prisma
- CSRF protection

## License

MIT
