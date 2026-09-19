import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AssetIQBot from '../ui/AssetIQBot';
import './AppShell.css';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />
      <div className="app-main">
        <Header onSidebarToggle={() => setSidebarCollapsed((c) => !c)} />
        <main className="app-content">
          {children}
        </main>
      </div>
      <AssetIQBot />
    </div>
  );
}
