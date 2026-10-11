import { Badge, Commitment, GameState, Transaction } from '../types';
import { DILEMMAS_LIST } from './dilemmas';
import {
  calculateFinancialHealth,
  calculateRunwayPercentage,
  calculateSafeDailyAllowance,
  calculateSavingsShieldPercentage,
} from '../utils/finance';

export const INITIAL_COMMITMENTS: Commitment[] = [
  {
    id: 'comm-wifi',
    title: 'High-Speed Flat WiFi',
    amount: 701,
    dueDay: 12,
    category: 'Bill',
    status: 'pending',
    icon: 'Wifi',
    description: 'Shared 200 Mbps broadband with roommates. Essential for assignments & gaming.',
    canSnip: true,
  },
  {
    id: 'comm-ott',
    title: 'OTT & Music Bundle (Netflix + Spotify)',
    amount: 499,
    dueDay: 15,
    category: 'Subscription',
    status: 'pending',
    icon: 'Tv',
    description: 'Auto-debits on Day 15. Can be snipped to save ₹499.',
    canSnip: true,
  },
  {
    id: 'comm-mobile',
    title: '5G Mobile Recharge (40GB)',
    amount: 299,
    dueDay: 20,
    category: 'Subscription',
    status: 'pending',
    icon: 'Smartphone',
    description: 'Emergency data for campus commutes and UPI connectivity.',
    canSnip: true,
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-0',
    day: 1,
    title: 'Month Opening Pocket Money / Stipend',
    category: 'Income',
    amount: 10000,
    type: 'income',
    timestamp: 'Day 1 • 09:00 AM',
    statDeltas: { cash: 10000, vibe: 20, health: 15 },
  },
  {
    id: 'tx-1',
    day: 1,
    title: 'Emergency Fund Locked (Savings Shield)',
    category: 'Savings',
    amount: -1000,
    type: 'savings_lock',
    timestamp: 'Day 1 • 09:30 AM',
    statDeltas: { cash: -1000, savings: 1000, health: 10 },
  },
  {
    id: 'tx-2',
    day: 2,
    title: 'Flat Grocery & Pantry Bulk Split',
    category: 'Utility',
    amount: -900,
    type: 'expense',
    timestamp: 'Day 2 • 02:15 PM',
    statDeltas: { cash: -900, vibe: 5, health: 8 },
  },
  {
    id: 'tx-3',
    day: 4,
    title: 'Friday Pizza Party Split',
    category: 'Food',
    amount: -350,
    type: 'expense',
    timestamp: 'Day 4 • 09:45 PM',
    statDeltas: { cash: -350, vibe: 15, health: -4 },
  },
  {
    id: 'tx-4',
    day: 6,
    title: 'Metro Smart Card Recharge',
    category: 'Utility',
    amount: -500,
    type: 'expense',
    timestamp: 'Day 6 • 08:30 AM',
    statDeltas: { cash: -500, health: 4 },
  },
  {
    id: 'tx-5',
    day: 8,
    title: 'Hostel Night Canteen Snacks & Chai',
    category: 'Food',
    amount: -250,
    type: 'expense',
    timestamp: 'Day 8 • 11:20 PM',
    statDeltas: { cash: -250, vibe: 10, health: -2 },
  },
  {
    id: 'tx-6',
    day: 9,
    title: 'Campus Stationery & Notebooks',
    category: 'Utility',
    amount: -600,
    type: 'expense',
    timestamp: 'Day 9 • 04:10 PM',
    statDeltas: { cash: -600, health: 2 },
  },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-starter',
    title: 'First Step Survivor',
    description: 'Began the 30-day trial and set up your budget pool.',
    emoji: '🌱',
    unlockedAtDay: 1,
    isUnlocked: true,
    category: 'survival',
  },
  {
    id: 'badge-shield',
    title: 'Shield Inceptor',
    description: 'Locked ₹1,000+ into your Savings Shield emergency fund.',
    emoji: '🛡️',
    unlockedAtDay: 1,
    isUnlocked: true,
    category: 'discipline',
  },
  {
    id: 'badge-maggi',
    title: 'Maggi Connoisseur',
    description: 'Passed an expensive food urge by hacking a budget meal.',
    emoji: '🍜',
    unlockedAtDay: 4,
    isUnlocked: true,
    category: 'vibe',
  },
  {
    id: 'badge-halfway',
    title: 'Mid-Month Titan',
    description: 'Reach Day 15 with cash runway above 50% and savings intact.',
    emoji: '⚔️',
    isUnlocked: false,
    category: 'survival',
  },
  {
    id: 'badge-snipper',
    title: 'Vault Snipper',
    description: 'Cancel or downsize a subscription to protect monthly liquidity.',
    emoji: '✂️',
    isUnlocked: false,
    category: 'discipline',
  },
  {
    id: 'badge-zen',
    title: 'Zen Saver',
    description: 'Achieve 100% of the ₹2,000 Savings Shield goal.',
    emoji: '🧘',
    isUnlocked: false,
    category: 'mastery',
  },
  {
    id: 'badge-social',
    title: 'Vibe Alchemist',
    description: 'Maintain Vibe Meter above 75% without going broke.',
    emoji: '✨',
    isUnlocked: false,
    category: 'vibe',
  },
  {
    id: 'badge-grandmaster',
    title: '₹10k Grandmaster',
    description: 'Survive all 30 days with a surplus and Financial Health grade S/A.',
    emoji: '👑',
    isUnlocked: false,
    category: 'mastery',
  },
];

export function getInitialGameState(): GameState {
  // Required Mock State:
  // Day 10, ₹6,400 remaining spendable, ₹1,200 commitments pending (WiFi ₹701 + OTT ₹499 = ₹1,200), ₹1,000 saved
  const currentDay = 10;
  const spendableBalance = 6400;
  const lockedSavings = 1000;
  const savingsTarget = 2000;

  // Filter commitments: pending commitments due on or after Day 10 = ₹701 + ₹499 = ₹1,200!
  // (We'll keep mobile recharge pending starting after day 20, or include it with amount adjust)
  const commitments: Commitment[] = [
    {
      id: 'comm-wifi',
      title: 'Flat High-Speed WiFi',
      amount: 701,
      dueDay: 12,
      category: 'Bill',
      status: 'pending',
      icon: 'Wifi',
      description: 'Roommate broadband bill due on Day 12.',
      canSnip: true,
    },
    {
      id: 'comm-ott',
      title: 'OTT Streaming Bundle',
      amount: 499,
      dueDay: 15,
      category: 'Subscription',
      status: 'pending',
      icon: 'Tv',
      description: 'Auto-debits on Day 15. Snip tool can cancel this!',
      canSnip: true,
    },
    {
      id: 'comm-mobile',
      title: '5G Data Recharge',
      amount: 299,
      dueDay: 22,
      category: 'Subscription',
      status: 'paid', // already paid earlier so pending is exactly ₹1,200
      icon: 'Smartphone',
      description: 'Paid in advance on Day 5.',
      canSnip: false,
    },
  ];

  const math = calculateSafeDailyAllowance(spendableBalance, commitments, currentDay, 30);
  const runwayPercent = calculateRunwayPercentage(math.safeDailyAllowance);
  const shieldPercent = calculateSavingsShieldPercentage(lockedSavings, savingsTarget);
  const vibeMeter = 72; // Vibe is good
  const financialHealth = calculateFinancialHealth(runwayPercent, shieldPercent, vibeMeter, false, commitments.length, 0);

  const activeDilemma = DILEMMAS_LIST.find(d => d.day === currentDay) || DILEMMAS_LIST[2];

  return {
    currentDay,
    totalDays: 30,
    startingPool: 10000,
    spendableBalance,
    lockedSavings,
    savingsTarget,
    stats: {
      cashRunway: runwayPercent,
      savingsShield: shieldPercent,
      vibeMeter,
      financialHealth,
    },
    commitments,
    transactions: INITIAL_TRANSACTIONS,
    resolvedDilemmas: {},
    activeDilemma: activeDilemma,
    badges: INITIAL_BADGES,
    soundEnabled: true,
    isGameOver: false,
    shakeActive: false,
    lastFeedbackAlert: {
      message: '⚡ Day 10 Active: ₹6,400 balance remaining. ₹1,200 commitments pending for Day 12 & 15.',
      type: 'info',
      timestamp: Date.now(),
    },
  };
}
