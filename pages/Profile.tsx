
import React from 'react';
import { useApp } from '../context/AppContext';
import { Header, Card, Button } from '../components/Components';
import { Settings as SettingsIcon, Award, Calculator, Target, History, ChevronRight, User as UserIcon, LogOut, Database, CheckCircle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STRIPE_PAYMENT_LINK } from '../constants';

const Profile = () => {
  const { isPro, user, logout } = useApp();
  const navigate = useNavigate();

  const menuItems = [
      { icon: Calculator, label: 'Pay Plan Config', path: '/payplan', color: 'text-blue-400' },
      { icon: Target, label: 'Monthly Goals', path: '/goals', color: 'text-emerald-400' },
      { icon: Award, label: 'Achievements', path: '/achievements', color: 'text-amber-400' },
      { icon: History, label: 'Deal History', path: '/history', color: 'text-purple-400' },
      { icon: Database, label: 'Settings', path: '/settings', color: 'text-slate-400' },
  ];

  const handleManageSubscription = () => {
      // Redirect to Stripe or Customer Portal
      window.open(STRIPE_PAYMENT_LINK, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      <Header title="Profile" />

      {/* User Info */}
      <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center border-2 border-white/10">
              <UserIcon size={32} className="text-slate-400" />
          </div>
          <div>
              <h2 className="text-xl font-bold text-white">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.email.split('@')[0] || 'Sales Pro')}
              </h2>
              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide mt-1 ${isPro ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>
                  {isPro && <CheckCircle size={10} />}
                  {isPro ? 'PRO MEMBER' : 'FREE PLAN'}
              </div>
          </div>
      </div>

      {/* Subscription CTA */}
      {!isPro ? (
          <div onClick={handleManageSubscription} className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 relative overflow-hidden cursor-pointer active:scale-95 transition-transform group shadow-lg">
              <div className="relative z-10">
                  <h3 className="font-bold text-white text-lg">Upgrade to PRO</h3>
                  <p className="text-indigo-200 text-xs mt-1 pr-10">Unlock unlimited deals, history, and advanced analytics for $7.99/mo.</p>
              </div>
              <CreditCard className="absolute -right-4 -bottom-4 text-white/10 w-24 h-24 group-hover:rotate-12 transition-transform" />
          </div>
      ) : (
          <div onClick={handleManageSubscription} className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-slate-800 transition-colors">
              <div>
                <p className="text-white font-bold text-sm">Pro Membership Active</p>
                <p className="text-slate-400 text-xs">Tap to manage billing</p>
              </div>
              <Button className="!w-auto px-4 py-2 h-8 text-xs !bg-slate-700">Manage</Button>
          </div>
      )}

      {/* Menu */}
      <div className="space-y-3">
          {menuItems.map((item, index) => (
              <Card key={index} onClick={() => navigate(item.path)} className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/10 active:scale-95 transition-all">
                  <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg bg-slate-800 ${item.color}`}>
                          <item.icon size={20} />
                      </div>
                      <span className="font-medium text-slate-200">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-500" />
              </Card>
          ))}
      </div>

      <div className="pt-8 pb-20">
          <Button variant="outline" onClick={logout} className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10 group">
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            Log Out
          </Button>
      </div>
    </div>
  );
};

export default Profile;
