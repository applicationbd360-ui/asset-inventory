import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingDown, DollarSign } from 'lucide-react';
import { financeApi } from '../../api/finance.api';
import './MroFinancialPlanningPage.css';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function MroFinancialPlanningPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['mro-financial-forecast'],
    queryFn: financeApi.getMroForecast,
  });

  // Calculate insights
  const insights = useMemo(() => {
    if (!data || !data.table) return [];
    
    let maxCostMonth = { month: '', loc: '', cost: 0 };
    let totalProjected = 0;
    
    data.table.forEach((row: any) => {
      row.keyFigures.totalCost.forEach((cost: number, i: number) => {
        totalProjected += cost;
        if (cost > maxCostMonth.cost) {
          maxCostMonth = { month: data.months[i], loc: row.locationId, cost };
        }
      });
    });

    return [
      {
        type: 'danger',
        icon: AlertCircle,
        title: 'Highest Budget Warning',
        desc: `Projected spike to ${formatCurrency(maxCostMonth.cost)} at ${maxCostMonth.loc} in ${maxCostMonth.month}`
      },
      {
        type: 'safe',
        icon: TrendingDown,
        title: 'Total Projected 12-Month MRO Cost',
        desc: `${formatCurrency(totalProjected)} estimated across all facilities.`
      }
    ];
  }, [data]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted animate-pulse">Calculating Financial Projections...</div>;
  }

  return (
    <div className="mro-finance-container">
      <div className="page-header">
        <div>
          <h1 className="page-title flex align-center gap-2">
            <DollarSign size={24} className="text-primary" />
            MRO Financial Planning
          </h1>
          <p className="page-subtitle text-muted text-sm">Budget forecasting for Preventive & Corrective Maintenance</p>
        </div>
      </div>

      {/* Smart Insights Panel */}
      <div className="budget-alert-panel">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <div key={idx} className="budget-alert-card">
              <div className={`budget-alert-icon ${insight.type}`}>
                <Icon size={24} />
              </div>
              <div className="budget-alert-content">
                <h4>{insight.title}</h4>
                <p>{insight.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="surface-card p-6">
        <h3 className="font-semibold mb-4 text-lg">Total Projected Costs | Trend Analysis</h3>
        <div className="finance-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data?.chart}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorOp1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOp2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGlobal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
              <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Area type="monotone" dataKey="OPERATIONSITE1" name="Operation Site 1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOp1)" />
              <Area type="monotone" dataKey="OPERATIONSITE2" name="Operation Site 2" stroke="#f59e0b" fillOpacity={1} fill="url(#colorOp2)" />
              <Area type="monotone" dataKey="GLOBAL_DISTRIBUTION_CENTER" name="Global Distribution" stroke="#10b981" fillOpacity={1} fill="url(#colorGlobal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Matrix */}
      <div className="surface-card p-6">
        <h3 className="font-semibold mb-4 text-lg">Total Projected Costs | Monthly Breakdown</h3>
        <div className="finance-table-container">
          <table className="finance-table">
            <thead>
              <tr>
                <th className="col-pinned" style={{ width: '180px' }}>Location ID</th>
                <th className="col-pinned" style={{ left: '180px', width: '300px' }}>Key Figures</th>
                {data?.months.map((month: string) => (
                  <th key={month}>{month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.table.map((row: any, rIdx: number) => {
                const isEven = rIdx % 2 === 0;
                const rowBg = isEven ? 'rgba(255,255,255,0.01)' : 'transparent';
                
                return (
                  <React.Fragment key={`${row.locationId}`}>
                    {/* Corrective Maint */}
                    <tr style={{ background: rowBg }}>
                      <td className="col-pinned" rowSpan={4} style={{ background: 'var(--surface-1)' }}>
                        <span className="badge badge-neutral">{row.locationId}</span>
                      </td>
                      <td className="col-pinned metric-label-finance" style={{ left: '180px', background: 'var(--surface-1)' }}>Total Cost Forecast (Corr. Maint.)</td>
                      {row.keyFigures.correctiveMaint.map((val: number, i: number) => (
                        <td key={i} className="finance-cell">{formatCurrency(val)}</td>
                      ))}
                    </tr>
                    {/* Preventive Maint */}
                    <tr style={{ background: rowBg }}>
                      <td className="col-pinned metric-label-finance" style={{ left: '180px', background: 'var(--surface-1)' }}>Total Cost Forecast (Prev. Maint.)</td>
                      {row.keyFigures.preventiveMaint.map((val: number, i: number) => (
                        <td key={i} className="finance-cell">{formatCurrency(val)}</td>
                      ))}
                    </tr>
                    {/* Unforeseen */}
                    <tr style={{ background: rowBg }}>
                      <td className="col-pinned metric-label-finance" style={{ left: '180px', background: 'var(--surface-1)' }}>Total Cost (Unforeseen Overwritten)</td>
                      {row.keyFigures.unforeseenOverwritten.map((val: number, i: number) => (
                        <td key={i} className="finance-cell text-muted">{val > 0 ? formatCurrency(val) : '-'}</td>
                      ))}
                    </tr>
                    {/* Total */}
                    <tr style={{ background: rowBg }}>
                      <td className="col-pinned font-semibold" style={{ left: '180px', background: 'var(--surface-1)', color: 'var(--color-primary)', borderBottom: '2px solid var(--border-subtle)' }}>Total Cost Forecast (Corr. & Prev. & Unforeseen)</td>
                      {row.keyFigures.totalCost.map((val: number, i: number) => {
                        let cellClass = 'highlight';
                        if (val > 250000) cellClass = 'danger'; // High budget warning
                        
                        return <td key={i} className={`finance-cell ${cellClass}`} style={{ borderBottom: '2px solid var(--border-subtle)' }}>{formatCurrency(val)}</td>;
                      })}
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
