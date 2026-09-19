import React, { useState } from 'react';
import { X, Globe, Building, Check, Shield } from 'lucide-react';
import './AssetShareModal.css';

interface AssetShareModalProps {
  onClose: () => void;
  equipmentName: string;
}

const MOCK_PARTNERS = [
  { id: 1, name: 'General Electric (OEM)', type: 'Manufacturer', access: 'Write' },
  { id: 2, name: 'Siemens Energy', type: 'Service Provider', access: 'Read' },
  { id: 3, name: 'Local Contractors Ltd', type: 'Sub-contractor', access: 'None' },
];

export default function AssetShareModal({ onClose, equipmentName }: AssetShareModalProps) {
  const [partners, setPartners] = useState(MOCK_PARTNERS);

  const toggleAccess = (id: number, currentAccess: string) => {
    const nextAccess = currentAccess === 'None' ? 'Read' : currentAccess === 'Read' ? 'Write' : 'None';
    setPartners(partners.map(p => p.id === id ? { ...p, access: nextAccess } : p));
  };

  return (
    <div className="share-modal-overlay">
      <div className="share-modal-container">
        
        {/* Header */}
        <div className="share-modal-header">
          <div className="share-modal-title">
            <Globe size={20} style={{ color: 'var(--color-primary)' }} />
            Edit Share
          </div>
          <button onClick={onClose} className="share-modal-close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="share-modal-body">
          <p className="share-modal-desc">
            Manage collaboration access for <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{equipmentName}</span>. 
            External partners will be able to view or edit the digital twin data on the Asset Intelligence Network based on these permissions.
          </p>

          <div className="share-partner-list">
            {partners.map(partner => (
              <div key={partner.id} className="share-partner-item">
                <div className="share-partner-info">
                  <div className="share-partner-avatar">
                    <Building size={18} />
                  </div>
                  <div>
                    <div className="share-partner-name">{partner.name}</div>
                    <div className="share-partner-type">{partner.type}</div>
                  </div>
                </div>
                
                <button 
                  onClick={() => toggleAccess(partner.id, partner.access)}
                  className={`share-access-btn ${
                    partner.access === 'Write' ? 'share-access-write' :
                    partner.access === 'Read' ? 'share-access-read' :
                    'share-access-none'
                  }`}
                >
                  {partner.access !== 'None' ? <Check size={12} /> : <Shield size={12} />}
                  {partner.access === 'None' ? 'No Access' : partner.access}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="share-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onClose}>Save Permissions</button>
        </div>

      </div>
    </div>
  );
}
