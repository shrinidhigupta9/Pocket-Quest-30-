import React from 'react';
import { Commitment } from '../types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Flag, 
  Zap, 
  Sparkles,
  Wifi,
  Tv,
  AlertTriangle
} from 'lucide-react';

interface MonthCalendarStepperProps {
  currentDay: number;
  totalDays: number;
  commitments: Commitment[];
  resolvedDays: number[];
  onSelectDay: (day: number) => void;
  onAdvanceDay: () => void;
}

export const MonthCalendarStepper: React.FC<MonthCalendarStepperProps> = ({
  currentDay,
  totalDays = 30,
  commitments,
  resolvedDays,
  onSelectDay,
  onAdvanceDay,
}) => {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="bg-[#101728]/80 border border-slate-700/60 rounded-3xl p-4 md:p-5 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
            30-Day Survival Timeline
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            {30 - currentDay} days remaining
          </span>
          <button
            onClick={onAdvanceDay}
            disabled={currentDay >= 30}
            className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center gap-1 active:scale-95 disabled:opacity-30"
          >
            <span>Next Day</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal timeline stepper bar */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="flex items-center gap-1.5 min-w-[680px]">
          {days.map((day) => {
            const isPast = day < currentDay;
            const isCurrent = day === currentDay;
            const isResolved = resolvedDays.includes(day);
            const dayCommitments = commitments.filter(c => c.dueDay === day && c.status === 'pending');
            const hasMilestone = day === 15 || day === 30 || day === 1;

            return (
              <button
                key={day}
                onClick={() => onSelectDay(day)}
                className={`relative flex-1 min-w-[36px] h-12 rounded-xl flex flex-col items-center justify-center transition-all border ${
                  isCurrent
                    ? 'bg-gradient-to-b from-cyan-500/30 to-indigo-600/30 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/30 scale-105 z-10'
                    : isPast
                    ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    : 'bg-[#141b2c]/60 border-slate-800/80 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                }`}
                title={`Day ${day}${dayCommitments.length ? ` • ₹${dayCommitments[0].amount} Due` : ''}`}
              >
                {/* Event / Commitment marker indicator */}
                {dayCommitments.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-[#101728] animate-ping" />
                )}
                {dayCommitments.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-[#101728]" />
                )}

                {/* Day number */}
                <span className={`text-xs font-mono font-extrabold ${isCurrent ? 'text-white text-sm' : ''}`}>
                  {day}
                </span>

                {/* Micro status badge under day */}
                <div className="text-[9px] font-mono leading-none mt-0.5">
                  {isCurrent ? (
                    <span className="text-cyan-400 font-bold">TODAY</span>
                  ) : day === 15 ? (
                    <span className="text-purple-400 font-bold">50%</span>
                  ) : day === 30 ? (
                    <span className="text-emerald-400 font-bold">END</span>
                  ) : isPast ? (
                    <span className="text-emerald-500/70">✓</span>
                  ) : (
                    <span className="text-slate-600">·</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Current Day</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Scheduled Auto-Debit Due</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Milestone (Day 15 / 30)</span>
          </div>
        </div>

        <span className="text-slate-500">Click any day to inspect encounters</span>
      </div>
    </div>
  );
};
