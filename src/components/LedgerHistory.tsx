import React, { useState } from 'react';
import { Transaction } from '../types';
import { 
  Receipt, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Lock, 
  Unlock, 
  Scissors, 
  Filter, 
  Search,
  Sparkles
} from 'lucide-react';

interface LedgerHistoryProps {
  transactions: Transaction[];
}

export const LedgerHistory: React.FC<LedgerHistoryProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<'all' | 'expense' | 'savings' | 'income'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter((t) => {
    if (filter === 'expense' && t.type !== 'expense') return false;
    if (filter === 'savings' && t.type !== 'savings_lock' && t.type !== 'savings_unlock') return false;
    if (filter === 'income' && t.type !== 'income') return false;
    if (searchTerm && !t.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-[#101728]/90 border border-slate-700/60 rounded-3xl p-5 md:p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-extrabold text-white">
            Survival Ledger & Stat Ripple History
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#0b101c] p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${filter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            All ({transactions.length})
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${filter === 'expense' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            Expenses
          </button>
          <button
            onClick={() => setFilter('savings')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${filter === 'savings' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            Shield
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {filtered.map((tx) => {
          const isIncome = tx.type === 'income';
          const isSavingsLock = tx.type === 'savings_lock';
          const isSavingsUnlock = tx.type === 'savings_unlock';
          const isExpense = tx.type === 'expense';

          return (
            <div
              key={tx.id}
              className="p-3 rounded-2xl bg-[#141d30]/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${
                  isIncome
                    ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                    : isSavingsLock
                    ? 'bg-cyan-950/80 border-cyan-800 text-cyan-400'
                    : isSavingsUnlock
                    ? 'bg-amber-950/80 border-amber-800 text-amber-400'
                    : 'bg-rose-950/80 border-rose-800 text-rose-400'
                }`}>
                  {isIncome ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : isSavingsLock ? (
                    <Lock className="w-4 h-4" />
                  ) : isSavingsUnlock ? (
                    <Unlock className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {tx.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      Day {tx.day}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {tx.timestamp} • {tx.category}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-sm font-mono font-black ${
                  isIncome
                    ? 'text-emerald-400'
                    : isSavingsLock
                    ? 'text-cyan-400'
                    : 'text-rose-400'
                }`}>
                  {isIncome ? `+₹${tx.amount}` : isSavingsLock ? `₹${Math.abs(tx.amount)} Lock` : `-₹${Math.abs(tx.amount)}`}
                </div>

                {/* Stat Deltas Ripple */}
                <div className="flex items-center justify-end gap-1.5 mt-0.5 text-[10px] font-mono">
                  {tx.statDeltas.vibe !== undefined && tx.statDeltas.vibe !== 0 && (
                    <span className={tx.statDeltas.vibe > 0 ? 'text-pink-400' : 'text-slate-400'}>
                      {tx.statDeltas.vibe > 0 ? `+${tx.statDeltas.vibe}% Vibe` : `${tx.statDeltas.vibe}% Vibe`}
                    </span>
                  )}
                  {tx.statDeltas.health !== undefined && tx.statDeltas.health !== 0 && (
                    <span className={tx.statDeltas.health > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {tx.statDeltas.health > 0 ? `+${tx.statDeltas.health}% Health` : `${tx.statDeltas.health}% Health`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-500 font-mono text-xs">
            No entries matching current filter.
          </div>
        )}
      </div>
    </div>
  );
};
