
export type DealType = 'new' | 'used' | 'certified';

export interface ProductStatus {
  vsc: boolean;
  gap: boolean;
  maintenance: boolean;
  accessories: boolean;
  tireAndWheel: boolean;
  appearancePackage: boolean;
  keyReplacement: boolean;
}

export interface Deal {
  id: string;
  customerName: string;
  type: DealType;
  year: string;
  make: string;
  model: string;
  frontGross: number;
  backGross: number;
  financeGross?: number; // Bank Reserve Amount
  pack: number;
  flat: number;
  spiffs: number;
  products: ProductStatus;
  chargeback: number;
  deliveryDate: string; // ISO String
  note: string;
  createdAt: string;
  
  // Overrides
  overrideFront?: number;
  overrideBack?: number;
  overrideReserve?: number;
}

export interface ProductCommission {
  mode: 'flat' | 'percentage';
  flatAmount?: number;
  percentOfGross?: number;
}

export interface VolumeBonus {
  units: number;
  bonus: number;
}

export interface PayPlan {
  frontCommissionPercent: number;
  backCommissionPercent: number;
  financeReserve: {
      mode: 'flat' | 'percentage';
      value: number; // Flat amount or Percentage
  };
  pack: number;
  flatRate: number;
  spiffsRate: number;
  volumeBonuses: VolumeBonus[];
  productCommission: {
    vsc: ProductCommission;
    gap: ProductCommission;
    maintenance: ProductCommission;
    accessories: ProductCommission;
    tireAndWheel: ProductCommission;
    appearancePackage: ProductCommission;
    keyReplacement: ProductCommission;
  };
}

export interface Goals {
  newUnitsGoal: number;
  usedUnitsGoal: number;
  incomeGoal: number;
  assumedAvgCommission: number;
}

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  unlocked: boolean;
  progress: number;
  target: number;
}

export interface UserStats {
  unitsMTD: number;
  totalGross: number;
  commissionMTD: number;
  bonuses: number;
  chargebacks: number;
  projectedIncome: number;
  projectedUnits: number;
  incomeVariance: number;
  unitVariance: number;
}

export interface NotificationPreferences {
  emailDailyPace: boolean;
  emailWeeklySummary: boolean;
  emailAchievements: boolean;
}

export type SubscriptionTier = 'FREE' | 'PRO' | 'GURU';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  notifications?: NotificationPreferences;
  lastPaceEmailDate?: string;
  isAdmin?: boolean;
  lastLogin?: string; // ISO timestamp of last login
  createdAt?: string; // ISO timestamp of account creation
  subscriptionTier?: SubscriptionTier; // Subscription level for coaching features
}

// Coaching Engine Types

export type CoachMessageType = 'MORNING' | 'MIDDAY' | 'EVENING' | 'ALERT' | 'ACHIEVEMENT';
export type CoachMessageLevel = 'INFO' | 'WARNING' | 'SUCCESS';

export interface CoachMessage {
  id: string;
  userId: string;
  createdAt: string; // ISO timestamp
  type: CoachMessageType;
  level: CoachMessageLevel;
  text: string;
  data?: any; // Optional raw numbers used
}

export interface UserDailyStats {
  userId: string;
  date: string; // YYYY-MM-DD
  dealsCount: number;
  totalCommission: number;
  avgCommission: number;
}

export interface CoachingContext {
  tier: SubscriptionTier;
  stats: {
    monthlyGoal: number;
    dealsThisMonth: number;
    dealsLastMonth: number;
    commissionThisMonth: number;
    commissionLastMonth: number;
    avgCommissionThisMonth: number;
    avgCommissionLastMonth: number;
    daysElapsed: number;
    daysInMonth: number;
    todayDeals: number;
    recentDaysWithoutDeals: number;
  };
}
