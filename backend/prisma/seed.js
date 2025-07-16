const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { name: 'admin' },
      { name: 'super_admin' }
    ]
  });

  console.log("Roles seeded!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
