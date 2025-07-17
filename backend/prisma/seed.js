const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const [adminRole, superAdminRole] = await Promise.all([
    prisma.role.create({ data: { name: 'admin' } }),
    prisma.role.create({ data: { name: 'super_admin' } })
  ]);

  const [createTodo, deleteTodo] = await Promise.all([
    prisma.permission.create({ data: { name: 'create_todo' } }),
    prisma.permission.create({ data: { name: 'delete_todo' } })
  ]);

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
        connect: [{ id: createTodo.id }, { id: deleteTodo.id }]
      }
    }
  });

  console.log('Seeding completed.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
