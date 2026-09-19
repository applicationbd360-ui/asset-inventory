import { useQuery } from '@tanstack/react-query';
import { 
  BarChart3, Cpu, Wrench, AlertTriangle, CheckCircle2, Clock, 
  TrendingUp, Activity, Loader2, ShoppingCart, FileText, Settings, 
  Package, LayoutDashboard, DollarSign, Shield
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboard.api';
import './DashboardPage.css';

const areaData = [
  { month: 'Jan', workOrders: 12, completed: 10 },
  { month: 'Feb', workOrders: 18, completed: 15 },
  { month: 'Mar', workOrders: 14, completed: 13 },
  { month: 'Apr', workOrders: 22, completed: 18 },
  { month: 'May', workOrders: 16, completed: 14 },
  { month: 'Jun', workOrders: 28, completed: 24 },
  { month: 'Jul', workOrders: 20, completed: 19 },
];

const statusConfig: Record<string, { label: string; badge: string }> = {
  CREATED:     { label: 'Created',     badge: 'badge-neutral' },
  IN_PROGRESS: { label: 'In Progress', badge: 'badge-primary' },
  COMPLETED:   { label: 'Completed',   badge: 'badge-success' },
  OVERDUE:     { label: 'Overdue',     badge: 'badge-danger' },
};

const priorityConfig: Record<string, string> = {
  CRITICAL: 'badge-danger',
  HIGH:     'badge-warning',
  MEDIUM:   'badge-primary',
  LOW:      'badge-neutral',
};

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardApi.getSummary
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-danger p-8">
        <AlertTriangle size={48} />
        <h2 className="text-xl font-bold">Failed to load dashboard</h2>
        <p>{String(error)}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-muted" size={32} />
      </div>
    );
  }

  const { kpis: summaryKpis, assetStatusData, recentWorkOrders } = data;

  // Fiori-style Launchpad Tiles configuration
  const launchpadTiles = [
    {
      title: 'Maintenance Execution',
      subtitle: 'Manage Work Orders',
      icon: Wrench,
      path: '/work-orders',
      bgColor: '#3b82f6', // blue-500
      badge: summaryKpis.openWOs > 0 ? summaryKpis.openWOs : null
    },
    {
      title: 'Maintenance Planning',
      subtitle: 'Preventive Schedules',
      icon: Clock,
      path: '/maintenance/pm-plans',
      bgColor: '#0ea5e9', // sky-500
      badge: null
    },
    {
      title: 'Analytics & Insights',
      subtitle: 'EAM Dashboard',
      icon: Activity,
      path: '/analytics',
      bgColor: '#8b5cf6', // violet-500
      badge: null
    },
    {
      title: 'Inventory Management',
      subtitle: 'Stock & Spares',
      icon: Package,
      path: '/inventory',
      bgColor: '#10b981', // emerald-500
      badge: null
    },
    {
      title: 'Purchasing (PR/PO)',
      subtitle: 'Procurement',
      icon: ShoppingCart,
      path: '/purchase/pr',
      bgColor: '#f59e0b', // amber-500
      badge: summaryKpis.pendingPrs > 0 ? summaryKpis.pendingPrs : null
    },
    {
      title: 'Equipment Master',
      subtitle: 'Asset Registry',
      icon: Cpu,
      path: '/maintenance/equipment',
      bgColor: '#64748b', // slate-500
      badge: summaryKpis.criticalEq > 0 ? summaryKpis.criticalEq : null
    },
    {
      title: 'Finance & Budget',
      subtitle: 'Cost Centers',
      icon: DollarSign,
      path: '/finance/budget',
      bgColor: '#14b8a6', // teal-500
      badge: null
    },
    {
      title: 'Administration',
      subtitle: 'Users & Roles',
      icon: Shield,
      path: '/settings/users',
      bgColor: '#6366f1', // indigo-500
      badge: null
    }
  ];

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header mb-2">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <LayoutDashboard size={24} className="text-primary" />
            Home
          </h1>
          <p className="page-subtitle text-muted text-sm">AssetIQ Enterprise Workspace</p>
        </div>
      </div>

      {/* ── Apps Section (Launchpad Tiles) ── */}
      <div>
        <h2 className="text-sm font-semibold text-muted mb-4 uppercase tracking-wider">Apps</h2>
        <div className="launchpad-grid">
          {launchpadTiles.map((tile) => (
            <Link 
              key={tile.title} 
              to={tile.path} 
              className="launchpad-tile"
              style={{ '--tile-bg': tile.bgColor } as React.CSSProperties}
            >
              <div className="tile-icon">
                <tile.icon size={20} color="white" />
              </div>
              
              {tile.badge && (
                <div className="tile-badge">{tile.badge}</div>
              )}

              <div className="tile-content">
                <div className="tile-title">{tile.title}</div>
                <div className="tile-subtitle">{tile.subtitle}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Insights Section ── */}
      <div>
        <h2 className="text-sm font-semibold text-muted mb-4 uppercase tracking-wider flex items-center gap-2">
          Insights <span className="badge badge-neutral" style={{ fontSize: 10 }}>2</span>
        </h2>
        
        <div className="dashboard-charts">
          {/* Work Order Trend */}
          <div className="chart-card surface-card" style={{ flex: 2 }}>
            <div className="chart-header">
              <h3 className="chart-title">Work Order Trend</h3>
              <span className="badge badge-primary">Last 7 months</span>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }}
                    itemStyle={{ fontSize: '13px' }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-primary)' }}
                  />
                  <Area type="monotone" dataKey="workOrders" name="Created" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorWo)" strokeWidth={2} />
                  <Area type="monotone" dataKey="completed" name="Completed" stroke="var(--color-success)" fillOpacity={1} fill="url(#colorComp)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Asset Status Overview */}
          <div className="chart-card surface-card" style={{ flex: 1 }}>
            <div className="chart-header">
              <h3 className="chart-title">Asset Status</h3>
            </div>
            <div style={{ height: 220, display: 'flex' }}>
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={assetStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {assetStatusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }}
                    itemStyle={{ fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="asset-status-legend" style={{ width: '40%', justifyContent: 'center' }}>
                {assetStatusData.map((entry: any) => (
                  <div key={entry.name} className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: entry.color }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{entry.name}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{entry.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
