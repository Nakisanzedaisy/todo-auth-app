const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check if roles exist
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' }
  });

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'super_admin' },
    update: {},
    create: { name: 'super_admin' }
  });

  // Check if permissions exist
  const createTodo = await prisma.permission.upsert({
    where: { name: 'create_todo' },
    update: {},
    create: { name: 'create_todo' }
  });

  const deleteTodo = await prisma.permission.upsert({
    where: { name: 'delete_todo' },
    update: {},
    create: { name: 'delete_todo' }
  });

  // Update roles with permissions
  await prisma.role.update({
    where: { id: adminRole.id },
    data: {
      permissions: {
        connect: [{ id: createTodo.id }]
      }
    }
  });

  await prisma.role.update({
    where: { id: superAdminRole.id },
    data: {
      permissions: {
        connect: [
          { id: createTodo.id },
          { id: deleteTodo.id }
        ]
      }
    }
  });

  console.log('Seeding completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
