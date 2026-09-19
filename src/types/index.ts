// ============================================================
// CORE TYPES — Enterprise Asset Inventory
// ============================================================

export type AssetType =
  | 'field'
  | 'well_cluster'
  | 'equipment'
  | 'location'
  | 'assembly'
  | 'component'
  | 'sensor'
  | 'structure';

export type AssetStatus =
  | 'operational'
  | 'maintenance'
  | 'critical'
  | 'decommissioned'
  | 'standby'
  | 'inspection_due';

export type AssetPhase =
  | 'planned'
  | 'partially_operational'
  | 'fully_operational'
  | 'sold'
  | 'decommissioned';

export type RiskLevel = 'very_high' | 'high' | 'medium' | 'low' | 'very_low';

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface AttributeValue {
  key: string;
  label: string;
  value: string | number | boolean | null;
  unit?: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'enum';
  isDefault?: boolean;
  group?: string;
}

export interface Partner {
  id: string;
  name: string;
  role: string;
  contactEmail?: string;
}

export interface Asset {
  id: string;
  name: string;
  shortName: string;
  assetType: AssetType;
  parentId: string | null;
  path: string[];               // IDs from root to this node
  hierarchyLabel: string;       // e.g. "PUMP / POSITIVE_DISPLACEMENT_PUMP / 200 Series"
  status: AssetStatus;
  phase: AssetPhase;
  description?: string;
  imageUrl?: string;
  iconType: string;             // maps to icon component

  // Identification
  externalId?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installDate?: string;
  languages?: string[];

  // Attributes
  attributes: AttributeValue[];
  attributesTotal: number;
  attributesWithoutValue: number;
  attributesChangedFromDefault: number;

  // Risk
  riskScore?: number;
  riskLevel?: RiskLevel;
  normalizedRisk?: number;

  // Maintenance
  nextInspectionDate?: string;
  lastMaintenanceDate?: string;
  nextWorkOrderId?: string;

  // Location
  location?: GeoLocation;
  locationLabel?: string;

  // Sharing
  partners?: Partner[];
  sharedWithCount?: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Children (for tree)
  children?: Asset[];
}

// ── Work Orders ──────────────────────────────────────────────

export type WorkOrderType = 'preventive' | 'corrective' | 'predictive' | 'inspection' | 'emergency';
export type WorkOrderStatus = 'planned' | 'in_progress' | 'completed' | 'verified' | 'cancelled' | 'overdue';
export type WorkOrderPriority = 'critical' | 'high' | 'medium' | 'low';

export interface WorkOrder {
  id: string;
  title: string;
  assetId: string;
  assetName: string;
  type: WorkOrderType;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  assignedTo: string;
  plannedDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedHours: number;
  actualHours?: number;
  description: string;
  notes?: string;
  remainingDays: number;
  createdAt: string;
}

// ── RCM Assessment ───────────────────────────────────────────

export type RCMStatus = 'draft' | 'in_process' | 'completed' | 'approved';
export type FailureType = 'breakdown' | 'low_output' | 'total_loss' | 'partial_loss' | 'degraded';
export type RecommendationType = 'proactive' | 'reactive';
export type MaintenanceSubtype = 'condition' | 'calendar' | 'repair' | 'inspection' | 'redesign';

export interface RCMRecommendation {
  id: string;
  title: string;
  functionalFailure: string;
  failureMode: string;
  failureModeCode: string;
  type: RecommendationType;
  subtype: MaintenanceSubtype;
  cycleValue?: number;
  cycleUnit?: string;
  mat?: string;
  hasFailureData: boolean;
}

export interface RCMNode {
  id: string;
  label: string;
  code: string;
  level: 'asset' | 'function' | 'failure';
  children?: RCMNode[];
  recommendations?: RCMRecommendation[];
  codeGroupId?: string;
  codeGroupDesc?: string;
}

export interface RCMAssessment {
  id: string;
  assetId: string;
  assetName: string;
  title: string;
  status: RCMStatus;
  hierarchy: RCMNode[];
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
}

// ── Dashboard ────────────────────────────────────────────────

export interface KPICard {
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  icon?: string;
}

export interface AttributeChangePoint {
  month: string;
  count: number;
  highest: number;
}

// ── Notification ──────────────────────────────────────────────

export type NotificationType = 'alert' | 'info' | 'success' | 'warning';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  assetId?: string;
  assetName?: string;
  read: boolean;
  createdAt: string;
}

// ── Navigation ───────────────────────────────────────────────

export type TabId =
  | 'information'
  | 'structure'
  | 'documentation'
  | 'monitoring'
  | 'maintenance'
  | 'assessment'
  | 'analytics'
  | 'erp';

export interface NavTab {
  id: TabId;
  label: string;
}
