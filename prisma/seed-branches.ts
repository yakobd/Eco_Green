import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding branches...');

  // Create branches
  const branch1 = await prisma.branch.upsert({
    where: { id: 'branch-1' },
    update: {},
    create: {
      id: 'branch-1',
      name: 'Eco Green - North Branch',
      location: 'North District, Industrial Zone A',
      phone: '+1 (555) 111-2222',
      email: 'north@ecogreen.com',
      manager: 'John Smith',
    },
  });

  const branch2 = await prisma.branch.upsert({
    where: { id: 'branch-2' },
    update: {},
    create: {
      id: 'branch-2',
      name: 'Eco Green - South Branch',
      location: 'South District, Commercial Area B',
      phone: '+1 (555) 333-4444',
      email: 'south@ecogreen.com',
      manager: 'Sarah Johnson',
    },
  });

  console.log('✅ Branches created');
  console.log('Branch 1:', branch1.name);
  console.log('Branch 2:', branch2.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
