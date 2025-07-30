const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create permissions
  const createTodoPermission = await prisma.permission.upsert({
    where: { name: 'create:todo' },
    update: {},
    create: { name: 'create:todo' }
  });

  const deleteUserPermission = await prisma.permission.upsert({
    where: { name: 'delete:user' },
    update: {},
    create: { name: 'delete:user' }
  });

  // Create roles
  const userRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: { name: 'User' }
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin' }
  });

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: { name: 'Super Admin' }
  });

  // Delete existing role permissions to avoid duplicates
  await prisma.rolePermission.deleteMany();

  // Assign permissions to roles
  await prisma.rolePermission.createMany({
    data: [
      // User permissions
      { roleId: userRole.id, permissionId: createTodoPermission.id },
      
      // Admin permissions
      { roleId: adminRole.id, permissionId: createTodoPermission.id },
      { roleId: adminRole.id, permissionId: deleteUserPermission.id },
      
      // Super Admin permissions
      { roleId: superAdminRole.id, permissionId: createTodoPermission.id },
      { roleId: superAdminRole.id, permissionId: deleteUserPermission.id }
    ]
  });

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'superadmin@test.com' },
    update: {},
    create: {
      name: 'Super Admin User',
      email: 'superadmin@test.com',
      password: hashedPassword,
      roleId: superAdminRole.id
    }
  });

  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@test.com',
      password: hashedPassword,
      roleId: adminRole.id
    }
  });

  await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@test.com',
      password: hashedPassword,
      roleId: userRole.id
    }
  });

  console.log('Database seeded successfully!');
  console.log('Test users created:');
  console.log('- superadmin@test.com / password123 (Super Admin)');
  console.log('- admin@test.com / password123 (Admin)');
  console.log('- user@test.com / password123 (User)');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });