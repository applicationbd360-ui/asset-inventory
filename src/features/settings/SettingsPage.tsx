import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Settings, Bell, User, History, Loader2 } from 'lucide-react';
import { systemApi } from '../../api/system.api';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('AUDIT_LOG');

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: systemApi.getAuditLogs,
    enabled: activeTab === 'AUDIT_LOG'
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle text-muted text-sm">Manage application preferences and security</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          className={`btn ${activeTab === 'GENERAL' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('GENERAL')}
        >
          <Settings size={16} /> General
        </button>
        <button 
          className={`btn ${activeTab === 'AUDIT_LOG' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('AUDIT_LOG')}
        >
          <History size={16} /> Audit Logs
        </button>
        <button 
          className={`btn ${activeTab === 'NOTIFICATIONS' ? 'btn-ghost' : 'btn-ghost'}`}
          disabled
        >
          <Bell size={16} /> Notifications
        </button>
      </div>

      <div className="surface-card">
        {activeTab === 'GENERAL' && (
          <div>
            <h3 className="mb-4 text-lg font-semibold">General Settings</h3>
            <p className="text-muted">Configuration options will appear here.</p>
          </div>
        )}

        {activeTab === 'AUDIT_LOG' && (
          <div>
            <h3 className="mb-4 text-lg font-semibold">System Audit Logs</h3>
            <p className="text-muted text-sm mb-4">View recent system activities, modifications, and access logs.</p>
            
            {isLoading ? <Loader2 className="animate-spin text-primary" /> : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Module / Table</th>
                    <th>Action</th>
                    <th>Record ID</th>
                    <th>User ID</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs?.map((log: any, i: number) => (
                    <tr key={i}>
                      <td className="text-sm text-muted">{new Date(log.changedAt).toLocaleString()}</td>
                      <td><span className="badge badge-neutral">{log.tableName}</span></td>
                      <td>
                        <span className={`badge ${
                          log.action === 'CREATE' ? 'badge-success' : 
                          log.action === 'DELETE' ? 'badge-danger' : 'badge-primary'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="font-mono text-sm">{log.recordId}</td>
                      <td>{log.changedBy || 'System'}</td>
                    </tr>
                  ))}
                  {(!auditLogs || auditLogs.length === 0) && (
                    <tr><td colSpan={5} className="text-center text-muted py-8">No audit logs found</td></tr>
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
