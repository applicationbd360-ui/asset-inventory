import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Plus, Edit, Trash2, Key, Loader2, Check } from 'lucide-react';
import { systemApi } from '../../api/system.api';

const MODULES = ['FINANCE', 'MAINTENANCE', 'INVENTORY', 'PURCHASE', 'HFM', 'SYSTEM', 'ADMIN'];
const ACTIONS = ['READ', 'CREATE', 'UPDATE', 'DELETE'];

export default function RoleManagementPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);

  const { data: roles, isLoading } = useQuery({
    queryKey: ['system-roles'],
    queryFn: systemApi.getRoles
  });

  const saveMutation = useMutation({
    mutationFn: (payload: any) => 
      editingRole 
        ? systemApi.updateRole(editingRole.id, payload)
        : systemApi.createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-roles'] });
      closeModal();
    },
    onError: (err: any) => alert(err.response?.data?.error?.message || 'Error saving role')
  });

  const deleteMutation = useMutation({
    mutationFn: systemApi.deleteRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['system-roles'] }),
    onError: (err: any) => alert(err.response?.data?.error?.message || 'Cannot delete this role')
  });

  const openModal = (role?: any) => {
    if (role) {
      setEditingRole(role);
      setName(role.name);
      setDisplayName(role.displayName);
      // Ensure permissions is an array even if stored as JSON string
      setPermissions(Array.isArray(role.permissions) ? role.permissions : JSON.parse(role.permissions || '[]'));
    } else {
      setEditingRole(null);
      setName('');
      setDisplayName('');
      setPermissions([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const togglePermission = (module: string, action: string) => {
    const permString = `${module}:${action}`;
    setPermissions(prev => 
      prev.includes(permString) 
        ? prev.filter(p => p !== permString) 
        : [...prev, permString]
    );
  };

  const toggleRow = (module: string) => {
    const modulePerms = ACTIONS.map(a => `${module}:${a}`);
    const hasAll = modulePerms.every(p => permissions.includes(p));
    if (hasAll) {
      setPermissions(prev => prev.filter(p => !p.startsWith(`${module}:`)));
    } else {
      setPermissions(prev => [...new Set([...prev, ...modulePerms])]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ name, displayName, permissions });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Shield size={22} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} />
            Role & Permission Management
          </h1>
          <p className="page-subtitle text-muted text-sm">Define access levels using the RBAC matrix</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={16} /> Create Role
        </button>
      </div>

      <div className="surface-card">
        {isLoading ? (
          <div className="p-8 text-center text-muted"><Loader2 className="animate-spin inline" /> Loading roles...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Role Code</th>
                <th>Display Name</th>
                <th>Users Assigned</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles?.map((role: any) => (
                <tr key={role.id}>
                  <td className="font-mono font-semibold" style={{ color: 'var(--primary)' }}>{role.name}</td>
                  <td className="font-semibold">{role.displayName}</td>
                  <td>
                    <span className="badge badge-neutral">{role._count?.users || 0} Users</span>
                  </td>
                  <td>
                    <span className={`badge ${role.isActive ? 'badge-success' : 'badge-neutral'}`}>
                      {role.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={() => openModal(role)}>
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn btn-ghost text-danger" 
                        style={{ padding: '4px 8px' }} 
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this role?')) {
                            deleteMutation.mutate(role.id);
                          }
                        }}
                        disabled={role._count?.users > 0}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Role Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="surface-card" style={{ width: '90%', maxWidth: 800, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Key size={20} /> {editingRole ? 'Edit Role Permissions' : 'Create New Role'}
              </h2>
              <button className="btn btn-ghost" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="form-label">Role Code (e.g. TECH_LEAD)</label>
                  <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value.toUpperCase())} required />
                </div>
                <div>
                  <label className="form-label">Display Name</label>
                  <input type="text" className="form-input" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Permission Matrix</h3>
                <table className="data-table" style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={{ width: '30%' }}>Module</th>
                      {ACTIONS.map(a => <th key={a} style={{ textAlign: 'center' }}>{a}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {MODULES.map(module => {
                      const allChecked = ACTIONS.every(a => permissions.includes(`${module}:${a}`));
                      return (
                        <tr key={module}>
                          <td style={{ fontWeight: 600 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={allChecked}
                                onChange={() => toggleRow(module)}
                                style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
                              />
                              {module}
                            </label>
                          </td>
                          {ACTIONS.map(action => (
                            <td key={action} style={{ textAlign: 'center' }}>
                              <label style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer', padding: 8 }}>
                                <input 
                                  type="checkbox" 
                                  checked={permissions.includes(`${module}:${action}`)}
                                  onChange={() => togglePermission(module, action)}
                                  style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
                                />
                              </label>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
