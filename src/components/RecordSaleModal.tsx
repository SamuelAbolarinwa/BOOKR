import React, { useState } from 'react';
import { Button } from './ui/button';
import { SolidClose } from './ui/icons';
import { db } from '@/lib/db';
import { InventoryItem } from '@/types';

interface RecordSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: InventoryItem[];
}

export const RecordSaleModal: React.FC<RecordSaleModalProps> = ({
  isOpen,
  onClose,
  inventoryItems,
}) => {
  const [amountNaira, setAmountNaira] = useState<string>('');
  const [itemName, setItemName] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'owing'>('paid');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
  const [debtorName, setDebtorName] = useState<string>('');
  const [debtorPhone, setDebtorPhone] = useState<string>('');
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | undefined>(undefined);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountNaira);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const amountInKobo = Math.round(parsedAmount * 100);

    await db.sales.add({
      amount: amountInKobo,
      itemName: itemName.trim() || 'General Sale',
      category: 'General',
      paymentStatus,
      paymentMethod,
      debtorName: paymentStatus === 'owing' ? debtorName.trim() || 'Customer' : undefined,
      debtorPhone: paymentStatus === 'owing' ? debtorPhone.trim() : undefined,
      inventoryItemId: selectedInventoryId,
      createdAt: new Date().toISOString(),
    });

    if (selectedInventoryId) {
      const inv = await db.inventory.get(selectedInventoryId);
      if (inv && inv.quantity > 0) {
        await db.inventory.update(selectedInventoryId, {
          quantity: Math.max(0, inv.quantity - 1),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    setAmountNaira('');
    setItemName('');
    setPaymentStatus('paid');
    setDebtorName('');
    setDebtorPhone('');
    setSelectedInventoryId(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-t-[32px] sm:rounded-3xl max-w-md w-full p-6 text-[#18241f] animate-liquid-spring max-h-[92vh] overflow-y-auto">
        
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto mb-4" />

        <div className="flex items-center justify-between pb-2">
          <h2 className="text-base font-extrabold text-[#0f382c]">Record Sale</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/[0.04] text-[#5e6b64] hover:text-[#0f382c] flex items-center justify-center cursor-pointer"
          >
            <SolidClose className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-[#18241f] mb-1">
              Amount (₦)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#5e6b64]">₦</span>
              <input
                type="number"
                step="any"
                required
                autoFocus
                value={amountNaira}
                onChange={(e) => setAmountNaira(e.target.value)}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-3 bg-black/[0.04] focus:bg-black/[0.07] rounded-2xl text-xl font-extrabold text-[#18241f] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-[#18241f] mb-1">
              Item Name
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Bread, Drinks, Haircut"
              className="w-full px-4 py-2.5 bg-black/[0.04] focus:bg-black/[0.07] rounded-2xl text-sm font-medium text-[#18241f] focus:outline-none transition-colors"
            />
          </div>

          {/* Optional: Pick from Inventory */}
          {inventoryItems.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#18241f] mb-1">
                From Stock (Optional)
              </label>
              <select
                value={selectedInventoryId || ''}
                onChange={(e) => {
                  const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                  setSelectedInventoryId(val);
                  if (val) {
                    const item = inventoryItems.find((i) => i.id === val);
                    if (item) {
                      setItemName(item.name);
                      setAmountNaira((item.sellingPrice / 100).toString());
                    }
                  }
                }}
                className="w-full px-4 py-2.5 bg-black/[0.04] focus:bg-black/[0.07] rounded-2xl text-xs font-medium text-[#18241f] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="">None (custom item)</option>
                {inventoryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.quantity} in stock)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Payment Status Pill */}
          <div>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full bg-black/[0.04]">
              <button
                type="button"
                onClick={() => setPaymentStatus('paid')}
                className={`py-2 rounded-full text-xs font-bold cursor-pointer transition-all ${
                  paymentStatus === 'paid'
                    ? 'bg-[#0f382c] text-white'
                    : 'text-[#5e6b64] hover:text-[#18241f]'
                }`}
              >
                Paid
              </button>
              <button
                type="button"
                onClick={() => setPaymentStatus('owing')}
                className={`py-2 rounded-full text-xs font-bold cursor-pointer transition-all ${
                  paymentStatus === 'owing'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-800'
                }`}
              >
                Owing
              </button>
            </div>
          </div>

          {/* Paid options: Cash or Bank Transfer */}
          {paymentStatus === 'paid' && (
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full bg-black/[0.04]">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-white text-[#0f382c] font-bold'
                    : 'text-[#5e6b64]'
                }`}
              >
                Cash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  paymentMethod === 'transfer'
                    ? 'bg-white text-[#0f382c] font-bold'
                    : 'text-[#5e6b64]'
                }`}
              >
                Transfer
              </button>
            </div>
          )}

          {/* Debtor Details if owing */}
          {paymentStatus === 'owing' && (
            <div className="space-y-2 pt-1">
              <input
                type="text"
                required
                value={debtorName}
                onChange={(e) => setDebtorName(e.target.value)}
                placeholder="Customer Name"
                className="w-full px-4 py-2.5 bg-amber-500/10 focus:bg-amber-500/15 rounded-2xl text-sm font-medium text-[#18241f] focus:outline-none transition-colors"
              />

              <input
                type="tel"
                value={debtorPhone}
                onChange={(e) => setDebtorPhone(e.target.value)}
                placeholder="Phone (optional)"
                className="w-full px-4 py-2.5 bg-black/[0.04] focus:bg-black/[0.07] rounded-2xl text-sm font-medium text-[#18241f] focus:outline-none transition-colors"
              />
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full justify-center text-sm font-bold mt-2">
            Save Sale
          </Button>

        </form>

      </div>
    </div>
  );
};
