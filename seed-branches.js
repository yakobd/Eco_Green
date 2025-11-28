const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Creating branches...');
  
  try {
    const branch1 = await prisma.branch.create({
      data: {
        name: 'Eco Green - North Branch',
        location: 'North District, Industrial Zone A',
        phone: '+1 (555) 111-2222',
        email: 'north@ecogreen.com',
        manager: 'John Smith',
      },
    });
    
    const branch2 = await prisma.branch.create({
      data: {
        name: 'Eco Green - South Branch',
        location: 'South District, Commercial Area B',
        phone: '+1 (555) 333-4444',
        email: 'south@ecogreen.com',
        manager: 'Sarah Johnson',
      },
    });
    
    console.log('✅ Branches created successfully!');
    console.log('Branch 1:', branch1.name);
    console.log('Branch 2:', branch2.name);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
