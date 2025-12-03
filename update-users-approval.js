const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Updating existing users to approved status...');
  
  const result = await prisma.user.updateMany({
    where: {},
    data: {
      isApproved: true,
    },
  });

  console.log(`Updated ${result.count} users`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
