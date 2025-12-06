import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header, Input, Button, Card } from '../components/Components';
import { useNavigate } from 'react-router-dom';

const Goals = () => {
  const { goals, updateGoals } = useApp();
  // Local state to handle input changes using strings for better UX
  const [form, setForm] = useState({
      newUnitsGoal: goals.newUnitsGoal.toString(),
      usedUnitsGoal: goals.usedUnitsGoal.toString(),
      incomeGoal: goals.incomeGoal.toString(),
      assumedAvgCommission: goals.assumedAvgCommission.toString()
  });
  const navigate = useNavigate();

  const handleSave = () => {
      updateGoals({
          newUnitsGoal: Number(form.newUnitsGoal) || 0,
          usedUnitsGoal: Number(form.usedUnitsGoal) || 0,
          incomeGoal: Number(form.incomeGoal) || 0,
          assumedAvgCommission: Number(form.assumedAvgCommission) || 0
      });
      navigate(-1);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
        <Header title="Monthly Goals" subtitle="Set Your Targets" />
        
        <div className="space-y-6">
            <Card>
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">Income Target</h3>
                <div className="space-y-4">
                    <Input 
                        label="Monthly Income Goal ($)" 
                        type="number" 
                        value={form.incomeGoal} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, incomeGoal: e.target.value})} 
                        placeholder="e.g. 10000"
                    />
                    <Input 
                        label="Est. Avg Commission ($)" 
                        type="number" 
                        value={form.assumedAvgCommission} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, assumedAvgCommission: e.target.value})} 
                        placeholder="e.g. 600"
                    />
                    <p className="text-xs text-slate-500 mt-2 bg-slate-800/50 p-3 rounded-lg border border-white/5">
                        * Estimated average commission is used to calculate your "Pace" projected income when there isn't enough data for the current month yet.
                    </p>
                </div>
            </Card>

            <Card>
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Volume Targets</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        label="New Units" 
                        type="number" 
                        value={form.newUnitsGoal} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, newUnitsGoal: e.target.value})} 
                    />
                    <Input 
                        label="Used Units" 
                        type="number" 
                        value={form.usedUnitsGoal} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, usedUnitsGoal: e.target.value})} 
                    />
                </div>
                <div className="mt-4 p-3 bg-slate-800 rounded-xl border border-white/5 flex justify-between items-center shadow-inner">
                    <span className="text-sm font-bold text-slate-300">Total Unit Goal</span>
                    <span className="text-xl font-bold text-white">
                        {(Number(form.newUnitsGoal) || 0) + (Number(form.usedUnitsGoal) || 0)}
                    </span>
                </div>
            </Card>

            <Button onClick={handleSave} className="shadow-emerald-900/20">Update Goals</Button>
        </div>
    </div>
  );
};

export default Goals;