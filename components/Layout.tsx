import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, TrendingUp, AlertOctagon, User, Calculator, Target, Award, LogOut, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Components';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { triggerNewDeal, logout } = useApp();
  const location = useLocation();

  const handleDealsClick = (e: React.MouseEvent) => {
      if (location.pathname === '/deals') {
          e.preventDefault();
          triggerNewDeal();
      }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans overflow-hidden">
      
      {/* DESKTOP SIDEBAR - Hidden on Mobile, Visible on MD+ */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-900 border-r border-white/5 h-screen shrink-0">
        <div className="p-6 flex items-center justify-center border-b border-white/5">
            <Logo className="w-20 h-20" />
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Main Menu</p>
            <SidebarItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarItem to="/deals" icon={<PlusCircle size={20} />} label="Deals" onClick={handleDealsClick} />
            <SidebarItem to="/pace" icon={<TrendingUp size={20} />} label="Pace & Goals" />
            <SidebarItem to="/monitor" icon={<AlertOctagon size={20} />} label="Monitor" />
            
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2 mt-8">Configuration</p>
            <SidebarItem to="/payplan" icon={<Calculator size={20} />} label="Pay Plan" />
            <SidebarItem to="/goals" icon={<Target size={20} />} label="Goals" />
            <SidebarItem to="/achievements" icon={<Award size={20} />} label="Achievements" />
            <SidebarItem to="/profile" icon={<User size={20} />} label="Profile" />
            <SidebarItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-white/5">
            <button 
                onClick={() => logout()}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
            >
                <LogOut size={20} />
                Sign Out
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="flex-1 overflow-y-auto pb-24 md:pb-0 scroll-smooth no-scrollbar md:custom-scrollbar">
            <div className="max-w-md md:max-w-7xl mx-auto w-full md:p-8">
                 {children}
            </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAV - Visible on Mobile, Hidden on MD+ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto">
            <nav className="bg-slate-900/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-between items-center text-xs font-medium pb-8">
            <NavItem to="/" icon={<LayoutDashboard size={24} />} label="Dash" />
            <NavItem to="/deals" icon={<PlusCircle size={24} />} label="Deals" onClick={handleDealsClick} />
            
            {/* Center Pace Button */}
            <NavLink 
                to="/pace"
                className={({ isActive }) => 
                `flex flex-col items-center justify-center w-14 h-14 -mt-8 rounded-full shadow-lg border-4 border-slate-900 transition-transform ${
                    isActive ? 'bg-emerald-500 text-white scale-110 shadow-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-800'
                }`
                }
            >
                <TrendingUp size={24} />
            </NavLink>

            <NavItem to="/monitor" icon={<AlertOctagon size={24} />} label="Monitor" />
            <NavItem to="/profile" icon={<User size={24} />} label="Profile" />
            </nav>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick?: (e: React.MouseEvent) => void }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1 transition-colors duration-200 ${
        isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const SidebarItem = ({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick?: (e: React.MouseEvent) => void }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
          isActive 
            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

export default Layout;