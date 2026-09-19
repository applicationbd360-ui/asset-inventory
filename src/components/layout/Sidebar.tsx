import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Cpu, ShoppingCart, FileText, Package,
  Wrench, BarChart3, Settings, ChevronLeft, ChevronRight, ChevronDown,
  ClipboardList, DollarSign, Activity, Users, Box, PieChart, Shield, Key, TrendingUp, Calendar, Map, BarChart2
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Master Data',
    items: [
      { label: 'Asset / Equipment', href: '/maintenance/equipment', icon: Cpu },
      { label: 'Item / Inventory', href: '/inventory', icon: Package },
      { label: 'Vendors', href: '/purchase/vendors', icon: Users },
    ],
  },
  {
    group: 'Asset Management',
    items: [
      { label: 'Dispatching Board', href: '/maintenance/dispatching-board', icon: Calendar },
      { label: 'Service & Asset Manager', href: '/maintenance/service-asset-manager', icon: Map },
      { label: 'Maintenance Order Costs', href: '/maintenance/order-costs', icon: BarChart2 },
      { label: 'Tech Object Damages', href: '/maintenance/technical-object-damages', icon: BarChart2 },
      { label: 'Work Center Utilization', href: '/maintenance/work-center-utilization', icon: Activity },
      { label: 'Risk Assessments', href: '/maintenance/risk-assessments', icon: Shield },
      { label: 'Work Orders', href: '/work-orders', icon: Wrench },
      { label: 'Forecasting', href: '/inventory/forecasting', icon: TrendingUp },
    ],
  },
  {
    group: 'Procurement',
    items: [
      { label: 'Requisitions', href: '/purchase/pr', icon: ClipboardList },
      { label: 'RFQs & Quotes', href: '/purchase/rfqs', icon: FileText },
      { label: 'Purchase Orders', href: '/purchase/po', icon: ShoppingCart },
      { label: 'Goods Receipt', href: '/purchase/grn', icon: ClipboardList },
    ],
  },
  {
    group: 'Facility Mgmt',
    items: [
      { label: 'HFM Dashboard', href: '/hfm/dashboard', icon: Activity },
    ],
  },
  {
    group: 'Finance',
    items: [
      { label: 'Fixed Assets',  href: '/finance/assets',  icon: DollarSign },
      { label: 'Budget',        href: '/finance/budget',  icon: PieChart },
      { label: 'MRO Planning',  href: '/finance/mro-planning', icon: Activity },
      { label: 'Journals',      href: '/finance/journals', icon: Activity },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { label: 'Reports', href: '/reports', icon: BarChart3 },
      { label: 'AI Analytics', href: '/analytics', icon: Activity },
    ],
  },
  {
    group: 'Administration',
    items: [
      { label: 'Settings',   href: '/settings',           icon: Settings },
      { label: 'Users',      href: '/settings/users',     icon: Users },
      { label: 'Roles',      href: '/settings/roles',     icon: Key },
      { label: 'Audit Log',  href: '/settings/audit-logs', icon: Shield },
    ],
  },
  {
    group: 'External / Partners',
    items: [
      { label: 'Vendor Portal', href: '/vendor-portal', icon: Users },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Auto-expand groups that contain the active item
  useEffect(() => {
    if (collapsed) return;
    const newExpanded = { ...expandedGroups };
    let hasChanges = false;
    navigation.forEach(group => {
      const hasActive = group.items.some(item => 
        item.href === '/dashboard' 
          ? location.pathname === '/dashboard' 
          : location.pathname.startsWith(item.href)
      );
      if (hasActive && !newExpanded[group.group]) {
        newExpanded[group.group] = true;
        hasChanges = true;
      }
    });
    // Ensure Overview is always expanded
    if (!newExpanded['Overview']) {
      newExpanded['Overview'] = true;
      hasChanges = true;
    }
    if (hasChanges) setExpandedGroups(newExpanded);
  }, [location.pathname, collapsed]);

  const toggleGroup = (groupName: string) => {
    if (collapsed) return; // Disable toggle when sidebar is collapsed
    setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const isActive = (href: string) =>
    href === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(href);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Box size={24} className="text-primary" />
        </div>
        <span className="sidebar-logo-text">AssetSync</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navigation.map((group) => {
          const isExpanded = expandedGroups[group.group] || collapsed;
          return (
            <div key={group.group} className="sidebar-group">
              <div 
                className={`sidebar-group-label ${collapsed ? 'collapsed' : 'clickable'}`}
                onClick={() => toggleGroup(group.group)}
                style={!collapsed ? { cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } : {}}
              >
                <span>{group.group}</span>
                {!collapsed && (
                  <ChevronDown 
                    size={14} 
                    style={{ 
                      transition: 'transform 0.2s', 
                      transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' 
                    }} 
                  />
                )}
              </div>
              
              <div 
                className="sidebar-group-items" 
                style={{ 
                  display: isExpanded ? 'block' : 'none',
                  animation: 'fadeIn 0.2s ease-in-out'
                }}
              >
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
                    style={!collapsed ? { paddingLeft: 'var(--space-3)' } : {}}
                  >
                    <item.icon className="sidebar-item-icon" size={18} />
                    <span className="sidebar-item-label">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="sidebar-item-badge">{item.badge}</span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="sidebar-toggle-btn">
        <button className="btn btn-ghost" style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }} onClick={onToggle}>
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span className="sidebar-item-label" style={{fontSize: 'var(--text-xs)'}}>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
