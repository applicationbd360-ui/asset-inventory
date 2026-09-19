import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, FileText, Loader2, Printer, FileSpreadsheet, BookOpen } from 'lucide-react';
import { reportApi } from '../../api/report.api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../utils/exportUtils';

type ReportType = 'ASSET_DEPRECIATION' | 'WORK_ORDER_COST' | 'INVENTORY_VALUATION';

// ── Column definitions for PDF export ────────────────────────
const reportPdfCols: Record<ReportType, { header: string; dataKey: string }[]> = {
  ASSET_DEPRECIATION: [
    { header: 'Asset No',         dataKey: 'assetNo' },
    { header: 'Name',             dataKey: 'name' },
    { header: 'Category',         dataKey: 'category' },
    { header: 'Cost Center',      dataKey: 'costCenter' },
    { header: 'Acquisition (BDT)',dataKey: 'acquisitionValue' },
    { header: 'Accum. Deprn',     dataKey: 'accumulatedDeprn' },
    { header: 'Book Value',       dataKey: 'bookValue' },
    { header: 'Status',           dataKey: 'status' },
  ],
  WORK_ORDER_COST: [
    { header: 'WO No',        dataKey: 'woNo' },
    { header: 'Equipment',    dataKey: 'equipment' },
    { header: 'Type',         dataKey: 'type' },
    { header: 'Labor (BDT)',  dataKey: 'laborCost' },
    { header: 'Material',     dataKey: 'materialCost' },
    { header: 'Service',      dataKey: 'serviceCost' },
    { header: 'Total',        dataKey: 'totalCost' },
    { header: 'Completed',    dataKey: 'completedDate' },
  ],
  INVENTORY_VALUATION: [
    { header: 'Item Code',   dataKey: 'itemCode' },
    { header: 'Item Name',   dataKey: 'itemName' },
    { header: 'Category',    dataKey: 'category' },
    { header: 'Location',    dataKey: 'location' },
    { header: 'Qty On Hand', dataKey: 'qtyOnHand' },
    { header: 'Unit Cost',   dataKey: 'unitCost' },
    { header: 'Total Value', dataKey: 'totalValue' },
  ],
};

const reportTitles: Record<ReportType, string> = {
  ASSET_DEPRECIATION: 'Asset Depreciation Report',
  WORK_ORDER_COST:    'Work Order Cost Report',
  INVENTORY_VALUATION:'Inventory Valuation Report',
};

const reportFilenames: Record<ReportType, string> = {
  ASSET_DEPRECIATION: 'asset_depreciation_report',
  WORK_ORDER_COST:    'work_order_cost_report',
  INVENTORY_VALUATION:'inventory_valuation_report',
};

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>('ASSET_DEPRECIATION');

  const { data: assetData, isLoading: isLoadingAssets } = useQuery({
    queryKey: ['report-asset-depreciation'],
    queryFn: reportApi.getAssetDepreciationReport,
    enabled: activeReport === 'ASSET_DEPRECIATION'
  });

  const { data: woData, isLoading: isLoadingWOs } = useQuery({
    queryKey: ['report-wo-cost'],
    queryFn: reportApi.getWorkOrderCostReport,
    enabled: activeReport === 'WORK_ORDER_COST'
  });

  const { data: invData, isLoading: isLoadingInv } = useQuery({
    queryKey: ['report-inv-valuation'],
    queryFn: reportApi.getInventoryValuationReport,
    enabled: activeReport === 'INVENTORY_VALUATION'
  });

  const getCurrentData = (): any[] => {
    if (activeReport === 'ASSET_DEPRECIATION') return assetData || [];
    if (activeReport === 'WORK_ORDER_COST')    return woData    || [];
    if (activeReport === 'INVENTORY_VALUATION') return invData  || [];
    return [];
  };

  const handleExportCSV = () => {
    const data = getCurrentData();
    if (!data.length) return;
    exportToCSV(data, reportFilenames[activeReport]);
  };

  const handleExportExcel = () => {
    const data = getCurrentData();
    if (!data.length) return;
    exportToExcel(data, reportFilenames[activeReport], reportTitles[activeReport]);
  };

  const handleExportPDF = () => {
    const data = getCurrentData();
    if (!data.length) return;
    exportToPDF(
      reportPdfCols[activeReport],
      data,
      reportTitles[activeReport],
      reportFilenames[activeReport]
    );
  };

  const handlePrint = () => window.print();

  const isLoading = isLoadingAssets || isLoadingWOs || isLoadingInv;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header print-hide">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle text-muted text-sm">Generate and export system reports</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={handleExportCSV} disabled={!getCurrentData().length}>
            <Download size={16} /> CSV
          </button>
          <button className="btn btn-ghost" onClick={handleExportExcel} disabled={!getCurrentData().length} style={{ color: 'var(--success)' }}>
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button className="btn btn-secondary" onClick={handleExportPDF} disabled={!getCurrentData().length}>
            <BookOpen size={16} /> PDF
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex gap-4 print-hide" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {(['ASSET_DEPRECIATION', 'WORK_ORDER_COST', 'INVENTORY_VALUATION'] as ReportType[]).map(type => (
          <button
            key={type}
            className={`btn ${activeReport === type ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveReport(type)}
            style={{ borderRadius: '6px 6px 0 0', borderBottom: activeReport === type ? 'none' : undefined }}
          >
            <FileText size={16} /> {reportTitles[type]}
          </button>
        ))}
      </div>

      <div className="surface-card">
        {/* Print Header */}
        <div className="print-only mb-4 hidden">
          <h2>AssetIQ Enterprise — {reportTitles[activeReport]}</h2>
          <p>Generated: {new Date().toLocaleString()}</p>
          <hr />
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <>
            {/* ── Asset Depreciation ── */}
            {activeReport === 'ASSET_DEPRECIATION' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 className="text-lg font-semibold">Asset Depreciation Report</h3>
                  {assetData && (
                    <div className="badge badge-neutral">{assetData.length} assets</div>
                  )}
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Asset No</th><th>Name</th><th>Category</th><th>Cost Center</th>
                      <th>Acquisition (BDT)</th><th>Accum. Deprn</th><th>Book Value</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetData?.map((a: any, i: number) => (
                      <tr key={i}>
                        <td className="font-mono text-sm">{a.assetNo}</td>
                        <td className="font-semibold">{a.name}</td>
                        <td>{a.category}</td>
                        <td>{a.costCenter}</td>
                        <td className="text-right">{a.acquisitionValue.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td className="text-right" style={{ color: 'var(--warning)' }}>{a.accumulatedDeprn.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td className="text-right font-semibold" style={{ color: 'var(--primary)' }}>{a.bookValue.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td><span className="badge badge-neutral">{a.status}</span></td>
                      </tr>
                    ))}
                    {(!assetData || assetData.length === 0) && (
                      <tr><td colSpan={8} className="text-center text-muted">No data found</td></tr>
                    )}
                  </tbody>
                  {assetData && assetData.length > 0 && (
                    <tfoot>
                      <tr style={{ fontWeight: 700, background: 'var(--surface-secondary)' }}>
                        <td colSpan={4} className="text-right">Totals:</td>
                        <td className="text-right">{assetData.reduce((s: number, a: any) => s + a.acquisitionValue, 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td className="text-right">{assetData.reduce((s: number, a: any) => s + a.accumulatedDeprn, 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td className="text-right" style={{ color: 'var(--primary)' }}>{assetData.reduce((s: number, a: any) => s + a.bookValue, 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}

            {/* ── Work Order Cost ── */}
            {activeReport === 'WORK_ORDER_COST' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 className="text-lg font-semibold">Work Order Cost Report</h3>
                  {woData && <div className="badge badge-neutral">{woData.length} work orders</div>}
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>WO No</th><th>Equipment</th><th>Type</th>
                      <th>Labor (BDT)</th><th>Material</th><th>Service</th><th>Total</th><th>Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {woData?.map((wo: any, i: number) => (
                      <tr key={i}>
                        <td className="font-mono text-sm">{wo.woNo}</td>
                        <td>{wo.equipment}</td>
                        <td><span className="badge badge-neutral">{wo.type}</span></td>
                        <td className="text-right">{wo.laborCost.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td className="text-right">{wo.materialCost.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td className="text-right">{wo.serviceCost.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td className="text-right font-semibold" style={{ color: 'var(--primary)' }}>{wo.totalCost.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td>{wo.completedDate ? new Date(wo.completedDate).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))}
                    {(!woData || woData.length === 0) && (
                      <tr><td colSpan={8} className="text-center text-muted">No completed work orders found</td></tr>
                    )}
                  </tbody>
                  {woData && woData.length > 0 && (
                    <tfoot>
                      <tr style={{ fontWeight: 700, background: 'var(--surface-secondary)' }}>
                        <td colSpan={3} className="text-right">Totals:</td>
                        <td className="text-right">{woData.reduce((s: number, w: any) => s + w.laborCost, 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td className="text-right">{woData.reduce((s: number, w: any) => s + w.materialCost, 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td className="text-right">{woData.reduce((s: number, w: any) => s + w.serviceCost, 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td className="text-right" style={{ color: 'var(--primary)' }}>{woData.reduce((s: number, w: any) => s + w.totalCost, 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}

            {/* ── Inventory Valuation ── */}
            {activeReport === 'INVENTORY_VALUATION' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 className="text-lg font-semibold">Inventory Valuation Report</h3>
                  {invData && <div className="badge badge-neutral">{invData.length} items</div>}
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Item Code</th><th>Item Name</th><th>Category</th>
                      <th>Location</th><th>Qty On Hand</th><th>Unit Cost (BDT)</th><th>Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invData?.map((inv: any, i: number) => (
                      <tr key={i}>
                        <td className="font-mono text-sm">{inv.itemCode}</td>
                        <td className="font-semibold">{inv.itemName}</td>
                        <td>{inv.category}</td>
                        <td>{inv.location}</td>
                        <td className="text-right">{inv.qtyOnHand}</td>
                        <td className="text-right">{inv.unitCost.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                        <td className="text-right font-semibold" style={{ color: 'var(--primary)' }}>{inv.totalValue.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                    {(!invData || invData.length === 0) && (
                      <tr><td colSpan={7} className="text-center text-muted">No inventory data found</td></tr>
                    )}
                  </tbody>
                  {invData && invData.length > 0 && (
                    <tfoot>
                      <tr style={{ fontWeight: 700, background: 'var(--surface-secondary)' }}>
                        <td colSpan={6} className="text-right">Total Inventory Value:</td>
                        <td className="text-right" style={{ color: 'var(--primary)' }}>
                          {invData.reduce((s: number, inv: any) => s + inv.totalValue, 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @media print {
          .print-hide { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; color: black; }
          .surface-card { border: none; box-shadow: none; background: white; padding: 0; }
          .data-table th, .data-table td { border-color: #ddd; color: black; }
        }
        tfoot td { padding: 10px 12px; }
        .text-right { text-align: right; }
      `}</style>
    </div>
  );
}
