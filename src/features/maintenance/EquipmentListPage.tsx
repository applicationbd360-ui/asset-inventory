import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Activity, Filter } from 'lucide-react';
import { maintenanceApi } from '../../api/maintenance.api';

export default function EquipmentListPage() {
  const [search, setSearch] = useState('');

  const { data: equipments, isLoading } = useQuery({
    queryKey: ['equipments'],
    queryFn: maintenanceApi.getEquipments,
  });

  const filteredEquipments = equipments?.filter((eq: any) =>
    eq.code.toLowerCase().includes(search.toLowerCase()) ||
    eq.name.toLowerCase().includes(search.toLowerCase()) ||
    eq.fixedAsset?.faNo?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Equipment Master</h1>
          <p className="page-subtitle text-muted text-sm">Manage operational equipment, functional locations, and maintenance profiles</p>
        </div>
      </div>

      <div className="surface-card pr-list-container">
        <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search Equipment Code, Name or FA No..."
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
            <div className="p-8 text-center text-muted">Loading equipment...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Equipment Code</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Fixed Asset No</th>
                  <th>Location (Floc)</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipments?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-muted">No equipment found</td>
                  </tr>
                ) : (
                  filteredEquipments?.map((eq: any) => (
                    <tr 
                      key={eq.id} 
                      onClick={() => window.location.href = `/maintenance/equipment/${eq.id}`}
                      style={{ cursor: 'pointer' }}
                      className="hover:bg-surface-2"
                    >
                      <td>
                        <div className="flex align-center gap-2 font-semibold" style={{ color: 'var(--color-primary)' }}>
                          <Activity size={16} />
                          {eq.code}
                        </div>
                      </td>
                      <td>{eq.name}</td>
                      <td>{eq.category?.name || 'N/A'}</td>
                      <td>{eq.fixedAsset?.faNo || 'N/A'}</td>
                      <td>{eq.floc?.name || 'Pending Assignment'}</td>
                      <td>
                        <span className={`badge ${
                          eq.status === 'ACTIVE' ? 'badge-success' : 
                          eq.status === 'BREAKDOWN' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {eq.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <Link to={`/maintenance/equipment/${eq.id}`} className="btn-icon">
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
