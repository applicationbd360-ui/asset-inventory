import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend 
} from 'recharts';
import { Activity, AlertCircle, CalendarClock, DollarSign, LayoutDashboard, Loader2 } from 'lucide-react';
import { analyticsApi } from '../../api/analytics.api';

// Custom colors for charts
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function AnalyticsDashboard() {
  const { data: costsData, isLoading: isLoadingCosts } = useQuery({
    queryKey: ['analytics-costs-by-work-center'],
    queryFn: analyticsApi.getCostsByWorkCenter
  });

  const { data: damagesData, isLoading: isLoadingDamages } = useQuery({
    queryKey: ['analytics-damages-by-cause'],
    queryFn: analyticsApi.getDamagesByCause
  });

  const { data: planningData, isLoading: isLoadingPlanning } = useQuery({
    queryKey: ['analytics-orders-for-planning'],
    queryFn: analyticsApi.getOrdersForPlanning
  });

  const isLoading = isLoadingCosts || isLoadingDamages || isLoadingPlanning;

  // Formatting currency for tooltips
  const formatCurrency = (value: number) => `৳ ${value.toLocaleString()}`;

  // Priority mapping for badges
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'badge-danger';
      case 'HIGH': return 'badge-warning';
      case 'MEDIUM': return 'badge-primary';
      default: return 'badge-neutral';
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '4rem' }}>
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Activity size={24} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} />
            Insights & Analytics
          </h1>
          <p className="page-subtitle text-muted text-sm">Advanced EAM visualizations for data-driven decisions</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-6)' }}>
        
        {/* Chart 1: Maintenance Costs by Work Center */}
        <div className="surface-card" style={{ gridColumn: '1 / -1' }}>
          <div className="chart-header">
            <h3 className="chart-title">
              <DollarSign size={16} /> Maintenance Costs by Work Center
            </h3>
          </div>
          <div style={{ height: 350, marginTop: 16 }}>
            {costsData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costsData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis 
                    dataKey="workCenter" 
                    tick={{ fontSize: 12, fill: 'var(--text-muted)' }} 
                    axisLine={false} 
                    tickLine={false} 
                    angle={-45} 
                    textAnchor="end"
                  />
                  <YAxis 
                    tickFormatter={(val) => `৳${val/1000}k`} 
                    tick={{ fontSize: 12, fill: 'var(--text-muted)' }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Total Cost']}
                    cursor={{ fill: 'var(--surface-secondary)' }}
                    contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                  />
                  <Bar dataKey="cost" name="Maintenance Cost" radius={[4, 4, 0, 0]}>
                    {costsData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No cost data available for work centers.
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Damages by Cause Code */}
        <div className="surface-card">
          <div className="chart-header">
            <h3 className="chart-title">
              <AlertCircle size={16} /> Damages by Cause Code
            </h3>
          </div>
          <div style={{ height: 300, marginTop: 16 }}>
            {damagesData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={damagesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="causeCode"
                  >
                    {damagesData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value, 'Occurrences']}
                    contentStyle={{ borderRadius: 8, border: '1px solid var(--border)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                <LayoutDashboard size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
                <p>No damage cause data found.</p>
                <p className="text-xs mt-1">Hint: Add cause codes to work orders.</p>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Orders for Planning */}
        <div className="surface-card">
          <div className="chart-header">
            <h3 className="chart-title">
              <CalendarClock size={16} /> Orders for Planning
            </h3>
            <span className="badge badge-neutral">Not Released</span>
          </div>
          
          {/* Priority Summary */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16, marginBottom: 16 }}>
            {planningData?.summary?.map((s: any) => (
              <div key={s.priority} style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{s.count}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 4 }}>{s.priority}</div>
              </div>
            ))}
            {(!planningData?.summary || planningData.summary.length === 0) && (
              <div className="text-muted text-sm w-full text-center py-4">No pending orders.</div>
            )}
          </div>

          {/* List of orders */}
          <div style={{ overflowY: 'auto', maxHeight: 220 }}>
            <table className="data-table" style={{ fontSize: '13px' }}>
              <thead>
                <tr>
                  <th>Order No</th>
                  <th>Equipment</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {planningData?.list?.map((wo: any) => (
                  <tr key={wo.id}>
                    <td className="font-mono text-primary font-semibold">{wo.id}</td>
                    <td>{wo.equipment}</td>
                    <td>
                      <span className={`badge ${getPriorityBadge(wo.priority)}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                        {wo.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
