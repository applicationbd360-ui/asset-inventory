import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, ArrowLeft, Loader2, Save } from 'lucide-react';
import { purchaseApi } from '../../api/purchase.api';

const lineSchema = z.object({
  itemType: z.enum(['ASSET', 'INVENTORY_ITEM', 'SERVICE']),
  itemDescription: z.string().min(1, 'Description required'),
  quantity: z.number().min(1, 'Min 1'),
  estimatedUnitPrice: z.number().min(0, 'Min 0'),
  uomCode: z.string().optional(),
});

const schema = z.object({
  sourceModule: z.string().min(1, 'Required'),
  sourceDocType: z.string().optional(),
  costCenterId: z.coerce.number().optional(),
  prType: z.enum(['ASSET', 'SPARE', 'SERVICE', 'AMC']),
  justification: z.string().optional(),
  requiredDate: z.string().optional(),
  lines: z.array(lineSchema).min(1, 'At least one item required'),
});

type FormData = z.infer<typeof schema>;

export default function PRCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      sourceModule: 'EAM',
      prType: 'ASSET',
      lines: [{ itemType: 'ASSET', itemDescription: '', quantity: 1, estimatedUnitPrice: 0, uomCode: 'PCS' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lines',
  });

  const lines = watch('lines');
  const totalAmount = lines.reduce((sum, line) => sum + (Number(line.quantity) || 0) * (Number(line.estimatedUnitPrice) || 0), 0);

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      await purchaseApi.createPr(data);
      navigate('/purchase/pr');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create PR');
    }
  };

  return (
    <div className="pr-create-page animate-fade-in">
      <div className="page-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title">Create Purchase Requisition</h1>
          <p className="page-subtitle text-muted text-sm">Fill details to request new assets or services</p>
        </div>
      </div>

      {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="surface-card" style={{ padding: 'var(--space-6)' }}>
        <h3 className="font-semibold mb-4" style={{ marginBottom: 'var(--space-4)' }}>Basic Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div className="form-group">
            <label className="form-label">PR Type</label>
            <select className="input" {...register('prType')}>
              <option value="ASSET">New Asset</option>
              <option value="SPARE">Spare Part / Inventory</option>
              <option value="SERVICE">Service</option>
              <option value="AMC">AMC / Contract</option>
            </select>
            {errors.prType && <span className="form-error">{errors.prType.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Source Module</label>
            <select className="input" {...register('sourceModule')}>
              <option value="EAM">EAM (Maintenance)</option>
              <option value="INVENTORY">Inventory</option>
              <option value="PROJECT">Project / Facility</option>
              <option value="DEPARTMENT">Department</option>
              <option value="PURCHASE">Purchase</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Source Document (Optional)</label>
            <input type="text" className="input" {...register('sourceDocType')} placeholder="e.g. Work Order / Asset Request" />
          </div>

          <div className="form-group">
            <label className="form-label">Cost Center ID</label>
            <input type="number" className="input" {...register('costCenterId')} placeholder="e.g. 1 (ICU / OT)" />
          </div>

          <div className="form-group">
            <label className="form-label">Required Date</label>
            <input type="date" className="input" {...register('requiredDate')} />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Justification / Purpose</label>
            <textarea className="input" rows={2} {...register('justification')} placeholder="Why is this required?" />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 className="font-semibold">Requisition Items</h3>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => append({ itemType: watch('prType') === 'ASSET' ? 'ASSET' : 'INVENTORY_ITEM', itemDescription: '', quantity: 1, estimatedUnitPrice: 0, uomCode: 'PCS' })}
          >
            <Plus size={14} /> Add Row
          </button>
        </div>

        <table className="data-table mb-4">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Item Type</th>
              <th style={{ width: '35%' }}>Description</th>
              <th style={{ width: '15%' }}>Qty</th>
              <th style={{ width: '20%' }}>Est. Unit Price</th>
              <th style={{ width: '10%' }}></th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td>
                  <select className="input" {...register(`lines.${index}.itemType`)}>
                    <option value="ASSET">Asset</option>
                    <option value="INVENTORY_ITEM">Spare/Item</option>
                    <option value="SERVICE">Service</option>
                  </select>
                </td>
                <td>
                  <input type="text" className={`input ${errors.lines?.[index]?.itemDescription ? 'input-error' : ''}`} placeholder="Item name/spec" {...register(`lines.${index}.itemDescription`)} />
                </td>
                <td>
                  <input type="number" className="input" min="1" step="0.01" {...register(`lines.${index}.quantity`, { valueAsNumber: true })} />
                </td>
                <td>
                  <input type="number" className="input" min="0" step="0.01" {...register(`lines.${index}.estimatedUnitPrice`, { valueAsNumber: true })} />
                </td>
                <td className="text-center">
                  <button type="button" className="btn-icon text-danger" onClick={() => remove(index)} disabled={fields.length === 1}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right font-semibold">Total Estimated Amount:</td>
              <td className="font-bold text-primary text-lg">৳ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        {errors.lines?.root && <div className="text-danger text-sm mb-4">{errors.lines.root.message}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save & Create PR
          </button>
        </div>
      </form>
    </div>
  );
}
