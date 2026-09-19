import React, { useState } from 'react';
import { Search, Filter, Settings, AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, ChevronRight, Calculator } from 'lucide-react';
import './RiskAssessmentPage.css';

const ASSIGNMENTS = [
  { id: '1', object: 'Risk_Criticality_Pump', desc: 'Raw water Pump 2', code: '20024005', score: 33.00, details: '2/2', active: true },
  { id: '2', object: 'Compressor_Station_A', desc: 'Main Air Compressor', code: '20024110', score: 18.50, details: '1/2', active: false },
  { id: '3', object: 'Cooling_Tower_Fan', desc: 'Cooling Tower Fan 1', code: '20024225', score: 8.00, details: '2/2', active: false },
];

export default function RiskAssessmentPage() {
  const [activeTab, setActiveTab] = useState('Assessments');
  const [expandedSection, setExpandedSection] = useState(true);
  
  // Status Dropdown State
  const [status, setStatus] = useState('Released');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // Interactive state for demonstration
  const [severity, setSeverity] = useState(12);
  const [productionRisk, setProductionRisk] = useState(21);
  
  const overallRisk = severity + productionRisk;
  const healthFinancial = severity === 12 ? 1000 : (severity === 6 ? 500 : 250);
  const productionFinancial = 3000;
  const overallFinancial = healthFinancial + productionFinancial;

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setShowStatusDropdown(false);
  };

  return (
    <div className="risk-layout animate-fade-in">
      
      {/* Left Sidebar (Assignments) */}
      <div className="risk-sidebar">
        <div className="risk-sidebar-header">
          <h2 className="risk-sidebar-title">
            Assignments (1)
            <div className="flex gap-2">
              <button className="btn-icon"><Filter size={16} /></button>
            </div>
          </h2>
          <div className="risk-search-box">
            <Search size={16} className="text-muted" />
            <input type="text" placeholder="Search" />
          </div>
        </div>
        
        <div className="risk-list-header">
          <span>Technical Object</span>
          <span>Details</span>
        </div>

        <div className="risk-list">
          {ASSIGNMENTS.map(item => (
            <div key={item.id} className={`risk-list-item ${item.active ? 'active' : ''}`}>
              <div className="risk-list-item-icon">
                <Settings size={18} />
              </div>
              <div className="risk-list-item-content">
                <div className="risk-list-item-title">{item.object}</div>
                <div className="risk-list-item-desc">{item.desc}</div>
                <div className="risk-list-item-desc">{item.code}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="risk-list-item-score">{item.score.toFixed(2)}</span>
                <span className="text-xs text-muted">{item.details}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Main Area (Assessments) */}
      <div className="risk-main">
        
        {/* Header */}
        <div className="risk-main-header">
          <div className="risk-header-top">
            <div>
              <h1 className="risk-page-title">Risk and Criticality Raw Water pump</h1>
              <div className="risk-page-subtitle">RAC_AS_145</div>
            </div>
            <div className="relative">
              <button 
                className="btn btn-secondary flex items-center gap-2"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                Change Status <ChevronDown size={14} />
              </button>
              
              {showStatusDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-1 border border-subtle rounded-md shadow-lg z-50 overflow-hidden">
                  <div className="flex flex-col py-1">
                    <button className="px-4 py-2 text-left text-sm hover:bg-surface-2 transition-colors" onClick={() => handleStatusChange('In Process')}>In Process</button>
                    <button className="px-4 py-2 text-left text-sm hover:bg-surface-2 transition-colors text-success" onClick={() => handleStatusChange('Released')}>Released</button>
                    <button className="px-4 py-2 text-left text-sm hover:bg-surface-2 transition-colors text-danger" onClick={() => handleStatusChange('Closed')}>Closed</button>
                    <button className="px-4 py-2 text-left text-sm hover:bg-surface-2 transition-colors text-muted" onClick={() => handleStatusChange('Cancelled')}>Cancelled</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="risk-meta-grid">
            <div className="risk-meta-item">
              <span className="risk-meta-label">Risk Type</span>
              <span className="risk-meta-value">Current Risk</span>
            </div>
            <div className="risk-meta-item">
              <span className="risk-meta-label">Currency</span>
              <span className="risk-meta-value">United States Dollar (USD)</span>
            </div>
            <div className="risk-meta-item">
              <span className="risk-meta-label">Valid To</span>
              <span className="risk-meta-value text-danger flex items-center gap-1">
                <AlertTriangle size={14} /> 
              </span>
            </div>
            <div className="risk-meta-item">
              <span className="risk-meta-label">Status</span>
              <span className={`risk-meta-value ${
                status === 'Released' ? 'text-success' : 
                status === 'In Process' ? 'text-warning' : 
                status === 'Closed' ? 'text-danger' : 'text-muted'
              }`}>
                {status}
              </span>
            </div>
          </div>

          <div className="risk-tabs">
            <div className={`risk-tab ${activeTab === 'Information' ? 'active' : ''}`} onClick={() => setActiveTab('Information')}>Information</div>
            <div className={`risk-tab ${activeTab === 'Assignments' ? 'active' : ''}`} onClick={() => setActiveTab('Assignments')}>Assignments</div>
            <div className={`risk-tab ${activeTab === 'Assessments' ? 'active' : ''}`} onClick={() => setActiveTab('Assessments')}>Assessments</div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'Assessments' && (
          <div className="risk-content">
            
            <div className="flex justify-between items-end">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Calculator size={20} className="text-primary"/> Impacts
              </h2>
              <div className="text-sm font-semibold text-muted">
                Risk Score/Criticality: <span className="text-danger">{overallRisk.toFixed(2)} A - O&M Safety critical</span> Action: RCM
              </div>
            </div>

            {/* Risk Details Table */}
            <div className="risk-section">
              <div className="risk-section-header">
                <div className="risk-section-title">Risk Details</div>
              </div>
              <table className="risk-table">
                <thead>
                  <tr>
                    <th>Impacts</th>
                    <th>Risk</th>
                    <th className="text-right">Financial Risk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="flex items-center gap-2"><CheckCircle2 size={16} className="text-muted"/> Health Safety</td>
                    <td className="risk-score-value">{severity.toFixed(2)}</td>
                    <td className="text-right font-semibold">{healthFinancial.toLocaleString()}.00 USD</td>
                  </tr>
                  <tr>
                    <td className="flex items-center gap-2"><CheckCircle2 size={16} className="text-muted"/> Production</td>
                    <td className="risk-score-value">{productionRisk.toFixed(2)}</td>
                    <td className="text-right font-semibold">{productionFinancial.toLocaleString()}.00 USD</td>
                  </tr>
                  <tr className="bg-surface-2 font-semibold">
                    <td>Overall</td>
                    <td className="risk-score-value">{overallRisk.toFixed(2)}</td>
                    <td className="text-right">{overallFinancial.toLocaleString()}.00 USD</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Accordion Form */}
            <div className="risk-section">
              <div className="risk-accordion-header" onClick={() => setExpandedSection(!expandedSection)}>
                {expandedSection ? <ChevronDown size={18} className="text-muted"/> : <ChevronRight size={18} className="text-muted"/>}
                <span className="font-semibold text-primary">Health Safety: Health</span>
              </div>
              
              {expandedSection && (
                <div className="risk-accordion-body">
                  <div className="risk-question">1. Severity</div>
                  <p className="text-sm text-muted mb-6">What would be the severity of a failure of this equipment</p>
                  
                  <div className="grid grid-cols-12 text-xs font-semibold text-muted mb-4 pb-2 border-b border-subtle uppercase tracking-wider">
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2">Value</div>
                    <div className="col-span-5">Long Text</div>
                  </div>

                  <div className="flex flex-col">
                    <label className="risk-radio-row hover:bg-surface-2 transition-colors -mx-4 px-4 rounded-md">
                      <div className="risk-radio-label">
                        <input type="radio" name="severity" className="risk-radio-input" checked={severity === 12} onChange={() => setSeverity(12)} />
                        Violation
                      </div>
                      <div className="risk-radio-value">12</div>
                      <div className="risk-radio-text">Major compliance violation resulting in shutdown.</div>
                    </label>

                    <label className="risk-radio-row hover:bg-surface-2 transition-colors -mx-4 px-4 rounded-md">
                      <div className="risk-radio-label">
                        <input type="radio" name="severity" className="risk-radio-input" checked={severity === 6} onChange={() => setSeverity(6)} />
                        Minor Injury
                      </div>
                      <div className="risk-radio-value">6</div>
                      <div className="risk-radio-text">Requires first aid but no lost time.</div>
                    </label>

                    <label className="risk-radio-row hover:bg-surface-2 transition-colors -mx-4 px-4 rounded-md border-b-0">
                      <div className="risk-radio-label">
                        <input type="radio" name="severity" className="risk-radio-input" checked={severity === 3} onChange={() => setSeverity(3)} />
                        Serious Disability
                      </div>
                      <div className="risk-radio-value">3</div>
                      <div className="risk-radio-text">Life threatening or permanent disability.</div>
                    </label>
                  </div>
                  
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
