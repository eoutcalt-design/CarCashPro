
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header, Input, Button, Card, Select } from '../components/Components';
import { useNavigate } from 'react-router-dom';

const PayPlanScreen = () => {
  const { payPlan, updatePayPlan } = useApp();
  const [plan, setPlan] = useState(payPlan);
  const navigate = useNavigate();

  const handleSave = () => {
      updatePayPlan(plan);
      navigate(-1);
  };

  return (
    <div className="p-6 space-y-6">
        <Header title="Pay Plan" subtitle="Configure Commission Structure" />

        <div className="space-y-4">
            <Card>
                <h3 className="text-sm font-bold text-blue-400 uppercase mb-4">Base Commission</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Front %" type="number" value={plan.frontCommissionPercent} onChange={(e:any) => setPlan({...plan, frontCommissionPercent: Number(e.target.value)})} />
                    <Input label="Back %" type="number" value={plan.backCommissionPercent} onChange={(e:any) => setPlan({...plan, backCommissionPercent: Number(e.target.value)})} />
                </div>
                <Input label="Pack Amount ($)" type="number" value={plan.pack} onChange={(e:any) => setPlan({...plan, pack: Number(e.target.value)})} />
            </Card>

            <Card>
                <h3 className="text-sm font-bold text-purple-400 uppercase mb-4">Finance Reserve Pay</h3>
                <div className="grid grid-cols-1 gap-4">
                    <Select 
                        label="Payment Method" 
                        value={plan.financeReserve.mode} 
                        onChange={(e:any) => setPlan({...plan, financeReserve: { ...plan.financeReserve, mode: e.target.value }})}
                        options={[{ value: 'flat', label: 'Flat Amount ($)' }, { value: 'percentage', label: 'Percentage of Reserve (%)' }]}
                    />
                    <Input 
                        label={plan.financeReserve.mode === 'flat' ? "Flat Amount ($)" : "Percentage of Reserve (%)"}
                        type="number" 
                        value={plan.financeReserve.value} 
                        onChange={(e:any) => setPlan({...plan, financeReserve: { ...plan.financeReserve, value: Number(e.target.value) }})} 
                    />
                </div>
            </Card>

            <Card>
                <h3 className="text-sm font-bold text-emerald-400 uppercase mb-4">Extras Defaults</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Default Flat ($)" type="number" value={plan.flatRate} onChange={(e:any) => setPlan({...plan, flatRate: Number(e.target.value)})} />
                    <Input label="Default Bonus ($)" type="number" value={plan.spiffsRate} onChange={(e:any) => setPlan({...plan, spiffsRate: Number(e.target.value)})} />
                </div>
            </Card>

            <Button onClick={handleSave}>Save Pay Plan</Button>
        </div>
    </div>
  );
};

export default PayPlanScreen;
