import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, DollarSign, Archive, ArrowRight, Loader2 } from 'lucide-react';
import { financeApi } from '../../api/finance.api';

export default function AssetCapitalizationPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedGrn, setSelectedGrn] = useState<any>(null);

  // Form state
  const [assetClassId, setAssetClassId] = useState('');
  const [usefulLifeYears, setUsefulLifeYears] = useState('5');
  const [depreciationMethod, setDepreciationMethod] = useState('STRAIGHT_LINE');

  const { data: pendingGrns, isLoading } = useQuery({
    queryKey: ['pending-capitalization'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/api/v1/finance/assets/pending-capitalization', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      return data.data;
    }
  });

  const capitalizeMutation = useMutation({
    mutationFn: (data: any) => financeApi.capitalizeAsset(data),
    onSuccess: () => {
      alert('Asset Capitalized Successfully! Journal Entry Posted.');
      queryClient.invalidateQueries({ queryKey: ['pending-capitalization'] });
      queryClient.invalidateQueries({ queryKey: ['fixed-assets'] });
      setSelectedGrn(null);
    },
    onError: (err: any) => {
      alert(err.response?.data?.error?.message || 'Failed to capitalize asset');
    }
  });

  const handleCapitalize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrn || !assetClassId) return;

    capitalizeMutation.mutate({
      grnLineId: selectedGrn.id,
      assetClassId: Number(assetClassId),
      name: selectedGrn.itemDescription,
      acquisitionCost: Number(selectedGrn.unitPrice) * Number(selectedGrn.acceptedQty),
      usefulLifeYears: Number(usefulLifeYears),
      salvageValue: 0,
      depreciationMethod,
      createEquipment: true,
      equipmentCategoryId: 1 // Default to 1 for demo
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Asset Capitalization</h1>
          <p className="page-subtitle text-muted text-sm">Capitalize passed GRN items and generate journal entries</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        {/* Pending GRNs List */}
        <div className="surface-card p-6">
          <h3 className="font-semibold mb-4">Pending for Capitalization</h3>
          
          {isLoading ? (
            <div className="text-center p-8 text-muted"><Loader2 className="animate-spin" /></div>
          ) : pendingGrns?.length === 0 ? (
            <div className="text-center p-8 text-muted">No pending items for capitalization.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {pendingGrns?.map((line: any) => (
                <div 
                  key={line.id}
                  className={`p-4 border rounded cursor-pointer ${selectedGrn?.id === line.id ? 'border-primary' : 'border-subtle'}`}
                  style={{ background: selectedGrn?.id === line.id ? 'var(--bg-primary-light)' : 'transparent', transition: 'all 0.2s' }}
                  onClick={() => setSelectedGrn(line)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 className="font-semibold" style={{ color: 'var(--color-primary)' }}>{line.itemDescription}</h4>
                      <p className="text-sm text-muted">GRN: {line.grn.grnNo} | Vendor: {line.grn.vendor.name}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="flex align-center gap-1"><Archive size={14} /> Qty: {Number(line.acceptedQty)}</span>
                        <span className="flex align-center gap-1"><DollarSign size={14} /> Unit Price: {Number(line.unitPrice).toLocaleString()} BDT</span>
                        <span className="flex align-center gap-1"><CheckCircle size={14} className="text-success" /> Inspection: PASSED</span>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Capitalization Form */}
        <div className="surface-card p-6" style={{ alignSelf: 'start', position: 'sticky', top: 'var(--space-6)' }}>
          <h3 className="font-semibold mb-4">Capitalization Details</h3>
          
          {!selectedGrn ? (
            <div className="text-center p-8 text-muted border border-dashed rounded bg-subtle">
              Select an item from the list to capitalize
            </div>
          ) : (
            <form onSubmit={handleCapitalize} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              
              <div className="p-3 bg-subtle rounded border">
                <p className="text-sm text-muted">Total Capitalization Value</p>
                <h2 className="font-bold text-xl mt-1">{(Number(selectedGrn.unitPrice) * Number(selectedGrn.acceptedQty)).toLocaleString()} BDT</h2>
              </div>

              <div className="form-group">
                <label className="form-label">Asset Class *</label>
                <select className="input" required value={assetClassId} onChange={e => setAssetClassId(e.target.value)}>
                  <option value="">-- Select Class --</option>
                  <option value="1">Medical Equipment</option>
                  <option value="2">Facility Equipment</option>
                  <option value="3">IT Equipment</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Depreciation Method</label>
                <select className="input" value={depreciationMethod} onChange={e => setDepreciationMethod(e.target.value)}>
                  <option value="STRAIGHT_LINE">Straight Line</option>
                  <option value="DECLINING_BALANCE">Declining Balance</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Useful Life (Years)</label>
                <input type="number" required min="1" max="50" className="input" value={usefulLifeYears} onChange={e => setUsefulLifeYears(e.target.value)} />
              </div>

              <div className="p-3 bg-primary-light rounded border border-primary mt-2">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Automated Actions:</p>
                <ul className="text-xs text-muted mt-2" style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: '1.5' }}>
                  <li>Generate Asset Number (FA No)</li>
                  <li>Post Journal Entry (Dr. Asset / Cr. Payable)</li>
                  <li>Generate Depreciation Schedule</li>
                  <li>Sync with EAM (Equipment Master)</li>
                </ul>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary mt-2 w-full"
                disabled={capitalizeMutation.isPending}
              >
                {capitalizeMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <DollarSign size={16} />}
                Capitalize Asset
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
