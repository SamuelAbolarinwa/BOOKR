import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  SolidPlus,
  SolidTrash,
  SolidEdit,
  SolidClose,
  SolidAlertTriangle,
} from './ui/icons';
import { InventoryItem, UnitType } from '@/types';
import { db } from '@/lib/db';
import { formatMoney } from '@/lib/utils';

interface InventoryViewProps {
  inventory: InventoryItem[];
}

export const InventoryView: React.FC<InventoryViewProps> = ({ inventory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<UnitType>('piece');
  const [quantity, setQuantity] = useState('1');
  const [costNaira, setCostNaira] = useState('');
  const [sellingNaira, setSellingNaira] = useState('');

  const unitOptions: { label: string; value: UnitType }[] = [
    { label: 'Piece', value: 'piece' },
    { label: 'Pack', value: 'pack' },
    { label: 'Carton', value: 'carton' },
    { label: 'Mudu', value: 'mudu' },
    { label: 'Cup', value: 'cup' },
    { label: 'Paint Rubber', value: 'paint_rubber' },
    { label: 'Kg', value: 'kg' },
  ];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setUnit('piece');
    setQuantity('1');
    setCostNaira('');
    setSellingNaira('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setName(item.name);
    setUnit(item.unit);
    setQuantity(item.quantity.toString());
    setCostNaira((item.costPrice / 100).toString());
    setSellingNaira((item.sellingPrice / 100).toString());
    setIsModalOpen(true);
  };

  const handleAdjustStock = async (item: InventoryItem, delta: number) => {
    if (!item.id) return;
    const newQty = Math.max(0, item.quantity + delta);
    await db.inventory.update(item.id, {
      quantity: newQty,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (window.confirm('Delete this product?')) {
      await db.inventory.delete(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10) || 0;
    const costKobo = Math.round((parseFloat(costNaira) || 0) * 100);
    const sellKobo = Math.round((parseFloat(sellingNaira) || 0) * 100);

    if (editingItem && editingItem.id) {
      await db.inventory.update(editingItem.id, {
        name: name.trim(),
        unit,
        quantity: qty,
        costPrice: costKobo,
        sellingPrice: sellKobo,
        updatedAt: new Date().toISOString(),
      });
    } else {
      await db.inventory.add({
        name: name.trim(),
        unit,
        quantity: qty,
        costPrice: costKobo,
        sellingPrice: sellKobo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-3">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#5e6b64]">
          Items in stock ({inventory.length})
        </span>
        <Button variant="primary" size="sm" onClick={handleOpenAdd}>
          <SolidPlus className="w-3.5 h-3.5" />
          <span>Add Item</span>
        </Button>
      </div>

      {/* Inventory Feed */}
      {inventory.length === 0 ? (
        <div className="rounded-2xl p-8 bg-white text-center space-y-1 text-[#5e6b64]">
          <p className="text-xs font-bold text-[#18241f]">No items in stock</p>
          <p className="text-xs opacity-75">Tap "Add Item" above to track goods and quantities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {inventory.map((item) => {
            const isLowStock = item.quantity <= 2;

            return (
              <div
                key={item.id}
                className="rounded-2xl p-4 bg-white space-y-2.5 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#18241f]">{item.name}</h4>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/[0.04] text-[#5e6b64]">
                      Per {item.unit.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="w-7 h-7 rounded-full text-[#5e6b64] hover:text-[#0f382c] hover:bg-black/[0.05] flex items-center justify-center cursor-pointer transition-colors"
                      title="Edit"
                    >
                      <SolidEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-7 h-7 rounded-full text-[#5e6b64]/40 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-colors"
                      title="Delete"
                    >
                      <SolidTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pricing info */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-black/[0.03] text-xs">
                  <div>
                    <span className="text-[10px] text-[#5e6b64] block">Cost:</span>
                    <div className="font-bold text-[#18241f] text-xs mt-0.5">{formatMoney(item.costPrice)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5e6b64] block">Selling:</span>
                    <div className="font-bold text-[#0f382c] text-xs mt-0.5">{formatMoney(item.sellingPrice)}</div>
                  </div>
                </div>

                {/* Stock Level & Stepper */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-1.5">
                    {isLowStock && (
                      <SolidAlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span className={`text-xs font-bold ${isLowStock ? 'text-amber-800' : 'text-[#18241f]'}`}>
                      {item.quantity} in stock
                    </span>
                  </div>

                  {/* Stepper */}
                  <div className="inline-flex items-center rounded-full bg-black/[0.05] p-1">
                    <button
                      onClick={() => handleAdjustStock(item, -1)}
                      className="w-6 h-6 rounded-full bg-white text-xs font-bold text-[#18241f] hover:bg-black/5 active:scale-90 transition-all flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2.5 text-xs font-bold text-[#18241f]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleAdjustStock(item, 1)}
                      className="w-6 h-6 rounded-full bg-white text-xs font-bold text-[#18241f] hover:bg-black/5 active:scale-90 transition-all flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Item Bottom Sheet */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-t-[32px] sm:rounded-3xl max-w-md w-full p-6 sm:p-7 text-[#18241f] animate-liquid-spring">
            
            <div className="w-10 h-1 rounded-full bg-black/15 mx-auto mb-4" />

            <div className="flex items-center justify-between pb-2">
              <h3 className="text-base font-extrabold text-[#0f382c]">
                {editingItem ? 'Edit item' : 'Add item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/[0.04] text-[#5e6b64] hover:text-[#0f382c] flex items-center justify-center cursor-pointer"
              >
                <SolidClose className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#18241f] mb-1">
                  Item name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bread, Drinks"
                  className="w-full px-4 py-2.5 bg-black/[0.04] focus:bg-black/[0.07] rounded-2xl text-sm font-medium text-[#18241f] focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#18241f] mb-1">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as UnitType)}
                    className="w-full px-3 py-2.5 bg-black/[0.04] focus:bg-black/[0.07] rounded-2xl text-xs font-medium text-[#18241f] focus:outline-none transition-colors cursor-pointer"
                  >
                    {unitOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18241f] mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black/[0.04] focus:bg-black/[0.07] rounded-2xl text-sm font-medium text-[#18241f] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#18241f] mb-1">
                    Cost (₦)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={costNaira}
                    onChange={(e) => setCostNaira(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-black/[0.04] focus:bg-black/[0.07] rounded-2xl text-sm font-medium text-[#18241f] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18241f] mb-1">
                    Selling (₦)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={sellingNaira}
                    onChange={(e) => setSellingNaira(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-black/[0.04] focus:bg-black/[0.07] rounded-2xl text-sm font-medium text-[#18241f] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full justify-center text-sm mt-2">
                {editingItem ? 'Save changes' : 'Add item'}
              </Button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
