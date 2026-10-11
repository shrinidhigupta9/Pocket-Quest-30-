import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DilemmaChoice, GameState, Commitment } from './types';
import { getInitialGameState, INITIAL_BADGES, INITIAL_TRANSACTIONS } from './data/initialState';
import { DILEMMAS_LIST } from './data/dilemmas';
import { 
  calculateFinancialHealth, 
  calculateRunwayPercentage, 
  calculateSafeDailyAllowance, 
  calculateSavingsShieldPercentage 
} from './utils/finance';
import { soundFx } from './utils/audio';

import { HeaderHUD } from './components/HeaderHUD';
import { VitalStatsGrid } from './components/VitalStatsGrid';
import { DailyDilemmaCard } from './components/DailyDilemmaCard';
import { DecisionLab } from './components/DecisionLab';
import { CommitmentVault } from './components/CommitmentVault';
import { MonthCalendarStepper } from './components/MonthCalendarStepper';
import { LedgerHistory } from './components/LedgerHistory';
import { BadgesModal } from './components/BadgesModal';
import { GameOverModal } from './components/GameOverModal';

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState);
  const [isDecisionLabOpen, setIsDecisionLabOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'quest' | 'vault' | 'ledger'>('quest');

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#10b981', '#fbbf24', '#ec4899', '#a855f7'],
      });
    } catch {
      // ignore
    }
  };

  // Toggle sound
  const handleToggleSound = () => {
    const nextState = !gameState.soundEnabled;
    soundFx.setEnabled(nextState);
    setGameState(prev => ({ ...prev, soundEnabled: nextState }));
    if (nextState) soundFx.playTap();
  };

  // Reset to presets
  const handleReset = (preset: 'default' | 'hardcore' | 'day1' | 'day15' = 'default') => {
    soundFx.playTap();
    if (preset === 'default') {
      setGameState(getInitialGameState());
      return;
    }

    if (preset === 'day1') {
      const state = getInitialGameState();
      state.currentDay = 1;
      state.spendableBalance = 9000;
      state.lockedSavings = 1000;
      state.activeDilemma = DILEMMAS_LIST[0];
      state.resolvedDilemmas = {};
      state.commitments.forEach(c => c.status = 'pending');
      const math = calculateSafeDailyAllowance(state.spendableBalance, state.commitments, 1, 30);
      state.stats.cashRunway = calculateRunwayPercentage(math.safeDailyAllowance);
      state.stats.financialHealth = 85;
      state.lastFeedbackAlert = {
        message: '🚀 Day 1 Launched: Fresh ₹10k pool loaded. Survive until Day 30!',
        type: 'success',
        timestamp: Date.now(),
      };
      setGameState(state);
      return;
    }

    if (preset === 'hardcore') {
      const state = getInitialGameState();
      state.startingPool = 5000;
      state.spendableBalance = 3200;
      state.lockedSavings = 500;
      state.currentDay = 10;
      state.stats.vibeMeter = 45;
      const math = calculateSafeDailyAllowance(state.spendableBalance, state.commitments, 10, 30);
      state.stats.cashRunway = calculateRunwayPercentage(math.safeDailyAllowance);
      state.stats.savingsShield = calculateSavingsShieldPercentage(state.lockedSavings, 2000);
      state.stats.financialHealth = 48;
      state.lastFeedbackAlert = {
        message: '🔥 HARDCORE BROKE MODE: Starting pool halved to ₹5k! Every rupee counts.',
        type: 'danger',
        timestamp: Date.now(),
      };
      setGameState(state);
      return;
    }

    if (preset === 'day15') {
      const state = getInitialGameState();
      state.currentDay = 15;
      state.spendableBalance = 4200;
      state.lockedSavings = 1500;
      state.activeDilemma = DILEMMAS_LIST.find(d => d.day === 15) || DILEMMAS_LIST[4];
      const math = calculateSafeDailyAllowance(state.spendableBalance, state.commitments, 15, 30);
      state.stats.cashRunway = calculateRunwayPercentage(math.safeDailyAllowance);
      state.stats.savingsShield = calculateSavingsShieldPercentage(state.lockedSavings, 2000);
      state.stats.financialHealth = 70;
      state.lastFeedbackAlert = {
        message: '⚡ Day 15 Milestone: Halfway through! OTT auto-debit due today.',
        type: 'warning',
        timestamp: Date.now(),
      };
      setGameState(state);
    }
  };

  // Dilemma Choice Selection with reactive feedback loop
  const handleSelectChoice = (choice: DilemmaChoice) => {
    const isSplurge = choice.badge === 'Splurge';
    if (isSplurge) {
      soundFx.playWarning();
    } else if (choice.deltas.savings || choice.badge === 'Frugal Hack' || choice.badge === 'Side Hustle') {
      soundFx.playCoin();
    } else {
      soundFx.playTap();
    }

    setGameState((prev) => {
      let newSpendable = prev.spendableBalance;
      let newLockedSavings = prev.lockedSavings;

      if (choice.deltas.cash) {
        newSpendable = Math.max(0, newSpendable + choice.deltas.cash);
      }
      if (choice.deltas.savings) {
        newLockedSavings = Math.max(0, newLockedSavings + choice.deltas.savings);
      }

      // Vibe change
      const newVibe = Math.min(100, Math.max(0, prev.stats.vibeMeter + (choice.deltas.vibe ?? 0)));

      // Math ripple
      const math = calculateSafeDailyAllowance(
        newSpendable,
        prev.commitments,
        prev.currentDay,
        prev.totalDays
      );
      const newRunway = calculateRunwayPercentage(math.safeDailyAllowance);
      const newShield = calculateSavingsShieldPercentage(newLockedSavings, prev.savingsTarget);
      const newHealth = calculateFinancialHealth(
        newRunway,
        newShield,
        newVibe,
        false,
        prev.commitments.length,
        prev.commitments.filter(c => c.status === 'snipped').length
      );

      // Previous math for delta comparison feedback
      const prevMath = calculateSafeDailyAllowance(
        prev.spendableBalance,
        prev.commitments,
        prev.currentDay,
        prev.totalDays
      );
      const allowanceDiff = prevMath.safeDailyAllowance - math.safeDailyAllowance;

      let alertMessage = `Decision locked: ${choice.title}`;
      let alertType: 'warning' | 'danger' | 'success' | 'info' = 'info';

      if (choice.deltas.cash && choice.deltas.cash < -500) {
        alertMessage = `⚠️ Alert: This ₹${Math.abs(choice.deltas.cash)} spend drops your daily allowance from ₹${prevMath.safeDailyAllowance} to ₹${math.safeDailyAllowance} for the rest of the month!`;
        alertType = 'danger';
      } else if (choice.badge === 'Frugal Hack' || choice.badge === 'Smart Balance') {
        alertMessage = `✨ Smart move! Preserved safe daily allowance at ₹${math.safeDailyAllowance}/day.`;
        alertType = 'success';
      } else if (choice.badge === 'Side Hustle') {
        alertMessage = `🚀 Side hustle win! Cash pool surged by +₹${choice.deltas.cash}.`;
        alertType = 'success';
      }

      // Check badges
      const updatedBadges = [...prev.badges];
      if (newLockedSavings >= prev.savingsTarget) {
        const zenBadge = updatedBadges.find(b => b.id === 'badge-zen');
        if (zenBadge && !zenBadge.isUnlocked) {
          zenBadge.isUnlocked = true;
          zenBadge.unlockedAtDay = prev.currentDay;
          triggerConfetti();
          soundFx.playVictory();
        }
      }

      // Add to transaction ledger
      const newTx = {
        id: `tx-${Date.now()}`,
        day: prev.currentDay,
        title: choice.title,
        category: prev.activeDilemma?.category || 'Encounter',
        amount: choice.deltas.cash ?? (choice.deltas.savings ? -choice.deltas.savings : 0),
        type: (choice.deltas.cash && choice.deltas.cash > 0 ? 'income' : 'expense') as 'income' | 'expense',
        timestamp: `Day ${prev.currentDay} • Tactical Choice`,
        statDeltas: choice.deltas,
      };

      return {
        ...prev,
        spendableBalance: newSpendable,
        lockedSavings: newLockedSavings,
        stats: {
          cashRunway: newRunway,
          savingsShield: newShield,
          vibeMeter: newVibe,
          financialHealth: newHealth,
        },
        transactions: [newTx, ...prev.transactions],
        resolvedDilemmas: {
          ...prev.resolvedDilemmas,
          [prev.currentDay]: choice.id,
        },
        shakeActive: isSplurge,
        badges: updatedBadges,
        lastFeedbackAlert: {
          message: alertMessage,
          type: alertType,
          timestamp: Date.now(),
        },
      };
    });

    if (isSplurge) {
      setTimeout(() => {
        setGameState(prev => ({ ...prev, shakeActive: false }));
      }, 500);
    }
  };

  // Advance Day Stepper Logic
  const handleAdvanceDay = () => {
    soundFx.playTap();
    setGameState((prev) => {
      if (prev.currentDay >= 30) {
        // Game Over - Victory!
        soundFx.playVictory();
        triggerConfetti();
        return {
          ...prev,
          isGameOver: true,
          gameOverReason: 'victory',
        };
      }

      const nextDay = prev.currentDay + 1;

      // Auto-debit scheduled commitments due on this day
      let updatedSpendable = prev.spendableBalance;
      let updatedCommitments = prev.commitments.map(c => ({ ...c }));
      let hadOverdraft = false;
      let alertMessage = `Advanced to Day ${nextDay}.`;
      let alertType: 'warning' | 'danger' | 'success' | 'info' = 'info';

      const dueCommitments = updatedCommitments.filter(c => c.dueDay === nextDay && c.status === 'pending');
      
      dueCommitments.forEach((comm) => {
        if (updatedSpendable >= comm.amount) {
          updatedSpendable -= comm.amount;
          comm.status = 'paid';
          alertMessage = `⚡ Scheduled commitment auto-debited: ${comm.title} (-₹${comm.amount}).`;
          alertType = 'info';
          soundFx.playCoin();
        } else {
          // Overdraft Penalty!
          updatedSpendable = Math.max(0, updatedSpendable - comm.amount - 250);
          comm.status = 'paid';
          hadOverdraft = true;
          alertMessage = `🚨 OVERDRAFT PENALTY: Insufficient balance for ${comm.title}! Debited with ₹250 penalty fee.`;
          alertType = 'danger';
          soundFx.playWarning();
        }
      });

      // Daily Vibe Decay: if player didn't have social spend, slight vibe dip to simulate hermit burnout
      let newVibe = prev.stats.vibeMeter;
      if (!prev.resolvedDilemmas[prev.currentDay]) {
        newVibe = Math.max(0, newVibe - 2);
      }

      // Check Mid-Month Milestone
      const updatedBadges = [...prev.badges];
      if (nextDay === 15 && prev.lockedSavings >= 1000) {
        const midBadge = updatedBadges.find(b => b.id === 'badge-halfway');
        if (midBadge && !midBadge.isUnlocked) {
          midBadge.isUnlocked = true;
          midBadge.unlockedAtDay = 15;
          triggerConfetti();
          soundFx.playVictory();
          alertMessage = `🎉 Mid-Month Milestone Reached! Day 15 survived with emergency shield intact.`;
          alertType = 'success';
        }
      }

      // Update active dilemma
      const nextDilemma = DILEMMAS_LIST.find(d => d.day === nextDay) || DILEMMAS_LIST[(nextDay % DILEMMAS_LIST.length)];

      const math = calculateSafeDailyAllowance(updatedSpendable, updatedCommitments, nextDay, prev.totalDays);
      const newRunway = calculateRunwayPercentage(math.safeDailyAllowance);
      const newShield = calculateSavingsShieldPercentage(prev.lockedSavings, prev.savingsTarget);
      const newHealth = calculateFinancialHealth(newRunway, newShield, newVibe, hadOverdraft, updatedCommitments.length, 0);

      // Check burnout or bankruptcy defeat
      let isGameOver = false;
      let gameOverReason: 'broke' | 'burnout' | 'victory' | undefined = undefined;

      if (newVibe <= 0) {
        isGameOver = true;
        gameOverReason = 'burnout';
        soundFx.playWarning();
      } else if (updatedSpendable <= 0 && math.pendingCommitmentsAmount > 0) {
        isGameOver = true;
        gameOverReason = 'broke';
        soundFx.playWarning();
      }

      return {
        ...prev,
        currentDay: nextDay,
        spendableBalance: updatedSpendable,
        commitments: updatedCommitments,
        activeDilemma: nextDilemma,
        badges: updatedBadges,
        stats: {
          cashRunway: newRunway,
          savingsShield: newShield,
          vibeMeter: newVibe,
          financialHealth: newHealth,
        },
        isGameOver,
        gameOverReason,
        lastFeedbackAlert: {
          message: alertMessage,
          type: alertType,
          timestamp: Date.now(),
        },
      };
    });
  };

  // Jump or select day
  const handleSelectDay = (day: number) => {
    soundFx.playTap();
    const dilemmaForDay = DILEMMAS_LIST.find(d => d.day === day) || DILEMMAS_LIST[0];
    setGameState(prev => ({
      ...prev,
      currentDay: day,
      activeDilemma: dilemmaForDay,
      lastFeedbackAlert: {
        message: `Inspecting Day ${day} timeline and financial conditions.`,
        type: 'info',
        timestamp: Date.now(),
      },
    }));
  };

  // Snip Subscription tool
  const handleSnipCommitment = (commitmentId: string) => {
    soundFx.playSnip();
    setGameState((prev) => {
      const target = prev.commitments.find(c => c.id === commitmentId);
      if (!target) return prev;

      const updatedCommitments = prev.commitments.map(c => 
        c.id === commitmentId ? { ...c, status: 'snipped' as const } : c
      );

      const math = calculateSafeDailyAllowance(
        prev.spendableBalance,
        updatedCommitments,
        prev.currentDay,
        prev.totalDays
      );
      const newRunway = calculateRunwayPercentage(math.safeDailyAllowance);
      const newHealth = calculateFinancialHealth(
        newRunway,
        prev.stats.savingsShield,
        prev.stats.vibeMeter,
        false,
        updatedCommitments.length,
        updatedCommitments.filter(c => c.status === 'snipped').length
      );

      // Badge unlock
      const updatedBadges = [...prev.badges];
      const snipBadge = updatedBadges.find(b => b.id === 'badge-snipper');
      if (snipBadge && !snipBadge.isUnlocked) {
        snipBadge.isUnlocked = true;
        snipBadge.unlockedAtDay = prev.currentDay;
      }

      const tx = {
        id: `tx-snip-${Date.now()}`,
        day: prev.currentDay,
        title: `Snipped Subscription: ${target.title}`,
        category: 'Vault Snip',
        amount: target.amount,
        type: 'income' as const,
        timestamp: `Day ${prev.currentDay} • Vault Snip Tool`,
        statDeltas: { health: 6 },
      };

      return {
        ...prev,
        commitments: updatedCommitments,
        stats: {
          ...prev.stats,
          cashRunway: newRunway,
          financialHealth: newHealth,
        },
        transactions: [tx, ...prev.transactions],
        badges: updatedBadges,
        lastFeedbackAlert: {
          message: `✂️ Vault Snip: Cancelled ${target.title}! Saved ₹${target.amount} & raised daily allowance to ₹${math.safeDailyAllowance}/day.`,
          type: 'success',
          timestamp: Date.now(),
        },
      };
    });
  };

  // Add commitment
  const handleAddCommitment = (newComm: Commitment) => {
    soundFx.playTap();
    setGameState(prev => ({
      ...prev,
      commitments: [...prev.commitments, newComm],
      lastFeedbackAlert: {
        message: `Added commitment ${newComm.title} (₹${newComm.amount}) due on Day ${newComm.dueDay}.`,
        type: 'info',
        timestamp: Date.now(),
      },
    }));
  };

  // Lock Savings into Shield
  const handleLockSavings = (amount: number) => {
    soundFx.playCoin();
    setGameState((prev) => {
      if (prev.spendableBalance < amount) return prev;
      const newSpendable = prev.spendableBalance - amount;
      const newLocked = prev.lockedSavings + amount;
      const math = calculateSafeDailyAllowance(newSpendable, prev.commitments, prev.currentDay, prev.totalDays);
      const newRunway = calculateRunwayPercentage(math.safeDailyAllowance);
      const newShield = calculateSavingsShieldPercentage(newLocked, prev.savingsTarget);
      const newHealth = calculateFinancialHealth(newRunway, newShield, prev.stats.vibeMeter, false, prev.commitments.length, 0);

      const tx = {
        id: `tx-lock-${Date.now()}`,
        day: prev.currentDay,
        title: `Locked ₹${amount} into Savings Shield`,
        category: 'Savings',
        amount: -amount,
        type: 'savings_lock' as const,
        timestamp: `Day ${prev.currentDay} • Shield Fortification`,
        statDeltas: { savings: amount, health: 4 },
      };

      if (newLocked >= prev.savingsTarget) {
        triggerConfetti();
        soundFx.playVictory();
      }

      return {
        ...prev,
        spendableBalance: newSpendable,
        lockedSavings: newLocked,
        stats: {
          ...prev.stats,
          cashRunway: newRunway,
          savingsShield: newShield,
          financialHealth: newHealth,
        },
        transactions: [tx, ...prev.transactions],
        lastFeedbackAlert: {
          message: `🛡️ Fortified Savings Shield: ₹${amount} locked. Target progress: ${newShield}%.`,
          type: 'success',
          timestamp: Date.now(),
        },
      };
    });
  };

  // Unlock Savings from Shield
  const handleUnlockSavings = (amount: number) => {
    soundFx.playTap();
    setGameState((prev) => {
      if (prev.lockedSavings < amount) return prev;
      const newSpendable = prev.spendableBalance + amount;
      const newLocked = prev.lockedSavings - amount;
      const math = calculateSafeDailyAllowance(newSpendable, prev.commitments, prev.currentDay, prev.totalDays);
      const newRunway = calculateRunwayPercentage(math.safeDailyAllowance);
      const newShield = calculateSavingsShieldPercentage(newLocked, prev.savingsTarget);
      const newHealth = calculateFinancialHealth(newRunway, newShield, prev.stats.vibeMeter, false, prev.commitments.length, 0);

      const tx = {
        id: `tx-unlock-${Date.now()}`,
        day: prev.currentDay,
        title: `Emergency Unlock ₹${amount} from Savings Shield`,
        category: 'Savings',
        amount: amount,
        type: 'savings_unlock' as const,
        timestamp: `Day ${prev.currentDay} • Emergency Relief`,
        statDeltas: { savings: -amount, cash: amount },
      };

      return {
        ...prev,
        spendableBalance: newSpendable,
        lockedSavings: newLocked,
        stats: {
          ...prev.stats,
          cashRunway: newRunway,
          savingsShield: newShield,
          financialHealth: newHealth,
        },
        transactions: [tx, ...prev.transactions],
        lastFeedbackAlert: {
          message: `Unlocked ₹${amount} from Savings Shield to spendable cash buffer.`,
          type: 'warning',
          timestamp: Date.now(),
        },
      };
    });
  };

  // Commit spend from Decision Lab
  const handleCommitSpendFromLab = (title: string, amount: number, category: string) => {
    soundFx.playWarning();
    setGameState((prev) => {
      const newSpendable = Math.max(0, prev.spendableBalance - amount);
      const math = calculateSafeDailyAllowance(newSpendable, prev.commitments, prev.currentDay, prev.totalDays);
      const newRunway = calculateRunwayPercentage(math.safeDailyAllowance);
      const newHealth = calculateFinancialHealth(newRunway, prev.stats.savingsShield, prev.stats.vibeMeter, false, prev.commitments.length, 0);

      const prevMath = calculateSafeDailyAllowance(prev.spendableBalance, prev.commitments, prev.currentDay, prev.totalDays);

      const tx = {
        id: `tx-lab-${Date.now()}`,
        day: prev.currentDay,
        title: `Impulse Splurge: ${title}`,
        category,
        amount: -amount,
        type: 'expense' as const,
        timestamp: `Day ${prev.currentDay} • Decision Lab Commit`,
        statDeltas: { cash: -amount, vibe: 10, health: -8 },
      };

      return {
        ...prev,
        spendableBalance: newSpendable,
        stats: {
          ...prev.stats,
          cashRunway: newRunway,
          financialHealth: newHealth,
        },
        transactions: [tx, ...prev.transactions],
        shakeActive: true,
        lastFeedbackAlert: {
          message: `⚠️ Alert: This ₹${amount} spend dropped your daily allowance from ₹${prevMath.safeDailyAllowance} to ₹${math.safeDailyAllowance}!`,
          type: 'danger',
          timestamp: Date.now(),
        },
      };
    });

    setTimeout(() => {
      setGameState(prev => ({ ...prev, shakeActive: false }));
    }, 500);
  };

  // Apply alternative from Decision Lab
  const handleApplyAlternativeFromLab = (
    title: string,
    savedAmount: number,
    spentAmount: number,
    healthGain: number,
    vibeDelta: number
  ) => {
    soundFx.playCoin();
    setGameState((prev) => {
      const newSpendable = Math.max(0, prev.spendableBalance - spentAmount);
      const newVibe = Math.min(100, Math.max(0, prev.stats.vibeMeter + vibeDelta));
      const math = calculateSafeDailyAllowance(newSpendable, prev.commitments, prev.currentDay, prev.totalDays);
      const newRunway = calculateRunwayPercentage(math.safeDailyAllowance);
      const newHealth = calculateFinancialHealth(newRunway, prev.stats.savingsShield, newVibe, false, prev.commitments.length, 0);

      const tx = {
        id: `tx-alt-${Date.now()}`,
        day: prev.currentDay,
        title: `Smart Alternative: ${title}`,
        category: 'Smart Hack',
        amount: -spentAmount,
        type: 'expense' as const,
        timestamp: `Day ${prev.currentDay} • Decision Lab Hack`,
        statDeltas: { cash: -spentAmount, vibe: vibeDelta, health: healthGain },
      };

      return {
        ...prev,
        spendableBalance: newSpendable,
        stats: {
          ...prev.stats,
          cashRunway: newRunway,
          vibeMeter: newVibe,
          financialHealth: newHealth,
        },
        transactions: [tx, ...prev.transactions],
        lastFeedbackAlert: {
          message: `🎯 Smart Alternative applied! Saved ₹${savedAmount} and earned +${healthGain}% Financial Health.`,
          type: 'success',
          timestamp: Date.now(),
        },
      };
    });
  };

  const resolvedDays = Object.keys(gameState.resolvedDilemmas).map(k => parseInt(k));

  return (
    <div className={`min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans transition-all ${
      gameState.shakeActive ? 'animate-shake' : ''
    }`}>
      
      {/* Top HUD */}
      <HeaderHUD
        state={gameState}
        onToggleSound={handleToggleSound}
        onReset={handleReset}
        onOpenDecisionLab={() => setIsDecisionLabOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onAdvanceDay={handleAdvanceDay}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-5 space-y-6">
        
        {/* Vital Stats Dashboard Grid */}
        <VitalStatsGrid
          stats={gameState.stats}
          spendableBalance={gameState.spendableBalance}
          lockedSavings={gameState.lockedSavings}
          savingsTarget={gameState.savingsTarget}
          safeDailyAllowance={calculateSafeDailyAllowance(
            gameState.spendableBalance,
            gameState.commitments,
            gameState.currentDay,
            gameState.totalDays
          ).safeDailyAllowance}
          pendingCommitmentsAmount={calculateSafeDailyAllowance(
            gameState.spendableBalance,
            gameState.commitments,
            gameState.currentDay,
            gameState.totalDays
          ).pendingCommitmentsAmount}
          onLockSavings={handleLockSavings}
          onUnlockSavings={handleUnlockSavings}
        />

        {/* 30-Day Calendar Timeline Stepper */}
        <MonthCalendarStepper
          currentDay={gameState.currentDay}
          totalDays={gameState.totalDays}
          commitments={gameState.commitments}
          resolvedDays={resolvedDays}
          onSelectDay={handleSelectDay}
          onAdvanceDay={handleAdvanceDay}
        />

        {/* Tab Navigation for Gameplay Focus */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('quest')}
            className={`px-4 py-2 rounded-xl font-bold text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'quest'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Daily Encounter & Dilemma
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 rounded-xl font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'vault'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <span>Commitment Vault</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-xl font-bold text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'ledger'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Survival Ledger ({gameState.transactions.length})
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'quest' && gameState.activeDilemma && (
          <DailyDilemmaCard
            dilemma={gameState.activeDilemma}
            resolvedChoiceId={gameState.resolvedDilemmas[gameState.currentDay]}
            onSelectChoice={handleSelectChoice}
            onAdvanceDay={handleAdvanceDay}
            currentDay={gameState.currentDay}
          />
        )}

        {activeTab === 'vault' && (
          <CommitmentVault
            commitments={gameState.commitments}
            currentDay={gameState.currentDay}
            onSnipCommitment={handleSnipCommitment}
            onAddCommitment={handleAddCommitment}
          />
        )}

        {activeTab === 'ledger' && (
          <LedgerHistory transactions={gameState.transactions} />
        )}

      </main>

      {/* Decision Lab Modal */}
      <DecisionLab
        isOpen={isDecisionLabOpen}
        onClose={() => setIsDecisionLabOpen(false)}
        state={gameState}
        onCommitSpend={handleCommitSpendFromLab}
        onApplyAlternative={handleApplyAlternativeFromLab}
      />

      {/* Badges Modal */}
      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        badges={gameState.badges}
      />

      {/* Game Over / Post-Mortem Modal */}
      <GameOverModal
        state={gameState}
        onRestart={() => handleReset('default')}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 px-4 py-4 text-center text-xs text-slate-500 font-mono">
        PocketQuest 30 • Real Financial Math Roguelike Simulator for Gen Z • Target: ₹10k Budget Mastery
      </footer>
    </div>
  );
};

export default App;
