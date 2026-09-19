import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Plus, Edit, Trash2, Key, Loader2, Check, UserPlus } from 'lucide-react';
import { systemApi } from '../../api/system.api';

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  // Form State
  const [employeeCode, setEmployeeCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [isActive, setIsActive] = useState(true);

  // New Password State
  const [newPassword, setNewPassword] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['system-users'],
    queryFn: systemApi.getUsers
  });

  const { data: roles } = useQuery({
    queryKey: ['system-roles'],
    queryFn: systemApi.getRoles
  });

  const saveMutation = useMutation({
    mutationFn: (payload: any) => 
      editingUser 
        ? systemApi.updateUser(editingUser.id, payload)
        : systemApi.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      closeModal();
    },
    onError: (err: any) => alert(err.response?.data?.error?.message || 'Error saving user')
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (payload: any) => systemApi.resetPassword(payload.id, payload.password),
    onSuccess: () => {
      alert('Password reset successfully');
      closePasswordModal();
    },
    onError: (err: any) => alert(err.response?.data?.error?.message || 'Error resetting password')
  });

  const deactivateMutation = useMutation({
    mutationFn: systemApi.deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['system-users'] }),
  });

  const openModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setEmployeeCode(user.employeeCode || '');
      setName(user.name);
      setEmail(user.email);
      setRoleId(user.roleId.toString());
      setIsActive(user.isActive);
      setPassword('');
    } else {
      setEditingUser(null);
      setEmployeeCode('');
      setName('');
      setEmail('');
      setRoleId('');
      setIsActive(true);
      setPassword('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const openPasswordModal = (user: any) => {
    setEditingUser(user);
    setNewPassword('');
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleId) return alert('Please select a role');
    saveMutation.mutate({ 
      employeeCode, name, email, 
      roleId: parseInt(roleId), 
      isActive,
      ...(password && !editingUser ? { password } : {})
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) return alert('Password must be at least 6 characters');
    resetPasswordMutation.mutate({ id: editingUser.id, password: newPassword });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users size={22} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} />
            User Management
          </h1>
          <p className="page-subtitle text-muted text-sm">Manage employee access and roles</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <UserPlus size={16} /> Add User
        </button>
      </div>

      <div className="surface-card">
        {isLoading ? (
          <div className="p-8 text-center text-muted"><Loader2 className="animate-spin inline" /> Loading users...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Emp Code</th>
                <th>Name & Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user: any) => (
                <tr key={user.id}>
                  <td className="font-mono">{user.employeeCode || '—'}</td>
                  <td>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-muted">{user.email}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{user.role?.displayName || user.role?.name}</span>
                  </td>
                  <td>
                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="text-sm text-muted">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={() => openModal(user)} title="Edit User">
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-ghost" style={{ padding: '4px 8px', color: 'var(--warning)' }} onClick={() => openPasswordModal(user)} title="Reset Password">
                        <Key size={16} />
                      </button>
                      {user.isActive && (
                        <button 
                          className="btn btn-ghost text-danger" 
                          style={{ padding: '4px 8px' }} 
                          onClick={() => {
                            if (confirm('Deactivate this user?')) deactivateMutation.mutate(user.id);
                          }}
                          title="Deactivate User"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="surface-card" style={{ width: '90%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <h2 className="text-xl font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="btn btn-ghost" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="form-label">Employee Code</label>
                  <input type="text" className="form-input" value={employeeCode} onChange={e => setEmployeeCode(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Role *</label>
                  <select className="form-input" value={roleId} onChange={e => setRoleId(e.target.value)} required>
                    <option value="">Select Role...</option>
                    {roles?.map((r: any) => (
                      <option key={r.id} value={r.id}>{r.displayName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Full Name *</label>
                <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              <div>
                <label className="form-label">Email Address *</label>
                <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              {!editingUser && (
                <div>
                  <label className="form-label">Initial Password *</label>
                  <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                </div>
              )}

              {editingUser && (
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 8 }}>
                  <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{ width: 16, height: 16 }} />
                  <span style={{ fontWeight: 600 }}>Active Account</span>
                </label>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isPasswordModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="surface-card" style={{ width: '90%', maxWidth: 400 }}>
            <h2 className="text-xl font-bold mb-4 border-b pb-4">Reset Password</h2>
            <p className="text-sm mb-4">Set a new password for <strong>{editingUser?.name}</strong>.</p>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={closePasswordModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={resetPasswordMutation.isPending}>
                  {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
