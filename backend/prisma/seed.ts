import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ── Roles ───────────────────────────────────────────────────
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'super_admin' },
      update: {},
      create: {
        name: 'super_admin',
        displayName: 'Super Administrator',
        permissions: ['*'],
      },
    }),
    prisma.role.upsert({
      where: { name: 'hod' },
      update: {},
      create: {
        name: 'hod',
        displayName: 'Head of Department',
        permissions: ['PR:CREATE', 'PR:VIEW', 'PR:APPROVE_DEPT', 'EQUIPMENT:VIEW', 'WORKORDER:VIEW'],
      },
    }),
    prisma.role.upsert({
      where: { name: 'biomedical_engineer' },
      update: {},
      create: {
        name: 'biomedical_engineer',
        displayName: 'Biomedical Engineer',
        permissions: [
          'EQUIPMENT:VIEW', 'EQUIPMENT:CREATE', 'EQUIPMENT:UPDATE',
          'WORKORDER:CREATE', 'WORKORDER:UPDATE', 'WORKORDER:VIEW',
          'CALIBRATION:MANAGE', 'GRN:INSPECT', 'PM:MANAGE',
        ],
      },
    }),
    prisma.role.upsert({
      where: { name: 'store_officer' },
      update: {},
      create: {
        name: 'store_officer',
        displayName: 'Store Officer',
        permissions: ['GRN:CREATE', 'GRN:VIEW', 'INVENTORY:MANAGE', 'WORKORDER:ISSUE_MATERIAL'],
      },
    }),
    prisma.role.upsert({
      where: { name: 'purchase_officer' },
      update: {},
      create: {
        name: 'purchase_officer',
        displayName: 'Purchase Officer',
        permissions: ['PR:VIEW', 'PO:CREATE', 'PO:VIEW', 'PO:UPDATE', 'VENDOR:MANAGE', 'GRN:VIEW'],
      },
    }),
    prisma.role.upsert({
      where: { name: 'finance_officer' },
      update: {},
      create: {
        name: 'finance_officer',
        displayName: 'Finance Officer',
        permissions: [
          'FIXED_ASSET:MANAGE', 'JOURNAL:CREATE', 'JOURNAL:VIEW',
          'DEPRECIATION:RUN', 'BUDGET:VIEW', 'REPORTS:FINANCE',
        ],
      },
    }),
    prisma.role.upsert({
      where: { name: 'management' },
      update: {},
      create: {
        name: 'management',
        displayName: 'Management',
        permissions: ['DASHBOARD:VIEW', 'REPORTS:ALL', 'EQUIPMENT:VIEW', 'WORKORDER:VIEW'],
      },
    }),
  ]);

  console.log(`✅ ${roles.length} roles created`);

  // ── Cost Centers ────────────────────────────────────────────
  const costCenters = await Promise.all([
    prisma.costCenter.upsert({ where: { code: 'CC-ICU' }, update: {}, create: { code: 'CC-ICU', name: 'Intensive Care Unit' } }),
    prisma.costCenter.upsert({ where: { code: 'CC-OT' }, update: {}, create: { code: 'CC-OT', name: 'Operation Theatre' } }),
    prisma.costCenter.upsert({ where: { code: 'CC-RAD' }, update: {}, create: { code: 'CC-RAD', name: 'Radiology' } }),
    prisma.costCenter.upsert({ where: { code: 'CC-LAB' }, update: {}, create: { code: 'CC-LAB', name: 'Laboratory' } }),
    prisma.costCenter.upsert({ where: { code: 'CC-EMRG' }, update: {}, create: { code: 'CC-EMRG', name: 'Emergency Department' } }),
    prisma.costCenter.upsert({ where: { code: 'CC-FACILITY' }, update: {}, create: { code: 'CC-FACILITY', name: 'Facility Management' } }),
  ]);

  console.log(`✅ ${costCenters.length} cost centers created`);

  // ── Departments ─────────────────────────────────────────────
  const depts = await Promise.all([
    prisma.department.upsert({ where: { code: 'DEPT-ICU' }, update: {}, create: { code: 'DEPT-ICU', name: 'ICU', costCenterId: costCenters[0].id } }),
    prisma.department.upsert({ where: { code: 'DEPT-OT' }, update: {}, create: { code: 'DEPT-OT', name: 'Operation Theatre', costCenterId: costCenters[1].id } }),
    prisma.department.upsert({ where: { code: 'DEPT-BIOMED' }, update: {}, create: { code: 'DEPT-BIOMED', name: 'Biomedical Engineering', costCenterId: costCenters[5].id } }),
    prisma.department.upsert({ where: { code: 'DEPT-PURCHASE' }, update: {}, create: { code: 'DEPT-PURCHASE', name: 'Purchase Department', costCenterId: costCenters[5].id } }),
    prisma.department.upsert({ where: { code: 'DEPT-FINANCE' }, update: {}, create: { code: 'DEPT-FINANCE', name: 'Finance Department', costCenterId: costCenters[5].id } }),
  ]);

  console.log(`✅ ${depts.length} departments created`);

  // ── Admin User ──────────────────────────────────────────────
  const superAdminRole = roles.find((r) => r.name === 'super_admin')!;
  const adminHash = await bcrypt.hash('Admin@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@assetiq.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@assetiq.com',
      employeeCode: 'EMP-0001',
      passwordHash: adminHash,
      roleId: superAdminRole.id,
    },
  });

  // Demo biomedical engineer
  const bimedHash = await bcrypt.hash('Biomed@123', 12);
  const biomedRole = roles.find((r) => r.name === 'biomedical_engineer')!;
  await prisma.user.upsert({
    where: { email: 'biomed@assetiq.com' },
    update: {},
    create: {
      name: 'Dr. Rahman (Biomedical)',
      email: 'biomed@assetiq.com',
      employeeCode: 'EMP-0002',
      passwordHash: bimedHash,
      roleId: biomedRole.id,
      departmentId: depts.find((d) => d.code === 'DEPT-BIOMED')!.id,
    },
  });

  console.log('✅ Users created: admin@assetiq.com / Admin@123');

  // ── Functional Locations ─────────────────────────────────────
  const hospital = await prisma.functionalLocation.upsert({
    where: { code: 'HOSP-01' },
    update: {},
    create: { code: 'HOSP-01', name: 'Main Hospital Building', type: 'FACILITY', level: 0 },
  });

  const icuFloor = await prisma.functionalLocation.upsert({
    where: { code: 'HOSP-01-ICU' },
    update: {},
    create: { code: 'HOSP-01-ICU', name: 'ICU Department', type: 'DEPARTMENT', parentId: hospital.id, level: 1, pathIds: [hospital.id] },
  });

  const otFloor = await prisma.functionalLocation.upsert({
    where: { code: 'HOSP-01-OT' },
    update: {},
    create: { code: 'HOSP-01-OT', name: 'Operation Theatre', type: 'DEPARTMENT', parentId: hospital.id, level: 1, pathIds: [hospital.id] },
  });

  console.log('✅ Functional locations created');

  // ── Equipment Categories ─────────────────────────────────────
  const categories = await Promise.all([
    prisma.equipmentCategory.upsert({ where: { code: 'CAT-VENTILATOR' }, update: {}, create: { code: 'CAT-VENTILATOR', name: 'Ventilator', isBiomedical: true, requiresCalib: true, defaultPmFreqDays: 30 } }),
    prisma.equipmentCategory.upsert({ where: { code: 'CAT-MONITOR' }, update: {}, create: { code: 'CAT-MONITOR', name: 'Patient Monitor', isBiomedical: true, requiresCalib: true, defaultPmFreqDays: 30 } }),
    prisma.equipmentCategory.upsert({ where: { code: 'CAT-DEFIB' }, update: {}, create: { code: 'CAT-DEFIB', name: 'Defibrillator', isBiomedical: true, requiresCalib: true, defaultPmFreqDays: 30 } }),
    prisma.equipmentCategory.upsert({ where: { code: 'CAT-GENERATOR' }, update: {}, create: { code: 'CAT-GENERATOR', name: 'Generator', isBiomedical: false, requiresCalib: false, defaultPmFreqDays: 90 } }),
    prisma.equipmentCategory.upsert({ where: { code: 'CAT-AC' }, update: {}, create: { code: 'CAT-AC', name: 'Air Conditioning', isBiomedical: false, requiresCalib: false, defaultPmFreqDays: 60 } }),
  ]);

  console.log(`✅ ${categories.length} equipment categories created`);

  // ── Asset Classes ────────────────────────────────────────────
  await Promise.all([
    prisma.assetClass.upsert({
      where: { code: 'MEDICAL-EQUIP' },
      update: {},
      create: {
        code: 'MEDICAL-EQUIP',
        name: 'Medical Equipment',
        assetGlCode: '1510',
        accumDepreciationGlCode: '1511',
        depreciationExpenseGlCode: '6510',
        defaultUsefulLifeMonths: 60,
        depreciationMethod: 'STRAIGHT_LINE',
      },
    }),
    prisma.assetClass.upsert({
      where: { code: 'FACILITY-EQUIP' },
      update: {},
      create: {
        code: 'FACILITY-EQUIP',
        name: 'Facility Equipment',
        assetGlCode: '1520',
        accumDepreciationGlCode: '1521',
        depreciationExpenseGlCode: '6520',
        defaultUsefulLifeMonths: 120,
        depreciationMethod: 'STRAIGHT_LINE',
      },
    }),
  ]);

  // ── Chart of Accounts (Basic) ────────────────────────────────
  const accounts = [
    { glCode: '1510', glName: 'Medical Equipment — Fixed Asset', accountType: 'ASSET', normalBalance: 'DEBIT' },
    { glCode: '1511', glName: 'Accumulated Depreciation — Medical Equipment', accountType: 'ASSET', normalBalance: 'CREDIT' },
    { glCode: '1520', glName: 'Facility Equipment — Fixed Asset', accountType: 'ASSET', normalBalance: 'DEBIT' },
    { glCode: '1521', glName: 'Accumulated Depreciation — Facility Equipment', accountType: 'ASSET', normalBalance: 'CREDIT' },
    { glCode: '1610', glName: 'Spare Parts Inventory', accountType: 'ASSET', normalBalance: 'DEBIT' },
    { glCode: '2100', glName: 'Accounts Payable', accountType: 'LIABILITY', normalBalance: 'CREDIT' },
    { glCode: '2110', glName: 'GR/IR Clearing', accountType: 'LIABILITY', normalBalance: 'CREDIT' },
    { glCode: '6510', glName: 'Depreciation Expense — Medical Equipment', accountType: 'EXPENSE', normalBalance: 'DEBIT' },
    { glCode: '6520', glName: 'Depreciation Expense — Facility Equipment', accountType: 'EXPENSE', normalBalance: 'DEBIT' },
    { glCode: '6610', glName: 'Repair & Maintenance Expense', accountType: 'EXPENSE', normalBalance: 'DEBIT' },
    { glCode: '6620', glName: 'Vendor Service Expense', accountType: 'EXPENSE', normalBalance: 'DEBIT' },
  ];

  for (const acc of accounts) {
    await prisma.chartOfAccounts.upsert({
      where: { glCode: acc.glCode },
      update: {},
      create: acc,
    });
  }

  console.log(`✅ ${accounts.length} GL accounts created`);

  // ── Posting Rules ────────────────────────────────────────────
  await prisma.postingRule.createMany({
    data: [
      { sourceModule: 'FIXED_ASSET', transactionType: 'ASSET_CAPITALIZATION', debitGlCode: '1510', creditGlCode: '2110', autoPost: true },
      { sourceModule: 'EAM', transactionType: 'WORK_ORDER_MATERIAL_CONSUMPTION', debitGlCode: '6610', creditGlCode: '1610', autoPost: true },
      { sourceModule: 'EAM', transactionType: 'VENDOR_SERVICE_COST', debitGlCode: '6620', creditGlCode: '2100', autoPost: true },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Posting rules created');

  // ── Demo Equipment ────────────────────────────────────────────
  const ventilatorCategory = categories.find((c) => c.code === 'CAT-VENTILATOR')!;
  await prisma.equipment.upsert({
    where: { code: 'EQ-BIO-000001' },
    update: {},
    create: {
      code: 'EQ-BIO-000001',
      name: 'ICU Ventilator — Bed 01',
      categoryId: ventilatorCategory.id,
      flocId: icuFloor.id,
      costCenterId: costCenters[0].id,
      serialNo: 'SN-VNT-001',
      modelNo: 'VNT-900-PRO',
      manufacturer: 'MedTech Solutions',
      warrantyStartDate: new Date('2025-01-01'),
      warrantyEndDate: new Date('2028-01-01'),
      installDate: new Date('2025-01-15'),
      purchaseValue: 3000000,
      criticality: 'CRITICAL',
      status: 'ACTIVE',
      phase: 'FULLY_OPERATIONAL',
      isBiomedical: true,
      calibRequired: true,
      pmRequired: true,
      riskScore: 76.0,
      riskLevel: 'VERY_HIGH',
    },
  });

  console.log('✅ Demo equipment created');

  // ── Approval Matrix ──────────────────────────────────────────
  await Promise.all([
    prisma.approvalMatrix.upsert({
      where: { module_documentType_conditionType_approverRole_approverOrder: { module: 'PR', documentType: 'ASSET', conditionType: 'AMOUNT_RANGE', approverRole: 'HOD', approverOrder: 1 } },
      update: {},
      create: { module: 'PR', documentType: 'ASSET', conditionType: 'AMOUNT_RANGE', minAmount: 0, approverRole: 'HOD', approverOrder: 1 },
    }),
    prisma.approvalMatrix.upsert({
      where: { module_documentType_conditionType_approverRole_approverOrder: { module: 'PR', documentType: 'ASSET', conditionType: 'AMOUNT_RANGE', approverRole: 'FINANCE', approverOrder: 2 } },
      update: {},
      create: { module: 'PR', documentType: 'ASSET', conditionType: 'AMOUNT_RANGE', minAmount: 50000, approverRole: 'FINANCE', approverOrder: 2 },
    }),
    prisma.approvalMatrix.upsert({
      where: { module_documentType_conditionType_approverRole_approverOrder: { module: 'PR', documentType: 'ASSET', conditionType: 'AMOUNT_RANGE', approverRole: 'MANAGEMENT', approverOrder: 3 } },
      update: {},
      create: { module: 'PR', documentType: 'ASSET', conditionType: 'AMOUNT_RANGE', minAmount: 500000, approverRole: 'MANAGEMENT', approverOrder: 3 },
    }),
  ]);

  console.log('✅ Approval matrix configured');

  console.log(`
  ════════════════════════════════════════════
  ✅ Database seeded successfully!

  Demo Login Credentials:
  ┌──────────────────────────────────────────┐
  │ Admin:   admin@assetiq.com / Admin@123   │
  │ Biomed:  biomed@assetiq.com / Biomed@123 │
  └──────────────────────────────────────────┘
  ════════════════════════════════════════════
  `);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
