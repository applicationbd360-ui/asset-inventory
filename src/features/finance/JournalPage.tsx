import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, BookOpen, Plus, Filter, ChevronRight, X } from 'lucide-react';
import { financeApi } from '../../api/finance.api';
import { Link } from 'react-router-dom';

export default function JournalPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ description: '', amount: '' });
  const queryClient = useQueryClient();

  const { data: journals, isLoading } = useQuery({
    queryKey: ['journals'],
    queryFn: financeApi.getJournals,
  });

  const createJournalMutation = useMutation({
    mutationFn: financeApi.createJournal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      setIsModalOpen(false);
      setNewEntry({ description: '', amount: '' });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createJournalMutation.mutate({
      description: newEntry.description,
      amount: Number(newEntry.amount),
    });
  };

  const filteredJournals = journals?.filter((j: any) =>
    j.journalNo.toLowerCase().includes(search.toLowerCase()) ||
    j.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Journal Entries (JV)</h1>
          <p className="page-subtitle text-muted text-sm">View GL postings from automated modules and manual entries</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> New Entry
          </button>
        </div>
      </div>

      <div className="surface-card pr-list-container">
        <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search JV No or Description..."
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
            <div className="p-8 text-center text-muted">Loading journals...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Journal No</th>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredJournals?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-muted">No journal entries found</td>
                  </tr>
                ) : (
                  filteredJournals?.map((j: any) => (
                    <tr key={j.id}>
                      <td>
                        <div className="flex align-center gap-2 font-semibold" style={{ color: 'var(--color-primary)' }}>
                          <BookOpen size={16} />
                          {j.journalNo}
                        </div>
                      </td>
                      <td className="text-sm">{new Date(j.journalDate).toLocaleDateString()}</td>
                      <td>
                        <span className="badge badge-neutral text-xs">{j.sourceModule}</span>
                      </td>
                      <td className="text-sm">{j.transactionType.replace('_', ' ')}</td>
                      <td className="text-sm text-muted">{j.description}</td>
                      <td className="font-semibold text-right">৳ {Number(j.totalAmount).toLocaleString()}</td>
                      <td>
                        <span className="badge badge-success">
                          {j.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <Link to={`/finance/journals/${j.id}`} className="btn-icon">
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Create Journal Entry (JV)</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. Monthly Accrual"
                    value={newEntry.description}
                    onChange={e => setNewEntry({ ...newEntry, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Total Amount (৳)</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    min="1"
                    placeholder="0.00"
                    value={newEntry.amount}
                    onChange={e => setNewEntry({ ...newEntry, amount: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={createJournalMutation.isPending}>
                  {createJournalMutation.isPending ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
