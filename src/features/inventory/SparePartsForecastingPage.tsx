import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, Cpu } from 'lucide-react';
import { inventoryApi } from '../../api/inventory.api';
import './SparePartsForecastingPage.css';

export default function SparePartsForecastingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['spare-parts-forecast'],
    queryFn: inventoryApi.getForecastingData,
  });

  // Calculate insights
  const insights = useMemo(() => {
    if (!data || !data.table) return [];
    
    let maxShortage = { week: '', part: '', loc: '', diff: 0 };
    let maxDemand = { part: '', val: 0 };
    
    data.table.forEach((row: any) => {
      let totalDemand = 0;
      row.keyFigures.totalForecast.forEach((forecast: number, i: number) => {
        totalDemand += forecast;
        const supply = row.keyFigures.supply[i] + row.keyFigures.receipts[i];
        if (forecast > supply) {
          const diff = forecast - supply;
          if (diff > maxShortage.diff) {
            maxShortage = { week: data.weeks[i], part: row.partName, loc: row.locationId, diff };
          }
        }
      });
      if (totalDemand > maxDemand.val) {
        maxDemand = { part: row.partName, val: totalDemand };
      }
    });

    return [
      {
        type: 'warning',
        icon: AlertTriangle,
        title: 'Critical Shortage Predicted',
        desc: maxShortage.diff > 0 
          ? `Shortage of ${maxShortage.diff}x ${maxShortage.part} at ${maxShortage.loc} in ${maxShortage.week}`
          : 'No immediate shortages predicted.'
      },
      {
        type: 'info',
        icon: TrendingUp,
        title: 'Highest Demand Part',
        desc: `${maxDemand.part} has the highest projected usage across all sites.`
      }
    ];
  }, [data]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted animate-pulse">Running AI Forecast Engine...</div>;
  }

  return (
    <div className="forecast-container">
      <div className="page-header">
        <div>
          <h1 className="page-title flex align-center gap-2">
            <Cpu size={24} className="text-primary" />
            Smart MRO Forecasting
          </h1>
          <p className="page-subtitle text-muted text-sm">AI-driven predictive demand planning for spare parts</p>
        </div>
      </div>

      {/* Smart Insights Panel */}
      <div className="insights-panel">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <div key={idx} className="insight-card">
              <div className={`insight-icon ${insight.type}`}>
                <Icon size={24} />
              </div>
              <div className="insight-content">
                <h4>{insight.title}</h4>
                <p>{insight.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="surface-card p-6">
        <h3 className="font-semibold mb-4 text-lg">Total Part Usage Forecast (Corr. & Prev. Maint.)</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data?.chart}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
              <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="OPERATIONSITE1" name="Operation Site 1" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="OPERATIONSITE2" name="Operation Site 2" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
              <Bar dataKey="GLOBAL_DISTRIBUTION_CENTER" name="Global Distribution" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap Matrix */}
      <div className="surface-card p-6">
        <h3 className="font-semibold mb-4 text-lg">Time-Phased Planning Matrix</h3>
        <div className="heatmap-table-container">
          <table className="heatmap-table">
            <thead>
              <tr>
                <th className="col-pinned" style={{ width: '150px' }}>Location</th>
                <th className="col-pinned" style={{ left: '150px', width: '200px' }}>Part ID / Name</th>
                <th className="col-pinned" style={{ left: '350px', width: '200px' }}>Key Figures</th>
                {data?.weeks.map((week: string) => (
                  <th key={week}>{week}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.table.map((row: any, rIdx: number) => {
                const isEven = rIdx % 2 === 0;
                const rowBg = isEven ? 'rgba(255,255,255,0.01)' : 'transparent';
                
                return (
                  <React.Fragment key={`${row.locationId}-${row.partId}`}>
                    {/* Independent Demand */}
                    <tr style={{ background: rowBg }}>
                      <td className="col-pinned" rowSpan={5} style={{ background: 'var(--surface-1)' }}>
                        <span className="badge badge-neutral">{row.locationId}</span>
                      </td>
                      <td className="col-pinned" rowSpan={5} style={{ left: '150px', background: 'var(--surface-1)' }}>
                        <div className="font-semibold text-primary">{row.partId}</div>
                        <div className="text-xs text-muted">{row.partName}</div>
                      </td>
                      <td className="col-pinned metric-label" style={{ left: '350px', background: 'var(--surface-1)' }}>Independent Demand</td>
                      {row.keyFigures.independentDemand.map((val: number, i: number) => (
                        <td key={i} className="heatmap-cell safe">{val || ''}</td>
                      ))}
                    </tr>
                    {/* Dependent Demand */}
                    <tr style={{ background: rowBg }}>
                      <td className="col-pinned metric-label" style={{ left: '350px', background: 'var(--surface-1)' }}>Dependent Demand</td>
                      {row.keyFigures.dependentDemand.map((val: number, i: number) => (
                        <td key={i} className="heatmap-cell safe">{val || ''}</td>
                      ))}
                    </tr>
                    {/* Total Forecast */}
                    <tr style={{ background: rowBg }}>
                      <td className="col-pinned font-semibold" style={{ left: '350px', background: 'var(--surface-1)', color: 'var(--color-primary)' }}>Total Usage Forecast</td>
                      {row.keyFigures.totalForecast.map((val: number, i: number) => {
                        const supply = row.keyFigures.supply[i] + row.keyFigures.receipts[i];
                        let cellClass = 'safe';
                        if (val > supply) cellClass = 'danger'; // Shortage!
                        else if (val > 0 && val === supply) cellClass = 'warning'; // Barely enough
                        
                        return <td key={i} className={`heatmap-cell font-bold ${cellClass}`}>{val || ''}</td>;
                      })}
                    </tr>
                    {/* Receipts */}
                    <tr style={{ background: rowBg }}>
                      <td className="col-pinned metric-label" style={{ left: '350px', background: 'var(--surface-1)' }}>Receipts</td>
                      {row.keyFigures.receipts.map((val: number, i: number) => (
                        <td key={i} className="heatmap-cell text-emerald-400">{val || ''}</td>
                      ))}
                    </tr>
                    {/* Supply */}
                    <tr style={{ background: rowBg }}>
                      <td className="col-pinned metric-label" style={{ left: '350px', background: 'var(--surface-1)', borderBottom: '2px solid var(--border-subtle)' }}>Supply (Stock)</td>
                      {row.keyFigures.supply.map((val: number, i: number) => (
                        <td key={i} className="heatmap-cell text-emerald-500" style={{ borderBottom: '2px solid var(--border-subtle)' }}>{val || ''}</td>
                      ))}
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
