const placeholder = (title: string) => () => (
  <div style={{ padding: 'var(--space-6)' }}>
    <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>{title}</h1>
    <p style={{ color: 'var(--text-muted)' }}>This module is under development — Phase 2+</p>
  </div>
);

export const EquipmentListPage    = placeholder('Equipment');
export const EquipmentDetailPage  = placeholder('Equipment Detail');
export const PRListPage           = placeholder('Purchase Requisitions');
export const PRCreatePage         = placeholder('Create PR');
export const POListPage           = placeholder('Purchase Orders');
export const GRNListPage          = placeholder('Goods Receipt');
export const WorkOrderListPage    = placeholder('Work Orders');
export const WorkOrderDetailPage  = placeholder('Work Order Detail');
export const InventoryPage        = placeholder('Inventory');
export const FixedAssetPage       = placeholder('Fixed Assets');
export const JournalPage          = placeholder('Journal Vouchers');
export const ReportsPage          = placeholder('Reports');
export const SettingsPage         = placeholder('Settings');
