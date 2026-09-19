import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2, ArrowLeft, Loader2, Save } from 'lucide-react';
import { purchaseApi } from '../../api/purchase.api';

const lineSchema = z.object({
  itemType: z.enum(['ASSET', 'INVENTORY_ITEM', 'SERVICE']),
  itemDescription: z.string().min(1, 'Required'),
  receivedQty: z.number().min(1, 'Min 1'),
  serialNo: z.string().optional(),
  modelNo: z.string().optional(),
  manufacturer: z.string().optional(),
});

const schema = z.object({
  vendorId: z.number().min(1, 'Vendor required'),
  poId: z.number().min(1, 'PO required'),
  grnType: z.enum(['ASSET', 'INVENTORY', 'SERVICE']),
  notes: z.string().optional(),
  lines: z.array(lineSchema).min(1, 'At least one item required'),
});

type FormData = z.infer<typeof schema>;

export default function GRNCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { data: vendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: purchaseApi.getVendors,
  });

  const { data: pos } = useQuery({
    queryKey: ['pos'],
    queryFn: purchaseApi.getPos,
  });

  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      grnType: 'ASSET',
      lines: [{ itemType: 'ASSET', itemDescription: '', receivedQty: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lines',
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      // In a real app we might fetch the PO lines first and populate them.
      // Here we just map the data to the API expectation.
      await purchaseApi.createGrn(data as any); // Any because we need to map types to backend if slightly different
      navigate('/purchase/grn');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create GRN');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title">Receive Goods (GRN)</h1>
          <p className="page-subtitle text-muted text-sm">Record receipt of assets or inventory items</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="surface-card" style={{ padding: 'var(--space-6)' }}>
        <h3 className="font-semibold mb-4" style={{ marginBottom: 'var(--space-4)' }}>Receipt Details</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div className="form-group">
            <label className="form-label">Vendor</label>
            <select className="input" {...register('vendorId', { valueAsNumber: true })}>
              <option value="">Select Vendor...</option>
              {vendors?.map((v: any) => (
                <option key={v.id} value={v.id}>{v.name} ({v.code})</option>
              ))}
            </select>
            {errors.vendorId && <span className="form-error">{errors.vendorId.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Reference PO</label>
            <select className="input" {...register('poId', { valueAsNumber: true })}>
              <option value="">Select Purchase Order...</option>
              {pos?.map((p: any) => (
                <option key={p.id} value={p.id}>{p.poNo} - {p.vendor?.name}</option>
              ))}
            </select>
            {errors.poId && <span className="form-error">{errors.poId.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">GRN Type</label>
            <select className="input" {...register('grnType')}>
              <option value="ASSET">New Asset</option>
              <option value="INVENTORY">Inventory / Spare Parts</option>
              <option value="SERVICE">Service</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Notes</label>
            <textarea className="input" rows={2} {...register('notes')} placeholder="Delivery notes, vehicle number, etc." />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 className="font-semibold">Received Items</h3>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => append({ itemType: watch('grnType') === 'ASSET' ? 'ASSET' : 'INVENTORY_ITEM', itemDescription: '', receivedQty: 1 })}
          >
            <Plus size={14} /> Add Row
          </button>
        </div>

        <table className="data-table mb-4">
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Type</th>
              <th style={{ width: '25%' }}>Description</th>
              <th style={{ width: '10%' }}>Rcv Qty</th>
              <th style={{ width: '15%' }}>Serial No</th>
              <th style={{ width: '15%' }}>Batch No</th>
              <th style={{ width: '15%' }}>Model No</th>
              <th style={{ width: '15%' }}>Manufacturer</th>
              <th style={{ width: '5%' }}></th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td>
                  <select className="input" {...register(`lines.${index}.itemType`)}>
                    <option value="ASSET">Asset</option>
                    <option value="INVENTORY_ITEM">Spare</option>
                  </select>
                </td>
                <td>
                  <input type="text" className={`input ${errors.lines?.[index]?.itemDescription ? 'input-error' : ''}`} placeholder="Item desc" {...register(`lines.${index}.itemDescription`)} />
                </td>
                <td>
                  <input type="number" className="input" min="1" step="0.01" {...register(`lines.${index}.receivedQty`, { valueAsNumber: true })} />
                </td>
                <td>
                  <input type="text" className="input" placeholder="S/N" {...register(`lines.${index}.serialNo`)} />
                </td>
                <td>
                  <input type="text" className="input" placeholder="Batch" {...register(`lines.${index}.batchNo`)} />
                </td>
                <td>
                  <input type="text" className="input" placeholder="Model" {...register(`lines.${index}.modelNo`)} />
                </td>
                <td>
                  <input type="text" className="input" placeholder="Make" {...register(`lines.${index}.manufacturer`)} />
                </td>
                <td className="text-center">
                  <button type="button" className="btn-icon text-danger" onClick={() => remove(index)} disabled={fields.length === 1}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {errors.lines?.root && <div className="text-danger text-sm mb-4">{errors.lines.root.message}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Confirm Receipt
          </button>
        </div>
      </form>
    </div>
  );
}
