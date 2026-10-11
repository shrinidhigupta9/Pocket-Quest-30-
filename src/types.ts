export interface VitalStats {
  cashRunway: number;       // 0-100%
  savingsShield: number;    // 0-100% (target ₹2,000)
  vibeMeter: number;        // 0-100% (mental peace / social life)
  financialHealth: number;  // 0-100% (master composite score)
}

export type StatDelta = {
  cash?: number;            // in ₹ (+ or -)
  savings?: number;         // in ₹ (+ or -)
  vibe?: number;            // in % (+ or -)
  health?: number;          // in % (+ or -)
};

export interface DilemmaChoice {
  id: string;
  title: string;
  subtitle: string;
  badge: 'Splurge' | 'Frugal Hack' | 'Smart Balance' | 'Hard Skip' | 'Side Hustle';
  deltas: StatDelta;
  consequences: {
    runwayImpact: string;
    vibeImpact: string;
    riskChange: 'Low' | 'Moderate' | 'High' | 'Beneficial';
    summary: string;
  };
  smartTip?: string;
}

export interface Dilemma {
  id: string;
  day: number;
  title: string;
  category: 'Social' | 'Food' | 'Health' | 'Shopping' | 'Utility' | 'Opportunity';
  emoji: string;
  lore: string;
  choices: DilemmaChoice[];
}

export interface Commitment {
  id: string;
  title: string;
  amount: number;
  dueDay: number;
  category: 'Bill' | 'Subscription' | 'Rent/Living' | 'Health';
  status: 'pending' | 'paid' | 'snipped';
  icon: string;
  description: string;
  canSnip: boolean;
}

export interface Transaction {
  id: string;
  day: number;
  title: string;
  category: string;
  amount: number;         // positive = income/refund, negative = expense
  type: 'expense' | 'savings_lock' | 'savings_unlock' | 'commitment' | 'income' | 'penalty';
  timestamp: string;
  statDeltas: StatDelta;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlockedAtDay?: number;
  isUnlocked: boolean;
  category: 'survival' | 'discipline' | 'vibe' | 'mastery';
}

export interface GameState {
  currentDay: number;
  totalDays: number;
  startingPool: number;
  spendableBalance: number;
  lockedSavings: number;
  savingsTarget: number;
  stats: VitalStats;
  commitments: Commitment[];
  transactions: Transaction[];
  resolvedDilemmas: Record<number, string>; // day -> choiceId
  activeDilemma: Dilemma | null;
  badges: Badge[];
  soundEnabled: boolean;
  isGameOver: boolean;
  gameOverReason?: 'broke' | 'burnout' | 'victory';
  shakeActive: boolean;
  lastFeedbackAlert: {
    message: string;
    type: 'warning' | 'danger' | 'success' | 'info';
    timestamp: number;
  } | null;
}
