import React from 'react';
import { GameState } from '../types';
import { calculateSafeDailyAllowance, getHealthGrade } from '../utils/finance';
import { soundFx } from '../utils/audio';
import { 
  ShieldAlert, 
  Flame, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Award, 
  FlaskConical, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react';

interface HeaderHUDProps {
  state: GameState;
  onToggleSound: () => void;
  onReset: (preset?: 'default' | 'hardcore' | 'day1' | 'day15') => void;
  onOpenDecisionLab: () => void;
  onOpenBadges: () => void;
  onAdvanceDay: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  state,
  onToggleSound,
  onReset,
  onOpenDecisionLab,
  onOpenBadges,
  onAdvanceDay,
}) => {
  const math = calculateSafeDailyAllowance(
    state.spendableBalance,
    state.commitments,
    state.currentDay,
    state.totalDays
  );
  const healthMeta = getHealthGrade(state.stats.financialHealth);

  const unlockedBadgesCount = state.badges.filter(b => b.isUnlocked).length;

  return (
    <header className="sticky top-0 z-40 bg-[#080c14]/90 backdrop-blur-xl border-b border-quest-border/60 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Brand & Day Stepper Badge */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center font-black text-lg text-cyan-400">
                ₹
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base md:text-lg">
                  PocketQuest <span className="text-cyan-400">30</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-bold tracking-wider">
                  ₹10K SURVIVOR
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Roguelike Budget Survival Simulator
              </p>
            </div>
          </div>

          {/* Current Day Stepper Counter */}
          <div className="flex items-center gap-2 bg-[#101728] border border-slate-700/60 rounded-xl px-3 py-1.5 shadow-inner">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold">Day</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-black text-white">{state.currentDay}</span>
              <span className="text-xs font-mono text-slate-500">/ 30</span>
            </div>
            <button
              id="advance-day-btn"
              onClick={onAdvanceDay}
              disabled={state.currentDay >= 30}
              className="ml-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center gap-1 active:scale-95 disabled:opacity-40"
              title="Advance to next day"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real-time Financial Math Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0c1220]/80 p-2 rounded-2xl border border-slate-800/80">
          
          {/* Spendable Balance */}
          <div className="px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
              Spendable Cash
            </span>
            <span className="text-sm md:text-base font-mono font-extrabold text-emerald-400">
              ₹{state.spendableBalance.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Locked Savings Shield */}
          <div className="px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
              Savings Shield
            </span>
            <div className="flex items-center gap-1">
              <span className="text-sm md:text-base font-mono font-extrabold text-cyan-400">
                ₹{state.lockedSavings.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                / 2k
              </span>
            </div>
          </div>

          {/* Pending Commitments */}
          <div className="px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
              Pending Bills
            </span>
            <span className="text-sm md:text-base font-mono font-extrabold text-amber-400">
              ₹{math.pendingCommitmentsAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Safe Daily Allowance */}
          <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-800/40 relative overflow-hidden">
            <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-300 block font-bold">
              Safe Daily Burn
            </span>
            <div className="flex items-baseline gap-1">
              <span className={`text-sm md:text-base font-mono font-extrabold ${math.safeDailyAllowance < 180 ? 'text-rose-400' : 'text-cyan-300'}`}>
                ₹{math.safeDailyAllowance}
              </span>
              <span className="text-[10px] font-mono text-slate-400">/day</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Modal Triggers */}
        <div className="flex items-center justify-end gap-2">
          
          {/* Decision Lab Button */}
          <button
            id="decision-lab-trigger-btn"
            onClick={onOpenDecisionLab}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/40 hover:to-pink-600/40 border border-purple-500/40 hover:border-purple-400 text-purple-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <FlaskConical className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Decision Lab</span>
            <span className="sm:hidden">Simulate</span>
          </button>

          {/* Badges Button */}
          <button
            id="badges-trigger-btn"
            onClick={onOpenBadges}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Perks & Badges"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-amber-300">{unlockedBadgesCount}</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 transition-all"
            title={state.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {state.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Reset / Preset Menu */}
          <div className="relative group">
            <button
              id="reset-presets-btn"
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 transition-all flex items-center gap-1"
              title="Reset or Load Presets"
            >
              <RotateCcw className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
            </button>
            
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-[#111827] border border-slate-700 rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase font-bold border-b border-slate-800">
                Load Preset Scenario
              </div>
              <button
                onClick={() => onReset('default')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
              >
                <span>Mock State (Day 10)</span>
                <span className="text-[10px] text-cyan-400 font-mono">₹6.4k</span>
              </button>
              <button
                onClick={() => onReset('day1')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
              >
                <span>Day 1 Clean Start</span>
                <span className="text-[10px] text-emerald-400 font-mono">₹10k</span>
              </button>
              <button
                onClick={() => onReset('hardcore')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-300 hover:bg-slate-800 flex items-center justify-between"
              >
                <span>Hardcore Broke Mode</span>
                <span className="text-[10px] text-rose-400 font-mono">₹5k</span>
              </button>
              <button
                onClick={() => onReset('day15')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-amber-300 hover:bg-slate-800 flex items-center justify-between"
              >
                <span>Mid-Month Crunch</span>
                <span className="text-[10px] text-amber-400 font-mono">Day 15</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Dynamic Feedback Alert Card (Instant Notification) */}
      {state.lastFeedbackAlert && (
        <div className="max-w-7xl mx-auto mt-2.5">
          <div className={`text-xs px-3 py-1.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
            state.lastFeedbackAlert.type === 'danger'
              ? 'bg-rose-950/60 border-rose-800/80 text-rose-200 animate-pulse'
              : state.lastFeedbackAlert.type === 'warning'
              ? 'bg-amber-950/60 border-amber-800/80 text-amber-200'
              : state.lastFeedbackAlert.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200'
              : 'bg-cyan-950/50 border-cyan-800/60 text-cyan-200'
          }`}>
            <div className="flex items-center gap-2">
              {state.lastFeedbackAlert.type === 'danger' ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : state.lastFeedbackAlert.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : state.lastFeedbackAlert.type === 'success' ? (
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              )}
              <span className="font-medium">{state.lastFeedbackAlert.message}</span>
            </div>
            <span className="text-[10px] font-mono opacity-60">LIVE TICK</span>
          </div>
        </div>
      )}
    </header>
  );
};
