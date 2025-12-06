
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

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  notifications?: NotificationPreferences;
  lastPaceEmailDate?: string;
  isAdmin?: boolean;
}
