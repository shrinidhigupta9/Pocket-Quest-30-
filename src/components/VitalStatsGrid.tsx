import React from 'react';
import { VitalStats } from '../types';
import { getHealthGrade } from '../utils/finance';
import { 
  Fuel, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  AlertOctagon, 
  Flame, 
  Lock, 
  Unlock,
  TrendingDown,
  TrendingUp,
  HelpCircle
} from 'lucide-react';

interface VitalStatsGridProps {
  stats: VitalStats;
  spendableBalance: number;
  lockedSavings: number;
  savingsTarget: number;
  safeDailyAllowance: number;
  pendingCommitmentsAmount: number;
  onLockSavings: (amount: number) => void;
  onUnlockSavings: (amount: number) => void;
}

export const VitalStatsGrid: React.FC<VitalStatsGridProps> = ({
  stats,
  spendableBalance,
  lockedSavings,
  savingsTarget,
  safeDailyAllowance,
  pendingCommitmentsAmount,
  onLockSavings,
  onUnlockSavings,
}) => {
  const healthMeta = getHealthGrade(stats.financialHealth);

  const isBurnoutRisk = stats.vibeMeter < 20;
  const isBrokeRisk = stats.cashRunway < 20 || spendableBalance < pendingCommitmentsAmount;

  return (
    <div className="space-y-3">
      {/* Critical Interconnection Alarm Banners */}
      {(isBurnoutRisk || isBrokeRisk) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {isBurnoutRisk && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/90 to-rose-950/90 border-2 border-rose-500/80 shadow-lg shadow-rose-950/50 flex items-center gap-3 animate-pulse">
              <Flame className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h4 className="text-sm font-extrabold text-rose-200 uppercase tracking-wider flex items-center gap-2">
                  <span>⚠️ Burnout Warning Triggered</span>
                </h4>
                <p className="text-xs text-rose-300/90 mt-0.5">
                  Vibe meter dropped to {stats.vibeMeter}%! Extreme penny-pinching causes fatigue. Splurge lightly or take a break to avoid mental collapse.
                </p>
              </div>
            </div>
          )}

          {isBrokeRisk && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/90 to-amber-950/90 border-2 border-red-500/80 shadow-lg shadow-red-950/50 flex items-center gap-3 animate-pulse">
              <AlertOctagon className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <h4 className="text-sm font-extrabold text-red-200 uppercase tracking-wider flex items-center gap-2">
                  <span>🚨 Broke Alarm: Runway Critical</span>
                </h4>
                <p className="text-xs text-red-300/90 mt-0.5">
                  Cash runway is at {stats.cashRunway}%! You have ₹{pendingCommitmentsAmount} in upcoming commitments. Overdraft penalty looms if cash drops further!
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4 Vital Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* STAT 1: Cash Runway */}
        <div className="bg-[#101728]/90 border border-slate-700/60 rounded-2xl p-4 shadow-xl hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Fuel className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Cash Runway
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Safe: ₹{safeDailyAllowance}/day
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-black font-mono ${stats.cashRunway < 25 ? 'text-rose-400' : stats.cashRunway < 50 ? 'text-amber-400' : 'text-cyan-400'}`}>
                {stats.cashRunway}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                stats.cashRunway < 25
                  ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.7)]'
                  : stats.cashRunway < 50
                  ? 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
              }`}
              style={{ width: `${Math.min(100, Math.max(3, stats.cashRunway))}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Spendable: ₹{spendableBalance}</span>
            <span className={stats.cashRunway >= 60 ? 'text-emerald-400' : 'text-amber-400'}>
              {stats.cashRunway >= 60 ? '⚡ Stable Fuel' : '⚠️ Burn Alert'}
            </span>
          </div>
        </div>

        {/* STAT 2: Savings Shield */}
        <div className="bg-[#101728]/90 border border-slate-700/60 rounded-2xl p-4 shadow-xl hover:border-emerald-500/50 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Savings Shield
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Target: ₹{savingsTarget.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-black font-mono ${stats.savingsShield >= 100 ? 'text-emerald-400' : 'text-lime-400'}`}>
                {stats.savingsShield}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-emerald-500 to-lime-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
              style={{ width: `${Math.min(100, Math.max(3, stats.savingsShield))}%` }}
            />
          </div>

          {/* Shield Lock / Unlock micro buttons */}
          <div className="mt-3 flex items-center justify-between gap-1">
            <span className="text-[11px] font-mono text-emerald-300 font-bold">
              ₹{lockedSavings} Locked
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onLockSavings(200)}
                disabled={spendableBalance < 200}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 disabled:opacity-30 active:scale-95"
                title="Lock ₹200 from spendable cash into Savings Shield"
              >
                +₹200 Lock
              </button>
              <button
                onClick={() => onUnlockSavings(200)}
                disabled={lockedSavings < 200}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 disabled:opacity-30 active:scale-95"
                title="Emergency Unlock ₹200 from Savings Shield"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>

        {/* STAT 3: Vibe / Social Meter */}
        <div className="bg-[#101728]/90 border border-slate-700/60 rounded-2xl p-4 shadow-xl hover:border-pink-500/50 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Vibe / Social Meter
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Mental peace & life
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-black font-mono ${stats.vibeMeter < 20 ? 'text-rose-400 animate-pulse' : stats.vibeMeter < 50 ? 'text-amber-400' : 'text-pink-400'}`}>
                {stats.vibeMeter}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                stats.vibeMeter < 20
                  ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.7)]'
                  : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 shadow-[0_0_12px_rgba(236,72,153,0.6)]'
              }`}
              style={{ width: `${Math.min(100, Math.max(3, stats.vibeMeter))}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
            <span className={stats.vibeMeter < 20 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
              {stats.vibeMeter < 20 ? '🔥 Burnout Warning' : stats.vibeMeter > 80 ? '✨ Peak Aura' : 'Chill Baseline'}
            </span>
            <span className="text-[10px] text-slate-500">
              Drops if ₹0 social spend
            </span>
          </div>
        </div>

        {/* STAT 4: Financial Health (Master Composite Score) */}
        <div className="bg-[#101728]/90 border border-slate-700/60 rounded-2xl p-4 shadow-xl hover:border-amber-500/50 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Financial Health
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Master composite
                </span>
              </div>
            </div>
            <div className="text-right flex items-baseline gap-1.5">
              <span className={`text-xs px-2 py-0.5 rounded font-black font-mono border ${healthMeta.colorClass} border-current/30 bg-black/40`}>
                GRADE {healthMeta.grade}
              </span>
              <span className={`text-2xl font-black font-mono ${healthMeta.colorClass}`}>
                {stats.financialHealth}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
              style={{ width: `${Math.min(100, Math.max(3, stats.financialHealth))}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
            <span className={`font-bold ${healthMeta.colorClass}`}>
              {healthMeta.label}
            </span>
            <span className="text-slate-500 text-[10px]">
              35%R • 30%S • 20%V
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
