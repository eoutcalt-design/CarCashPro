
import React, { useState, useEffect } from 'react';
import { useApp, calculateCommission } from '../context/AppContext';
import { Deal, DealType, ProductStatus } from '../types';
import { Header, Card, Input, Button, Toggle, Select } from '../components/Components';
import { Car, Filter, Plus, X, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface DealFormState {
    id?: string;
    customerName: string;
    type: DealType;
    year: string;
    make: string;
    model: string;
    frontGross: string;
    backGross: string;
    financeGross: string;
    pack: string;
    flat: string;
    spiffs: string;
    products: ProductStatus;
    chargeback: string;
    deliveryDate: string;
    note: string;
    
    // Overrides
    overrideFront: string;
    overrideBack: string;
    overrideReserve: string;
}

const getInitialFormState = (): DealFormState => ({
    customerName: '',
    type: 'new',
    year: new Date().getFullYear().toString(),
    make: '',
    model: '',
    frontGross: '',
    backGross: '',
    financeGross: '',
    pack: '', 
    flat: '',
    spiffs: '',
    products: {
        vsc: false, gap: false, maintenance: false, accessories: false, 
        tireAndWheel: false, appearancePackage: false, keyReplacement: false
    },
    chargeback: '',
    deliveryDate: format(new Date(), 'yyyy-MM-dd'),
    note: '',
    overrideFront: '',
    overrideBack: '',
    overrideReserve: ''
});

const Deals = () => {
  const { deals, addDeal, updateDeal, deleteDeal, payPlan, newDealTrigger } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DealFormState>(getInitialFormState());
  const [filter, setFilter] = useState<'all' | 'new' | 'used'>('all');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleOpenNewDeal = () => {
      setEditingId(null);
      setError(null);
      localStorage.removeItem('ccp_deal_draft');
      
      const freshState = getInitialFormState();
      const mergedState = {
          ...freshState,
          pack: (payPlan.pack ?? 0).toString(),
          flat: (payPlan.flatRate ?? 0).toString(),
          spiffs: (payPlan.spiffsRate ?? 0).toString(),
      };
      
      setForm(mergedState);
      setFormKey(Date.now()); 
      setShowModal(true);
  };
  
  useEffect(() => {
      if (newDealTrigger > 0) handleOpenNewDeal();
  }, [newDealTrigger]);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!form.customerName?.trim()) {
          setError('Customer Name is required');
          return;
      }
      
      setIsSaving(true);

      const dealData: any = {
          ...form,
          frontGross: parseFloat(form.frontGross) || 0,
          backGross: parseFloat(form.backGross) || 0,
          financeGross: parseFloat(form.financeGross) || 0,
          pack: form.pack === '' ? (payPlan.pack ?? 0) : parseFloat(form.pack),
          flat: form.flat === '' ? (payPlan.flatRate ?? 0) : parseFloat(form.flat),
          spiffs: form.spiffs === '' ? (payPlan.spiffsRate ?? 0) : parseFloat(form.spiffs),
          chargeback: parseFloat(form.chargeback) || 0,
          overrideFront: parseFloat(form.overrideFront) || 0,
          overrideBack: parseFloat(form.overrideBack) || 0,
          overrideReserve: parseFloat(form.overrideReserve) || 0
      };

      try {
          if (editingId && form.id) {
              await updateDeal(dealData as Deal);
          } else {
              const { id, ...newDealData } = dealData;
              const sanitized = JSON.parse(JSON.stringify(newDealData));
              await addDeal(sanitized);
              setFilter('all');
          }
          
          localStorage.removeItem('ccp_deal_draft');
          setEditingId(null);
          setShowModal(false);
          setForm(getInitialFormState());
      } catch (err) {
          setError('Failed to save deal.');
      } finally {
          setIsSaving(false);
      }
  };

  const handleEdit = (deal: Deal) => {
      const freshProducts = getInitialFormState().products;
      setForm({
          ...deal,
          frontGross: deal.frontGross.toString(),
          backGross: deal.backGross.toString(),
          financeGross: (deal.financeGross || 0).toString(),
          pack: (deal.pack !== undefined ? deal.pack : payPlan.pack).toString(),
          flat: deal.flat.toString(),
          spiffs: deal.spiffs.toString(),
          chargeback: deal.chargeback.toString(),
          products: { ...freshProducts, ...deal.products },
          overrideFront: (deal.overrideFront || 0) > 0 ? (deal.overrideFront || 0).toString() : '',
          overrideBack: (deal.overrideBack || 0) > 0 ? (deal.overrideBack || 0).toString() : '',
          overrideReserve: (deal.overrideReserve || 0) > 0 ? (deal.overrideReserve || 0).toString() : ''
      });
      setEditingId(deal.id);
      setFormKey(Date.now());
      setError(null);
      setShowModal(true);
  };

  const handleDelete = async (id: string) => {
      if(window.confirm('Delete this deal?')) {
          await deleteDeal(id);
          setEditingId(null);
          setShowModal(false);
      }
  };

  const filteredDeals = deals.filter(d => filter === 'all' || d.type === filter);

  return (
    <div className="p-6 min-h-screen relative">
      <Header 
        title="Deals" 
        rightElement={
            <div className="flex gap-2">
                <button onClick={() => setFilter(filter === 'all' ? 'new' : filter === 'new' ? 'used' : 'all')} className="p-2 bg-slate-800 rounded-full text-slate-400">
                    <Filter size={20} className={filter !== 'all' ? 'text-blue-400' : ''} />
                </button>
            </div>
        }
      />

      <div className="space-y-4 pb-36">
          {filteredDeals.map((deal) => {
              const commission = calculateCommission(deal, payPlan);
              const hasOverride = (deal.overrideFront || 0) > 0 || (deal.overrideBack || 0) > 0 || (deal.overrideReserve || 0) > 0;

              return (
                <Card key={deal.id} className="relative group overflow-hidden active:scale-[0.99] transition-transform" onClick={() => handleEdit(deal)}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${deal.type === 'new' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                <Car size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{deal.year} {deal.make} {deal.model}</h3>
                                <p className="text-slate-400 text-sm">{deal.customerName}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`font-bold text-xl ${hasOverride ? 'text-amber-400' : 'text-white'}`}>
                                ${commission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </div>
                            <div className="flex items-center justify-end gap-1">
                                {hasOverride && <span className="text-[8px] bg-amber-900/50 text-amber-400 px-1 rounded uppercase font-bold">Manual</span>}
                                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Comm</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-2 text-[10px] text-slate-500 flex gap-3">
                        <span>Front: ${deal.frontGross}</span>
                        <span>Back: ${deal.backGross}</span>
                        <span>Rsrv: ${deal.financeGross || 0}</span>
                    </div>
                </Card>
              );
          })}
      </div>

      {showModal && (
          <div className="fixed inset-0 z-[1100] flex items-end md:items-center justify-center bg-black/90 backdrop-blur-sm p-0 md:p-4 animate-fade-in">
              <div key={formKey} className="bg-slate-900 w-full max-w-md h-[90vh] md:h-auto md:max-h-[85vh] rounded-t-3xl md:rounded-3xl border border-white/10 flex flex-col shadow-2xl animate-slide-up relative">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center shrink-0">
                      <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Deal' : 'New Deal'}</h2>
                      <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="text-slate-400" size={20} /></button>
                  </div>
                  
                  {error && <div className="mx-4 mt-4 p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl flex items-center gap-2 text-rose-300 text-sm"><AlertCircle size={16} />{error}</div>}
                  
                  <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
                      <Input label="Customer Name" value={form.customerName} onChange={(e: any) => setForm({...form, customerName: e.target.value})} placeholder="e.g. John Doe" />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Year" type="number" value={form.year} onChange={(e: any) => setForm({...form, year: e.target.value})} />
                        <Select label="Type" value={form.type} onChange={(e: any) => setForm({...form, type: e.target.value as DealType})} options={[{ value: 'new', label: 'New' }, { value: 'used', label: 'Used' }]} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Make" value={form.make} onChange={(e: any) => setForm({...form, make: e.target.value})} />
                        <Input label="Model" value={form.model} onChange={(e: any) => setForm({...form, model: e.target.value})} />
                      </div>

                      <div className="h-px bg-white/10 my-2" />
                      <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Deal Gross</h3>

                      <div className="grid grid-cols-3 gap-3">
                        <Input label="Front ($)" type="number" value={form.frontGross} onChange={(e: any) => setForm({...form, frontGross: e.target.value})} placeholder="0" />
                        <Input label="Back ($)" type="number" value={form.backGross} onChange={(e: any) => setForm({...form, backGross: e.target.value})} placeholder="0" />
                        <Input label="Reserve ($)" type="number" value={form.financeGross} onChange={(e: any) => setForm({...form, financeGross: e.target.value})} placeholder="0" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <Input label="Pack ($)" type="number" value={form.pack} onChange={(e: any) => setForm({...form, pack: e.target.value})} />
                        <Input label="Flat ($)" type="number" value={form.flat} onChange={(e: any) => setForm({...form, flat: e.target.value})} />
                      </div>

                      <div className="h-px bg-white/10 my-2" />
                      <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Commission Overrides</h3>
                      <p className="text-xs text-slate-500 mb-3">Enter a value only if you need to override the calculated commission for that category.</p>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <Input label="Base ($)" type="number" value={form.overrideFront} onChange={(e: any) => setForm({...form, overrideFront: e.target.value})} placeholder="Calc" />
                        <Input label="Backend ($)" type="number" value={form.overrideBack} onChange={(e: any) => setForm({...form, overrideBack: e.target.value})} placeholder="Calc" />
                        <Input label="Reserve ($)" type="number" value={form.overrideReserve} onChange={(e: any) => setForm({...form, overrideReserve: e.target.value})} placeholder="Calc" />
                      </div>

                      <div className="h-px bg-white/10 my-2" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Spiffs ($)" type="number" value={form.spiffs} onChange={(e: any) => setForm({...form, spiffs: e.target.value})} />
                        <Input label="Chargeback ($)" type="number" value={form.chargeback} onChange={(e: any) => setForm({...form, chargeback: e.target.value})} />
                      </div>

                      <div className="h-px bg-white/10 my-2" />
                      <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Products</h3>
                      <div className="grid grid-cols-1 gap-1">
                          {Object.keys(form.products || {}).map((key) => (
                              <Toggle key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} checked={form.products![key as keyof ProductStatus]} onChange={() => setForm({...form, products: { ...form.products!, [key]: !form.products![key as keyof ProductStatus] }})} />
                          ))}
                      </div>
                      
                      <div className="h-px bg-white/10 my-2" />
                      <Input label="Delivery Date" type="date" value={form.deliveryDate ? format(new Date(form.deliveryDate), 'yyyy-MM-dd') : ''} onChange={(e: any) => setForm({...form, deliveryDate: e.target.value})} />
                  </div>

                  <div className="p-4 border-t border-white/10 bg-slate-900 rounded-b-3xl space-y-3 shrink-0">
                      <Button onClick={handleSubmit} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Deal'}</Button>
                      {editingId && <Button variant="danger" onClick={() => handleDelete(editingId)}>Delete Deal</Button>}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Deals;
