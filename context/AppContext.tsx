import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Deal, PayPlan, Goals, Achievement, UserStats, User, NotificationPreferences } from '../types';
import { DEFAULT_PAY_PLAN, DEFAULT_GOALS, INITIAL_ACHIEVEMENTS } from '../constants';
import { auth, db } from '../lib/firebase';

interface AppContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, firstName: string, lastName?: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  deals: Deal[];
  payPlan: PayPlan;
  goals: Goals;
  stats: UserStats;
  achievements: Achievement[];
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => Promise<void>;
  updateDeal: (deal: Deal) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  updatePayPlan: (plan: PayPlan) => void;
  updateGoals: (goals: Goals) => void;
  updateNotifications: (prefs: NotificationPreferences) => Promise<void>;
  isPro: boolean;
  togglePro: () => void;
  sendTestEmail: () => Promise<string | undefined>;
  exportData: () => string;
  importData: (json: string) => boolean;
  newDealTrigger: number;
  triggerNewDeal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Admins who can see the technical settings
const ADMIN_EMAILS = ['info@carcashpro.com', 'eoutcalt@gmail.com'];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- State ---
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [payPlan, setPayPlan] = useState<PayPlan>(DEFAULT_PAY_PLAN);
  const [goals, setGoals] = useState<Goals>(DEFAULT_GOALS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [newDealTrigger, setNewDealTrigger] = useState(0);
  
  const [stats, setStats] = useState<UserStats>({
    unitsMTD: 0, totalGross: 0, commissionMTD: 0, bonuses: 0, chargebacks: 0,
    projectedIncome: 0, projectedUnits: 0, incomeVariance: 0, unitVariance: 0,
  });

  // --- Auth & Data Listener ---
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin = ADMIN_EMAILS.includes(firebaseUser.email || '');
        
        setUser(prev => ({ 
            ...prev, 
            id: firebaseUser.uid, 
            email: firebaseUser.email || '',
            isAdmin: isAdmin 
        } as User));
        
        // --- 1. Listen to User Settings ---
        const userDocRef = db.collection('users').doc(firebaseUser.uid);
        const unsubscribeSettings = userDocRef.onSnapshot((docSnap) => {
            if (docSnap.exists) {
                const data = docSnap.data() as any;
                if (data.payPlan) setPayPlan(prev => ({...DEFAULT_PAY_PLAN, ...data.payPlan}));
                if (data.goals) setGoals(data.goals);
                if (data.achievements) setAchievements(data.achievements);
                if (data.isPro !== undefined) setIsPro(data.isPro);
                
                setUser(prev => prev ? ({
                    ...prev,
                    firstName: data.firstName || prev.firstName,
                    lastName: data.lastName || prev.lastName,
                    phone: data.phone || prev.phone,
                    notifications: data.notifications || { emailDailyPace: true, emailWeeklySummary: true, emailAchievements: true },
                    lastPaceEmailDate: data.lastPaceEmailDate,
                    isAdmin: ADMIN_EMAILS.includes(prev.email)
                }) : null);

            } else {
                userDocRef.set({
                    payPlan: DEFAULT_PAY_PLAN,
                    goals: DEFAULT_GOALS,
                    achievements: INITIAL_ACHIEVEMENTS,
                    isPro: false,
                    notifications: { emailDailyPace: true, emailWeeklySummary: true, emailAchievements: true }
                }, { merge: true });
            }
        });

        // --- 2. Listen to Deals ---
        const dealsRef = db.collection('users').doc(firebaseUser.uid).collection('deals');
        const unsubscribeDeals = dealsRef.onSnapshot((snapshot) => {
            const loadedDeals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deal));
            loadedDeals.sort((a,b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime());
            setDeals(loadedDeals);
            setLoading(false);
        });

        return () => {
            unsubscribeSettings();
            unsubscribeDeals();
        };

      } else {
        setUser(null);
        setDeals([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    recalculateStats();
  }, [deals, payPlan, goals]);

  // --- Stats Logic ---
  const recalculateStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dayOfMonth = Math.max(1, now.getDate());

    const currentDeals = deals.filter(d => {
        const dDate = new Date(d.deliveryDate);
        return dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear;
    });

    const unitsMTD = currentDeals.length;
    let totalGross = 0;
    let commissionSum = 0;
    let chargebacks = 0;

    currentDeals.forEach(d => {
        totalGross += (d.frontGross + d.backGross + (d.financeGross || 0));
        chargebacks += d.chargeback;
        commissionSum += calculateCommission(d, payPlan);
    });

    let bonuses = 0;
    const sortedBonuses = [...payPlan.volumeBonuses].sort((a, b) => b.units - a.units);
    const achievedTier = sortedBonuses.find(b => unitsMTD >= b.units);
    if (achievedTier) bonuses = achievedTier.bonus;

    const commissionMTD = commissionSum + bonuses;

    let projectedUnits = 0;
    let projectedIncome = 0;
    const effectiveDay = Math.max(1, dayOfMonth);
    const runRateMultiplier = daysInMonth / effectiveDay;

    if (unitsMTD > 0) {
        projectedUnits = Math.round(unitsMTD * runRateMultiplier);
        projectedIncome = Math.round(commissionMTD * runRateMultiplier);
    } else {
        projectedIncome = Math.round(goals.assumedAvgCommission * goals.newUnitsGoal); 
    }

    const monthProgressRatio = effectiveDay / daysInMonth;
    const targetIncomePace = Math.round(goals.incomeGoal * monthProgressRatio);
    const totalUnitGoal = goals.newUnitsGoal + goals.usedUnitsGoal;
    const targetUnitPace = Math.round(totalUnitGoal * monthProgressRatio);

    setStats({
        unitsMTD,
        totalGross,
        commissionMTD,
        bonuses,
        chargebacks,
        projectedIncome,
        projectedUnits,
        incomeVariance: Math.round(commissionMTD - targetIncomePace),
        unitVariance: Math.round(unitsMTD - targetUnitPace)
    });
  };

  // --- Auth Actions ---
  const login = async (email: string, pass: string) => await auth.signInWithEmailAndPassword(email, pass);
  const signup = async (email: string, pass: string, firstName: string, lastName: string = '', phone: string = '') => {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    if (cred.user) {
        await db.collection('users').doc(cred.user.uid).set({
            firstName, lastName, phone, email,
            payPlan: DEFAULT_PAY_PLAN, goals: DEFAULT_GOALS,
            achievements: INITIAL_ACHIEVEMENTS, isPro: false,
            notifications: { emailDailyPace: true, emailWeeklySummary: true, emailAchievements: true },
            createdAt: new Date().toISOString()
        });
    }
  };
  const logout = async () => await auth.signOut();
  const resetPassword = async (email: string) => await auth.sendPasswordResetEmail(email);
  
  const updateUserEmail = async (newEmail: string) => {
      if(auth.currentUser) await auth.currentUser.updateEmail(newEmail);
  }
  const updateUserPassword = async (newPass: string) => {
      if(auth.currentUser) await auth.currentUser.updatePassword(newPass);
  }

  const addDeal = async (dealData: Omit<Deal, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('No user');
    const newDocRef = db.collection('users').doc(user.id).collection('deals').doc();
    const newDeal = { ...dealData, id: newDocRef.id, createdAt: new Date().toISOString() };
    await newDocRef.set(newDeal);
  };

  const updateDeal = async (updatedDeal: Deal) => {
    if (!user) throw new Error('No user');
    await db.collection('users').doc(user.id).collection('deals').doc(updatedDeal.id).update({ ...updatedDeal });
  };

  const deleteDeal = async (id: string) => {
    if (!user) throw new Error('No user');
    await db.collection('users').doc(user.id).collection('deals').doc(id).delete();
  };

  const updatePayPlan = async (plan: PayPlan) => {
    if (!user) return;
    setPayPlan(plan);
    await db.collection('users').doc(user.id).update({ payPlan: plan });
  };

  const updateGoals = async (newGoals: Goals) => {
    if (!user) return;
    setGoals(newGoals);
    await db.collection('users').doc(user.id).update({ goals: newGoals });
  };
  
  const updateNotifications = async (prefs: NotificationPreferences) => {
      if (!user) return;
      await db.collection('users').doc(user.id).update({ notifications: prefs });
  }

  const togglePro = async () => { /* Managed externally */ };

  const sendTestEmail = async () => {
      if (!user) return undefined;
      const docRef = await db.collection('mail').add({
          to: [user.email],
          message: { subject: 'Test Email', html: '<p>It Works!</p>' }
      });
      return docRef.id;
  };

  const exportData = () => JSON.stringify({ deals, payPlan, goals }, null, 2);
  const importData = (json: string) => false; 
  const triggerNewDeal = () => setNewDealTrigger(prev => prev + 1);

  return (
    <AppContext.Provider value={{
        user, loading, login, signup, logout, resetPassword, updateUserEmail, updateUserPassword,
        deals, payPlan, goals, stats, achievements,
        addDeal, updateDeal, deleteDeal, updatePayPlan, updateGoals, updateNotifications,
        isPro, togglePro, sendTestEmail, exportData, importData, newDealTrigger, triggerNewDeal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// --- COMMISSION CALCULATOR ---
export const calculateCommission = (deal: Deal, plan: PayPlan) => {
    const parseVal = (val: any) => {
        const n = parseFloat(val);
        return isNaN(n) ? 0 : n;
    };

    // 1. Front Commission (Base)
    let finalFrontComm = 0;
    if (deal.overrideFront !== undefined && deal.overrideFront > 0) {
        finalFrontComm = deal.overrideFront;
    } else {
        const packAmount = (deal.pack !== undefined && deal.pack !== null) ? deal.pack : plan.pack;
        const frontPayable = Math.max(0, deal.frontGross - packAmount);
        finalFrontComm = frontPayable * (plan.frontCommissionPercent / 100);
    }

    // 2. Back Commission (Backend)
    let finalBackComm = 0;
    if (deal.overrideBack !== undefined && deal.overrideBack > 0) {
        finalBackComm = deal.overrideBack;
    } else {
        finalBackComm = deal.backGross * (plan.backCommissionPercent / 100);
    }

    // 3. Finance Reserve Commission
    let finalReserveComm = 0;
    if (deal.overrideReserve !== undefined && deal.overrideReserve > 0) {
        finalReserveComm = deal.overrideReserve;
    } else {
        if (plan.financeReserve.mode === 'flat') {
            // If flat, pay the flat amount if reserve > 0
            if ((deal.financeGross || 0) > 0) {
                finalReserveComm = plan.financeReserve.value;
            }
        } else {
            // Percentage of reserve
            finalReserveComm = (deal.financeGross || 0) * (plan.financeReserve.value / 100);
        }
    }

    // 4. Products (Pay is built into Back Gross usually, but if there are separate spiffs/product pay)
    // *NOTE: Based on previous instructions, product toggles are for penetration stats only 
    // and do NOT affect commission unless explicitly part of back gross or spiffs.
    // However, we still add "Flat Rate" and "Spiffs".
    
    // 5. Total
    const totalCommission = 
        finalFrontComm + 
        finalBackComm + 
        finalReserveComm + 
        parseVal(deal.flat) + 
        parseVal(deal.spiffs) - 
        parseVal(deal.chargeback);

    return totalCommission;
};