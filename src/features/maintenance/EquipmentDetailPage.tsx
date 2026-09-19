import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Settings, ShieldAlert, Loader2, ArrowLeft, QrCode, Save, FileText, Activity, Layers, ActivitySquare, BadgeCheck, ChevronDown } from 'lucide-react';
import { maintenanceApi } from '../../api/maintenance.api';
import AssetHierarchyTree from '../../components/ui/AssetHierarchyTree';
import AssetShareModal from '../../components/ui/AssetShareModal';
import './EquipmentDetailPage.css';

export default function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Information');
  const [selectedNode, setSelectedNode] = useState('pump-00554');
  const [showManageDropdown, setShowManageDropdown] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const { data: eq, isLoading } = useQuery({
    queryKey: ['equipment', id],
    queryFn: () => maintenanceApi.getEquipmentById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <div className="p-8 text-center text-muted flex items-center justify-center h-full"><Loader2 size={24} className="animate-spin mr-2"/> Loading equipment master data...</div>;
  if (!eq) return <div className="p-8 text-center text-danger">Equipment not found</div>;

  return (
    <div className="fiori-layout animate-fade-in">
      
      {/* Left Sidebar: Asset Hierarchy Tree */}
      <div className="fiori-sidebar">
        <div className="p-4 border-b border-subtle font-semibold flex items-center gap-2 text-primary">
          <Layers size={18} /> Functional Location
        </div>
        <AssetHierarchyTree onSelectNode={setSelectedNode} />
      </div>

      {/* Right Main Content */}
      <div className="fiori-main">
        
        {/* Header */}
        <div className="fiori-header">
          <div className="fiori-header-title flex-1">
            <button className="btn-icon" onClick={() => navigate('/maintenance/equipment')}>
              <ArrowLeft size={20} />
            </button>
            <Settings size={28} className="text-primary" />
            <div>
              <div className="text-sm text-muted mb-1 flex items-center gap-4">
                <span>PUMP / POSITIVE_DISPLACEMENT_PUMP / 200 Series</span>
                <span className="text-primary font-medium cursor-pointer hover:underline" onClick={() => setShowShareModal(true)}>
                  Shared With: 2 Partners
                </span>
              </div>
              <h1>{eq.name} <span className="badge badge-success ml-2">A+</span></h1>
              <div className="text-sm text-muted mt-1">{eq.code}</div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button className="btn btn-secondary">Publish</button>
            <div style={{ position: 'relative' }}>
              <button 
                className="btn btn-primary flex items-center gap-2"
                onClick={() => setShowManageDropdown(!showManageDropdown)}
              >
                Manage <ChevronDown size={14} />
              </button>
              {showManageDropdown && (
                <div className="manage-dropdown">
                  <button className="manage-dropdown-item" onClick={() => { alert('Update Model feature is coming soon!'); setShowManageDropdown(false); }}>Update Model</button>
                  <button className="manage-dropdown-item" onClick={() => { alert('Remove Model feature is coming soon!'); setShowManageDropdown(false); }}>Remove Model</button>
                  <button className="manage-dropdown-item" onClick={() => { alert('Manage Phase feature is coming soon!'); setShowManageDropdown(false); }}>Manage Phase</button>
                  <div className="manage-dropdown-divider"></div>
                  <button 
                    className="manage-dropdown-item font-semibold text-primary" 
                    onClick={() => { setShowShareModal(true); setShowManageDropdown(false); }}
                  >
                    Edit Share
                  </button>
                  <button className="manage-dropdown-item" onClick={() => { alert('Request Model feature is coming soon!'); setShowManageDropdown(false); }}>Request Model</button>
                  <button className="manage-dropdown-item" onClick={() => { alert('New Notification feature is coming soon!'); setShowManageDropdown(false); }}>New Notification</button>
                  <button className="manage-dropdown-item" onClick={() => { alert('Edit Header feature is coming soon!'); setShowManageDropdown(false); }}>Edit Header</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="fiori-tabs">
          {['Information', 'Structure & Parts', 'Documentation', 'Monitoring', 'Maintenance & Service', 'Assessment', 'Analytics', 'ERP Information'].map(tab => (
            <div 
              key={tab}
              className={`fiori-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Information' && (
          <div className="fiori-cards-grid">
            
            {/* Card 1: All Attributes */}
            <div className="fiori-card">
              <div className="fiori-card-title"><FileText size={16} /> All Attributes</div>
              <div className="fiori-card-value text-right mt-2 text-primary">30</div>
              <div className="flex justify-between mt-auto">
                <span className="text-sm text-muted">Changed Values</span>
                <span className="font-semibold">0</span>
              </div>
            </div>

            {/* Card 2: Status */}
            <div className="fiori-card">
              <div className="fiori-card-title"><ShieldAlert size={16} /> Status</div>
              <div className="mt-4 mb-2">Equipment</div>
              <div className="flex justify-between mt-auto">
                <span className="text-sm text-muted">Status</span>
                <span className="font-semibold text-success">True</span>
              </div>
            </div>

            {/* Card 3: Linking */}
            <div className="fiori-card">
              <div className="fiori-card-title"><ActivitySquare size={16} /> SAP AIN Class</div>
              <div className="mt-4 mb-2">Equipment Linking</div>
              <div className="flex justify-between mt-auto">
                <span className="text-sm text-muted">AIN: Equipment</span>
                <span className="font-semibold">{eq.code}</span>
              </div>
            </div>

            {/* Card 4: Equipment Condition */}
            <div className="fiori-card" style={{ gridRow: 'span 2' }}>
              <div className="fiori-card-title"><BadgeCheck size={16} /> Equipment Condition</div>
              <div className="mt-4 text-success font-semibold">Excellent</div>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                Equipment is in perfect condition and functions efficiently without any issues. All recent maintenance checks passed successfully.
              </p>
            </div>

            {/* Card 5: Real-time Sensors (Pumps) */}
            <div className="fiori-card" style={{ gridRow: 'span 2' }}>
              <div className="fiori-card-title"><Activity size={16} /> Pumps Data</div>
              <div className="mt-4 flex flex-col gap-4">
                <div className="fiori-card-row">
                  <span>Next Inspection Date</span>
                  <span className="highlight">Dec 11, 2026</span>
                </div>
                <div className="fiori-card-row">
                  <span>Bearing Temperature</span>
                  <span className="highlight text-warning">99 °C</span>
                </div>
                <div className="fiori-card-row">
                  <span>Inflow Temperature</span>
                  <span className="highlight">90 °C</span>
                </div>
                <div className="fiori-card-row">
                  <span>Oil Level</span>
                  <span className="highlight text-success">70 %</span>
                </div>
              </div>
            </div>
            
            {/* Card 6: Manufacturer */}
            <div className="fiori-card">
              <div className="fiori-card-title"><Settings size={16} /> Manufacturer Info</div>
              <div className="mt-4 mb-2">{eq.manufacturer || 'General Electric'}</div>
              <div className="flex justify-between mt-auto">
                <span className="text-sm text-muted">Model</span>
                <span className="font-semibold">{eq.modelNo || '200 Series'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Structure & Parts' && (
          <div className="bg-surface rounded-lg border border-subtle shadow-sm p-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-primary"><Layers size={20}/> Asset BOM / Installed Components</h3>
              <button className="btn btn-primary" onClick={() => alert('Install Component feature coming soon')}>Install Component</button>
            </div>
            
            <div className="table-responsive">
              <table className="table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <tr>
                    <th className="py-3 px-4 font-semibold text-muted">Component Name</th>
                    <th className="py-3 px-4 font-semibold text-muted">Serial No</th>
                    <th className="py-3 px-4 font-semibold text-muted">Installed At</th>
                    <th className="py-3 px-4 font-semibold text-muted">Warranty End</th>
                    <th className="py-3 px-4 font-semibold text-muted">Status</th>
                    <th className="py-3 px-4 font-semibold text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-8 italic">Loading components... (API integration pending)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab !== 'Information' && activeTab !== 'Structure & Parts' && (
          <div className="flex items-center justify-center h-64 text-muted border border-dashed border-subtle rounded-lg mt-8">
            <div className="text-center">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <h3>{activeTab} Module</h3>
              <p>Integration pending. Data will be mapped in the next phase.</p>
            </div>
          </div>
        )}

      </div>

      {/* Asset Collaboration Modal */}
      {showShareModal && (
        <AssetShareModal 
          equipmentName={`${eq.code} - ${eq.name}`} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  );
}
