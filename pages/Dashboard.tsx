
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header, StatCard, Card, Button } from '../components/Components';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Plus, Percent, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { PRODUCT_LABELS } from '../constants';
import { ProductStatus } from '../types';

const Dashboard = () => {
  const { stats, deals, goals } = useApp();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'income' | 'units'>('income');

  // Mock data for chart
  const chartData = deals.slice(0, 7).reverse().map((d, i) => ({
      name: `Deal ${i+1}`,
      income: d.frontGross + d.backGross
  }));

  // MTD Penetration
  const now = new Date();
  const currentMonthDeals = deals.filter(d => {
      const dDate = new Date(d.deliveryDate);
      return dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear();
  });
  const mtdCount = currentMonthDeals.length || 1;

  const penetrationStats = Object.entries(PRODUCT_LABELS).map(([key, label]) => {
      const count = currentMonthDeals.filter(d => d.products[key as keyof ProductStatus]).length;
      const percentage = Math.round((count / mtdCount) * 100);
      return { key, label, percentage };
  });

  // Logic for Main Display
  const isIncome = viewMode === 'income';
  const mainValue = isIncome ? stats.commissionMTD : stats.unitsMTD;
  const projectedValue = isIncome ? stats.projectedIncome : stats.projectedUnits;
  const goalValue = isIncome ? goals.incomeGoal : (goals.newUnitsGoal + goals.usedUnitsGoal);
  const variance = isIncome ? stats.incomeVariance : stats.unitVariance;
  const varianceColor = variance >= 0 ? 'text-emerald-400' : 'text-rose-400';
  const varianceBg = variance >= 0 ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-rose-500/20 border-rose-500/30';
  const varianceIcon = variance >= 0 ? <TrendingUp size={14} className="mr-1"/> : <TrendingDown size={14} className="mr-1"/>;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <Header 
            title="Dashboard" 
            rightElement={
                <button onClick={() => navigate('/deals')} className="md:hidden p-2 bg-slate-800 rounded-full text-blue-400 hover:bg-slate-700">
                    <Plus size={20} />
                </button>
            }
          />
          <div className="hidden md:flex gap-3">
               <Button onClick={() => navigate('/deals')} className="!w-auto px-6 py-2 h-12">
                  <Plus size={18} /> Add New Deal
               </Button>
          </div>
      </div>

      {/* Toggle Switch */}
      <div className="md:w-64 p-1 bg-slate-900 rounded-xl border border-white/10 mb-4 shadow-inner">
          <button 
            onClick={() => setViewMode('income')}
            className={`w-1/2 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${isIncome ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Commission
          </button>
          <button 
            onClick={() => setViewMode('units')}
            className={`w-1/2 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${!isIncome ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Volume
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Hero Card - Spans 2 cols on Desktop */}
          <div className="md:col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-900 p-8 text-center md:text-left shadow-2xl shadow-blue-900/50 border border-blue-400/20 flex flex-col md:flex-row items-center md:justify-between">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 mb-6 md:mb-0">
                <div className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">
                    {isIncome ? 'Total Commission MTD' : 'Total Units MTD'}
                </div>
                
                <div className="text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                    {isIncome ? `$${mainValue.toLocaleString()}` : mainValue}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                    {/* Projection Chip */}
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900/40 border border-white/10 text-sm font-bold text-blue-100 backdrop-blur-md">
                        Forecast: {isIncome ? `$${projectedValue.toLocaleString()}` : projectedValue}
                    </div>
                </div>
            </div>
            
            {/* Variance Visual for Desktop */}
            <div className="relative z-10 flex flex-col items-center md:items-end">
                 <div className={`flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 backdrop-blur-sm ${variance >= 0 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500 text-rose-400'}`}>
                     {variance >= 0 ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
                     <span className="text-[10px] font-bold mt-1 uppercase">{variance >= 0 ? 'Ahead' : 'Behind'}</span>
                 </div>
                 <div className={`mt-2 text-sm font-bold ${varianceColor}`}>
                    {variance >= 0 ? '+' : ''}{isIncome ? `$${variance.toLocaleString()}` : variance}
                 </div>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 gap-4 h-full">
            <StatCard 
                label="Goal" 
                value={isIncome ? `$${goalValue.toLocaleString()}` : goalValue.toString()}
                subtext="Monthly Target"
                accent="blue"
            />
            <StatCard 
                label="Gross" 
                value={`$${(stats.totalGross / 1000).toFixed(1)}k`}
                subtext="Front + Back"
                accent="emerald"
            />
            <StatCard 
                label="Bonuses" 
                value={`$${stats.bonuses}`}
                accent="amber"
            />
            <StatCard 
                label="Chargebacks" 
                value={`$${stats.chargebacks}`}
                accent="rose"
            />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Penetration (MTD) */}
        <div>
            <div className="flex items-center gap-2 mb-3 px-1">
                <Percent size={16} className="text-slate-400" />
                <h3 className="text-slate-300 font-medium text-sm">Product Penetration (MTD)</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar">
                {penetrationStats.map((stat) => (
                    <div key={stat.key} className="flex-none w-24 bg-slate-800/50 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center hover:bg-slate-800 transition-colors">
                        <div className={`text-xl font-bold mb-1 ${stat.percentage >= 50 ? 'text-emerald-400' : 'text-white'}`}>
                            {stat.percentage}%
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Recent Trend */}
        <div className="h-full">
            <div className="flex items-center gap-2 mb-3 px-1">
                <ArrowUpRight size={16} className="text-slate-400" />
                <h3 className="text-slate-300 font-medium text-sm">Recent Gross Trend</h3>
            </div>
            {deals.length > 0 ? (
                <Card className="h-40">
                    <div className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                <Area type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorGross)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            ) : (
                <div className="h-40 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-slate-500 text-sm">
                    No deals data to visualize
                </div>
            )}
        </div>
      </div>

      {!deals.length && (
            <div className="text-center py-10 opacity-50">
                <p>No deals yet. Tap + to add one!</p>
            </div>
      )}
    </div>
  );
};

export default Dashboard;
