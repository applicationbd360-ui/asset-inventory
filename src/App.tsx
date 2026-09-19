import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuthStore } from './store/auth.store';
import AppShell from './components/layout/AppShell';
import LoadingScreen from './components/ui/LoadingScreen';
import {
  WorkOrderDetailPage as WorkOrderDetail
} from './features/placeholders';

// ── Lazy-loaded pages ────────────────────────────────────────
const LoginPage     = lazy(() => import('./features/auth/LoginPage'));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const AnalyticsPage = lazy(() => import('./features/dashboard/AnalyticsPage'));
const PRListPage    = lazy(() => import('./features/purchase/PRListPage'));
const PRCreatePage  = lazy(() => import('./features/purchase/PRCreatePage'));
const POListPage    = lazy(() => import('./features/purchase/POListPage'));
const POCreatePage  = lazy(() => import('./features/purchase/POCreatePage'));
const GRNListPage   = lazy(() => import('./features/purchase/GRNListPage'));
const GRNCreatePage = lazy(() => import('./features/purchase/GRNCreatePage'));
const FixedAssetPage = lazy(() => import('./features/finance/FixedAssetPage'));
const AssetCapitalizationPage = lazy(() => import('./features/finance/AssetCapitalizationPage'));
const JournalPage   = lazy(() => import('./features/finance/JournalPage'));
const MroFinancialPlanningPage = lazy(() => import('./features/finance/MroFinancialPlanningPage'));
const EquipmentListPage = lazy(() => import('./features/maintenance/EquipmentListPage'));
const EquipmentDetailPage = lazy(() => import('./features/maintenance/EquipmentDetailPage'));
const RiskAssessmentPage = lazy(() => import('./features/maintenance/RiskAssessmentPage'));
const WorkCenterUtilizationPage = lazy(() => import('./features/maintenance/WorkCenterUtilizationPage'));
const DispatchingBoardPage = lazy(() => import('./features/maintenance/DispatchingBoardPage'));
const ServiceAssetManagerPage = lazy(() => import('./features/maintenance/ServiceAssetManagerPage'));
const ServiceWorkOrderDetailPage = lazy(() => import('./features/maintenance/ServiceWorkOrderDetailPage'));
const OnSiteVisitFormPage = lazy(() => import('./features/maintenance/OnSiteVisitFormPage'));
const MaintenanceOrderCostsPage = lazy(() => import('./features/maintenance/MaintenanceOrderCostsPage'));
const TechnicalObjectDamagesPage = lazy(() => import('./features/maintenance/TechnicalObjectDamagesPage'));
const VendorListPage = lazy(() => import('./features/purchase/VendorListPage'));
const WorkOrderListPage = lazy(() => import('./features/maintenance/WorkOrderListPage'));
const WorkOrderCreatePage = lazy(() => import('./features/maintenance/WorkOrderCreatePage'));
const WorkOrderDetailPage = lazy(() => import('./features/maintenance/WorkOrderDetailPage'));
const PmPlanListPage = lazy(() => import('./features/maintenance/PmPlanListPage'));
const PmPlanCreatePage = lazy(() => import('./features/maintenance/PmPlanCreatePage'));
const InventoryPage = lazy(() => import('./features/inventory/InventoryPage'));
const SparePartsForecastingPage = lazy(() => import('./features/inventory/SparePartsForecastingPage'));
const ReportsPage   = lazy(() => import('./features/reports/ReportsPage'));
const SettingsPage  = lazy(() => import('./features/settings/SettingsPage'));
const AuditLogPage  = lazy(() => import('./features/settings/AuditLogPage'));
const UserManagementPage = lazy(() => import('./features/settings/UserManagementPage'));
const RoleManagementPage = lazy(() => import('./features/settings/RoleManagementPage'));
const AnalyticsDashboard = lazy(() => import('./features/analytics/AnalyticsDashboard'));
const HfmDashboardPage = lazy(() => import('./features/hfm/HfmDashboardPage'));
const BudgetPage    = lazy(() => import('./features/finance/BudgetPage'));
const VendorPortalPage = lazy(() => import('./features/vendor/VendorPortalPage'));

// ── Protected Route ──────────────────────────────────────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// ── App ───────────────────────────────────────────────────────
import GRNDetailsPage from './features/purchase/GRNDetailsPage';
import RFQListPage from './features/purchase/RFQListPage';
import RFQDetailsPage from './features/purchase/RFQDetailsPage';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <ThemeProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public */}
          <Route
            path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />

        {/* Protected — inside AppShell */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppShell>
                <Routes>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />

                  {/* Equipment */}
                  <Route path="equipment" element={<EquipmentListPage />} />
                  <Route path="equipment/:id" element={<EquipmentDetailPage />} />

                  <Route path="purchase/pr" element={<PRListPage />} />
                  <Route path="purchase/pr/create" element={<PRCreatePage />} />
                  <Route path="purchase/rfqs" element={<RFQListPage />} />
                  <Route path="purchase/rfqs/:id" element={<RFQDetailsPage />} />
                  <Route path="purchase/po" element={<POListPage />} />
                  <Route path="purchase/po/create" element={<POCreatePage />} />
                  <Route path="purchase/grn" element={<GRNListPage />} />
                  <Route path="purchase/grn/create" element={<GRNCreatePage />} />
                  <Route path="purchase/grn/:id" element={<GRNDetailsPage />} />
                  <Route path="purchase/vendors" element={<VendorListPage />} />

                  {/* Equipment Master */}
                  <Route path="maintenance/equipment" element={<EquipmentListPage />} />
                  <Route path="maintenance/equipment/:id" element={<EquipmentDetailPage />} />
                  
                  {/* Risk Assessments */}
                  <Route path="maintenance/risk-assessments" element={<RiskAssessmentPage />} />
                  <Route path="maintenance/work-center-utilization" element={<WorkCenterUtilizationPage />} />
                  <Route path="maintenance/dispatching-board" element={<DispatchingBoardPage />} />
                  <Route path="maintenance/service-asset-manager" element={<ServiceAssetManagerPage />} />
                  <Route path="maintenance/service-asset-manager/work-order/:id" element={<ServiceWorkOrderDetailPage />} />
                  <Route path="maintenance/service-asset-manager/form" element={<OnSiteVisitFormPage />} />
                  <Route path="maintenance/order-costs" element={<MaintenanceOrderCostsPage />} />
                  <Route path="maintenance/technical-object-damages" element={<TechnicalObjectDamagesPage />} />

                  {/* Work Orders */}
                  <Route path="work-orders" element={<WorkOrderListPage />} />
                  <Route path="work-orders/create" element={<WorkOrderCreatePage />} />
                  <Route path="work-orders/:id" element={<WorkOrderDetailPage />} />

                  {/* PM Plans */}
                  <Route path="maintenance/pm-plans" element={<PmPlanListPage />} />
                  <Route path="maintenance/pm-plans/create" element={<PmPlanCreatePage />} />

                  {/* Inventory */}
                  <Route path="inventory" element={<InventoryPage />} />
                  <Route path="inventory/forecasting" element={<SparePartsForecastingPage />} />

                  {/* Finance */}
                  <Route path="finance/assets" element={<FixedAssetPage />} />
                  <Route path="finance/assets/capitalize" element={<AssetCapitalizationPage />} />
                  <Route path="finance/journals" element={<JournalPage />} />
                  <Route path="finance/budget" element={<BudgetPage />} />
                  <Route path="finance/mro-planning" element={<MroFinancialPlanningPage />} />

                  {/* Reports */}
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="analytics" element={<AnalyticsDashboard />} />

                  {/* HFM */}
                  <Route path="hfm/dashboard" element={<HfmDashboardPage />} />

                  {/* Vendor Portal */}
                  <Route path="vendor-portal" element={<VendorPortalPage />} />

                  {/* Settings */}
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="settings/users" element={<UserManagementPage />} />
                  <Route path="settings/roles" element={<RoleManagementPage />} />
                  <Route path="settings/audit-logs" element={<AuditLogPage />} />

                  {/* 404 */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </AppShell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
    </ThemeProvider>
  );
}
