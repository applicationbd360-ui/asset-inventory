import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Filter, ChevronLeft, ChevronRight, Clock, User, Database } from 'lucide-react';
import api from '../../api/client';

interface AuditLog {
  id: number;
  tableName: string;
  entityType: string | null;
  recordId: number;
  action: string;
  changedBy: number | null;
  userName: string | null;
  changedAt: string;
  module: string | null;
  ipAddress: string | null;
  newValues: any;
}

interface AuditResponse {
  data: AuditLog[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

const fetchAuditLogs = async (params: Record<string, string>): Promise<AuditResponse> => {
  const res = await api.get('/system/audit-logs', { params });
  return res.data;
};

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'var(--success)',
  UPDATE: 'var(--warning)',
  DELETE: 'var(--danger)',
  STATUS_CHANGE: 'var(--info)',
};

const MODULE_COLORS: Record<string, string> = {
  MAINTENANCE: '#8b5cf6',
  PURCHASE:    '#3b82f6',
  FINANCE:     '#10b981',
  INVENTORY:   '#f59e0b',
  HFM:         '#06b6d4',
  SYSTEM:      '#6b7280',
  AUTH:        '#ec4899',
};

export default function AuditLogPage() {
  const [filters, setFilters] = useState({ module: '', action: '', startDate: '', endDate: '' });
  const [page, setPage] = useState(1);

  const queryParams: Record<string, string> = { page: String(page), limit: '20' };
  if (filters.module)    queryParams.module    = filters.module;
  if (filters.action)    queryParams.action    = filters.action;
  if (filters.startDate) queryParams.startDate = filters.startDate;
  if (filters.endDate)   queryParams.endDate   = filters.endDate;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['audit-logs', queryParams],
    queryFn: () => fetchAuditLogs(queryParams),
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(f => ({ ...f, [key]: value }));
    setPage(1);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Shield size={22} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} />
            Audit Trail
          </h1>
          <p className="page-subtitle text-muted text-sm">Complete history of all system actions and changes</p>
        </div>
        {data && (
          <div className="badge badge-neutral" style={{ fontSize: 14, padding: '6px 14px' }}>
            {data.pagination.total.toLocaleString()} total records
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="surface-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
          <div>
            <label className="form-label">Module</label>
            <select className="form-input" style={{ width: 160 }}
              value={filters.module} onChange={e => handleFilterChange('module', e.target.value)}>
              <option value="">All Modules</option>
              {['MAINTENANCE', 'PURCHASE', 'FINANCE', 'INVENTORY', 'HFM', 'AUTH', 'SYSTEM'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Action</label>
            <select className="form-input" style={{ width: 140 }}
              value={filters.action} onChange={e => handleFilterChange('action', e.target.value)}>
              <option value="">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="STATUS_CHANGE">STATUS CHANGE</option>
            </select>
          </div>
          <div>
            <label className="form-label">From Date</label>
            <input type="date" className="form-input"
              value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)} />
          </div>
          <div>
            <label className="form-label">To Date</label>
            <input type="date" className="form-input"
              value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)} />
          </div>
          {(filters.module || filters.action || filters.startDate || filters.endDate) && (
            <button className="btn btn-ghost" onClick={() => {
              setFilters({ module: '', action: '', startDate: '', endDate: '' });
              setPage(1);
            }}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="surface-card">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            Loading audit logs...
          </div>
        ) : isError ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--danger)' }}>
            ⚠️ Failed to load audit logs. Admin access required.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th><Clock size={14} style={{ display: 'inline', marginRight: 4 }} />Timestamp</th>
                <th><User size={14} style={{ display: 'inline', marginRight: 4 }} />User</th>
                <th>Action</th>
                <th>Module</th>
                <th><Database size={14} style={{ display: 'inline', marginRight: 4 }} />Entity</th>
                <th>Record ID</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map(log => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: 13 }}>
                    <div>{new Date(log.changedAt).toLocaleDateString()}</div>
                    <div className="text-xs text-muted">{new Date(log.changedAt).toLocaleTimeString()}</div>
                  </td>
                  <td>
                    <div className="text-sm font-semibold">{log.userName || '—'}</div>
                    {log.changedBy && <div className="text-xs text-muted">ID: {log.changedBy}</div>}
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '2px 10px', borderRadius: 999,
                      background: `${ACTION_COLORS[log.action] || '#6b7280'}22`,
                      color: ACTION_COLORS[log.action] || '#6b7280',
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex', padding: '2px 10px', borderRadius: 999,
                      background: `${MODULE_COLORS[log.module || ''] || '#6b7280'}22`,
                      color: MODULE_COLORS[log.module || ''] || '#6b7280',
                      fontSize: 12, fontWeight: 600,
                    }}>
                      {log.module || '—'}
                    </span>
                  </td>
                  <td>
                    <div className="font-semibold text-sm">{log.entityType || log.tableName}</div>
                  </td>
                  <td>
                    <span className="font-mono text-sm">#{log.recordId}</span>
                  </td>
                  <td className="text-muted text-xs">{log.ipAddress || '—'}</td>
                </tr>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    <Shield size={40} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                    No audit logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {data && data.pagination.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <p className="text-muted text-sm">
              Showing {((page - 1) * 20) + 1}–{Math.min(page * 20, data.pagination.total)} of {data.pagination.total}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" disabled={page === 1}
                onClick={() => setPage(p => p - 1)}>
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                Page {page} of {data.pagination.pages}
              </span>
              <button className="btn btn-ghost" disabled={page === data.pagination.pages}
                onClick={() => setPage(p => p + 1)}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
