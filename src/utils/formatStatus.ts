export function formatStatus(status: string | null | undefined): string {
  if (!status) return 'Unknown';
  
  // Mapping internal DB statuses to the exact User requested Status Mapping
  const map: Record<string, string> = {
    // PR
    'DRAFT': 'Draft',
    'PENDING': 'Pending Approval',
    'PENDING_APPROVAL': 'Pending Approval',
    'APPROVED': 'Approved',
    'REJECTED': 'Rejected',
    'CONVERTED_TO_PO': 'Converted to PO',
    
    // PO
    'ISSUED': 'Issued',
    'PARTIAL_PO': 'Partially Received',
    'PARTIALLY_RECEIVED': 'Partially Received',
    'OPEN': 'Open',
    'CLOSED': 'Closed',
    
    // GRN
    'RECEIVED': 'Received',
    'INSPECTION_PENDING': 'Inspection Pending',
    'PENDING': 'Inspection Pending',
    'ACCEPTED': 'Accepted',
    
    // Asset & Equipment
    'CREATED': 'Created',
    'CAPITALIZED': 'Capitalized',
    'INSTALLED': 'Installed',
    'ACTIVE': 'Active',
    'UNDER_REPAIR': 'Under Repair',
    'BREAKDOWN': 'Breakdown',
    'UNDER_MAINTENANCE': 'Under Maintenance',
    'RETIRED': 'Retired',
    
    // PM Plan
    'DUE': 'Due',
    'OVERDUE': 'Overdue',
    
    // Work Order
    'ASSIGNED': 'Assigned',
    'IN_PROGRESS': 'In Progress',
    'COMPLETED': 'Completed',
    'VERIFIED': 'Verified'
  };

  if (map[status]) {
    return map[status];
  }

  // Fallback title case format
  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
