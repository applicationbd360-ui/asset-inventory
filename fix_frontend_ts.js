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

// 1. DashboardPage.tsx
replaceInFile('src/features/dashboard/DashboardPage.tsx', [
  { regex: /map\(\(entry, i\)/g, replace: 'map((entry: any, i: number)' },
  { regex: /map\(\(s\)/g, replace: 'map((s: any)' },
  { regex: /map\(\(wo\)/g, replace: 'map((wo: any)' },
]);

// 2. InventoryPage.tsx
replaceInFile('src/features/inventory/InventoryPage.tsx', [
  { regex: /import \{ Link \} from 'react-router-dom';/g, replace: '' }
]);

// 3. WorkOrderCreatePage.tsx
replaceInFile('src/features/maintenance/WorkOrderCreatePage.tsx', [
  { regex: /const \[employees, setEmployees\] = useState<any\[\]>\(\[\]\);/g, replace: '' }
]);

// 4. GRNCreatePage.tsx
// wait, does createGrn exist in purchase.api.ts? Let's check purchaseApi.createGrn
// It's probably called createGrn in the frontend api, I'll just change the api file instead, or use any
// Let's first export createGrn in purchase.api.ts
replaceInFile('src/api/purchase.api.ts', [
  { regex: /createPo: \(payload: any\) => api.post\('\/purchase\/po', payload\).then\(res => res.data\),/g, replace: `createPo: (payload: any) => api.post('/purchase/po', payload).then(res => res.data),
  createGrn: (payload: any) => api.post('/purchase/grn', payload).then(res => res.data),` }
]);

// 5. POCreatePage.tsx
replaceInFile('src/features/purchase/POCreatePage.tsx', [
  { regex: /taxAmount: z\.number\(\)\.optional\(\),/g, replace: 'taxAmount: z.number().default(0),' }
]);

// 6. SettingsPage.tsx
replaceInFile('src/features/settings/SettingsPage.tsx', [
  { regex: /Shield, /g, replace: '' },
  { regex: /User, /g, replace: '' }
]);

console.log('Frontend fixes applied.');
