import { CoachMessage, CoachMessageType, CoachMessageLevel, CoachingContext, SubscriptionTier } from '../types';

/**
 * Rules-based coaching engine for CarCashPro
 * Generates coaching messages based on user performance data
 */

export interface CoachingRule {
  shouldTrigger: (context: CoachingContext) => boolean;
  generateMessage: (context: CoachingContext) => Omit<CoachMessage, 'id' | 'userId' | 'createdAt'>;
  minTier?: SubscriptionTier;
}

// Helper: Calculate pacing status
function calculatePacing(context: CoachingContext) {
  const { monthlyGoal, dealsThisMonth, daysElapsed, daysInMonth } = context.stats;
  const expectedPace = (monthlyGoal / daysInMonth) * daysElapsed;
  const paceDelta = dealsThisMonth - expectedPace;
  const daysRemaining = daysInMonth - daysElapsed;
  const requiredDailyDeals = daysRemaining > 0 
    ? Math.ceil((monthlyGoal - dealsThisMonth) / daysRemaining * 10) / 10 
    : 0;
  
  let status: 'AHEAD' | 'ON_TRACK' | 'BEHIND';
  if (paceDelta >= 1) status = 'AHEAD';
  else if (paceDelta <= -1) status = 'BEHIND';
  else status = 'ON_TRACK';
  
  return { status, paceDelta, daysRemaining, requiredDailyDeals, expectedPace };
}

// Rule 1: Morning Pacing Message
export const morningPacingRule: CoachingRule = {
  shouldTrigger: (context) => true, // Always show morning message
  generateMessage: (context) => {
    const pacing = calculatePacing(context);
    const { dealsThisMonth, monthlyGoal } = context.stats;
    
    let text = '';
    let level: CoachMessageLevel = 'INFO';
    
    if (pacing.status === 'AHEAD') {
      text = `Good morning! You're ${Math.abs(Math.round(pacing.paceDelta))} deal${Math.abs(pacing.paceDelta) > 1 ? 's' : ''} ahead of pace this month. Protect this lead with consistent follow-up today.`;
      level = 'SUCCESS';
    } else if (pacing.status === 'ON_TRACK') {
      text = `Good morning! You're right on pace for your monthly goal (${dealsThisMonth}/${monthlyGoal} deals). One solid day can put you ahead of the curve.`;
      level = 'INFO';
    } else {
      text = `Good morning! You're ${Math.abs(Math.round(pacing.paceDelta))} deal${Math.abs(pacing.paceDelta) > 1 ? 's' : ''} behind pace with ${pacing.daysRemaining} days left. You need about ${pacing.requiredDailyDeals} deals per day to hit your goal.`;
      level = 'WARNING';
    }
    
    return {
      type: 'MORNING',
      level,
      text,
      data: { pacing }
    };
  }
};

// Rule 2: Mid-day Activity Check
export const middayActivityRule: CoachingRule = {
  shouldTrigger: (context) => true,
  generateMessage: (context) => {
    const { todayDeals } = context.stats;
    const pacing = calculatePacing(context);
    
    let text = '';
    let level: CoachMessageLevel = 'INFO';
    
    if (todayDeals === 0) {
      if (context.tier === 'GURU' || context.tier === 'PRO') {
        text = `No deals logged yet today. To catch your monthly goal, you need ${pacing.requiredDailyDeals} deals/day for the next ${pacing.daysRemaining} days.`;
      } else {
        text = `No deals logged yet today. You need at least 1 by close to maintain your current pace.`;
      }
      level = 'WARNING';
    } else {
      text = `You've already logged ${todayDeals} deal${todayDeals > 1 ? 's' : ''} today. One more keeps you ahead of your current pace.`;
      level = 'SUCCESS';
    }
    
    return {
      type: 'MIDDAY',
      level,
      text,
      data: { todayDeals, pacing }
    };
  }
};

// Rule 3: End-of-day Summary
export const eveningSummaryRule: CoachingRule = {
  shouldTrigger: (context) => true,
  generateMessage: (context) => {
    const { todayDeals, dealsThisMonth, monthlyGoal } = context.stats;
    const pacing = calculatePacing(context);
    
    let text = '';
    let level: CoachMessageLevel = 'INFO';
    
    if (todayDeals === 0) {
      text = `Day complete with no deals logged. You're at ${dealsThisMonth}/${monthlyGoal} for the month. Tomorrow is a fresh opportunity.`;
      level = 'WARNING';
    } else if (todayDeals === 1) {
      text = `Solid day with 1 deal logged. You're at ${dealsThisMonth}/${monthlyGoal} for the month. ${pacing.status === 'AHEAD' ? 'Keep the momentum!' : 'Keep pushing!'}`;
      level = 'SUCCESS';
    } else {
      text = `Great day with ${todayDeals} deals logged! You're at ${dealsThisMonth}/${monthlyGoal} for the month. This is the kind of consistency that wins.`;
      level = 'SUCCESS';
    }
    
    return {
      type: 'EVENING',
      level,
      text,
      data: { todayDeals, pacing }
    };
  }
};

// Rule 4: Momentum Alert (GURU only)
export const momentumAlertRule: CoachingRule = {
  shouldTrigger: (context) => {
    return context.tier === 'GURU' && context.stats.recentDaysWithoutDeals >= 3;
  },
  generateMessage: (context) => {
    const { recentDaysWithoutDeals } = context.stats;
    
    return {
      type: 'ALERT',
      level: 'WARNING',
      text: `You've gone ${recentDaysWithoutDeals} days without a logged deal. Momentum is slipping – front-load follow-ups tomorrow.`,
      data: { recentDaysWithoutDeals }
    };
  },
  minTier: 'GURU'
};

// Rule 5: Achievement - Goal Hit
export const goalAchievementRule: CoachingRule = {
  shouldTrigger: (context) => {
    const { dealsThisMonth, monthlyGoal } = context.stats;
    return dealsThisMonth >= monthlyGoal;
  },
  generateMessage: (context) => {
    const { dealsThisMonth, monthlyGoal, daysRemaining } = context.stats;
    
    return {
      type: 'ACHIEVEMENT',
      level: 'SUCCESS',
      text: `🎉 Goal achieved! You hit ${monthlyGoal} deals with ${daysRemaining} days left. Every deal from here is bonus territory.`,
      data: { dealsThisMonth, monthlyGoal }
    };
  }
};

// All rules in priority order
export const ALL_RULES: CoachingRule[] = [
  goalAchievementRule,
  momentumAlertRule,
  morningPacingRule,
  middayActivityRule,
  eveningSummaryRule
];

/**
 * Generate coaching message based on time of day and context
 */
export function generateCoachingMessage(
  context: CoachingContext,
  timeOfDay: 'MORNING' | 'MIDDAY' | 'EVENING'
): Omit<CoachMessage, 'id' | 'userId' | 'createdAt'> {
  
  // Check for special alerts first (achievements, momentum)
  for (const rule of ALL_RULES) {
    if (rule.minTier && !tierMeetsMinimum(context.tier, rule.minTier)) {
      continue;
    }
    
    if (rule.shouldTrigger(context)) {
      const message = rule.generateMessage(context);
      
      // Return alerts immediately
      if (message.type === 'ALERT' || message.type === 'ACHIEVEMENT') {
        return message;
      }
      
      // Return time-appropriate message
      if (message.type === timeOfDay) {
        return message;
      }
    }
  }
  
  // Fallback
  return {
    type: timeOfDay,
    level: 'INFO',
    text: 'Keep pushing toward your goals today!',
    data: {}
  };
}

/**
 * Check if user's tier meets minimum requirement
 */
function tierMeetsMinimum(userTier: SubscriptionTier, minTier: SubscriptionTier): boolean {
  const tierOrder: SubscriptionTier[] = ['FREE', 'PRO', 'GURU'];
  const userLevel = tierOrder.indexOf(userTier);
  const minLevel = tierOrder.indexOf(minTier);
  return userLevel >= minLevel;
}

/**
 * Calculate stats needed for coaching context from deals array
 */
export function calculateCoachingStats(
  deals: any[],
  monthlyGoal: number,
  tier: SubscriptionTier = 'FREE'
): CoachingContext {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const today = now.toISOString().split('T')[0];
  
  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysElapsed = now.getDate();
  
  // Filter deals by month
  const dealsThisMonth = deals.filter(d => {
    const dealDate = new Date(d.deliveryDate);
    return dealDate.getMonth() === currentMonth && dealDate.getFullYear() === currentYear;
  });
  
  const dealsLastMonth = deals.filter(d => {
    const dealDate = new Date(d.deliveryDate);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return dealDate.getMonth() === lastMonth && dealDate.getFullYear() === lastMonthYear;
  });
  
  const todayDeals = dealsThisMonth.filter(d => {
    return d.deliveryDate.split('T')[0] === today;
  }).length;
  
  // Calculate commissions
  const commissionThisMonth = dealsThisMonth.reduce((sum, d) => sum + (d.commission || 0), 0);
  const commissionLastMonth = dealsLastMonth.reduce((sum, d) => sum + (d.commission || 0), 0);
  
  const avgCommissionThisMonth = dealsThisMonth.length > 0 
    ? commissionThisMonth / dealsThisMonth.length 
    : 0;
  const avgCommissionLastMonth = dealsLastMonth.length > 0 
    ? commissionLastMonth / dealsLastMonth.length 
    : 0;
  
  // Calculate recent days without deals
  let recentDaysWithoutDeals = 0;
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(checkDate.getDate() - i);
    const checkDateStr = checkDate.toISOString().split('T')[0];
    
    const hasDeals = dealsThisMonth.some(d => d.deliveryDate.split('T')[0] === checkDateStr);
    if (!hasDeals) {
      recentDaysWithoutDeals++;
    } else {
      break; // Stop at first day with deals
    }
  }
  
  return {
    tier,
    stats: {
      monthlyGoal,
      dealsThisMonth: dealsThisMonth.length,
      dealsLastMonth: dealsLastMonth.length,
      commissionThisMonth,
      commissionLastMonth,
      avgCommissionThisMonth,
      avgCommissionLastMonth,
      daysElapsed,
      daysInMonth,
      todayDeals,
      recentDaysWithoutDeals
    }
  };
}
