import { Commitment, GameState, VitalStats } from '../types';

export const BASELINE_DAILY_NEED = 200; // Baseline daily survival spend in INR for a Gen Z student

export function calculateDaysRemaining(currentDay: number, totalDays: number = 30): number {
  return Math.max(1, totalDays - currentDay + 1);
}

export function getUpcomingCommitments(commitments: Commitment[], currentDay: number): Commitment[] {
  return commitments.filter(c => c.status === 'pending' && c.dueDay >= currentDay);
}

export function calculatePendingCommitmentsAmount(commitments: Commitment[], currentDay: number): number {
  return getUpcomingCommitments(commitments, currentDay).reduce((acc, c) => acc + c.amount, 0);
}

export function calculateSafeDailyAllowance(
  spendableBalance: number,
  commitments: Commitment[],
  currentDay: number,
  totalDays: number = 30
): {
  safeDailyAllowance: number;
  daysRemaining: number;
  pendingCommitmentsAmount: number;
  effectiveSpendable: number;
  isDeficit: boolean;
} {
  const daysRemaining = calculateDaysRemaining(currentDay, totalDays);
  const pendingCommitmentsAmount = calculatePendingCommitmentsAmount(commitments, currentDay);
  const effectiveSpendable = spendableBalance - pendingCommitmentsAmount;
  const isDeficit = effectiveSpendable < 0;
  const safeDailyAllowance = isDeficit ? 0 : Math.round(effectiveSpendable / daysRemaining);

  return {
    safeDailyAllowance,
    daysRemaining,
    pendingCommitmentsAmount,
    effectiveSpendable,
    isDeficit,
  };
}

export function calculateRunwayPercentage(safeDailyAllowance: number): number {
  // 100% corresponds to ₹333/day (comfortable), 0% corresponds to ₹0/day
  // ₹200/day corresponds to 60%
  const percentage = Math.round((safeDailyAllowance / 300) * 100);
  return Math.min(100, Math.max(0, percentage));
}

export function calculateSavingsShieldPercentage(lockedSavings: number, target: number = 2000): number {
  return Math.min(100, Math.max(0, Math.round((lockedSavings / target) * 100)));
}

export function calculateFinancialHealth(
  runway: number,
  shield: number,
  vibe: number,
  hasOverdraft: boolean,
  commitmentsCount: number,
  snippedCount: number
): number {
  // Weighted master composite score:
  // 35% Runway + 30% Savings Shield + 20% Vibe + 15% Commitments/Discipline
  let disciplineScore = 80;
  if (snippedCount > 0) disciplineScore += 5;
  if (hasOverdraft) disciplineScore -= 30;

  const rawScore = 0.35 * runway + 0.30 * shield + 0.20 * vibe + 0.15 * disciplineScore;
  return Math.min(100, Math.max(0, Math.round(rawScore)));
}

export function getHealthGrade(score: number): {
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  label: string;
  colorClass: string;
} {
  if (score >= 90) return { grade: 'S', label: 'Financial Grandmaster', colorClass: 'text-emerald-400' };
  if (score >= 75) return { grade: 'A', label: 'Budget Prodigy', colorClass: 'text-cyan-400' };
  if (score >= 60) return { grade: 'B', label: 'Scrappy Hustler', colorClass: 'text-lime-400' };
  if (score >= 45) return { grade: 'C', label: 'Living on the Edge', colorClass: 'text-amber-400' };
  if (score >= 30) return { grade: 'D', label: 'Broke Aristocrat', colorClass: 'text-orange-500' };
  return { grade: 'F', label: 'Financial Flatline', colorClass: 'text-rose-500' };
}

// Consequence Simulation for "The Decision Lab"
export interface SimulationResult {
  beforeDailyAllowance: number;
  afterDailyAllowance: number;
  allowanceDifference: number;
  costPerRemainingDay: number;
  beforeRunway: number;
  afterRunway: number;
  beforeHealth: number;
  afterHealth: number;
  riskShift: 'Safe' | 'Moderate' | 'High Risk' | 'Critical Alert';
  burnoutRisk: boolean;
  brokeRisk: boolean;
  savingsGoalDelayedDays: number;
  smartAlternatives: {
    title: string;
    description: string;
    savedAmount: number;
    healthGain: number;
    vibeDelta: number;
  }[];
}

export function simulateExpense(
  state: GameState,
  spendAmount: number,
  category: string
): SimulationResult {
  const currentMath = calculateSafeDailyAllowance(
    state.spendableBalance,
    state.commitments,
    state.currentDay,
    state.totalDays
  );

  const newSpendable = Math.max(0, state.spendableBalance - spendAmount);
  const newMath = calculateSafeDailyAllowance(
    newSpendable,
    state.commitments,
    state.currentDay,
    state.totalDays
  );

  const beforeDailyAllowance = currentMath.safeDailyAllowance;
  const afterDailyAllowance = newMath.safeDailyAllowance;
  const allowanceDifference = beforeDailyAllowance - afterDailyAllowance;
  const daysRemaining = currentMath.daysRemaining;
  const costPerRemainingDay = Math.round(spendAmount / daysRemaining);

  const beforeRunway = calculateRunwayPercentage(beforeDailyAllowance);
  const afterRunway = calculateRunwayPercentage(afterDailyAllowance);

  // Vibe impact estimate
  let estimatedVibeDelta = 0;
  if (category === 'Food' || category === 'Social' || category === 'Party') {
    estimatedVibeDelta = Math.min(25, Math.round(spendAmount / 50));
  }
  const afterVibe = Math.min(100, Math.max(0, state.stats.vibeMeter + estimatedVibeDelta));

  const beforeHealth = state.stats.financialHealth;
  const afterHealth = calculateFinancialHealth(
    afterRunway,
    state.stats.savingsShield,
    afterVibe,
    false,
    state.commitments.length,
    0
  );

  // Risk shift evaluation
  let riskShift: 'Safe' | 'Moderate' | 'High Risk' | 'Critical Alert' = 'Safe';
  if (afterDailyAllowance < 120 || newMath.isDeficit) {
    riskShift = 'Critical Alert';
  } else if (afterDailyAllowance < 180 || allowanceDifference > 50) {
    riskShift = 'High Risk';
  } else if (allowanceDifference > 25) {
    riskShift = 'Moderate';
  }

  // Days savings target delayed
  const savingsTargetDiff = Math.max(0, state.savingsTarget - state.lockedSavings);
  const savingsGoalDelayedDays = Math.min(daysRemaining, Math.ceil(spendAmount / Math.max(1, beforeDailyAllowance)));

  // Generate Gen Z Smart Alternatives
  const smartAlternatives = generateAlternatives(spendAmount, category);

  return {
    beforeDailyAllowance,
    afterDailyAllowance,
    allowanceDifference,
    costPerRemainingDay,
    beforeRunway,
    afterRunway,
    beforeHealth,
    afterHealth,
    riskShift,
    burnoutRisk: afterVibe < 20,
    brokeRisk: afterRunway < 20 || newMath.isDeficit,
    savingsGoalDelayedDays,
    smartAlternatives,
  };
}

function generateAlternatives(amount: number, category: string) {
  const alts = [];

  if (category === 'Food') {
    alts.push({
      title: 'Cook at hostel / home + Chai',
      description: 'Prep quick meal with flatmate + tapri chai (+₹' + Math.round(amount * 0.75) + ' saved)',
      savedAmount: Math.round(amount * 0.75),
      healthGain: 12,
      vibeDelta: 5,
    });
    alts.push({
      title: 'Split an order with roommate',
      description: 'BOGO deal or 1:1 split on Swiggy (+₹' + Math.round(amount * 0.5) + ' saved)',
      savedAmount: Math.round(amount * 0.5),
      healthGain: 8,
      vibeDelta: 15,
    });
  } else if (category === 'Shopping' || category === 'Fashion') {
    alts.push({
      title: 'Apply 48-Hour Cool-Off Rule',
      description: 'Add to wishlist & wait 2 days. 80% of Gen Z impulse urges vanish (+₹' + amount + ' saved)',
      savedAmount: amount,
      healthGain: 15,
      vibeDelta: -2,
    });
    alts.push({
      title: 'Thrift or buy pre-loved alternative',
      description: 'Check FreeUp or swap clothes with friend (+₹' + Math.round(amount * 0.65) + ' saved)',
      savedAmount: Math.round(amount * 0.65),
      healthGain: 10,
      vibeDelta: 10,
    });
  } else if (category === 'Social' || category === 'Party') {
    alts.push({
      title: 'Host BYOB Board Game / Watch Party',
      description: 'Hangout at flat with popcorn & YouTube party (+₹' + Math.round(amount * 0.7) + ' saved)',
      savedAmount: Math.round(amount * 0.7),
      healthGain: 10,
      vibeDelta: 20,
    });
    alts.push({
      title: 'Designated Driver / Drinks pass',
      description: 'Eat beforehand, stick to iced tea or soft drinks (+₹' + Math.round(amount * 0.6) + ' saved)',
      savedAmount: Math.round(amount * 0.6),
      healthGain: 12,
      vibeDelta: 8,
    });
  } else {
    alts.push({
      title: 'Splitwise delayed settlement',
      description: 'Split with group or claim cashback / student discount (+₹' + Math.round(amount * 0.4) + ' saved)',
      savedAmount: Math.round(amount * 0.4),
      healthGain: 6,
      vibeDelta: 4,
    });
    alts.push({
      title: 'Skip & deposit into Savings Shield',
      description: 'Lock half into emergency buffer (+₹' + Math.round(amount * 0.5) + ' into Shield)',
      savedAmount: Math.round(amount * 0.5),
      healthGain: 18,
      vibeDelta: 0,
    });
  }

  return alts;
}
