
import React from 'react';
import { useApp } from '../context/AppContext';
import { Header, Card } from '../components/Components';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ProductStatus } from '../types';
import { PRODUCT_LABELS } from '../constants';

const Monitor = () => {
  const { deals, stats } = useApp();

  // Helper functions to replace date-fns
  const subMonths = (date: Date, months: number) => {
      const d = new Date(date);
      d.setMonth(d.getMonth() - months);
      return d;
  };
  const startOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1);
  };
  const endOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };
  const isWithinInterval = (date: Date, interval: { start: Date; end: Date }) => {
      return date >= interval.start && date <= interval.end;
  };
  const formatMonth = (date: Date) => {
      return date.toLocaleString('default', { month: 'short' });
  };

  // --- Chargeback Chart Data (Last 6 Months) ---
  const today = new Date();
  const chargebackData = [];
  
  for (let i = 5; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const monthLabel = formatMonth(date); // e.g., "Oct"

      const monthlyDeals = deals.filter(d => {
          const dDate = new Date(d.deliveryDate);
          return isWithinInterval(dDate, { start: monthStart, end: monthEnd });
      });

      const monthlyChargebacks = monthlyDeals.reduce((sum, d) => sum + (d.chargeback || 0), 0);
      
      chargebackData.push({
          name: monthLabel,
          amount: monthlyChargebacks
      });
  }

  // --- Product Penetration Data ---
  const productCounts: Record<string, number> = {};
  
  const currentMonthDeals = deals.filter(d => {
      const dDate = new Date(d.deliveryDate);
      return dDate.getMonth() === today.getMonth() && dDate.getFullYear() === today.getFullYear();
  });

  const totalDeals = currentMonthDeals.length || 1;

  const penetrationData = Object.entries(PRODUCT_LABELS).map(([key, label]) => {
      const count = currentMonthDeals.filter(d => d.products[key as keyof ProductStatus]).length;
      return {
        name: label,
        percent: Math.round((count / totalDeals) * 100),
      };
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <Header title="Monitor" subtitle="Chargebacks & Trends" />

      {/* Chargeback Monitor Chart (Red) */}
      <Card className="bg-slate-900/50 border-white/5 shadow-2xl">
        <div className="flex justify-between items-end mb-4">
            <div>
                <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Rolling Chargebacks</h3>
                <div className="text-3xl font-bold text-white mt-1">${stats.chargebacks.toLocaleString()}</div>
            </div>
            <div className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase border border-rose-500/30">
                Threshold
            </div>
        </div>

        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chargebackData}>
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} 
                        dy={10}
                    />
                    <Tooltip 
                        cursor={{fill: '#fff', opacity: 0.05}}
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                        formatter={(value: number) => [`$${value}`, 'Chargeback']}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={24}>
                        {chargebackData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.amount > 0 ? '#ef4444' : '#334155'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 text-center">
             <p className="text-xs text-slate-500">
                 You have recovered <span className="text-emerald-400 font-bold">$0</span> of chargebacks this month.
             </p>
        </div>
      </Card>

      {/* Product Breakdown Grid */}
      <div>
          <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-3 ml-1">Category Breakdown (MTD)</h3>
          <div className="grid grid-cols-2 gap-3">
             {penetrationData.slice(0,4).map((item) => (
                 <div key={item.name} className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 flex justify-between items-center">
                     <span className="text-slate-300 text-xs font-bold">{item.name}</span>
                     <span className={`text-sm font-bold ${item.percent > 50 ? 'text-blue-400' : 'text-slate-500'}`}>{item.percent}%</span>
                 </div>
             ))}
          </div>
      </div>

      {/* List of Chargebacks */}
      <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1">Recent Deductions</h3>
            <button className="text-blue-400 text-xs font-bold">View All</button>
          </div>
          
          {deals.filter(d => d.chargeback > 0).slice(0, 3).map(deal => (
              <div key={deal.id} className="flex justify-between items-center p-4 bg-slate-800/30 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                          <span className="text-rose-500 font-bold text-xs">CB</span>
                      </div>
                      <div>
                          <div className="text-white font-bold text-sm">{deal.customerName}</div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold">{new Date(deal.deliveryDate).toLocaleDateString()}</div>
                      </div>
                  </div>
                  <div className="text-rose-500 font-black">-${deal.chargeback}</div>
              </div>
          ))}
          
          {deals.filter(d => d.chargeback > 0).length === 0 && (
             <div className="p-6 text-center border border-dashed border-slate-700 rounded-2xl text-slate-500 text-xs">
                 No recent chargebacks found. Great work!
             </div>
          )}
      </div>
    </div>
  );
};

export default Monitor;
    