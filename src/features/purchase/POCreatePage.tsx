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
  orderedQty: z.number().min(1, 'Min 1'),
  unitPrice: z.number().min(0, 'Min 0'),
  taxAmount: z.number().min(0).default(0),
  uomCode: z.string().optional(),
});

const schema = z.object({
  vendorId: z.number().min(1, 'Vendor required'),
  poType: z.enum(['ASSET', 'SPARE', 'SERVICE', 'AMC']),
  expectedDeliveryDate: z.string().optional(),
  paymentTerms: z.string().optional(),
  warrantyTerms: z.string().optional(),
  amcTerms: z.string().optional(),
  deliveryLocationId: z.coerce.number().optional(),
  notes: z.string().optional(),
  lines: z.array(lineSchema).min(1, 'At least one item required'),
});

type FormData = z.infer<typeof schema>;

export default function POCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { data: vendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: purchaseApi.getVendors,
  });

  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      poType: 'ASSET',
      lines: [{ itemType: 'ASSET', itemDescription: '', orderedQty: 1, unitPrice: 0, taxAmount: 0, uomCode: 'PCS' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lines',
  });

  const lines = watch('lines');
  const totalAmount = lines.reduce((sum, line) => {
    const qty = Number(line.orderedQty) || 0;
    const price = Number(line.unitPrice) || 0;
    const tax = Number(line.taxAmount) || 0;
    return sum + (qty * price) + tax;
  }, 0);

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      await purchaseApi.createPo(data);
      navigate('/purchase/po');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create PO');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title">Create Purchase Order</h1>
          <p className="page-subtitle text-muted text-sm">Issue order to vendor for items or services</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="surface-card" style={{ padding: 'var(--space-6)' }}>
        <h3 className="font-semibold mb-4" style={{ marginBottom: 'var(--space-4)' }}>Order Details</h3>
        
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
            <label className="form-label">PO Type</label>
            <select className="input" {...register('poType')}>
              <option value="ASSET">New Asset</option>
              <option value="SPARE">Spare Part / Inventory</option>
              <option value="SERVICE">Service</option>
              <option value="AMC">AMC / Contract</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Expected Delivery Date</label>
            <input type="date" className="input" {...register('expectedDeliveryDate')} />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Terms</label>
            <input type="text" className="input" {...register('paymentTerms')} placeholder="e.g. Net 30 / Advance" />
          </div>

          <div className="form-group">
            <label className="form-label">Warranty Terms</label>
            <input type="text" className="input" {...register('warrantyTerms')} placeholder="e.g. 1 Year Comprehensive" />
          </div>

          <div className="form-group">
            <label className="form-label">AMC Terms</label>
            <input type="text" className="input" {...register('amcTerms')} placeholder="e.g. 3 Years Post Warranty" />
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Location ID</label>
            <input type="number" className="input" {...register('deliveryLocationId')} placeholder="e.g. 1 (Central Store)" />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Notes / Instructions</label>
            <textarea className="input" rows={2} {...register('notes')} placeholder="Special instructions for vendor..." />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 className="font-semibold">Order Items</h3>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => append({ itemType: watch('poType') === 'ASSET' ? 'ASSET' : 'INVENTORY_ITEM', itemDescription: '', orderedQty: 1, unitPrice: 0, taxAmount: 0, uomCode: 'PCS' })}
          >
            <Plus size={14} /> Add Row
          </button>
        </div>

        <table className="data-table mb-4">
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Type</th>
              <th style={{ width: '30%' }}>Description</th>
              <th style={{ width: '10%' }}>Qty</th>
              <th style={{ width: '15%' }}>Unit Price</th>
              <th style={{ width: '15%' }}>Tax Amt</th>
              <th style={{ width: '10%' }}>Line Total</th>
              <th style={{ width: '5%' }}></th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => {
              const qty = Number(watch(`lines.${index}.orderedQty`)) || 0;
              const price = Number(watch(`lines.${index}.unitPrice`)) || 0;
              const tax = Number(watch(`lines.${index}.taxAmount`)) || 0;
              const lineTotal = (qty * price) + tax;

              return (
                <tr key={field.id}>
                  <td>
                    <select className="input" {...register(`lines.${index}.itemType`)}>
                      <option value="ASSET">Asset</option>
                      <option value="INVENTORY_ITEM">Spare/Item</option>
                      <option value="SERVICE">Service</option>
                    </select>
                  </td>
                  <td>
                    <input type="text" className={`input ${errors.lines?.[index]?.itemDescription ? 'input-error' : ''}`} placeholder="Item desc" {...register(`lines.${index}.itemDescription`)} />
                  </td>
                  <td>
                    <input type="number" className="input" min="1" step="0.01" {...register(`lines.${index}.orderedQty`, { valueAsNumber: true })} />
                  </td>
                  <td>
                    <input type="number" className="input" min="0" step="0.01" {...register(`lines.${index}.unitPrice`, { valueAsNumber: true })} />
                  </td>
                  <td>
                    <input type="number" className="input" min="0" step="0.01" {...register(`lines.${index}.taxAmount`, { valueAsNumber: true })} />
                  </td>
                  <td className="font-semibold text-right">
                    ৳ {lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-center">
                    <button type="button" className="btn-icon text-danger" onClick={() => remove(index)} disabled={fields.length === 1}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} className="text-right font-semibold">Total PO Amount:</td>
              <td className="font-bold text-primary text-lg text-right">৳ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        {errors.lines?.root && <div className="text-danger text-sm mb-4">{errors.lines.root.message}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Confirm & Save PO
          </button>
        </div>
      </form>
    </div>
  );
}
