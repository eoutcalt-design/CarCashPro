import React from 'react';
import { useApp } from '../context/AppContext';
import { Header, Card } from '../components/Components';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, AlertTriangle } from 'lucide-react';

const Pace = () => {
  const { stats, goals } = useApp();

  const percentage = Math.min(100, Math.round((stats.commissionMTD / goals.incomeGoal) * 100));
  const gap = goals.incomeGoal - stats.commissionMTD;
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const daysRemaining = daysInMonth - new Date().getDate();

  const data = [
    { name: 'Completed', value: stats.commissionMTD },
    { name: 'Remaining', value: Math.max(0, gap) },
  ];
  
  const COLORS = ['#10b981', '#334155'];

  return (
    <div className="p-6 space-y-6">
      <Header title="Pace" subtitle="Track your monthly targets" />

      {/* Main Circle */}
      <div className="flex justify-center my-8">
          <div className="relative w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                        ))}
                    </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">{percentage}%</span>
                  <span className="text-slate-400 text-xs uppercase tracking-wider mt-1">to Goal</span>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <TrendingUp size={18} />
                <span className="text-xs font-bold uppercase">Projected</span>
            </div>
            <div className="text-2xl font-bold text-white">${stats.projectedIncome.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">Estimated finish</div>
        </Card>

        <Card className="bg-gradient-to-br from-rose-900/40 to-slate-900/40 border-rose-500/20">
            <div className="flex items-center gap-2 mb-2 text-rose-400">
                <AlertTriangle size={18} />
                <span className="text-xs font-bold uppercase">Gap</span>
            </div>
            <div className="text-2xl font-bold text-white">${gap > 0 ? gap.toLocaleString() : '0'}</div>
            <div className="text-xs text-slate-400 mt-1">Needed to hit goal</div>
        </Card>
      </div>

      <Card>
          <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-full text-blue-400">
                  <Calendar size={24} />
              </div>
              <div className="flex-1">
                  <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Month Progress</span>
                      <span className="text-sm text-slate-400">{daysRemaining} days left</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full" 
                        style={{ width: `${((daysInMonth - daysRemaining) / daysInMonth) * 100}%`}}
                      />
                  </div>
              </div>
          </div>
      </Card>
    </div>
  );
};

export default Pace;
