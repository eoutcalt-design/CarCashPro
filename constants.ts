
import { PayPlan, Goals, Achievement } from './types';

export const DEFAULT_PAY_PLAN: PayPlan = {
  frontCommissionPercent: 25,
  backCommissionPercent: 15,
  financeReserve: {
      mode: 'percentage',
      value: 0
  },
  pack: 695,
  flatRate: 100,
  spiffsRate: 0,
  volumeBonuses: [
    { units: 10, bonus: 500 },
    { units: 15, bonus: 1000 },
    { units: 20, bonus: 2000 },
  ],
  productCommission: {
    vsc: { mode: 'flat', flatAmount: 50 },
    gap: { mode: 'flat', flatAmount: 25 },
    maintenance: { mode: 'flat', flatAmount: 25 },
    accessories: { mode: 'percentage', percentOfGross: 10 },
    tireAndWheel: { mode: 'flat', flatAmount: 25 },
    appearancePackage: { mode: 'flat', flatAmount: 25 },
    keyReplacement: { mode: 'flat', flatAmount: 25 },
  },
};

export const DEFAULT_GOALS: Goals = {
  newUnitsGoal: 8,
  usedUnitsGoal: 5,
  incomeGoal: 8000,
  assumedAvgCommission: 650,
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', key: 'first_blood', title: 'First Blood', description: 'Log your first deal', icon: 'Trophy', unlocked: false, progress: 0, target: 1 },
  { id: '2', key: 'double_digits', title: 'Double Digits', description: 'Log 10 total deals', icon: 'Target', unlocked: false, progress: 0, target: 10 },
  { id: '3', key: 'money_maker', title: 'Money Maker', description: 'Earn $10k in a month', icon: 'Banknote', unlocked: false, progress: 0, target: 10000 },
  { id: '4', key: 'product_pro', title: 'Product Pro', description: 'Sell 3 products in one deal', icon: 'Package', unlocked: false, progress: 0, target: 3 },
  { id: '5', key: 'big_hitter', title: 'Big Hitter', description: 'Earn $1000 commission on a single deal', icon: 'Zap', unlocked: false, progress: 0, target: 1000 },
];

export const PRODUCT_LABELS: Record<string, string> = {
  vsc: 'VSC',
  gap: 'GAP',
  maintenance: 'Maint',
  accessories: 'Acc',
  tireAndWheel: 'T&W',
  appearancePackage: 'Appr',
  keyReplacement: 'Key',
};

// ==========================================
// STRIPE BILLING CONFIGURATION
// ==========================================
// 1. Go to Stripe Dashboard -> Products -> Create Payment Link
// 2. Paste that link inside the quotes below
export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_payment_link_PLACEHOLDER";
