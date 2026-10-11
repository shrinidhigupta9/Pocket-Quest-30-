import React, { useState } from 'react';
import { Commitment } from '../types';
import { 
  Scissors, 
  Wifi, 
  Tv, 
  Smartphone, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface CommitmentVaultProps {
  commitments: Commitment[];
  currentDay: number;
  onSnipCommitment: (id: string) => void;
  onAddCommitment: (commitment: Commitment) => void;
}

export const CommitmentVault: React.FC<CommitmentVaultProps> = ({
  commitments,
  currentDay,
  onSnipCommitment,
  onAddCommitment,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('299');
  const [newDueDay, setNewDueDay] = useState('18');
  const [newCategory, setNewCategory] = useState<'Subscription' | 'Bill'>('Subscription');

  const pendingTotal = commitments
    .filter(c => c.status === 'pending' && c.dueDay >= currentDay)
    .reduce((acc, c) => acc + c.amount, 0);

  const snippedTotal = commitments
    .filter(c => c.status === 'snipped')
    .reduce((acc, c) => acc + c.amount, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const amount = parseInt(newAmount) || 199;
    const dueDay = Math.min(30, Math.max(currentDay, parseInt(newDueDay) || currentDay + 2));

    const newComm: Commitment = {
      id: `comm-custom-${Date.now()}`,
      title: newTitle.trim(),
      amount,
      dueDay,
      category: newCategory,
      status: 'pending',
      icon: newCategory === 'Bill' ? 'Wifi' : 'Tv',
      description: `Added by user for Day ${dueDay}.`,
      canSnip: true,
    };

    onAddCommitment(newComm);
    setShowAddModal(false);
    setNewTitle('');
  };

  return (
    <div className="bg-[#101728]/90 border border-slate-700/60 rounded-3xl p-5 md:p-6 shadow-xl relative backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-white">
              Subscription & Commitment Vault
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800">
              ₹{pendingTotal} PENDING
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-debits can trigger overdraft penalties if underfunded. Use the <strong>Snip Tool</strong> to cancel non-essentials!
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          <span>Add Bill</span>
        </button>
      </div>

      {/* Snipped stats banner */}
      {snippedTotal > 0 && (
        <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-medium">
            <Scissors className="w-4 h-4 text-emerald-400" />
            <span>Vault Snip Savings Active: ₹{snippedTotal} freed up back into monthly spendable pool!</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
            +{(snippedTotal / 100).toFixed(1)}% Survival Boost
          </span>
        </div>
      )}

      {/* Commitments Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {commitments.map((comm) => {
          const isPending = comm.status === 'pending';
          const isSnipped = comm.status === 'snipped';
          const isPaid = comm.status === 'paid';
          const isDueSoon = isPending && comm.dueDay - currentDay <= 3 && comm.dueDay >= currentDay;

          return (
            <div
              key={comm.id}
              className={`rounded-2xl p-4 border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSnipped
                  ? 'bg-slate-900/40 border-slate-800 opacity-60'
                  : isDueSoon
                  ? 'bg-[#171f33] border-amber-500/70 shadow-lg shadow-amber-950/40'
                  : 'bg-[#131b2e] border-slate-700/70 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400">
                      {comm.icon === 'Wifi' ? (
                        <Wifi className="w-4 h-4" />
                      ) : comm.icon === 'Tv' ? (
                        <Tv className="w-4 h-4" />
                      ) : (
                        <Smartphone className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                        {comm.category}
                      </span>
                      <h4 className="font-bold text-white text-sm leading-tight">
                        {comm.title}
                      </h4>
                    </div>
                  </div>

                  <span className="text-sm font-mono font-black text-amber-300">
                    ₹{comm.amount}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-normal mt-1">
                  {comm.description}
                </p>

                {/* Due Date & Status Pill */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800 text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>Due Day {comm.dueDay}</span>
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isSnipped
                      ? 'bg-slate-800 text-slate-400'
                      : isPaid
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : isDueSoon
                      ? 'bg-amber-950 text-amber-300 border border-amber-700 animate-pulse'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}>
                    {comm.status}
                  </span>
                </div>
              </div>

              {/* Action / Snip Tool */}
              <div className="mt-4 pt-2">
                {isPending && comm.canSnip && (
                  <button
                    id={`snip-btn-${comm.id}`}
                    onClick={() => onSnipCommitment(comm.id)}
                    className="w-full py-1.5 px-3 rounded-xl font-bold text-xs bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 text-rose-300 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                    title="Cancel subscription with Snip Tool"
                  >
                    <Scissors className="w-3.5 h-3.5 text-rose-400" />
                    <span>Snip (Cancel & Free ₹{comm.amount})</span>
                  </button>
                )}

                {isSnipped && (
                  <div className="text-center text-[11px] font-mono text-emerald-400 font-semibold py-1">
                    ✂️ Snipped (Freed ₹{comm.amount})
                  </div>
                )}

                {isPaid && (
                  <div className="text-center text-[11px] font-mono text-slate-400 py-1">
                    ✓ Paid & Completed
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Bill Dialog Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleCreate} className="bg-[#111827] border-2 border-slate-700 rounded-3xl p-5 w-full max-w-md shadow-2xl">
            <h4 className="text-base font-extrabold text-white mb-3">
              Add Monthly Commitment
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Gym Pass, Cook Salary"
                  className="w-full bg-[#0b111e] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 font-mono block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    min="50"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full bg-[#0b111e] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-cyan-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-mono block mb-1">Due Day (1-30)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={newDueDay}
                    onChange={(e) => setNewDueDay(e.target.value)}
                    className="w-full bg-[#0b111e] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow active:scale-95"
              >
                Add to Vault
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
