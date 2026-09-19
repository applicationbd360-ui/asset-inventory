import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Calendar, Plus, Filter, Clock } from 'lucide-react';
import { maintenanceApi } from '../../api/maintenance.api';
import { Link } from 'react-router-dom';

const freqConfig: Record<string, string> = {
  CALENDAR_DAYS: 'Days',
  CALENDAR_MONTHS: 'Months',
  OPERATING_HOURS: 'Hours',
};

export default function PmPlanListPage() {
  const [search, setSearch] = useState('');

  const { data: plans, isLoading } = useQuery({
    queryKey: ['pm-plans'],
    queryFn: maintenanceApi.getPmPlans,
  });

  const filteredPlans = plans?.filter((plan: any) =>
    plan.planName.toLowerCase().includes(search.toLowerCase()) ||
    plan.equipment?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Maintenance Planning</h1>
          <p className="page-subtitle text-muted text-sm">Manage Preventive Maintenance (PM) schedules</p>
        </div>
        <div className="header-actions">
          <Link to="/maintenance/pm-plans/create" className="btn btn-primary">
            <Plus size={16} /> Create PM Plan
          </Link>
        </div>
      </div>

      <div className="surface-card pr-list-container">
        <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search plan name or equipment..."
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
            <div className="p-8 text-center text-muted">Loading PM Plans...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Equipment</th>
                  <th>Frequency</th>
                  <th>Responsible Team</th>
                  <th>Status</th>
                  <th>Next Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-muted">No PM Plans found</td>
                  </tr>
                ) : (
                  filteredPlans?.map((plan: any) => (
                    <tr key={plan.id}>
                      <td>
                        <div className="flex align-center gap-2 font-semibold" style={{ color: 'var(--color-primary)' }}>
                          <Calendar size={16} />
                          {plan.planName}
                        </div>
                      </td>
                      <td className="font-semibold">{plan.equipment?.name || 'N/A'}</td>
                      <td>
                        Every {plan.frequencyValue} {freqConfig[plan.frequencyType] || plan.frequencyType}
                      </td>
                      <td>{plan.responsibleTeam || 'General'}</td>
                      <td>
                        <span className={`badge ${plan.isActive ? 'badge-success' : 'badge-neutral'}`}>
                          {plan.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td>
                        {plan.nextDueDate ? (
                          <div className="flex align-center gap-1">
                            <Clock size={14} className="text-muted" />
                            {new Date(plan.nextDueDate).toLocaleDateString()}
                          </div>
                        ) : 'Not Scheduled'}
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
