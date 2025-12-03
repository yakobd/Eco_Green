import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: { isApproved: true },
    create: {
      email: 'superadmin@example.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isApproved: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { isApproved: true },
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      isApproved: true,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: { isApproved: true },
    create: {
      email: 'user@example.com',
      name: 'Purchasing Organization',
      password: hashedPassword,
      role: 'USER',
      isApproved: true,
    },
  });

  console.log('✅ Users created');

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Industrial Steel Pipes',
        type: 'Construction Materials',
        price: 1500.0,
        quantity: 500,
        location: 'Warehouse A - City Center',
        description: 'High-quality steel pipes for industrial use',
        imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cement Bags (50kg)',
        type: 'Construction Materials',
        price: 8.5,
        quantity: 10000,
        location: 'Warehouse B - North District',
        description: 'Premium Portland cement',
        imageUrl: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Electrical Cables',
        type: 'Electronics',
        price: 45.0,
        quantity: 2000,
        location: 'Warehouse C - East Zone',
        description: 'Copper electrical cables, various gauges',
        imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Paint Buckets (20L)',
        type: 'Chemicals',
        price: 35.0,
        quantity: 1500,
        location: 'Warehouse A - City Center',
        description: 'Interior and exterior paint',
        imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Plywood Sheets',
        type: 'Wood Products',
        price: 25.0,
        quantity: 800,
        location: 'Warehouse D - South Area',
        description: '4x8 plywood sheets, various thicknesses',
        imageUrl: 'https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=400',
      },
    }),
  ]);

  console.log('✅ Products created');

  // Create sample orders
  await prisma.order.createMany({
    data: [
      {
        userId: user.id,
        productId: products[0].id,
        quantity: 50,
        totalPrice: 75000,
        status: 'APPROVED',
      },
      {
        userId: user.id,
        productId: products[1].id,
        quantity: 500,
        totalPrice: 4250,
        status: 'DELIVERED',
      },
      {
        userId: user.id,
        productId: products[2].id,
        quantity: 100,
        totalPrice: 4500,
        status: 'PENDING',
      },
    ],
  });

  console.log('✅ Orders created');

  // Create advertisements
  await prisma.advertisement.createMany({
    data: [
      {
        message: 'New stock of Industrial Steel Pipes available!',
        productId: products[0].id,
      },
      {
        message: 'Special discount on Cement Bags this month!',
        productId: products[1].id,
      },
    ],
  });

  console.log('✅ Advertisements created');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
