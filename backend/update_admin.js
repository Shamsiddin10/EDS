const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Admin@123456', 10);
  const user = await prisma.user.upsert({
    where: { email: 'asliddinbrohimjonov481@gmail.com' },
    update: { role: 'SUPER_ADMIN', isVerified: true },
    create: {
      name: 'Asliddin',
      email: 'asliddinbrohimjonov481@gmail.com',
      password: hash,
      role: 'SUPER_ADMIN',
      isVerified: true
    }
  });
  console.log('✅ Done! User:', user.email, '| Role:', user.role);
  console.log('📧 Email: asliddinbrohimjonov481@gmail.com');
  console.log('🔑 Password: Admin@123456');
  await prisma.$disconnect();
}

main().catch(console.error);
