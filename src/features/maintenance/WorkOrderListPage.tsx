import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Wrench, Plus, Filter, ChevronRight, Sparkles } from 'lucide-react';
import { maintenanceApi } from '../../api/maintenance.api';
import { Link } from 'react-router-dom';
import AIOrderRecommendationModal from './AIOrderRecommendationModal';

const statusConfig: Record<string, string> = {
  OPEN: 'badge-primary',
  IN_PROGRESS: 'badge-warning',
  COMPLETED: 'badge-success',
  CLOSED: 'badge-neutral',
};

const priorityConfig: Record<string, string> = {
  LOW: 'badge-neutral',
  MEDIUM: 'badge-primary',
  HIGH: 'badge-warning',
  CRITICAL: 'badge-danger',
};

export default function WorkOrderListPage() {
  const [search, setSearch] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);

  const { data: wos, isLoading } = useQuery({
    queryKey: ['workorders'],
    queryFn: maintenanceApi.getWorkOrders,
  });

  const filteredWos = wos?.filter((wo: any) =>
    wo.woNo.toLowerCase().includes(search.toLowerCase()) ||
    wo.title.toLowerCase().includes(search.toLowerCase()) ||
    wo.equipment?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Work Orders</h1>
          <p className="page-subtitle text-muted text-sm">Manage maintenance tasks and breakdowns</p>
        </div>
        <div className="header-actions flex items-center gap-3">
          <button 
            className="btn btn-secondary flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
            onClick={() => setShowAIModal(true)}
          >
            <Sparkles size={16} /> Assign Order (AI)
          </button>
          <Link to="/work-orders/create" className="btn btn-primary">
            <Plus size={16} /> Create Work Order
          </Link>
        </div>
      </div>

      <AIOrderRecommendationModal 
        isOpen={showAIModal} 
        onClose={() => setShowAIModal(false)} 
      />

      <div className="surface-card pr-list-container">
        <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search WO No, Title or Equipment..."
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
            <div className="p-8 text-center text-muted">Loading work orders...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>WO No</th>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Equipment</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredWos?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-muted">No work orders found</td>
                  </tr>
                ) : (
                  filteredWos?.map((wo: any) => (
                    <tr key={wo.id}>
                      <td>
                        <div className="flex align-center gap-2 font-semibold" style={{ color: 'var(--color-primary)' }}>
                          <Wrench size={16} />
                          {wo.woNo}
                        </div>
                      </td>
                      <td className="text-sm">{new Date(wo.createdAt).toLocaleDateString()}</td>
                      <td className="font-semibold">{wo.title}</td>
                      <td>{wo.equipment?.name || 'General / N/A'}</td>
                      <td>{wo.woType}</td>
                      <td>
                        <span className={`badge ${priorityConfig[wo.priority]}`}>
                          {wo.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${statusConfig[wo.status]}`}>
                          {wo.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="text-right">
                        <Link to={`/work-orders/${wo.id}`} className="btn-icon">
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
