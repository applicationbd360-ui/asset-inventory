import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { purchaseApi } from '../../api/purchase.api';

export default function GRNDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);

  // Inspection form state
  const [acceptedQty, setAcceptedQty] = useState('');
  const [rejectedQty, setRejectedQty] = useState('');
  const [inspectionStatus, setInspectionStatus] = useState('PASSED');
  const [warrantyStartDate, setWarrantyStartDate] = useState('');

  const { data: grn, isLoading } = useQuery({
    queryKey: ['grn', id],
    queryFn: () => purchaseApi.getGrnById(Number(id)),
    enabled: !!id,
  });

  const inspectMutation = useMutation({
    mutationFn: (data: any) => purchaseApi.inspectGrnLine(data.lineId, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['grn', id] });
      setSelectedLineId(null);
      alert(res.message);
    }
  });

  const handleInspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLineId) return;
    inspectMutation.mutate({
      lineId: selectedLineId,
      acceptedQty: Number(acceptedQty),
      rejectedQty: Number(rejectedQty),
      inspectionStatus,
      warrantyStartDate: warrantyStartDate || undefined
    });
  };

  const openInspection = (line: any) => {
    setSelectedLineId(line.id);
    setAcceptedQty(line.receivedQty.toString());
    setRejectedQty('0');
    setInspectionStatus('PASSED');
    setWarrantyStartDate('');
  };

  if (isLoading) return <div>Loading...</div>;
  if (!grn) return <div>GRN Not Found</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
        <button className="btn-icon" onClick={() => navigate('/purchase/grn')}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title">{grn.grnNo}</h1>
          <p className="page-subtitle text-muted text-sm">PO Ref: {grn.po?.poNo} | Vendor: {grn.vendor?.name}</p>
        </div>
      </div>

      <div className="surface-card" style={{ padding: 'var(--space-6)' }}>
        <h3 className="font-semibold mb-4">Received Items & Inspection</h3>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Rcv Qty</th>
              <th>S/N</th>
              <th>Batch</th>
              <th>Inspection</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {grn.lines?.map((line: any) => (
              <tr key={line.id}>
                <td>{line.itemType}</td>
                <td>{line.itemDescription}</td>
                <td>{Number(line.receivedQty)}</td>
                <td>{line.serialNo || '-'}</td>
                <td>{line.batchNo || '-'}</td>
                <td>
                  <span className={`badge ${
                    line.inspectionStatus === 'PASSED' ? 'badge-success' : 
                    line.inspectionStatus === 'FAILED' ? 'badge-danger' : 'badge-warning'
                  }`}>
                    {line.inspectionStatus}
                  </span>
                  {line.inspectionStatus === 'PASSED' && line.acceptedQty && (
                    <div className="text-xs text-muted mt-1">Acpt: {Number(line.acceptedQty)} | Rej: {Number(line.rejectedQty)}</div>
                  )}
                </td>
                <td>
                  {line.inspectionStatus === 'PENDING' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => openInspection(line)}>
                      Inspect
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLineId && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content surface-card" style={{ padding: '2rem', width: '400px', borderRadius: '8px' }}>
            <h3 className="mb-4 font-semibold" style={{ marginBottom: '1rem' }}>Quality Inspection</h3>
            <form onSubmit={handleInspect}>
              <div className="form-group mb-4" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Result</label>
                <select className="input" style={{ width: '100%' }} value={inspectionStatus} onChange={e => setInspectionStatus(e.target.value)}>
                  <option value="PASSED">Passed</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Accepted Qty</label>
                  <input type="number" required min="0" step="0.01" className="input" style={{ width: '100%' }} value={acceptedQty} onChange={e => setAcceptedQty(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Rejected Qty</label>
                  <input type="number" required min="0" step="0.01" className="input" style={{ width: '100%' }} value={rejectedQty} onChange={e => setRejectedQty(e.target.value)} />
                </div>
              </div>
              
              {inspectionStatus === 'PASSED' && (
                <div className="form-group mb-4" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Warranty Start Date (if applicable)</label>
                  <input type="date" className="input" style={{ width: '100%' }} value={warrantyStartDate} onChange={e => setWarrantyStartDate(e.target.value)} />
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedLineId(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={inspectMutation.isPending}>Submit Inspection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
