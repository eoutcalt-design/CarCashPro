import React from 'react';
import { useApp } from '../context/AppContext';
import { Header, Card } from '../components/Components';
import { Trophy, Lock, Zap, Target, Banknote, Package } from 'lucide-react';

const iconMap: Record<string, any> = {
    Trophy, Zap, Target, Banknote, Package
};

const Achievements = () => {
  const { achievements } = useApp();

  return (
    <div className="p-6 space-y-6">
        <Header title="Achievements" subtitle="Badges & Milestones" />

        <div className="grid grid-cols-2 gap-4">
            {achievements.map((ach) => {
                const Icon = iconMap[ach.icon] || Trophy;
                const isUnlocked = ach.unlocked;
                const progressPct = Math.min(100, (ach.progress / ach.target) * 100);

                return (
                    <Card key={ach.id} className={`relative overflow-hidden ${isUnlocked ? 'border-amber-500/40 bg-amber-900/10' : 'opacity-70 grayscale'}`}>
                        <div className="flex flex-col items-center text-center p-2">
                            <div className={`p-3 rounded-full mb-3 ${isUnlocked ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                                {isUnlocked ? <Icon size={24} /> : <Lock size={24} />}
                            </div>
                            <h3 className="font-bold text-sm mb-1">{ach.title}</h3>
                            <p className="text-[10px] text-slate-400 leading-tight">{ach.description}</p>
                            
                            {!isUnlocked && (
                                <div className="w-full h-1.5 bg-slate-700 rounded-full mt-3 overflow-hidden">
                                    <div className="h-full bg-amber-500/50" style={{ width: `${progressPct}%` }} />
                                </div>
                            )}
                        </div>
                    </Card>
                );
            })}
        </div>
    </div>
  );
};

export default Achievements;
