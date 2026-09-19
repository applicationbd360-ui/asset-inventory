import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line, ComposedChart
} from 'recharts';
import { Activity, Zap, ShieldAlert, TrendingUp, Loader2 } from 'lucide-react';
import { dashboardApi } from '../../api/dashboard.api';

const vendorPerformanceData = [
  { name: 'Siemens Health', quality: 95, speed: 90, cost: 85 },
  { name: 'GE Medical', quality: 88, speed: 75, cost: 92 },
  { name: 'Local Supplier A', quality: 70, speed: 85, cost: 95 },
  { name: 'Medtronic', quality: 98, speed: 95, cost: 80 },
];

const infectionRiskData = [
  { name: 'ICU', riskScore: 85, threshold: 75 },
  { name: 'OT-1', riskScore: 40, threshold: 75 },
  { name: 'General Ward', riskScore: 60, threshold: 75 },
  { name: 'Emergency', riskScore: 92, threshold: 75 },
];

const energyData = [
  { name: 'Week 1', electricity: 4000, hvac: 2400 },
  { name: 'Week 2', electricity: 3000, hvac: 1398 },
  { name: 'Week 3', electricity: 2000, hvac: 9800 },
  { name: 'Week 4', electricity: 2780, hvac: 3908 },
];

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: dashboardApi.getAnalytics
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-muted" size={32} />
      </div>
    );
  }

  const { downtimeData, workOrderTrend } = data;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Advanced Analytics & AI</h1>
          <p className="page-subtitle text-muted text-sm">Predictive insights, risk heatmaps, and performance</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Downtime Trend */}
        <div className="card">
          <div className="card-header flex align-center gap-2 mb-4">
            <Activity size={20} className="text-danger" />
            <h3 className="font-bold">Equipment Downtime Analytics</h3>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={downtimeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-muted)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-muted)'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                />
                <Legend />
                <Area type="monotone" dataKey="downtime" name="Actual Downtime" stroke="var(--color-danger)" fillOpacity={1} fill="url(#colorDowntime)" />
                <Area type="monotone" dataKey="target" name="Target Max" stroke="var(--color-success)" fillOpacity={1} fill="url(#colorTarget)" />
                <defs>
                  <linearGradient id="colorDowntime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-danger)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-danger)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Work Order Trend */}
        <div className="card">
          <div className="card-header flex align-center gap-2 mb-4">
            <TrendingUp size={20} className="text-primary" />
            <h3 className="font-bold">Work Order Trend</h3>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={workOrderTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--color-muted)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-muted)'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                />
                <Legend />
                <Area type="monotone" dataKey="workOrders" name="Total WOs" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="var(--color-success)" fillOpacity={1} fill="url(#colorCompleted)" />
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor AMC Performance */}
        <div className="card">
          <div className="card-header flex align-center gap-2 mb-4">
            <TrendingUp size={20} className="text-primary" />
            <h3 className="font-bold">Vendor / AMC Performance</h3>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quality" fill="#3b82f6" name="Quality Score" />
                <Bar dataKey="speed" fill="#10b981" name="Speed Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Infection Risk AI */}
        <div className="card">
          <div className="card-header flex align-center gap-2 mb-4">
            <ShieldAlert size={20} className="text-warning" />
            <h3 className="font-bold">Infection Outbreak Risk (AI)</h3>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={infectionRiskData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="riskScore" fill="#f59e0b" name="Risk Index" />
                <Line type="step" dataKey="threshold" stroke="#ef4444" name="Critical Threshold" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Energy Consumption */}
        <div className="card">
          <div className="card-header flex align-center gap-2 mb-4">
            <Zap size={20} className="text-success" />
            <h3 className="font-bold">Energy & Utility Consumption</h3>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="electricity" stackId="1" stroke="#3b82f6" fill="#93c5fd" name="Electricity (kWh)" />
                <Area type="monotone" dataKey="hvac" stackId="1" stroke="#10b981" fill="#6ee7b7" name="HVAC" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
