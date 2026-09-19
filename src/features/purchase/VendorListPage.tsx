import React, { useState } from 'react';
import { Search, Filter, Plus, Building2, Mail, Phone, MapPin, ChevronRight, CheckCircle2, X } from 'lucide-react';

const INITIAL_VENDORS = [
  {
    id: 'V-001',
    name: 'General Electric (OEM)',
    type: 'Manufacturer',
    email: 'contact@ge.com',
    phone: '+1 800-555-0199',
    status: 'ACTIVE',
    location: 'Boston, MA'
  },
  {
    id: 'V-002',
    name: 'Siemens Energy',
    type: 'Service Provider',
    email: 'support@siemens-energy.com',
    phone: '+49 89-1234-5678',
    status: 'ACTIVE',
    location: 'Munich, Germany'
  },
  {
    id: 'V-003',
    name: 'Local Contractors Ltd',
    type: 'Sub-contractor',
    email: 'hello@localcontractors.net',
    phone: '+1 555-012-3456',
    status: 'PENDING',
    location: 'Houston, TX'
  }
];

export default function VendorListPage() {
  const [search, setSearch] = useState('');
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: '', type: 'Manufacturer', email: '', phone: '', location: '' });

  // Draggable logic
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    // @ts-ignore
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    // @ts-ignore
    e.target.releasePointerCapture(e.pointerId);
  };

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.email) {
      alert('Please fill out the required fields!');
      return;
    }
    const vendorId = `V-00${vendors.length + 1}`;
    setVendors([...vendors, { ...newVendor, id: vendorId, status: 'PENDING' }]);
    setNewVendor({ name: '', type: 'Manufacturer', email: '', phone: '', location: '' });
    setShowAddModal(false);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 relative">
      
      {/* Header */}
      <div className="page-header flex justify-between items-end">
        <div>
          <h1 className="page-title text-2xl font-bold flex items-center gap-2">
            <Building2 size={24} className="text-primary" /> Vendor Management
          </h1>
          <p className="page-subtitle text-muted text-sm mt-1">
            Manage your Business Partners, OEMs, and Service Providers globally.
          </p>
        </div>
        <button 
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} /> Add Vendor
        </button>
      </div>

      {/* Main Content */}
      <div className="surface-card p-0 overflow-hidden">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center p-4 border-b border-subtle bg-surface-2">
          <div className="flex items-center gap-2 bg-surface-1 px-3 py-2 rounded-md border border-subtle w-80">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search vendors..."
              className="bg-transparent border-none outline-none text-sm w-full text-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary flex items-center gap-2">
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-surface-2 border-b border-subtle text-sm text-muted">
                <th className="p-4 font-semibold text-center">Vendor Name</th>
                <th className="p-4 font-semibold text-center">Type</th>
                <th className="p-4 font-semibold text-center">Contact Info</th>
                <th className="p-4 font-semibold text-center">Location</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    No vendors found.
                  </td>
                </tr>
              ) : (
                filteredVendors.map(vendor => (
                  <tr key={vendor.id} className="border-b border-subtle hover:bg-surface-2 transition-colors cursor-pointer">
                    <td className="p-4">
                      <div className="font-semibold text-primary">{vendor.name}</div>
                      <div className="text-xs text-muted mt-1">{vendor.id}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm bg-surface-3 px-2 py-1 rounded border border-subtle">
                        {vendor.type}
                      </span>
                    </td>
                    <td className="p-4 flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Mail size={14} className="text-muted" /> {vendor.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Phone size={14} /> {vendor.phone}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted">
                        <MapPin size={14} /> {vendor.location}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        {vendor.status === 'ACTIVE' ? (
                          <span className="badge badge-success flex items-center gap-1 w-max">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span className="badge badge-warning w-max">Pending</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button className="btn-icon mx-auto">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              backgroundColor: '#1e1e2d',
            }}
            className="rounded-lg border border-subtle shadow-xl w-[500px] flex flex-col"
          >
            <div 
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="p-4 border-b border-subtle flex justify-between items-center cursor-move"
              style={{ backgroundColor: '#13131e' }}
            >
              <h2 className="font-bold text-lg text-primary flex items-center gap-2 select-none pointer-events-none">
                <Building2 size={20} /> Add New Vendor
              </h2>
              <button 
                className="btn-icon select-none" 
                onPointerDown={(e) => e.stopPropagation()} 
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-muted">Vendor Name *</label>
                <input 
                  type="text" className="input-field" placeholder="e.g. Acme Corp" 
                  value={newVendor.name} onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-muted">Vendor Type</label>
                <select className="input-field bg-surface-1" value={newVendor.type} onChange={(e) => setNewVendor({...newVendor, type: e.target.value})}>
                  <option>Manufacturer</option>
                  <option>Service Provider</option>
                  <option>Sub-contractor</option>
                  <option>Supplier</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-muted">Email Address *</label>
                <input 
                  type="email" className="input-field" placeholder="contact@example.com" 
                  value={newVendor.email} onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="text-sm font-semibold text-muted">Phone Number</label>
                  <input 
                    type="text" className="input-field" placeholder="+1 234 567 890" 
                    value={newVendor.phone} onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="text-sm font-semibold text-muted">Location</label>
                  <input 
                    type="text" className="input-field" placeholder="City, Country" 
                    value={newVendor.location} onChange={(e) => setNewVendor({...newVendor, location: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-subtle flex justify-end gap-2" style={{ backgroundColor: '#13131e' }}>
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddVendor}>Create Vendor</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
