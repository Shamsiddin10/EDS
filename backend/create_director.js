const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('**********', 10);
  const phoneNumber = '+998907654321';
  
  const user = await prisma.user.upsert({
    where: { phoneNumber },
    update: { role: 'DIRECTOR', isVerified: true },
    create: {
      firstName: 'Direktor',
      lastName: 'EduSys',
      phoneNumber: phoneNumber,
      password: hash,
      role: 'DIRECTOR',
      isVerified: true
    }
  });
  console.log('✅ Director created with Phone:', user.phoneNumber);
  await prisma.$disconnect();
}

main().catch(console.error);
