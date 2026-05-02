import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    const user = await prisma.user.update({
      where: { email: 'asliddinbrohimjonov481@gmail.com' },
      data: { role: 'SUPER_ADMIN' },
    })
    console.log('Successfully updated user to SUPER_ADMIN:', user.email, user.role)
  } catch (err: any) {
    console.error('Failed to update:', err.message)
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
