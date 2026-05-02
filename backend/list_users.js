const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      isVerified: true
    }
  });
  console.log('--- USERS IN DATABASE ---');
  console.table(users);
  await prisma.$disconnect();
}

main().catch(console.error);
