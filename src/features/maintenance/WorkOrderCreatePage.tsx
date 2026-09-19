import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, X } from 'lucide-react';
import { maintenanceApi } from '../../api/maintenance.api';

export default function WorkOrderCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'PM',
    priority: 'MEDIUM',
    scheduledDate: '',
    equipmentId: ''
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => maintenanceApi.createWorkOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workorders'] });
      navigate('/work-orders');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      equipmentId: form.equipmentId ? Number(form.equipmentId) : undefined
    });
  };

  return (
    <div className="flex flex-col h-full bg-background -m-6 animate-fade-in" style={{ minHeight: 'calc(100vh - 64px)' }}>
      
      {/* Header Section */}
      <div className="bg-surface-1 px-8 py-6 border-b border-subtle sticky top-0 z-10">
        <h1 className="text-[1.75rem] font-bold text-primary tracking-tight">Create Maintenance Order</h1>
        <p className="text-muted text-[0.95rem] mt-1">Issue a new maintenance task or report a breakdown</p>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 pb-32">
        
        {/* General Information Block */}
        <div className="bg-surface-1 border border-subtle rounded-md shadow-sm">
          <div className="px-6 py-4 border-b border-subtle bg-surface-2">
            <h2 className="text-lg font-bold text-primary">General Information</h2>
          </div>
          
          <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-primary">Order Title <span className="text-danger">*</span></label>
              <input
                type="text"
                required
                placeholder="Brief summary of the issue or task"
                className="input-field bg-background border-subtle focus:border-blue-500 transition-colors"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-primary">Detailed Description</label>
              <textarea
                placeholder="Provide detailed steps, symptoms, or instructions..."
                className="input-field bg-background border-subtle focus:border-blue-500 transition-colors min-h-[120px] resize-y"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Planning Data Block */}
        <div className="bg-surface-1 border border-subtle rounded-md shadow-sm">
          <div className="px-6 py-4 border-b border-subtle bg-surface-2">
            <h2 className="text-lg font-bold text-primary">Planning Data</h2>
          </div>
          
          <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-primary">Target Equipment (Optional)</label>
              <select
                className="input-field bg-background border-subtle focus:border-blue-500 transition-colors"
                value={form.equipmentId}
                onChange={(e) => setForm({ ...form, equipmentId: e.target.value })}
              >
                <option value="">-- Select Equipment --</option>
                <option value="1">ICU Ventilator — Bed 01</option>
                <option value="2">Raw Water Pump 2</option>
                <option value="3">Main Air Compressor</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-primary">Order Type</label>
              <select
                className="input-field bg-background border-subtle focus:border-blue-500 transition-colors"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="PM">Preventive Maintenance (PM)</option>
                <option value="BREAKDOWN">Breakdown (BD)</option>
                <option value="INSPECTION">Inspection (IN)</option>
                <option value="CALIBRATION">Calibration (CAL)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-primary">Priority</label>
              <select
                className="input-field bg-background border-subtle focus:border-blue-500 transition-colors"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-primary">Scheduled Date</label>
              <input
                type="date"
                className="input-field bg-background border-subtle focus:border-blue-500 transition-colors"
                value={form.scheduledDate}
                onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Sticky Footer Actions */}
      <div className="bg-surface-1 border-t border-subtle p-6 flex justify-end gap-4 sticky bottom-0 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
        <button 
          type="button" 
          className="btn btn-secondary px-8 font-semibold flex items-center gap-2"
          onClick={() => navigate('/work-orders')}
        >
          <X size={16} /> Cancel
        </button>
        <button 
          type="button" 
          className="btn btn-primary px-8 font-semibold flex items-center gap-2"
          onClick={handleSubmit}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Saving...' : <><Save size={16} /> Save Order</>}
        </button>
      </div>

    </div>
  );
}
