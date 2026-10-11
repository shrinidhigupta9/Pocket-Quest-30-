import React from 'react';
import { GameState } from '../types';
import { getHealthGrade } from '../utils/finance';
import { Trophy, Skull, Flame, RotateCcw, Share2, Sparkles, CheckCircle } from 'lucide-react';

interface GameOverModalProps {
  state: GameState;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ state, onRestart }) => {
  if (!state.isGameOver) return null;

  const isVictory = state.gameOverReason === 'victory' || state.currentDay >= 30;
  const isBurnout = state.gameOverReason === 'burnout';
  const healthMeta = getHealthGrade(state.stats.financialHealth);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div className="bg-[#0f172a] border-2 border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl p-6 text-center text-slate-100">
        
        {/* Big Icon */}
        <div className="mx-auto w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mb-4 shadow-xl">
          {isVictory ? (
            <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-emerald-400 rounded-3xl flex items-center justify-center text-black">
              <Trophy className="w-8 h-8" />
            </div>
          ) : isBurnout ? (
            <div className="w-full h-full bg-rose-600 rounded-3xl flex items-center justify-center text-white">
              <Flame className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-full h-full bg-red-600 rounded-3xl flex items-center justify-center text-white">
              <Skull className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white">
          {isVictory ? '🎉 QUEST COMPLETE: You Survived the ₹10k Month!' : isBurnout ? '🔥 BURNOUT COLLAPSE!' : '💀 BROKE & OVERDRAWN!'}
        </h2>

        <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
          {isVictory
            ? `You conquered 30 days of Gen Z financial temptations, locked ₹${state.lockedSavings} into your emergency fund, and kept your mental peace intact!`
            : isBurnout
            ? 'Your Vibe Meter hit zero. Severe social isolation and extreme penny-pinching triggered mental exhaustion.'
            : 'You ran out of liquid cash before your auto-debits were paid, triggering severe overdraft charges.'}
        </p>

        {/* Post-Mortem Stats Grid */}
        <div className="mt-5 grid grid-cols-3 gap-3 p-4 bg-[#141d30] rounded-2xl border border-slate-800 text-left">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Final Balance</span>
            <span className="text-base font-mono font-black text-emerald-400">
              ₹{state.spendableBalance}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Shield Saved</span>
            <span className="text-base font-mono font-black text-cyan-400">
              ₹{state.lockedSavings}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Grade Rating</span>
            <span className={`text-base font-mono font-black ${healthMeta.colorClass}`}>
              {healthMeta.grade} ({healthMeta.label})
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={onRestart}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Next Month (Restart)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
