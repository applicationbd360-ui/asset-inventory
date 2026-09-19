import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, FileText, ChevronRight, Filter } from 'lucide-react';
import { purchaseApi } from '../../api/purchase.api';
import './PRListPage.css';

const statusConfig: Record<string, string> = {
  DRAFT: 'badge-neutral',
  PENDING: 'badge-warning',
  APPROVED: 'badge-success',
  REJECTED: 'badge-danger',
};

const prStatusConfig: Record<string, string> = {
  OPEN: 'badge-primary',
  PARTIAL_PO: 'badge-warning',
  CONVERTED_TO_PO: 'badge-success',
  CLOSED: 'badge-neutral',
  CANCELLED: 'badge-danger',
};

export default function PRListPage() {
  const [search, setSearch] = useState('');

  const { data: prs, isLoading } = useQuery({
    queryKey: ['prs'],
    queryFn: purchaseApi.getPrs,
  });

  const filteredPrs = prs?.filter((pr: any) =>
    pr.prNo.toLowerCase().includes(search.toLowerCase()) ||
    pr.prType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pr-list-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Purchase Requisitions (PR)</h1>
          <p className="page-subtitle text-muted text-sm">Manage asset and spare part requisitions</p>
        </div>
        <div className="header-actions">
          <Link to="/purchase/pr/create" className="btn btn-primary">
            <Plus size={16} /> Create PR
          </Link>
        </div>
      </div>

      <div className="surface-card pr-list-container">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search PR No or Type..."
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="table-wrapper">
          {isLoading ? (
            <div className="p-8 text-center text-muted">Loading requisitions...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>PR No</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Department</th>
                  <th>Amount (Est.)</th>
                  <th>Approval</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredPrs?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-muted">No PRs found</td>
                  </tr>
                ) : (
                  filteredPrs?.map((pr: any) => (
                    <tr key={pr.id}>
                      <td>
                        <div className="flex align-center gap-2 font-semibold" style={{ color: 'var(--color-primary)' }}>
                          <FileText size={16} />
                          {pr.prNo}
                        </div>
                      </td>
                      <td className="text-sm">{new Date(pr.requestDate).toLocaleDateString()}</td>
                      <td>{pr.prType}</td>
                      <td>{pr.department?.name || 'N/A'}</td>
                      <td className="text-right">৳ {Number(pr.totalEstimated || 0).toLocaleString()}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
                          <span className={`badge ${
                            pr.approvalStatus === 'APPROVED' ? 'badge-success' :
                            pr.approvalStatus === 'REJECTED' ? 'badge-danger' :
                            pr.approvalStatus === 'PENDING' ? 'badge-warning' : 'badge-secondary'
                          }`}>
                            {pr.approvalStatus}
                          </span>
                          {pr.approvalStatus === 'PENDING' && pr.pendingWithRole && (
                            <span className="text-xs text-muted">
                              with: <strong>{pr.pendingWithRole.replace('_', ' ')}</strong>
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${prStatusConfig[pr.prStatus]}`}>
                          {pr.prStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="text-right">
                        <Link to={`/purchase/pr/${pr.id}`} className="btn-icon">
                          <ChevronRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
