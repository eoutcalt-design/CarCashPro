
import React, { useState } from 'react';
import { Button, Card, Logo } from '../components/Components';
import { useNavigate } from 'react-router-dom';
import { Key, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;
    
    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    setError('');
    setLoading(true);
    // Simulate API update
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
             <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px]" />
             <div className="w-full max-w-md z-10 flex flex-col items-center">
                <Logo className="w-32 h-32 mb-8" />
                <Card className="w-full bg-slate-900/60 backdrop-blur-2xl border-white/10 p-8 shadow-2xl animate-slide-up text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Password Updated</h2>
                    <p className="text-slate-400 text-sm mb-6">Your password has been successfully reset. You can now log in with your new credentials.</p>
                    <Button onClick={() => navigate('/login')} className="!bg-emerald-600 hover:!bg-emerald-500">
                        Continue to Login
                    </Button>
                </Card>
             </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        <div className="mb-10 animate-fade-in">
            <Logo className="w-32 h-32" />
        </div>

        <Card className="w-full bg-slate-900/60 backdrop-blur-2xl border-white/10 p-8 shadow-2xl animate-slide-up">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white">Create New Password</h2>
                <p className="text-slate-400 text-sm mt-1">Your new password must be different from previous used passwords.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase ml-1">New Password</label>
                    <div className="relative group">
                        <Key className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="New password"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase ml-1">Confirm Password</label>
                    <div className="relative group">
                        <Key className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="Confirm new password"
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-rose-400 text-xs text-center font-bold bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">
                        {error}
                    </div>
                )}

                <Button type="submit" className="mt-8" disabled={loading}>
                    {loading ? 'Updating...' : 'Reset Password'}
                </Button>
            </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
