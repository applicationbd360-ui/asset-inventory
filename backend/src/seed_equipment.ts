import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding equipment data...');

  // Create or get category
  let category = await prisma.equipmentCategory.findFirst();
  if (!category) {
    category = await prisma.equipmentCategory.create({
      data: {
        code: 'CAT-MED',
        name: 'Medical Equipment',
        isBiomedical: true,
      }
    });
  }

  // Create dummy equipment
  const equipmentData = [
    { code: 'EQ-001', name: 'MRI Machine Scanner', categoryId: category.id, status: 'ACTIVE', criticality: 'CRITICAL' },
    { code: 'EQ-002', name: 'X-Ray Machine', categoryId: category.id, status: 'ACTIVE', criticality: 'HIGH' },
    { code: 'EQ-003', name: 'Backup Generator 500KVA', categoryId: category.id, status: 'UNDER_MAINTENANCE', criticality: 'MEDIUM' },
    { code: 'EQ-004', name: 'HVAC Chiller Unit A', categoryId: category.id, status: 'ACTIVE', criticality: 'HIGH' },
    { code: 'EQ-005', name: 'Ultrasound Machine', categoryId: category.id, status: 'ACTIVE', criticality: 'MEDIUM' },
  ];

  for (const eq of equipmentData) {
    await prisma.equipment.upsert({
      where: { code: eq.code },
      update: {},
      create: eq
    });
  }

  console.log('Successfully seeded 5 equipment records.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
