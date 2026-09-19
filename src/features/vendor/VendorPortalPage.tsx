import React from 'react';
import { Building2, Server, BellRing, Activity, ChevronRight, Check } from 'lucide-react';
import './VendorPortalPage.css';

export default function VendorPortalPage() {
  return (
    <div className="vendor-portal-layout animate-fade-in">
      
      {/* Header */}
      <div className="vendor-portal-header">
        <div className="vendor-welcome">
          <div className="vendor-logo">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="vendor-portal-title">Vendor Collaboration Portal</h1>
          </div>
        </div>
        <p className="vendor-portal-subtitle">Welcome back, <strong>General Electric (OEM)</strong></p>
      </div>

      {/* Main Content */}
      <div className="vendor-portal-content">
        
        {/* KPI Cards */}
        <div className="vendor-stats-grid">
          <div className="vendor-stat-card">
            <div className="vendor-stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <Server size={28} />
            </div>
            <div className="vendor-stat-info">
              <span className="vendor-stat-value">1</span>
              <span className="vendor-stat-label">Shared Assets</span>
            </div>
          </div>
          
          <div className="vendor-stat-card">
            <div className="vendor-stat-icon" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
              <Activity size={28} />
            </div>
            <div className="vendor-stat-info">
              <span className="vendor-stat-value">3</span>
              <span className="vendor-stat-label">Pending Work Orders</span>
            </div>
          </div>

          <div className="vendor-stat-card">
            <div className="vendor-stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <BellRing size={28} />
            </div>
            <div className="vendor-stat-info">
              <span className="vendor-stat-value">0</span>
              <span className="vendor-stat-label">Critical Alerts</span>
            </div>
          </div>
        </div>

        {/* Shared Equipment Table */}
        <div>
          <h2 className="vendor-section-title">
            <Server size={20} /> Shared Equipment Data
          </h2>
          <div className="vendor-table-card">
            <table className="vendor-table">
              <thead>
                <tr>
                  <th>Equipment Code</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Your Access</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold text-primary">EQ-BIO-000001</td>
                  <td>ICU Ventilator — Bed 01</td>
                  <td>Eagle_Ford_Field &gt; North_Field</td>
                  <td>
                    <span className="badge badge-success">ACTIVE</span>
                  </td>
                  <td>
                    <span className="vendor-access-badge">
                      <Check size={14} /> Write
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon text-primary">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
                {/* Empty State for Demo */}
                <tr>
                  <td colSpan={6} className="text-center text-muted" style={{ padding: '32px' }}>
                    No other equipment has been shared with your company yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
