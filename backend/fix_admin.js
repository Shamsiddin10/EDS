const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Admin@123456', 10);
  const emails = ['asliddinbrohimjonov481@gmail.com', 'asliddinibrohimjonov481@gmail.com'];
  
  for (const email of emails) {
    const user = await prisma.user.upsert({
      where: { email },
      update: { role: 'SUPER_ADMIN', isVerified: true },
      create: {
        name: 'Asliddin',
        email: email,
        password: hash,
        role: 'SUPER_ADMIN',
        isVerified: true
      }
    });
    console.log('✅ User updated/created:', user.email);
  }
  await prisma.$disconnect();
}

main().catch(console.error);
