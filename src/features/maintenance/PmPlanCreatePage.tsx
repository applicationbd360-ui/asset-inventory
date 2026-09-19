import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save, ArrowLeft } from 'lucide-react';
import { maintenanceApi } from '../../api/maintenance.api';
import { Link } from 'react-router-dom';

export default function PmPlanCreatePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    planName: '',
    equipmentId: '',
    frequencyType: 'CALENDAR_DAYS',
    frequencyValue: '',
    responsibleTeam: '',
    advanceCreateDays: 7,
    nextDueDate: '',
  });

  const { data: equipments } = useQuery({
    queryKey: ['equipments'],
    queryFn: maintenanceApi.getEquipments,
  });

  const createMutation = useMutation({
    mutationFn: maintenanceApi.createPmPlan,
    onSuccess: () => {
      navigate('/maintenance/pm-plans');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header">
        <div>
          <div className="flex align-center gap-2 mb-2">
            <Link to="/maintenance/pm-plans" className="text-muted hover:text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="page-title">Create PM Plan</h1>
          </div>
          <p className="page-subtitle text-muted text-sm">Set up a new preventive maintenance schedule</p>
        </div>
      </div>

      <div className="surface-card p-6 max-w-3xl">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label>Plan Name <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.planName}
                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                placeholder="e.g. Monthly HVAC Inspection"
              />
            </div>

            <div className="form-group">
              <label>Target Equipment <span className="text-danger">*</span></label>
              <select
                className="form-control"
                required
                value={formData.equipmentId}
                onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
              >
                <option value="">Select Equipment...</option>
                {equipments?.map((eq: any) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name} ({eq.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Frequency Type <span className="text-danger">*</span></label>
              <select
                className="form-control"
                required
                value={formData.frequencyType}
                onChange={(e) => setFormData({ ...formData, frequencyType: e.target.value })}
              >
                <option value="CALENDAR_DAYS">Calendar Days</option>
                <option value="CALENDAR_MONTHS">Calendar Months</option>
                <option value="OPERATING_HOURS">Operating Hours</option>
              </select>
            </div>

            <div className="form-group">
              <label>Frequency Value <span className="text-danger">*</span></label>
              <input
                type="number"
                className="form-control"
                required
                min="1"
                value={formData.frequencyValue}
                onChange={(e) => setFormData({ ...formData, frequencyValue: e.target.value })}
                placeholder="e.g. 30 (for every 30 days)"
              />
            </div>

            <div className="form-group">
              <label>First Due Date <span className="text-danger">*</span></label>
              <input
                type="date"
                className="form-control"
                required
                value={formData.nextDueDate}
                onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Responsible Team</label>
              <input
                type="text"
                className="form-control"
                value={formData.responsibleTeam}
                onChange={(e) => setFormData({ ...formData, responsibleTeam: e.target.value })}
                placeholder="e.g. Mechanical Team"
              />
            </div>
            
            <div className="form-group">
              <label>Advance Generation Days</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={formData.advanceCreateDays}
                onChange={(e) => setFormData({ ...formData, advanceCreateDays: Number(e.target.value) })}
                placeholder="Days before due date to create WO"
              />
            </div>
          </div>

          <div className="form-actions mt-4 flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <Link to="/maintenance/pm-plans" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createMutation.isPending}
            >
              <Save size={16} />
              {createMutation.isPending ? 'Saving...' : 'Save Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
