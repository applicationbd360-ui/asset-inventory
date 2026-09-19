import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Package, Plus, Filter, AlertTriangle, X } from 'lucide-react';
import { inventoryApi } from '../../api/inventory.api';
import { Link } from 'react-router-dom';

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', uom: 'PCS', minStockLevel: '', unitPrice: '' });
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: inventoryApi.getItems,
  });

  const createItemMutation = useMutation({
    mutationFn: inventoryApi.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      setIsModalOpen(false);
      setNewItem({ name: '', description: '', uom: 'PCS', minStockLevel: '', unitPrice: '' });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createItemMutation.mutate({
      name: newItem.name,
      description: newItem.description,
      uom: newItem.uom,
      minStockLevel: newItem.minStockLevel ? Number(newItem.minStockLevel) : 0,
      unitPrice: newItem.unitPrice ? Number(newItem.unitPrice) : 0,
    });
  };

  const filteredItems = items?.filter((item: any) =>
    item.itemCode.toLowerCase().includes(search.toLowerCase()) ||
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Master</h1>
          <p className="page-subtitle text-muted text-sm">Manage spare parts and consumables stock levels</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>

      <div className="surface-card pr-list-container">
        <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search Item Code or Name..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', marginLeft: 'var(--space-2)' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="table-wrapper">
          {isLoading ? (
            <div className="p-8 text-center text-muted">Loading inventory items...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>UOM</th>
                  <th>Current Stock</th>
                  <th>Min Level</th>
                  <th>Unit Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-muted">No items found</td>
                  </tr>
                ) : (
                  filteredItems?.map((item: any) => {
                    const isLowStock = item.currentStock <= item.minStockLevel;
                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="flex align-center gap-2 font-semibold" style={{ color: 'var(--color-primary)' }}>
                            <Package size={16} />
                            {item.itemCode}
                          </div>
                        </td>
                        <td className="font-semibold">{item.name}</td>
                        <td>{item.category?.name || 'Uncategorized'}</td>
                        <td>{item.uom}</td>
                        <td className={`font-bold text-right ${isLowStock ? 'text-danger' : 'text-success'}`}>
                          {item.currentStock}
                          {isLowStock && <AlertTriangle size={14} style={{ display: 'inline', marginLeft: '4px' }} />}
                        </td>
                        <td className="text-right">{item.minStockLevel}</td>
                        <td className="text-right">৳ {Number(item.unitPrice).toLocaleString()}</td>
                        <td>
                          <span className={`badge ${isLowStock ? 'badge-danger' : 'badge-success'}`}>
                            {isLowStock ? 'LOW STOCK' : 'IN STOCK'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Add New Inventory Item</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. SKF Bearing 6205"
                    value={newItem.name}
                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Optional description"
                    value={newItem.description}
                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label>UOM (Unit of Measure)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. PCS, LTR, KG"
                      value={newItem.uom}
                      onChange={e => setNewItem({ ...newItem, uom: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Min Stock Level</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      placeholder="0"
                      value={newItem.minStockLevel}
                      onChange={e => setNewItem({ ...newItem, minStockLevel: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Unit Price (৳)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    placeholder="0.00"
                    value={newItem.unitPrice}
                    onChange={e => setNewItem({ ...newItem, unitPrice: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={createItemMutation.isPending}>
                  {createItemMutation.isPending ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
