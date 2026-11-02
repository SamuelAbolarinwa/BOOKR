import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  SolidPlus,
  SolidTrash,
  SolidShoppingBag,
  SolidUtensils,
} from './ui/icons';
import { Expense } from '@/types';
import { db } from '@/lib/db';
import { formatMoney } from '@/lib/utils';

interface ExpensesViewProps {
  expenses: Expense[];
  onOpenRecordModal: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onOpenRecordModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'restock' | 'chop_money'>('all');

  const filteredExpenses = expenses.filter((e) => {
    if (filter === 'all') return true;
    return e.expenseType === filter;
  });

  const totalRestockKobo = expenses
    .filter((e) => e.expenseType === 'restock')
    .reduce((acc, e) => acc + e.amount, 0);

  const totalChopKobo = expenses
    .filter((e) => e.expenseType === 'chop_money')
    .reduce((acc, e) => acc + e.amount, 0);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (window.confirm('Delete this expense record?')) {
      await db.expenses.delete(id);
    }
  };

  return (
    <div className="space-y-3">
      
      {/* Filter Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1 overflow-x-auto p-1 bg-black/[0.04] rounded-full">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
              filter === 'all'
                ? 'bg-white text-[#0f382c]'
                : 'text-[#5e6b64] hover:text-[#18241f]'
            }`}
          >
            All ({expenses.length})
          </button>
          <button
            onClick={() => setFilter('restock')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              filter === 'restock'
                ? 'bg-white text-[#0f382c]'
                : 'text-[#5e6b64] hover:text-[#18241f]'
            }`}
          >
            <SolidShoppingBag className="w-3.5 h-3.5" />
            <span>Stock</span>
          </button>
          <button
            onClick={() => setFilter('chop_money')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              filter === 'chop_money'
                ? 'bg-white text-[#0f382c]'
                : 'text-[#5e6b64] hover:text-[#18241f]'
            }`}
          >
            <SolidUtensils className="w-3.5 h-3.5" />
            <span>Personal</span>
          </button>
        </div>

        {expenses.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenRecordModal}
            className="text-xs shrink-0 text-[#0f382c] font-bold"
          >
            <SolidPlus className="w-3.5 h-3.5" />
            <span>New</span>
          </Button>
        )}
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl p-4 bg-white">
          <span className="text-[11px] font-semibold text-[#5e6b64] block">Stock Capital</span>
          <div className="text-base font-extrabold text-[#0f382c] mt-0.5">
            {formatMoney(totalRestockKobo)}
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-white">
          <span className="text-[11px] font-semibold text-[#5e6b64] block">Personal Spending</span>
          <div className="text-base font-extrabold text-amber-800 mt-0.5">
            {formatMoney(totalChopKobo)}
          </div>
        </div>
      </div>

      {/* Expenses Feed */}
      {filteredExpenses.length === 0 ? (
        <div className="rounded-2xl p-8 bg-white text-center space-y-1 text-[#5e6b64]">
          <p className="text-xs font-bold text-[#18241f]">No expenses recorded</p>
          <p className="text-xs opacity-75">Tap "Record Expense" above to track what you spend.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredExpenses.map((exp) => {
            const isRestock = exp.expenseType === 'restock';
            const dateStr = new Date(exp.createdAt).toLocaleDateString('en-NG', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={exp.id}
                className="rounded-2xl p-4 bg-white flex items-center justify-between transition-all"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#18241f]">{exp.description}</span>
                    {isRestock ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0f382c]/10 text-[#0f382c]">
                        Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-800">
                        Personal
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#5e6b64]">
                    <span>{dateStr}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm sm:text-base font-extrabold text-rose-700">
                    -{formatMoney(exp.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="w-7 h-7 rounded-full text-[#5e6b64]/40 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-colors"
                    title="Delete expense"
                    aria-label="Delete expense"
                  >
                    <SolidTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
