import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, ShoppingCart, ChevronRight, Filter } from 'lucide-react';
import { purchaseApi } from '../../api/purchase.api';

const statusConfig: Record<string, string> = {
  DRAFT: 'badge-neutral',
  PENDING: 'badge-warning',
  APPROVED: 'badge-success',
  REJECTED: 'badge-danger',
};

const poStatusConfig: Record<string, string> = {
  OPEN: 'badge-primary',
  PARTIAL_GRN: 'badge-warning',
  FULFILLED: 'badge-success',
  CLOSED: 'badge-neutral',
  CANCELLED: 'badge-danger',
};

export default function POListPage() {
  const [search, setSearch] = useState('');

  const { data: pos, isLoading } = useQuery({
    queryKey: ['pos'],
    queryFn: purchaseApi.getPos,
  });

  const filteredPos = pos?.filter((po: any) =>
    po.poNo.toLowerCase().includes(search.toLowerCase()) ||
    po.poType.toLowerCase().includes(search.toLowerCase()) ||
    po.vendor?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Purchase Orders (PO)</h1>
          <p className="page-subtitle text-muted text-sm">Manage vendor orders and fulfillments</p>
        </div>
        <div className="header-actions">
          <Link to="/purchase/po/create" className="btn btn-primary">
            <Plus size={16} /> Create PO
          </Link>
        </div>
      </div>

      <div className="surface-card pr-list-container">
        <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search PO No, Vendor or Type..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', marginLeft: 'var(--space-2)' }}
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
            <div className="p-8 text-center text-muted">Loading orders...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>PO No</th>
                  <th>Date</th>
                  <th>Vendor</th>
                  <th>Type</th>
                  <th>Total Amount</th>
                  <th>Approval</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredPos?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-muted">No POs found</td>
                  </tr>
                ) : (
                  filteredPos?.map((po: any) => (
                    <tr key={po.id}>
                      <td>
                        <div className="flex align-center gap-2 font-semibold" style={{ color: 'var(--color-primary)' }}>
                          <ShoppingCart size={16} />
                          {po.poNo}
                        </div>
                      </td>
                      <td className="text-sm">{new Date(po.poDate).toLocaleDateString()}</td>
                      <td>{po.vendor?.name || 'N/A'}</td>
                      <td>{po.poType}</td>
                      <td className="font-semibold">৳ {Number(po.totalAmount).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${statusConfig[po.approvalStatus]}`}>
                          {po.approvalStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${poStatusConfig[po.poStatus]}`}>
                          {po.poStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="text-right">
                        <Link to={`/purchase/po/${po.id}`} className="btn-icon">
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
