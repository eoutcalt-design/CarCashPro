import React, { useState, useEffect } from 'react';
import { CoachMessage, SubscriptionTier } from '../types';
import { Brain, TrendingUp, AlertCircle, Trophy, Info } from 'lucide-react';

interface AICoachCardProps {
  message: CoachMessage | null;
  tier: SubscriptionTier;
  onAskQuestion?: () => void;
}

export const AICoachCard: React.FC<AICoachCardProps> = ({ message, tier, onAskQuestion }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  if (!message) {
    return (
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-3xl p-6 border border-purple-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Brain className="text-purple-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Coach</h3>
            <p className="text-xs text-purple-300">Analyzing your performance...</p>
          </div>
        </div>
        <p className="text-slate-400 text-sm">
          Your personalized coaching will appear here based on your daily performance.
        </p>
      </div>
    );
  }

  const getIcon = () => {
    switch (message.level) {
      case 'SUCCESS':
        return <Trophy className="text-emerald-400" size={24} />;
      case 'WARNING':
        return <AlertCircle className="text-amber-400" size={24} />;
      default:
        return <TrendingUp className="text-blue-400" size={24} />;
    }
  };

  const getBorderColor = () => {
    switch (message.level) {
      case 'SUCCESS':
        return 'border-emerald-500/20';
      case 'WARNING':
        return 'border-amber-500/20';
      default:
        return 'border-blue-500/20';
    }
  };

  const getGradient = () => {
    switch (message.level) {
      case 'SUCCESS':
        return 'from-emerald-900/30 to-green-900/30';
      case 'WARNING':
        return 'from-amber-900/30 to-orange-900/30';
      default:
        return 'from-blue-900/30 to-purple-900/30';
    }
  };

  const getTierBadge = () => {
    if (tier === 'GURU') {
      return (
        <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white">
          GURU INSIGHTS
        </span>
      );
    } else if (tier === 'PRO') {
      return (
        <span className="px-2 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-bold text-blue-300">
          PRO COACHING
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={`bg-gradient-to-br ${getGradient()} rounded-3xl p-6 border ${getBorderColor()} backdrop-blur-sm transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${
            message.level === 'SUCCESS' ? 'bg-emerald-500/20' :
            message.level === 'WARNING' ? 'bg-amber-500/20' :
            'bg-blue-500/20'
          }`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Coach</h3>
            {getTierBadge()}
          </div>
        </div>
        
        {/* Time badge */}
        <div className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded-lg">
          {getTimeLabel(message.type)}
        </div>
      </div>

      {/* Message */}
      <p className="text-white text-base leading-relaxed mb-4">
        {message.text}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Info size={14} />
          <span>Based on your current numbers</span>
        </div>
        
        {onAskQuestion && (
          <button
            onClick={onAskQuestion}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
          >
            Ask a question
          </button>
        )}
      </div>

      {/* Upgrade CTA for FREE users */}
      {tier === 'FREE' && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30">
          <p className="text-xs text-blue-200 mb-2">
            🚀 Unlock daily coaching messages and performance insights with PRO
          </p>
          <button className="text-xs font-bold text-blue-300 hover:text-blue-200 underline">
            Upgrade to PRO →
          </button>
        </div>
      )}
    </div>
  );
};

function getTimeLabel(type: string): string {
  switch (type) {
    case 'MORNING':
      return 'Morning Brief';
    case 'MIDDAY':
      return 'Mid-Day Check';
    case 'EVENING':
      return 'Evening Summary';
    case 'ALERT':
      return 'Alert';
    case 'ACHIEVEMENT':
      return 'Achievement';
    default:
      return 'Update';
  }
}
