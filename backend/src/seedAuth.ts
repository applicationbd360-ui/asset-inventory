import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding roles and users...');

  // 1. Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      displayName: 'System Administrator',
      permissions: ['ALL'],
    },
  });

  const techRole = await prisma.role.upsert({
    where: { name: 'TECHNICIAN' },
    update: {},
    create: {
      name: 'TECHNICIAN',
      displayName: 'Maintenance Technician',
      permissions: ['MAINTENANCE:READ', 'MAINTENANCE:UPDATE'],
    },
  });

  const docRole = await prisma.role.upsert({
    where: { name: 'DOCTOR' },
    update: {},
    create: {
      name: 'DOCTOR',
      displayName: 'Medical Doctor',
      permissions: ['PR:CREATE', 'PR:READ', 'WORK_ORDER:CREATE'],
    },
  });

  const finRole = await prisma.role.upsert({
    where: { name: 'FINANCE' },
    update: {},
    create: {
      name: 'FINANCE',
      displayName: 'Finance Officer',
      permissions: ['FINANCE:READ', 'FINANCE:CREATE', 'FINANCE:UPDATE', 'PO:READ'],
    },
  });

  // 2. Users
  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@hospital.com' },
    update: {},
    create: {
      email: 'admin@hospital.com',
      name: 'Super Admin',
      passwordHash,
      roleId: adminRole.id,
      employeeCode: 'EMP-001'
    }
  });

  await prisma.user.upsert({
    where: { email: 'tech@hospital.com' },
    update: {},
    create: {
      email: 'tech@hospital.com',
      name: 'John Technician',
      passwordHash,
      roleId: techRole.id,
      employeeCode: 'EMP-002'
    }
  });

  await prisma.user.upsert({
    where: { email: 'doc@hospital.com' },
    update: {},
    create: {
      email: 'doc@hospital.com',
      name: 'Dr. Sarah',
      passwordHash,
      roleId: docRole.id,
      employeeCode: 'EMP-003'
    }
  });

  await prisma.user.upsert({
    where: { email: 'finance@hospital.com' },
    update: {},
    create: {
      email: 'finance@hospital.com',
      name: 'Mike Finance',
      passwordHash,
      roleId: finRole.id,
      employeeCode: 'EMP-004'
    }
  });

  console.log('✅ Auth seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
