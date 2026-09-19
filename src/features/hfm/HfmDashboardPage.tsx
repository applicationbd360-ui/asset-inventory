import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Droplets, Trash2, ShieldCheck, Plus, Loader2 } from 'lucide-react';
import { hfmApi } from '../../api/hfm.api';

export default function HfmDashboardPage() {
  const [activeTab, setActiveTab] = useState('UTILITIES');

  const { data: utilities, isLoading: isLoadingU } = useQuery({
    queryKey: ['hfm-utilities'],
    queryFn: hfmApi.getUtilityMeters,
    enabled: activeTab === 'UTILITIES'
  });

  const { data: wasteLogs, isLoading: isLoadingW } = useQuery({
    queryKey: ['hfm-waste'],
    queryFn: hfmApi.getWasteLogs,
    enabled: activeTab === 'WASTE'
  });

  const { data: audits, isLoading: isLoadingA } = useQuery({
    queryKey: ['hfm-audits'],
    queryFn: hfmApi.getAudits,
    enabled: activeTab === 'COMPLIANCE'
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Facility Management (HFM)</h1>
          <p className="page-subtitle text-muted text-sm">Monitor hospital utilities, waste, housekeeping, and compliance</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-subtle pb-2">
        <button 
          className={`btn ${activeTab === 'UTILITIES' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('UTILITIES')}
        >
          <Droplets size={16} /> Utility Monitoring
        </button>
        <button 
          className={`btn ${activeTab === 'WASTE' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('WASTE')}
        >
          <Trash2 size={16} /> Bio-Waste Management
        </button>
        <button 
          className={`btn ${activeTab === 'HOUSEKEEPING' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('HOUSEKEEPING')}
        >
          <Activity size={16} /> Housekeeping
        </button>
        <button 
          className={`btn ${activeTab === 'COMPLIANCE' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('COMPLIANCE')}
        >
          <ShieldCheck size={16} /> NABH Compliance
        </button>
      </div>

      <div className="surface-card">
        {/* UTILITIES */}
        {activeTab === 'UTILITIES' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Utility Meters</h3>
              <button className="btn btn-primary btn-sm"><Plus size={14} /> Log Reading</button>
            </div>
            {isLoadingU ? <Loader2 className="animate-spin text-primary" /> : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Meter No</th>
                    <th>Utility Type</th>
                    <th>Location</th>
                    <th>UOM</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {utilities?.map((u: any, i: number) => (
                    <tr key={i}>
                      <td className="font-mono text-sm">{u.meterNo}</td>
                      <td><span className="badge badge-primary">{u.utilityType}</span></td>
                      <td>{u.location?.name || 'N/A'}</td>
                      <td>{u.unitOfMeasure}</td>
                      <td><span className={u.isActive ? 'text-success' : 'text-muted'}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    </tr>
                  ))}
                  {(!utilities || utilities.length === 0) && (
                    <tr><td colSpan={5} className="text-center text-muted">No utility meters found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* WASTE */}
        {activeTab === 'WASTE' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Biomedical Waste Logs</h3>
              <button className="btn btn-primary btn-sm"><Plus size={14} /> Log Waste</button>
            </div>
            {isLoadingW ? <Loader2 className="animate-spin text-primary" /> : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Weight (KG)</th>
                    <th>Dispatch ID</th>
                  </tr>
                </thead>
                <tbody>
                  {wasteLogs?.map((w: any, i: number) => (
                    <tr key={i}>
                      <td className="text-sm text-muted">{new Date(w.loggedAt).toLocaleString()}</td>
                      <td><span className="badge badge-neutral">{w.category?.name}</span></td>
                      <td>{w.location?.name || 'N/A'}</td>
                      <td className="font-semibold text-danger">{w.weightKg} kg</td>
                      <td>{w.dispatchId || 'Pending'}</td>
                    </tr>
                  ))}
                  {(!wasteLogs || wasteLogs.length === 0) && (
                    <tr><td colSpan={5} className="text-center text-muted">No waste logs found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* HOUSEKEEPING */}
        {activeTab === 'HOUSEKEEPING' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Housekeeping Schedules</h3>
              <button className="btn btn-primary btn-sm"><Plus size={14} /> Create Schedule</button>
            </div>
            <div className="p-8 text-center text-muted border border-dashed border-subtle rounded-md">
              <Activity size={32} className="mx-auto mb-2 opacity-50" />
              <p>Housekeeping module is active. Create schedules to track cleaning logs.</p>
            </div>
          </div>
        )}

        {/* COMPLIANCE */}
        {activeTab === 'COMPLIANCE' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Compliance Audits</h3>
              <button className="btn btn-primary btn-sm"><Plus size={14} /> Schedule Audit</button>
            </div>
            {isLoadingA ? <Loader2 className="animate-spin text-primary" /> : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Audit Type</th>
                    <th>Auditor</th>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {audits?.map((a: any, i: number) => (
                    <tr key={i}>
                      <td><span className="badge badge-primary">{a.auditType}</span></td>
                      <td>{a.auditorName}</td>
                      <td>{new Date(a.auditDate).toLocaleDateString()}</td>
                      <td className="font-semibold">{a.score || 'N/A'}</td>
                      <td><span className="badge badge-neutral">{a.status}</span></td>
                    </tr>
                  ))}
                  {(!audits || audits.length === 0) && (
                    <tr><td colSpan={5} className="text-center text-muted">No compliance audits found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
