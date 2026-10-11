import React from 'react';
import { Badge } from '../types';
import { Award, X, Sparkles, Lock, CheckCircle2 } from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ isOpen, onClose, badges }) => {
  if (!isOpen) return null;

  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0f172a] border-2 border-amber-500/60 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">
                  Roguelike Perks & Badges
                </h3>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                  {unlockedCount} / {badges.length} UNLOCKED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Master key survival habits across your 30-day trial to earn permanent bragging rights.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                b.isUnlocked
                  ? 'bg-[#141e33] border-amber-500/40 shadow-lg shadow-amber-950/20'
                  : 'bg-slate-900/40 border-slate-800 opacity-50'
              }`}
            >
              <div className="text-3xl shrink-0 p-1.5 rounded-2xl bg-[#0b101c] border border-slate-800">
                {b.emoji}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-white text-sm">
                    {b.title}
                  </h4>
                  {b.isUnlocked ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {b.unlockedAtDay ? `Day ${b.unlockedAtDay}` : 'EARNED'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      LOCKED
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  {b.description}
                </p>

                <div className="mt-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Category: {b.category}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow"
          >
            Close & Keep Playing
          </button>
        </div>

      </div>
    </div>
  );
};
