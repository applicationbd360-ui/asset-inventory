import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, DollarSign, Filter, ChevronRight, Calculator, Loader2, QrCode, Plus } from 'lucide-react';
import { financeApi } from '../../api/finance.api';
import { Link } from 'react-router-dom';

export default function FixedAssetPage() {
  const [search, setSearch] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: assets, isLoading } = useQuery({
    queryKey: ['fixed-assets'],
    queryFn: financeApi.getAssets,
  });

  const runDepreciationMutation = useMutation({
    mutationFn: () => {
      const now = new Date();
      return financeApi.runDepreciation(now.getFullYear(), now.getMonth() + 1);
    },
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries({ queryKey: ['fixed-assets'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.error?.message || 'Failed to run depreciation');
    }
  });

  const filteredAssets = assets?.filter((asset: any) =>
    asset.faNo?.toLowerCase().includes(search.toLowerCase()) ||
    asset.assetName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fixed Assets Register</h1>
          <p className="page-subtitle text-muted text-sm">Manage capitalized assets and depreciation</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/finance/assets/capitalize" className="btn btn-secondary">
            <Plus size={16} /> Capitalize Asset
          </Link>
          <button
            className="btn btn-primary"
            onClick={() => runDepreciationMutation.mutate()}
            disabled={runDepreciationMutation.isPending}
          >
            {runDepreciationMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Calculator size={16} />}
            Run Depreciation
          </button>
        </div>
      </div>

      <div className="surface-card">
        <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search Asset No or Name..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="table-wrapper">
          {isLoading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              <Loader2 className="animate-spin" style={{ display: 'inline' }} /> Loading assets...
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset No</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Capitalized On</th>
                  <th>Acq. Cost (BDT)</th>
                  <th>Book Value (BDT)</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {!filteredAssets || filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                      <DollarSign size={40} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                      No capitalized assets found
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset: any) => (
                    <tr key={asset.id}>
                      <td>
                        <span className="font-mono font-semibold" style={{ color: 'var(--primary)' }}>
                          {asset.faNo}
                        </span>
                      </td>
                      <td className="font-semibold">{asset.assetName}</td>
                      <td>{asset.assetClass?.name || 'N/A'}</td>
                      <td className="text-sm">
                        {asset.capitalizationDate
                          ? new Date(asset.capitalizationDate).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="text-right">
                        {Number(asset.acquisitionValue).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-right font-semibold" style={{ color: 'var(--success)' }}>
                        {Number(asset.bookValue).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`badge ${asset.assetStatus === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}`}>
                          {asset.assetStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '4px 8px' }}
                            onClick={() => setSelectedAssetId(asset.id)}
                            title="View QR Code"
                          >
                            <QrCode size={16} />
                          </button>
                          <Link
                            to={`/finance/assets/${asset.id}`}
                            className="btn btn-ghost"
                            style={{ padding: '4px 8px' }}
                            title="View Details"
                          >
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedAssetId && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => setSelectedAssetId(null)}
        >
          <div
            className="surface-card"
            style={{ maxWidth: 360, width: '100%', textAlign: 'center', padding: 32 }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold" style={{ marginBottom: 20 }}>Asset QR Code</h3>
            <QrCodeDisplay assetId={selectedAssetId} />
            <button
              className="btn btn-secondary"
              style={{ marginTop: 20 }}
              onClick={() => setSelectedAssetId(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QrCodeDisplay({ assetId }: { assetId: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['asset-qrcode', assetId],
    queryFn: () => financeApi.getAssetQrCode(assetId)
  });

  if (isLoading) return (
    <div style={{ padding: 40 }}>
      <Loader2 className="animate-spin" style={{ display: 'inline' }} />
    </div>
  );
  if (error) return (
    <div style={{ padding: 20, color: 'var(--danger)' }}>Failed to load QR code</div>
  );

  return (
    <div style={{ background: 'white', padding: 16, borderRadius: 8, display: 'inline-block' }}>
      <img src={data?.qrCode} alt="Asset QR Code" style={{ width: 200, height: 200 }} />
      <p style={{ marginTop: 8, fontSize: 12, color: '#666' }}>Scan to view asset details</p>
    </div>
  );
}
