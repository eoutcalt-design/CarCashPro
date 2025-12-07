import React from 'react';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { FREE_DEAL_LIMIT } from '../constants';

interface FreeTrialWarningProps {
  dealCount: number;
  projectedIncome: number;
  onUpgrade: () => void;
}

export const FreeTrialWarning: React.FC<FreeTrialWarningProps> = ({
  dealCount,
  projectedIncome,
  onUpgrade
}) => {
  // Don't show if user has less than 8 deals
  if (dealCount < 8) return null;

  const dealsRemaining = FREE_DEAL_LIMIT - dealCount;
  
  // Deal #8: Soft warning
  if (dealCount === 8) {
    return (
      <div className="mx-4 mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl animate-slide-down">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg shrink-0">
            <AlertCircle size={20} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-amber-400 font-bold text-sm mb-1">
              You're almost at the Pro unlock point
            </h3>
            <p className="text-amber-200/80 text-xs">
              <span className="font-bold">{dealsRemaining} free deals remaining.</span> Keep crushing it!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Deal #9: Urgent warning with projected income
  if (dealCount === 9) {
    return (
      <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-orange-500/20 to-rose-500/20 border border-orange-500/40 rounded-2xl animate-slide-down shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-500/30 rounded-lg shrink-0">
            <TrendingUp size={20} className="text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-orange-300 font-bold text-sm mb-1">
              Next deal requires Pro
            </h3>
            <p className="text-orange-200/80 text-xs mb-3">
              Your current projected income is{' '}
              <span className="font-bold text-emerald-400">
                ${projectedIncome.toLocaleString()}
              </span>
              . Don't lose your momentum!
            </p>
            <button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-2 px-4 rounded-lg text-xs hover:from-indigo-500 hover:to-blue-500 transition-all shadow-md"
            >
              Upgrade to Pro - $9.99/mo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
