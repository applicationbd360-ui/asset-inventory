import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, FileText, Plus, AlertCircle, ShoppingCart } from 'lucide-react';
import { purchaseApi } from '../../api/purchase.api';

export default function RFQDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Quote form state
  const [vendorId, setVendorId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [techCompliance, setTechCompliance] = useState(false);
  const [warrantyYears, setWarrantyYears] = useState('0');
  const [deliveryDays, setDeliveryDays] = useState('0');
  const [amcSupport, setAmcSupport] = useState(false);
  const [complianceScore, setComplianceScore] = useState('5');
  const [serviceScore, setServiceScore] = useState('5');

  const { data: rfq, isLoading } = useQuery({
    queryKey: ['rfq', id],
    queryFn: () => purchaseApi.getRfqById(Number(id)),
    enabled: !!id,
  });

  const { data: vendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => purchaseApi.getVendors ? purchaseApi.getVendors() : fetch('http://localhost:3000/api/v1/purchase/vendors', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }).then(res => res.json()).then(d => d.data),
  });

  const quoteMutation = useMutation({
    mutationFn: (data: any) => purchaseApi.addQuotation(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfq', id] });
      setShowQuoteModal(false);
      resetForm();
    }
  });

  const selectMutation = useMutation({
    mutationFn: (quotationId: number) => purchaseApi.selectVendor(Number(id), quotationId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rfq', id] });
      alert(data.message);
      navigate('/purchase/po');
    }
  });

  const resetForm = () => {
    setVendorId('');
    setTotalAmount('');
    setTechCompliance(false);
    setWarrantyYears('0');
    setDeliveryDays('0');
    setAmcSupport(false);
    setComplianceScore('5');
    setServiceScore('5');
  };

  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    quoteMutation.mutate({
      vendorId: Number(vendorId),
      totalAmount: Number(totalAmount),
      techCompliance,
      warrantyYears: Number(warrantyYears),
      deliveryDays: Number(deliveryDays),
      amcSupport,
      complianceScore: Number(complianceScore),
      serviceScore: Number(serviceScore)
    });
  };

  // Evaluation Matrix Logic
  const quotations = rfq?.quotations || [];
  
  if (isLoading) return <div>Loading RFQ...</div>;
  if (!rfq) return <div>RFQ Not Found</div>;

  return (
    <div className="rfq-details animate-fade-in">
      <div className="page-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
        <button className="btn-icon" onClick={() => navigate('/purchase/rfqs')}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 className="page-title">{rfq.rfqNo}</h1>
            <span className={`badge ${rfq.status === 'CLOSED' ? 'badge-success' : 'badge-warning'}`}>
              {rfq.status}
            </span>
          </div>
          <p className="page-subtitle text-muted text-sm">PR Reference: {rfq.pr?.prNo} | Due: {new Date(rfq.dueDate).toLocaleDateString()}</p>
        </div>
        
        {rfq.status !== 'CLOSED' && (
          <button className="btn btn-primary" onClick={() => setShowQuoteModal(true)}>
            <Plus size={18} /> Add Quotation
          </button>
        )}
      </div>

      {/* PR Details Summary */}
      <div className="surface-card mb-6" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 className="font-semibold mb-4" style={{ marginBottom: '1rem' }}>Requisition Items</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Item Type</th>
              <th>Description</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {rfq.pr?.lines.map((line: any) => (
              <tr key={line.id}>
                <td>{line.itemType}</td>
                <td>{line.itemDescription}</td>
                <td>{Number(line.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vendor Evaluation Matrix */}
      <div className="surface-card" style={{ padding: '1.5rem' }}>
        <h3 className="font-semibold mb-4" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={18} /> Vendor Evaluation Matrix
        </h3>
        
        {quotations.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertCircle size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No quotations received yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead style={{ background: 'var(--surface-50)' }}>
                <tr>
                  <th style={{ borderRight: '1px solid var(--border-color)', width: '200px' }}>Criteria</th>
                  {quotations.map((q: any) => (
                    <th key={q.id} style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)', minWidth: '150px' }}>
                      <div className="font-semibold text-primary">{q.vendor?.name}</div>
                      {q.isSelected && <div className="badge badge-success mt-1" style={{ marginTop: '0.25rem' }}>Selected</div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium" style={{ borderRight: '1px solid var(--border-color)' }}>Total Price (BDT)</td>
                  {quotations.map((q: any) => (
                    <td key={q.id} className="text-center font-bold" style={{ borderRight: '1px solid var(--border-color)', fontSize: '1.1rem' }}>
                      ৳ {Number(q.totalAmount).toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="font-medium" style={{ borderRight: '1px solid var(--border-color)' }}>Technical Compliance</td>
                  {quotations.map((q: any) => (
                    <td key={q.id} className="text-center" style={{ borderRight: '1px solid var(--border-color)' }}>
                      {q.techCompliance ? <span className="text-success" style={{ color: 'green' }}>✓ Yes</span> : <span className="text-danger" style={{ color: 'red' }}>✗ No</span>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="font-medium" style={{ borderRight: '1px solid var(--border-color)' }}>Warranty</td>
                  {quotations.map((q: any) => (
                    <td key={q.id} className="text-center" style={{ borderRight: '1px solid var(--border-color)' }}>
                      {q.warrantyYears} Years
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="font-medium" style={{ borderRight: '1px solid var(--border-color)' }}>Delivery Time</td>
                  {quotations.map((q: any) => (
                    <td key={q.id} className="text-center" style={{ borderRight: '1px solid var(--border-color)' }}>
                      {q.deliveryDays} Days
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="font-medium" style={{ borderRight: '1px solid var(--border-color)' }}>AMC Support</td>
                  {quotations.map((q: any) => (
                    <td key={q.id} className="text-center" style={{ borderRight: '1px solid var(--border-color)' }}>
                      {q.amcSupport ? 'Available' : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="font-medium" style={{ borderRight: '1px solid var(--border-color)' }}>Service Score (1-10)</td>
                  {quotations.map((q: any) => (
                    <td key={q.id} className="text-center" style={{ borderRight: '1px solid var(--border-color)' }}>
                      {q.serviceScore}/10
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="font-medium" style={{ borderRight: '1px solid var(--border-color)' }}>Compliance Score (1-10)</td>
                  {quotations.map((q: any) => (
                    <td key={q.id} className="text-center" style={{ borderRight: '1px solid var(--border-color)' }}>
                      {q.complianceScore}/10
                    </td>
                  ))}
                </tr>
                
                {/* Action Row */}
                {rfq.status !== 'CLOSED' && (
                  <tr>
                    <td style={{ borderRight: '1px solid var(--border-color)' }}></td>
                    {quotations.map((q: any) => (
                      <td key={q.id} className="text-center" style={{ borderRight: '1px solid var(--border-color)', padding: '1rem' }}>
                        <button 
                          className="btn btn-primary btn-sm" 
                          style={{ width: '100%' }}
                          onClick={() => selectMutation.mutate(q.id)}
                          disabled={selectMutation.isPending || !q.techCompliance}
                        >
                          <ShoppingCart size={14} /> Select & Create PO
                        </button>
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quotation Entry Modal */}
      {showQuoteModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto' }}>
          <div className="modal-content surface-card" style={{ padding: '2rem', width: '500px', borderRadius: '8px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="mb-4 font-semibold" style={{ marginBottom: '1.5rem' }}>Enter Vendor Quotation</h3>
            <form onSubmit={handleAddQuote}>
              <div className="form-group mb-3" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Select Vendor</label>
                <select required className="input" style={{ width: '100%' }} value={vendorId} onChange={e => setVendorId(e.target.value)}>
                  <option value="">-- Choose Vendor --</option>
                  {vendors?.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              
              <div className="form-group mb-3" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Total Quoted Price (BDT)</label>
                <input type="number" required min="0" className="input" style={{ width: '100%' }} value={totalAmount} onChange={e => setTotalAmount(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Technical Compliance</label>
                  <select className="input" style={{ width: '100%' }} value={techCompliance ? 'true' : 'false'} onChange={e => setTechCompliance(e.target.value === 'true')}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>AMC Support</label>
                  <select className="input" style={{ width: '100%' }} value={amcSupport ? 'true' : 'false'} onChange={e => setAmcSupport(e.target.value === 'true')}>
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Warranty (Years)</label>
                  <input type="number" required min="0" className="input" style={{ width: '100%' }} value={warrantyYears} onChange={e => setWarrantyYears(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Delivery (Days)</label>
                  <input type="number" required min="0" className="input" style={{ width: '100%' }} value={deliveryDays} onChange={e => setDeliveryDays(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Service Score (1-10)</label>
                  <input type="number" required min="1" max="10" className="input" style={{ width: '100%' }} value={serviceScore} onChange={e => setServiceScore(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Compliance Score (1-10)</label>
                  <input type="number" required min="1" max="10" className="input" style={{ width: '100%' }} value={complianceScore} onChange={e => setComplianceScore(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowQuoteModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={quoteMutation.isPending}>Save Quotation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
