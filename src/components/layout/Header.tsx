import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Bell, Menu, LogOut, User, Settings, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { authApi } from '../../api/auth.api';
import { systemApi } from '../../api/system.api';
import { useTheme } from '../../context/ThemeContext';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/equipment': 'Equipment',
  '/purchase/pr': 'Purchase Requisitions',
  '/purchase/po': 'Purchase Orders',
  '/purchase/grn': 'Goods Receipt',
  '/work-orders': 'Work Orders',
  '/inventory': 'Inventory',
  '/finance/assets': 'Fixed Assets',
  '/finance/journals': 'Journals',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

interface HeaderProps {
  onSidebarToggle: () => void;
}

export default function Header({ onSidebarToggle }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { theme, toggleTheme } = useTheme();

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: systemApi.getNotifications,
    refetchInterval: 30000 // Poll every 30s
  });

  const currentPage = breadcrumbMap[location.pathname] || 'AssetSync';

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn('Backend logout failed, forcing client logout', e);
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="app-header">
      {/* Mobile sidebar toggle */}
      <button className="btn-icon" onClick={onSidebarToggle} id="sidebar-toggle-btn">
        <Menu size={18} />
      </button>

      {/* Breadcrumb */}
      <div className="header-breadcrumb">
        <span className="text-muted text-sm">AssetSync</span>
        <span className="text-muted text-sm">/</span>
        <span>{currentPage}</span>
      </div>

      {/* Search */}
      <div className="header-search">
        <Search size={14} className="header-search-icon" />
        <input
          id="global-search"
          type="text"
          className="header-search-input"
          placeholder="Search equipment, work orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="header-actions">
        {/* Theme Toggle */}
        <div className="tooltip-container">
          <button className="btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="tooltip">Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</div>
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <div className="header-notification-btn tooltip-container">
            <button className="btn-icon" id="notification-btn" onClick={() => setNotifMenuOpen(!notifMenuOpen)}>
              <Bell size={18} />
              {notifData?.unreadCount > 0 && <span className="notification-dot" />}
            </button>
            {!notifMenuOpen && <div className="tooltip">Notifications</div>}
          </div>

          {notifMenuOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setNotifMenuOpen(false)} />
              <div className="dropdown" style={{ zIndex: 100, minWidth: 300, right: 0 }}>
                <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="font-semibold text-sm">Notifications</div>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifData?.data?.map((n: any) => (
                    <div 
                      key={n.id} 
                      className={`dropdown-item ${!n.isRead ? 'font-semibold' : ''}`}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '12px' }}
                      onClick={async () => {
                        if (!n.isRead) {
                          await systemApi.markNotificationRead(n.id);
                        }
                      }}
                    >
                      <div className="text-sm">{n.title}</div>
                      <div className="text-xs text-muted mt-1">{n.message}</div>
                    </div>
                  ))}
                  {(!notifData?.data || notifData.data.length === 0) && (
                    <div className="p-4 text-center text-sm text-muted">No notifications</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            id="user-menu-btn"
            className="header-user-btn"
            onClick={() => setUserMenuOpen((o) => !o)}
          >
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <span className="user-name">{user?.name?.split(' ')[0]}</span>
              <span className="user-role">{user?.role?.displayName}</span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {userMenuOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="dropdown" style={{ zIndex: 100, minWidth: 200 }}>
                <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="font-semibold text-sm">{user?.name}</div>
                  <div className="text-xs text-muted">{user?.email}</div>
                </div>
                <button className="dropdown-item" onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}>
                  <User size={14} /> My Profile
                </button>
                <button className="dropdown-item" onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}>
                  <Settings size={14} /> Settings
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item" style={{ color: 'var(--color-danger)' }} onClick={handleLogout}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
