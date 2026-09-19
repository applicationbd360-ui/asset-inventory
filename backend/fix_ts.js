const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  for (const { regex, replace } of replacements) {
    content = content.replace(regex, replace);
  }
  fs.writeFileSync(fullPath, content);
}

// 1. asset.controller.ts
replaceInFile('src/modules/finance/asset.controller.ts', [
  { regex: /assetCode/g, replace: 'faNo' },
  { regex: /equipmentCode/g, replace: 'code' },
  { regex: /capitalizedDate/g, replace: 'capitalizationDate' },
  { regex: /\{ glCode: (.*?), debitAmount: (.*?), creditAmount: (.*?) \}/g, replace: '{ lineNo: 1, glCode: $1, debitAmount: $2, creditAmount: $3 }' },
]);

// 2. depreciation.controller.ts
replaceInFile('src/modules/finance/depreciation.controller.ts', [
  { regex: /\{ glCode: asset\.assetClass\.depreciationExpenseGlCode, debitAmount: sched\.deprnAmount, creditAmount: 0 \}/g, replace: '{ lineNo: 1, glCode: asset.assetClass.depreciationExpenseGlCode, debitAmount: sched.deprnAmount, creditAmount: 0 }' },
  { regex: /\{ glCode: asset\.assetClass\.accumDepreciationGlCode, debitAmount: 0, creditAmount: sched\.deprnAmount \}/g, replace: '{ lineNo: 2, glCode: asset.assetClass.accumDepreciationGlCode, debitAmount: 0, creditAmount: sched.deprnAmount }' }
]);

// 3. journal.controller.ts
replaceInFile('src/modules/finance/journal.controller.ts', [
  { regex: /journalDate/g, replace: 'postingDate' }
]);

// 4. inventory.controller.ts
replaceInFile('src/modules/inventory/inventory.controller.ts', [
  { regex: /prisma\.inventoryItem/g, replace: 'prisma.item' },
  { regex: /prisma\.stockLedger/g, replace: 'prisma.stockMovement' }
]);

// 5. equipment.controller.ts
replaceInFile('src/modules/maintenance/equipment.controller.ts', [
  { regex: /assetCode:/g, replace: 'faNo:' }
]);

// 6. workorder.controller.ts
replaceInFile('src/modules/maintenance/workorder.controller.ts', [
  { regex: /equipmentId: data\.equipmentId,/g, replace: 'equipmentId: Number(data.equipmentId),' }
]);

// 7. system.controller.ts
replaceInFile('src/modules/system/system.controller.ts', [
  { regex: /module: req\.user\?\.permissions/g, replace: 'module: Array.isArray(req.user?.permissions) ? req.user?.permissions[0] : req.user?.permissions' }
]);

console.log('Fixes applied.');
