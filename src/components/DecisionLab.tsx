import React, { useState } from 'react';
import { GameState } from '../types';
import { simulateExpense } from '../utils/finance';
import { 
  FlaskConical, 
  Sparkles, 
  X, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  Lightbulb, 
  TrendingDown, 
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface DecisionLabProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
  onCommitSpend: (title: string, amount: number, category: string) => void;
  onApplyAlternative: (title: string, savedAmount: number, spentAmount: number, healthGain: number, vibeDelta: number) => void;
}

const POPULAR_TEMPTATIONS = [
  { title: 'Swiggy Gourmet Biryani + Gulab Jamun', amount: 480, category: 'Food' },
  { title: 'ZARA / H&M Oversized Tee', amount: 1290, category: 'Fashion' },
  { title: 'Saturday Night Club Cover Charge', amount: 1500, category: 'Social' },
  { title: 'Noise Cancelling Earbuds Flash Sale', amount: 1899, category: 'Shopping' },
  { title: 'Third Wave Coffee + Croissant Run', amount: 360, category: 'Food' },
];

export const DecisionLab: React.FC<DecisionLabProps> = ({
  isOpen,
  onClose,
  state,
  onCommitSpend,
  onApplyAlternative,
}) => {
  const [itemName, setItemName] = useState('Swiggy Late Night Feast');
  const [amountStr, setAmountStr] = useState('550');
  const [category, setCategory] = useState<'Food' | 'Fashion' | 'Social' | 'Shopping' | 'Utility'>('Food');
  const [wishlistSaved, setWishlistSaved] = useState(false);

  if (!isOpen) return null;

  const parsedAmount = Math.max(0, parseInt(amountStr) || 0);
  const simulation = simulateExpense(state, parsedAmount, category);

  const handleApplyQuickTemptation = (item: typeof POPULAR_TEMPTATIONS[0]) => {
    setItemName(item.title);
    setAmountStr(item.amount.toString());
    setCategory(item.category as typeof category);
    setWishlistSaved(false);
  };

  const handleSaveToWishlist = () => {
    setWishlistSaved(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0f172a] border-2 border-purple-500/60 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-100 p-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight text-white">
                  The Decision Lab
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-700">
                  SIMULATE BEFORE YOU SPEND
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Stress-test any impulse purchase before committing your hard-earned rupees.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Temptation Presets */}
        <div className="mt-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block mb-2">
            Popular Gen Z Temptations
          </span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TEMPTATIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyQuickTemptation(item)}
                className="text-xs px-2.5 py-1 rounded-xl bg-slate-800/70 hover:bg-purple-950/80 text-slate-300 hover:text-purple-300 border border-slate-700/80 hover:border-purple-600 transition-all font-medium active:scale-95"
              >
                {item.title} <span className="font-mono text-cyan-400">(₹{item.amount})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#141e33] rounded-2xl border border-slate-800">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-mono text-slate-400 font-bold uppercase block mb-1">
              What are you tempted to buy?
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                setWishlistSaved(false);
              }}
              placeholder="e.g. Swiggy Butter Chicken, Myntra Jacket"
              className="w-full bg-[#0b111e] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 font-bold uppercase block mb-1">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 font-bold font-mono">₹</span>
              <input
                type="number"
                min="0"
                step="50"
                value={amountStr}
                onChange={(e) => {
                  setAmountStr(e.target.value);
                  setWishlistSaved(false);
                }}
                className="w-full bg-[#0b111e] border border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-sm font-mono text-cyan-300 font-bold focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Interactive Consequences Matrix */}
        <div className="mt-5 p-4 rounded-2xl bg-[#11192e] border-2 border-slate-800 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-black uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Instantaneous Consequence Matrix</span>
            </span>
            <span className={`text-xs font-mono font-extrabold px-3 py-1 rounded-full border ${
              simulation.riskShift === 'Critical Alert'
                ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                : simulation.riskShift === 'High Risk'
                ? 'bg-orange-950 text-orange-300 border-orange-700'
                : simulation.riskShift === 'Moderate'
                ? 'bg-amber-950 text-amber-300 border-amber-700'
                : 'bg-emerald-950 text-emerald-300 border-emerald-700'
            }`}>
              {simulation.riskShift.toUpperCase()} SHIFT
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Metric 1: Daily Allowance Drop */}
            <div className="p-3 rounded-xl bg-[#090d17] border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Daily Allowance Impact
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-sm font-mono text-slate-500 line-through">
                  ₹{simulation.beforeDailyAllowance}
                </span>
                <span className="text-base font-mono font-black text-rose-400">
                  → ₹{simulation.afterDailyAllowance}
                </span>
              </div>
              <span className="text-[10px] text-rose-300/80 font-mono block mt-0.5">
                -₹{simulation.allowanceDifference}/day remainder
              </span>
            </div>

            {/* Metric 2: Cost Per Remaining Day */}
            <div className="p-3 rounded-xl bg-[#090d17] border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Cost Per Remaining Day
              </span>
              <div className="mt-1">
                <span className="text-base font-mono font-black text-amber-300">
                  +₹{simulation.costPerRemainingDay}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                  absorbed across {30 - state.currentDay + 1} days
                </span>
              </div>
            </div>

            {/* Metric 3: Savings Goal Delay */}
            <div className="p-3 rounded-xl bg-[#090d17] border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Savings Goal Delayed
              </span>
              <div className="mt-1">
                <span className="text-base font-mono font-black text-purple-300">
                  +{simulation.savingsGoalDelayedDays} Days
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ₹2,000 Shield target pushed
                </span>
              </div>
            </div>

            {/* Metric 4: Financial Health Score */}
            <div className="p-3 rounded-xl bg-[#090d17] border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Financial Health Score
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-sm font-mono text-slate-500">
                  {simulation.beforeHealth}%
                </span>
                <span className={`text-base font-mono font-black ${simulation.afterHealth < simulation.beforeHealth ? 'text-rose-400' : 'text-emerald-400'}`}>
                  → {simulation.afterHealth}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Composite rating impact
              </span>
            </div>

          </div>

          {/* Feedback banner */}
          {parsedAmount > 0 && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Gen Z Reality Check:</strong> This ₹{parsedAmount} spend drops your daily spendable allowance from ₹{simulation.beforeDailyAllowance} to ₹{simulation.afterDailyAllowance} for the remaining {30 - state.currentDay + 1} days of the month!
              </span>
            </div>
          )}
        </div>

        {/* Gen Z Smart Alternatives Section */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-2.5">
            <Lightbulb className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Gen Z Smart Alternatives (Hack the urge)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {simulation.smartAlternatives.map((alt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#11192e] border border-emerald-800/40 hover:border-emerald-500/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-white text-xs">
                      {alt.title}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      Save ₹{alt.savedAmount}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">
                    {alt.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400">
                    +{alt.healthGain}% Health
                  </span>
                  <button
                    onClick={() => {
                      const spent = Math.max(0, parsedAmount - alt.savedAmount);
                      onApplyAlternative(alt.title, alt.savedAmount, spent, alt.healthGain, alt.vibeDelta);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 active:scale-95"
                  >
                    Apply Alternative
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToWishlist}
              disabled={wishlistSaved}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 active:scale-95"
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{wishlistSaved ? 'Saved to 48-Hr Wishlist!' : '48-Hour Cool-Off (Wishlist)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onCommitSpend(itemName, parsedAmount, category);
                onClose();
              }}
              disabled={parsedAmount <= 0 || parsedAmount > state.spendableBalance}
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/20 active:scale-95 transition-all disabled:opacity-40 flex items-center gap-1.5"
            >
              <span>Commit Splurge (₹{parsedAmount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
