const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get the admin user we created
  const admin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' }
  });

  if (!admin) {
    console.log('Admin user not found. Please create admin first.');
    return;
  }

  const courses = [
    {
      title: 'Matematika - Asosiy tushunchalar',
      description: 'Algebra va Geometriya fanlaridan boshlang’ich bilimlar.',
      teacherId: admin.id,
      isApproved: true
    },
    {
      title: 'Ingliz tili - Intermediate',
      description: 'Grammatika va so’zlashuv nutqini rivojlantirish kursi.',
      teacherId: admin.id,
      isApproved: true
    },
    {
      title: 'Web Dasturlash (Next.js & Node.js)',
      description: 'Zamonaviy Full-stack veb ilovalar yaratishni o’rganamiz.',
      teacherId: admin.id,
      isApproved: true
    }
  ];

  for (const course of courses) {
    await prisma.course.create({ data: course });
  }

  console.log('✅ Namunaviy fanlar qo’shildi!');
  await prisma.$disconnect();
}

main().catch(console.error);
