import React, { useState } from 'react';
import { Button } from './ui/button';
import { SolidClose, SolidShoppingBag, SolidUtensils } from './ui/icons';
import { db } from '@/lib/db';

interface RecordExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecordExpenseModal: React.FC<RecordExpenseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [amountNaira, setAmountNaira] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [expenseType, setExpenseType] = useState<'restock' | 'chop_money'>('restock');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountNaira);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const amountInKobo = Math.round(parsedAmount * 100);

    await db.expenses.add({
      amount: amountInKobo,
      description: description.trim() || 'General Expense',
      expenseType,
      category: expenseType === 'restock' ? 'Restock' : 'Personal Upkeep',
      createdAt: new Date().toISOString(),
    });

    setAmountNaira('');
    setDescription('');
    setExpenseType('restock');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-t-[32px] sm:rounded-3xl max-w-md w-full p-6 text-[#18241f] animate-liquid-spring max-h-[92vh] overflow-y-auto">
        
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto mb-4" />

        <div className="flex items-center justify-between pb-2">
          <h2 className="text-base font-extrabold text-[#0f382c]">Record Expense</h2>
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

          {/* Type Selector: Restock vs Chop-Money */}
          <div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setExpenseType('restock')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  expenseType === 'restock'
                    ? 'bg-[#0f382c] text-white'
                    : 'bg-black/[0.04] text-[#5e6b64] hover:bg-black/[0.07]'
                }`}
              >
                <SolidShoppingBag className="w-4 h-4" />
                <span>Stock Capital</span>
              </button>

              <button
                type="button"
                onClick={() => setExpenseType('chop_money')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  expenseType === 'chop_money'
                    ? 'bg-amber-700 text-white'
                    : 'bg-black/[0.04] text-[#5e6b64] hover:bg-black/[0.07]'
                }`}
              >
                <SolidUtensils className="w-4 h-4" />
                <span>Personal Spend</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#18241f] mb-1">
              Description
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Bought eggs, transport, food"
              className="w-full px-4 py-2.5 bg-black/[0.04] focus:bg-black/[0.07] rounded-2xl text-sm font-medium text-[#18241f] focus:outline-none transition-colors"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full justify-center text-sm font-bold mt-2">
            Save Expense
          </Button>

        </form>

      </div>
    </div>
  );
};
