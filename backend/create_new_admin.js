const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Admin@123456', 10);
  const phoneNumber = '+998901234567';
  
  const user = await prisma.user.upsert({
    where: { phoneNumber },
    update: { role: 'SUPER_ADMIN', isVerified: true },
    create: {
      firstName: 'Asliddin',
      lastName: 'Ibrohimjonov',
      phoneNumber: phoneNumber,
      password: hash,
      role: 'SUPER_ADMIN',
      isVerified: true
    }
  });
  console.log('✅ Admin created with Phone:', user.phoneNumber);
  await prisma.$disconnect();
}

main().catch(console.error);
