import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Brain, Loader2, TrendingUp, DollarSign, Target } from 'lucide-react';
import { SubscriptionTier, CoachingContext } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AICoachChatProps {
  isOpen: boolean;
  onClose: () => void;
  tier: SubscriptionTier;
  context: CoachingContext;
  onUpgrade?: () => void;
}

export const AICoachChat: React.FC<AICoachChatProps> = ({ 
  isOpen, 
  onClose, 
  tier, 
  context,
  onUpgrade 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: tier === 'FREE' 
        ? "Hi! I'm your AI Coach. Upgrade to PRO to unlock personalized coaching and performance insights."
        : `Hi! I'm your AI Coach. I can help you understand your performance and reach your goals. Ask me anything about your numbers!`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    if (tier === 'FREE') {
      // Show upgrade prompt for FREE users
      setMessages(prev => [...prev, {
        role: 'user',
        content: input,
        timestamp: new Date().toISOString()
      }, {
        role: 'assistant',
        content: "I'd love to help you with that! Upgrade to PRO to unlock AI coaching and get personalized insights about your performance.",
        timestamp: new Date().toISOString()
      }]);
      setInput('');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          context: context,
          tier: tier
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "How am I pacing this month?",
    "What's my projected paycheck?",
    "How many deals do I need to hit my goal?",
    "Am I ahead or behind last month?"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:justify-end p-0 md:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Chat Panel */}
      <div className="relative w-full md:w-[440px] h-[100vh] md:h-[600px] bg-slate-900 md:rounded-3xl shadow-2xl flex flex-col border-t md:border border-white/10 animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Brain className="text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Coach</h3>
              <p className="text-xs text-purple-300">
                {tier === 'GURU' ? 'GURU Insights' : tier === 'PRO' ? 'PRO Coaching' : 'Upgrade to unlock'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="text-slate-400" size={20} />
          </button>
        </div>

        {/* Stats Summary */}
        <div className="p-4 bg-slate-800/50 border-b border-white/5">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-blue-400" />
              <div>
                <div className="text-xs text-slate-400">Deals MTD</div>
                <div className="text-sm font-bold text-white">
                  {context.stats.dealsThisMonth}/{context.stats.monthlyGoal}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-emerald-400" />
              <div>
                <div className="text-xs text-slate-400">Commission</div>
                <div className="text-sm font-bold text-white">
                  ${Math.round(context.stats.commissionThisMonth).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-purple-400" />
              <div>
                <div className="text-xs text-slate-400">Pacing</div>
                <div className="text-sm font-bold text-white">
                  {context.stats.dealsThisMonth >= (context.stats.monthlyGoal / context.stats.daysInMonth) * context.stats.daysElapsed ? 'Ahead' : 'Behind'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-100 border border-white/10'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs opacity-50 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-white/10 rounded-2xl px-4 py-3">
                <Loader2 className="animate-spin text-purple-400" size={20} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && tier !== 'FREE' && (
          <div className="px-4 pb-2">
            <p className="text-xs text-slate-400 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(q)}
                  className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors border border-white/5"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-slate-900">
          {tier === 'FREE' && onUpgrade ? (
            <button
              onClick={onUpgrade}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-white transition-all"
            >
              Upgrade to PRO to Chat
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your performance..."
                className="flex-1 px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
