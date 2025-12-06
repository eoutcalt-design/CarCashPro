
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button, Input, Card, Logo } from '../components/Components';
import { useNavigate } from 'react-router-dom';
import { Mail, Key, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError(null);
    try {
      // Fixed: Now passing both email and password
      await login(email, password);
      // Navigation happens automatically via App.tsx user state change
    } catch (err: any) {
      console.error(err);
      // Map Firebase error codes to user-friendly messages
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
          setError('Too many failed attempts. Please try again later.');
      } else {
          setError('Failed to sign in. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        
        <div className="mb-10 animate-fade-in">
            <Logo className="w-40 h-40" />
        </div>

        <Card className="w-full bg-slate-900/60 backdrop-blur-2xl border-white/10 p-8 shadow-2xl animate-slide-up">
          <div className="mb-6 text-center">
             <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
             <p className="text-slate-400 text-sm mt-1">Track your pace, crush your goals.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="you@dealership.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase ml-1">Password</label>
              <div className="relative group">
                <Key className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end mt-2">
                  <button type="button" onClick={() => navigate('/forgot-password')} className="text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors">
                    Forgot Password?
                  </button>
              </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold animate-pulse">
                    <AlertCircle size={14} />
                    {error}
                </div>
            )}

            <Button type="submit" className="mt-8 shadow-blue-900/50" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <button onClick={() => navigate('/signup')} className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                Create Account
              </button>
            </p>
          </div>
        </Card>
        
        <p className="mt-8 text-slate-600 text-xs">© 2024 CarCashPro. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
