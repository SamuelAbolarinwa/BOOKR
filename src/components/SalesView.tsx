import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  SolidPlus,
  SolidMessage,
  SolidCheckCircle,
  SolidTrash,
  SolidSearch,
} from './ui/icons';
import { Sale } from '@/types';
import { db } from '@/lib/db';
import { formatMoney } from '@/lib/utils';

interface SalesViewProps {
  sales: Sale[];
  onOpenRecordModal: () => void;
}

export const SalesView: React.FC<SalesViewProps> = ({ sales, onOpenRecordModal }) => {
  const [filter, setFilter] = useState<'all' | 'paid' | 'owing'>('all');
  const [search, setSearch] = useState('');

  const totalOwingKobo = sales
    .filter((s) => s.paymentStatus === 'owing')
    .reduce((acc, s) => acc + s.amount, 0);

  const filteredSales = sales.filter((s) => {
    const matchesFilter = filter === 'all' || s.paymentStatus === filter;
    const matchesSearch =
      s.itemName.toLowerCase().includes(search.toLowerCase()) ||
      (s.debtorName && s.debtorName.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleSettleDebt = async (id?: number) => {
    if (!id) return;
    await db.sales.update(id, {
      paymentStatus: 'paid',
    });
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (window.confirm('Delete this record?')) {
      await db.sales.delete(id);
    }
  };

  const handleWhatsAppNudge = (sale: Sale) => {
    const amountStr = formatMoney(sale.amount);
    const debtorName = sale.debtorName || 'friend';
    const text = encodeURIComponent(
      `Hello ${debtorName}, please remember the ${amountStr} for the ${sale.itemName} when you're free. Thank you!`
    );
    const phone = sale.debtorPhone ? sale.debtorPhone.replace(/[^0-9]/g, '') : '';
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
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
            All ({sales.length})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
              filter === 'paid'
                ? 'bg-white text-[#0f382c]'
                : 'text-[#5e6b64] hover:text-[#18241f]'
            }`}
          >
            Paid ({sales.filter((s) => s.paymentStatus === 'paid').length})
          </button>
          <button
            onClick={() => setFilter('owing')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              filter === 'owing'
                ? 'bg-amber-600 text-white'
                : 'text-amber-800'
            }`}
          >
            <span>Owing</span>
            {totalOwingKobo > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {formatMoney(totalOwingKobo)}
              </span>
            )}
          </button>
        </div>

        {sales.length > 0 && (
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

      {/* Owing Callout Banner */}
      {totalOwingKobo > 0 && filter !== 'paid' && (
        <div className="rounded-2xl p-3.5 bg-amber-500/10 flex items-center justify-between">
          <div className="text-xs font-bold text-amber-900">
            {formatMoney(totalOwingKobo)} currently owing
          </div>
          <button
            onClick={() => setFilter('owing')}
            className="text-xs font-bold text-amber-900 underline cursor-pointer px-2 py-1"
          >
            View
          </button>
        </div>
      )}

      {/* Search Bar (Only if > 4 items) */}
      {sales.length > 4 && (
        <div className="relative">
          <SolidSearch className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#5e6b64]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sales..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-full text-xs font-medium text-[#18241f] focus:outline-none"
          />
        </div>
      )}

      {/* Sales List */}
      {filteredSales.length === 0 ? (
        <div className="rounded-2xl p-8 bg-white text-center space-y-1 text-[#5e6b64]">
          <p className="text-xs font-bold text-[#18241f]">No sales recorded</p>
          <p className="text-xs opacity-75">Tap "Record Sale" above to log transactions.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSales.map((sale) => {
            const isOwing = sale.paymentStatus === 'owing';
            const dateStr = new Date(sale.createdAt).toLocaleDateString('en-NG', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={sale.id}
                className="rounded-2xl p-4 bg-white flex items-center justify-between transition-all"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#18241f]">{sale.itemName}</span>
                    
                    {isOwing ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-900">
                        Owing: {sale.debtorName || 'Customer'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0f382c]/10 text-[#0f382c]">
                        {sale.paymentMethod || 'cash'}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#5e6b64]">
                    <span>{dateStr}</span>
                  </div>
                </div>

                {/* Right side: Amount & Quick Actions */}
                <div className="flex items-center gap-3">
                  <span className={`text-sm sm:text-base font-extrabold ${
                    isOwing ? 'text-amber-800' : 'text-[#0f382c]'
                  }`}>
                    +{formatMoney(sale.amount)}
                  </span>

                  {/* Owing actions */}
                  {isOwing && (
                    <div className="flex items-center gap-1">
                      <button
                        title="Send WhatsApp reminder"
                        onClick={() => handleWhatsAppNudge(sale)}
                        className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-800 hover:bg-emerald-500/25 flex items-center justify-center cursor-pointer transition-colors"
                        aria-label="Send WhatsApp reminder"
                      >
                        <SolidMessage className="w-3.5 h-3.5" />
                      </button>

                      <button
                        title="Mark as Paid"
                        onClick={() => handleSettleDebt(sale.id)}
                        className="w-8 h-8 rounded-full bg-[#0f382c]/10 text-[#0f382c] hover:bg-[#0f382c]/20 flex items-center justify-center cursor-pointer transition-colors"
                        aria-label="Mark as paid"
                      >
                        <SolidCheckCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleDelete(sale.id)}
                    className="w-7 h-7 rounded-full text-[#5e6b64]/40 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-colors"
                    title="Delete record"
                    aria-label="Delete sale"
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
