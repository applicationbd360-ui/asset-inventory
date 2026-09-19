import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, Package, ChevronRight, Filter } from 'lucide-react';
import { purchaseApi } from '../../api/purchase.api';

export default function GRNListPage() {
  const [search, setSearch] = useState('');

  const { data: grns, isLoading } = useQuery({
    queryKey: ['grns'],
    queryFn: purchaseApi.getGrns,
  });

  const filteredGrns = grns?.filter((grn: any) =>
    grn.grnNo.toLowerCase().includes(search.toLowerCase()) ||
    grn.po?.poNo?.toLowerCase().includes(search.toLowerCase()) ||
    grn.vendor?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Goods Receipt Notes (GRN)</h1>
          <p className="page-subtitle text-muted text-sm">Receive and inspect items from vendors</p>
        </div>
        <div className="header-actions">
          <Link to="/purchase/grn/create" className="btn btn-primary">
            <Plus size={16} /> Receive Goods
          </Link>
        </div>
      </div>

      <div className="surface-card pr-list-container">
        <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search GRN, PO No or Vendor..."
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
            <div className="p-8 text-center text-muted">Loading receipts...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>GRN No</th>
                  <th>Date</th>
                  <th>PO No</th>
                  <th>Vendor</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredGrns?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-muted">No GRNs found</td>
                  </tr>
                ) : (
                  filteredGrns?.map((grn: any) => (
                    <tr key={grn.id}>
                      <td>
                        <div className="flex align-center gap-2 font-semibold" style={{ color: 'var(--color-primary)' }}>
                          <Package size={16} />
                          {grn.grnNo}
                        </div>
                      </td>
                      <td className="text-sm">{new Date(grn.receivedDate).toLocaleDateString()}</td>
                      <td>{grn.po?.poNo || 'N/A'}</td>
                      <td>{grn.vendor?.name || 'N/A'}</td>
                      <td>{grn.grnType}</td>
                      <td>
                        <span className="badge badge-success">
                          RECEIVED
                        </span>
                      </td>
                      <td className="text-right">
                        <Link to={`/purchase/grn/${grn.id}`} className="btn-icon">
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
