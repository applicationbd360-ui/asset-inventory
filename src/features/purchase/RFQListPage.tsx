import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText } from 'lucide-react';
import { purchaseApi } from '../../api/purchase.api';

export default function RFQListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [prId, setPrId] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Dragging state for modal
  const modalRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent native browser drag
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = pos.current.x;
    const startPosY = pos.current.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!modalRef.current) return;
      pos.current.x = startPosX + (moveEvent.clientX - startX);
      pos.current.y = startPosY + (moveEvent.clientY - startY);
      modalRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const { data: rfqs, isLoading } = useQuery({
    queryKey: ['rfqs'],
    queryFn: purchaseApi.getRfqs,
  });

  const createMutation = useMutation({
    mutationFn: purchaseApi.createRfq,
    onSuccess: (newRfq) => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      setShowCreateModal(false);
      navigate(`/purchase/rfqs/${newRfq.id}`);
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ prId: Number(prId), dueDate });
  };

  return (
    <div className="rfq-page animate-fade-in">
      <div className="page-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Request for Quotations (RFQ)</h1>
          <p className="page-subtitle text-muted text-sm">Manage vendor quotations and evaluate technical/commercial bids</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} /> New RFQ
        </button>
      </div>

      <div className="surface-card" style={{ padding: 'var(--space-6)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>RFQ No</th>
              <th>Ref PR</th>
              <th>Department</th>
              <th>Due Date</th>
              <th>Quotations</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={7}>Loading...</td></tr> : rfqs?.map((rfq: any) => (
              <tr key={rfq.id}>
                <td className="font-medium text-primary">{rfq.rfqNo}</td>
                <td>{rfq.pr?.prNo}</td>
                <td>{rfq.pr?.department?.name}</td>
                <td>{new Date(rfq.dueDate).toLocaleDateString()}</td>
                <td>{rfq._count?.quotations || 0} Received</td>
                <td>
                  <span className={`badge ${
                    rfq.status === 'CLOSED' ? 'badge-success' : 
                    rfq.status === 'EVALUATING' ? 'badge-warning' : 'badge-primary'
                  }`}>
                    {rfq.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/purchase/rfqs/${rfq.id}`)}>
                    <FileText size={14} /> Evaluate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div 
            ref={modalRef}
            className="modal-content surface-card shadow-lg" 
            style={{ 
              padding: '0', 
              width: '450px', 
              borderRadius: '12px',
              position: 'relative',
              transform: `translate(${pos.current.x}px, ${pos.current.y}px)`,
              background: 'var(--surface)',
              overflow: 'hidden'
            }}
          >
            {/* Draggable Header */}
            <div 
              onMouseDown={onMouseDown} 
              style={{ 
                cursor: 'grab', 
                padding: '1.5rem', 
                borderBottom: '1px solid var(--border-subtle)', 
                userSelect: 'none',
                background: 'var(--surface-sunken)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h3 className="font-semibold text-lg" style={{ margin: 0, pointerEvents: 'none' }}>Create New RFQ</h3>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleCreate} style={{ padding: '1.5rem' }}>
              <div className="form-group mb-4" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label font-medium text-slate-700" style={{ display: 'block', marginBottom: '0.5rem' }}>Approved PR ID (Reference)</label>
                <input type="number" required className="input w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" style={{ width: '100%' }} value={prId} onChange={e => setPrId(e.target.value)} placeholder="e.g. 1004" />
              </div>
              <div className="form-group mb-4" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label font-medium text-slate-700" style={{ display: 'block', marginBottom: '0.5rem' }}>Submission Due Date</label>
                <input type="date" required className="input w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" style={{ width: '100%' }} value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button type="button" className="btn btn-secondary px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-slate-700" onClick={() => {
                  setShowCreateModal(false);
                  pos.current = { x: 0, y: 0 }; // Reset position on close
                }}>Cancel</button>
                <button type="submit" className="btn btn-primary px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Generating...' : 'Generate RFQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
