import React, { useState } from 'react';
import { Dilemma, DilemmaChoice } from '../types';
import { 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  ArrowRight, 
  Zap, 
  HelpCircle,
  TrendingDown,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

interface DailyDilemmaCardProps {
  dilemma: Dilemma;
  resolvedChoiceId?: string;
  onSelectChoice: (choice: DilemmaChoice) => void;
  onAdvanceDay: () => void;
  currentDay: number;
}

export const DailyDilemmaCard: React.FC<DailyDilemmaCardProps> = ({
  dilemma,
  resolvedChoiceId,
  onSelectChoice,
  onAdvanceDay,
  currentDay,
}) => {
  const [hoveredChoice, setHoveredChoice] = useState<DilemmaChoice | null>(null);

  const resolvedChoice = resolvedChoiceId 
    ? dilemma.choices.find(c => c.id === resolvedChoiceId) 
    : null;

  return (
    <div className="bg-[#101728]/95 border-2 border-slate-700/80 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Decorative cyber ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header lore badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{dilemma.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/80">
                DAY {dilemma.day} ENCOUNTER
              </span>
              <span className="text-xs font-mono text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-800/80">
                {dilemma.category}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-white mt-1">
              {dilemma.title}
            </h2>
          </div>
        </div>

        {resolvedChoice && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-mono font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>DECISION LOCKED</span>
          </div>
        )}
      </div>

      {/* Lore Description */}
      <p className="text-sm text-slate-300 leading-relaxed bg-[#0d1322]/80 p-3.5 rounded-2xl border border-slate-800 mb-5 relative z-10">
        {dilemma.lore}
      </p>

      {/* Choices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10">
        {dilemma.choices.map((choice) => {
          const isSelected = resolvedChoiceId === choice.id;
          const isFrugal = choice.badge === 'Frugal Hack' || choice.badge === 'Hard Skip';
          const isSplurge = choice.badge === 'Splurge';
          const isHustle = choice.badge === 'Side Hustle';

          return (
            <div
              key={choice.id}
              onMouseEnter={() => setHoveredChoice(choice)}
              onMouseLeave={() => setHoveredChoice(null)}
              className={`rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-950/60 ring-2 ring-cyan-500/40'
                  : 'bg-[#151d30]/90 border-slate-700/70 hover:border-cyan-500/60 hover:bg-[#1a243c]'
              }`}
            >
              <div>
                {/* Tactical Badge & Delte preview pill */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-md border ${
                    isSplurge 
                      ? 'bg-rose-950 text-rose-300 border-rose-800' 
                      : isFrugal 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                      : isHustle
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                  }`}>
                    {choice.badge}
                  </span>

                  {/* Immediate Cash Delta Badge */}
                  <span className={`text-xs font-mono font-bold ${
                    (choice.deltas.cash ?? 0) < 0 
                      ? 'text-rose-400' 
                      : (choice.deltas.cash ?? 0) > 0 
                      ? 'text-emerald-400' 
                      : (choice.deltas.savings ?? 0) !== 0
                      ? 'text-cyan-400'
                      : 'text-slate-400'
                  }`}>
                    {choice.deltas.cash 
                      ? (choice.deltas.cash > 0 ? `+₹${choice.deltas.cash}` : `-₹${Math.abs(choice.deltas.cash)}`)
                      : choice.deltas.savings
                      ? (choice.deltas.savings > 0 ? `+₹${choice.deltas.savings} Shield` : `-₹${Math.abs(choice.deltas.savings)} Shield`)
                      : '₹0 spent'}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-bold text-white text-sm leading-snug">
                  {choice.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  {choice.subtitle}
                </p>

                {/* Stat impact tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] font-mono">
                  {choice.deltas.vibe !== undefined && choice.deltas.vibe !== 0 && (
                    <span className={`px-1.5 py-0.5 rounded ${choice.deltas.vibe > 0 ? 'bg-pink-950/60 text-pink-300' : 'bg-rose-950/60 text-rose-300'}`}>
                      {choice.deltas.vibe > 0 ? `+${choice.deltas.vibe}% Vibe` : `${choice.deltas.vibe}% Vibe`}
                    </span>
                  )}
                  {choice.deltas.health !== undefined && choice.deltas.health !== 0 && (
                    <span className={`px-1.5 py-0.5 rounded ${choice.deltas.health > 0 ? 'bg-emerald-950/60 text-emerald-300' : 'bg-amber-950/60 text-amber-300'}`}>
                      {choice.deltas.health > 0 ? `+${choice.deltas.health}% Health` : `${choice.deltas.health}% Health`}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-2">
                <button
                  id={`choice-btn-${choice.id}`}
                  onClick={() => onSelectChoice(choice)}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-800 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Chosen Decision</span>
                    </>
                  ) : (
                    <>
                      <span>Commit Choice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Consequences Matrix & Gen Z Smart Tip Preview */}
      {hoveredChoice && (
        <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-[#0d1424] to-[#121a30] border border-cyan-800/60 shadow-xl transition-all animate-fadeIn relative z-10">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Consequence Preview: {hoveredChoice.title}</span>
            </span>
            <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
              hoveredChoice.consequences.riskChange === 'High'
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : hoveredChoice.consequences.riskChange === 'Moderate'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {hoveredChoice.consequences.riskChange.toUpperCase()} RISK
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold shrink-0">•</span>
              <span><strong>Runway:</strong> {hoveredChoice.consequences.runwayImpact}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-pink-400 font-bold shrink-0">•</span>
              <span><strong>Vibe:</strong> {hoveredChoice.consequences.vibeImpact}</span>
            </div>
          </div>

          {hoveredChoice.smartTip && (
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-300 font-medium">
              <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Gen Z Smart Tip: {hoveredChoice.smartTip}</span>
            </div>
          )}
        </div>
      )}

      {/* Advance to Next Day Prompt if Resolved */}
      {resolvedChoice && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2 relative z-10">
          <div className="text-xs text-slate-400">
            Day {currentDay} resolved! Ready for the next financial trial?
          </div>
          <button
            onClick={onAdvanceDay}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <span>Advance to Day {currentDay + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
