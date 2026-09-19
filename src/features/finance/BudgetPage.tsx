import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DollarSign, Plus, TrendingUp, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { budgetApi, type Budget } from '../../api/budget.api';

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ label, value, color, icon: Icon }: {
  label: string; value: string; color: string; icon: React.ElementType;
}) {
  return (
    <div className="surface-card" style={{ padding: '20px 24px', borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p className="text-muted text-sm">{label}</p>
          <p className="text-lg font-semibold" style={{ color, marginTop: 4 }}>{value}</p>
        </div>
        <Icon size={28} style={{ color, opacity: 0.6 }} />
      </div>
    </div>
  );
}

// ── Utilization Bar ───────────────────────────────────────────
function UtilizationBar({ utilized, committed, budgeted }: {
  utilized: number; committed: number; budgeted: number;
}) {
  const pctUsed = budgeted > 0 ? Math.min((utilized / budgeted) * 100, 100) : 0;
  const pctCommitted = budgeted > 0 ? Math.min((committed / budgeted) * 100, 100 - pctUsed) : 0;
  const isOverBudget = (utilized + committed) > budgeted;

  return (
    <div style={{ width: '100%', minWidth: 120 }}>
      <div style={{
        height: 8, borderRadius: 4, background: 'var(--surface-secondary)',
        overflow: 'hidden', display: 'flex',
      }}>
        <div style={{
          width: `${pctUsed}%`, background: isOverBudget ? 'var(--danger)' : 'var(--primary)',
          transition: 'width 0.3s ease',
        }} />
        <div style={{
          width: `${pctCommitted}%`, background: 'var(--warning)', opacity: 0.7,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <p className="text-xs text-muted" style={{ marginTop: 4 }}>
        {(pctUsed + pctCommitted).toFixed(1)}% utilized / committed
        {isOverBudget && <span style={{ color: 'var(--danger)', marginLeft: 8 }}>⚠ Over budget!</span>}
      </p>
    </div>
  );
}

// ── Allocate Modal ────────────────────────────────────────────
function AllocateModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    fiscalYear: currentYear,
    budgetType: 'CAPEX',
    costCenterId: '',
    budgetedAmount: '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: budgetApi.allocateBudget,
    onSuccess: () => { onSuccess(); onClose(); },
    onError: (e: any) => setError(e?.response?.data?.error?.message || 'Failed to allocate budget'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.costCenterId || !form.budgetedAmount) {
      setError('All fields are required');
      return;
    }
    mutation.mutate({
      fiscalYear: form.fiscalYear,
      budgetType: form.budgetType,
      costCenterId: parseInt(form.costCenterId),
      budgetedAmount: parseFloat(form.budgetedAmount),
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="surface-card animate-fade-in" style={{ width: 480, padding: 32, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold" style={{ marginBottom: 24 }}>
          <DollarSign size={20} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} />
          Allocate Budget
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Fiscal Year</label>
              <select className="form-input" value={form.fiscalYear}
                onChange={e => setForm(f => ({ ...f, fiscalYear: parseInt(e.target.value) }))}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Budget Type</label>
              <select className="form-input" value={form.budgetType}
                onChange={e => setForm(f => ({ ...f, budgetType: e.target.value }))}>
                <option value="CAPEX">CAPEX (Capital Expenditure)</option>
                <option value="OPEX">OPEX (Operating Expenditure)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Cost Center ID</label>
            <input type="number" className="form-input" placeholder="e.g. 1"
              value={form.costCenterId}
              onChange={e => setForm(f => ({ ...f, costCenterId: e.target.value }))} />
            <p className="text-xs text-muted" style={{ marginTop: 4 }}>Enter the Cost Center ID from settings</p>
          </div>

          <div>
            <label className="form-label">Budget Amount (BDT)</label>
            <input type="number" step="0.01" className="form-input" placeholder="e.g. 500000.00"
              value={form.budgetedAmount}
              onChange={e => setForm(f => ({ ...f, budgetedAmount: e.target.value }))} />
          </div>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Allocate Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function BudgetPage() {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: budgets, isLoading } = useQuery({
    queryKey: ['budgets', selectedYear],
    queryFn: () => budgetApi.getBudgets(selectedYear),
  });

  const totalBudgeted  = budgets?.reduce((s, b) => s + Number(b.budgetedAmount), 0) ?? 0;
  const totalUtilized  = budgets?.reduce((s, b) => s + Number(b.utilizedAmount), 0) ?? 0;
  const totalCommitted = budgets?.reduce((s, b) => s + Number(b.committedAmount), 0) ?? 0;
  const totalAvailable = budgets?.reduce((s, b) => s + Number(b.availableAmount), 0) ?? 0;

  const fmt = (n: number) => 'BDT ' + n.toLocaleString('en-BD', { minimumFractionDigits: 2 });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Budget Management</h1>
          <p className="page-subtitle text-muted text-sm">CAPEX & OPEX budget allocation and utilization tracking</p>
        </div>
        <div className="header-actions">
          <select className="form-input" style={{ width: 120 }}
            value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))}>
            {YEARS.map(y => <option key={y} value={y}>FY {y}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Allocate Budget
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Total Budgeted"  value={fmt(totalBudgeted)}  color="var(--primary)" icon={DollarSign} />
        <StatCard label="Utilized"        value={fmt(totalUtilized)}  color="var(--warning)" icon={TrendingUp} />
        <StatCard label="Committed"       value={fmt(totalCommitted)} color="var(--info)"    icon={AlertTriangle} />
        <StatCard label="Available"       value={fmt(totalAvailable)} color="var(--success)" icon={CheckCircle} />
      </div>

      {/* Budget Table */}
      <div className="surface-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 className="text-lg font-semibold">FY {selectedYear} Budget Allocations</h3>
          {budgets && <div className="badge badge-neutral">{budgets.length} allocations</div>}
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading budgets...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Cost Center</th>
                <th>Type</th>
                <th>Budgeted (BDT)</th>
                <th>Utilized</th>
                <th>Committed</th>
                <th>Available</th>
                <th>Utilization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {budgets?.map((b: Budget) => {
                const available  = Number(b.availableAmount);
                const budgeted   = Number(b.budgetedAmount);
                const utilized   = Number(b.utilizedAmount);
                const committed  = Number(b.committedAmount);
                const overBudget = available < 0;
                return (
                  <tr key={b.id}>
                    <td>
                      <div className="font-semibold">{b.costCenter?.name || `CC-${b.costCenterId}`}</div>
                      <div className="text-xs text-muted">{b.costCenter?.code}</div>
                    </td>
                    <td>
                      <span className={`badge ${b.budgetType === 'CAPEX' ? 'badge-primary' : 'badge-neutral'}`}>
                        {b.budgetType}
                      </span>
                    </td>
                    <td className="text-right font-semibold">{budgeted.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                    <td className="text-right" style={{ color: 'var(--warning)' }}>{utilized.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                    <td className="text-right" style={{ color: 'var(--info)' }}>{committed.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                    <td className="text-right font-semibold" style={{ color: overBudget ? 'var(--danger)' : 'var(--success)' }}>
                      {available.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ minWidth: 160 }}>
                      <UtilizationBar utilized={utilized} committed={committed} budgeted={budgeted} />
                    </td>
                    <td>
                      {overBudget
                        ? <span className="badge badge-danger">Over Budget</span>
                        : available / budgeted < 0.1
                        ? <span className="badge badge-warning">Near Limit</span>
                        : <span className="badge badge-success">Healthy</span>
                      }
                    </td>
                  </tr>
                );
              })}
              {(!budgets || budgets.length === 0) && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    <DollarSign size={40} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                    No budgets allocated for FY {selectedYear}
                  </td>
                </tr>
              )}
            </tbody>
            {budgets && budgets.length > 0 && (
              <tfoot>
                <tr style={{ fontWeight: 700, background: 'var(--surface-secondary)' }}>
                  <td colSpan={2} className="text-right">Totals:</td>
                  <td className="text-right">{totalBudgeted.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                  <td className="text-right" style={{ color: 'var(--warning)' }}>{totalUtilized.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                  <td className="text-right" style={{ color: 'var(--info)' }}>{totalCommitted.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                  <td className="text-right" style={{ color: 'var(--success)' }}>{totalAvailable.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>

      {showModal && (
        <AllocateModal
          onClose={() => setShowModal(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['budgets'] })}
        />
      )}
    </div>
  );
}
